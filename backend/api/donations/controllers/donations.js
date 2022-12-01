"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");
const montonio = require("../../../util/montonio");
const banks = require("../../../util/banks");
const proportionUtils = require("../../../util/proportionUtils");

module.exports = {
  async createOnetimeDonation(donationData) {
    const donation = {
      ...donationData,
      finalized: false,
    };

    delete donation.bank;

    const entity = await strapi.services.donations.create(donation);

    const sanitizedEntity = sanitizeEntity(entity, {
      model: strapi.models.donations,
    });

    return sanitizedEntity;
  },

  getOnetimePaymentURL(donationEntity) {
    const payload = {
      amount: donationEntity.amount,
      currency: donationEntity.currency,
      merchant_reference: `${donationEntity.id}`,
      merchant_return_url: `${process.env.FRONTEND_URL}/annetatud`,
      merchant_notification_url: `${
        strapi.config.get("server.url") ||
        "https://annetusplatvorm.free.beeceptor.com"
      }/confirm`,
      payment_information_unstructured: "Anneta Targalt annetus",
      checkout_email: donationEntity.email,
      checkout_first_name: donationEntity.firstName,
      checkout_last_name: donationEntity.lastName,
    };

    const paymentURL = montonio.createPaymentURL(payload);
    return paymentURL;
  },

  async createRecurringDonation(donationData) {
    const entity = await strapi.services["recurring-donations"].create(
      donationData
    );

    const sanitizedEntity = sanitizeEntity(entity, {
      model: strapi.models["recurring-donations"],
    });

    return sanitizedEntity;
  },

  getRecurringPaymentURL(donationEntity) {
    const paymentURL = banks.createRecurringPaymentLink(
      donationEntity.bank,
      donationEntity
    );
    return paymentURL;
  },

  async sendConfirmationEmail(donationId) {
    const template = sanitizeEntity(
      await strapi.query("email-template").findOne(),
      {
        model: strapi.models["email-template"],
      }
    );

    const donation = await strapi
      .query("donations")
      .findOne({ id: donationId });
    const sanitizedDonation = sanitizeEntity(donation, {
      model: strapi.models.donations,
    });

    const emailsData = sanitizeEntity(await strapi.query("emails").findOne(), {
      model: strapi.models["emails"],
    });

    await strapi.plugins["email"].services.email.sendTemplatedEmail(
      {
        to: donation.email,
        replyTo: emailsData.automatedEmailsReplyToAddress,
      },
      template,
      sanitizedDonation
    );
  },

  async donate(ctx) {
    try {
      const amount = Math.floor(Number(ctx.request.body.amount) * 100) / 100;
      if (!amount) throw "Invalid amount";
      if (amount < 1) throw "Amount is less than 1";
      ctx.request.body.amount = amount;
    } catch (err) {
      console.error(err);
      return { success: false, reason: err };
    }

    const donationData = {
      ...ctx.request.body,
      currency: "EUR",
    };

    if (donationData.choosingProportions) {
      if (!this.validateProportions(donationData.proportions)) {
        return { success: false, reason: "Invalid proportions" };
      }
    } else {
      donationData.proportions = donationData.proportions.map(
        ([organization, proportion], i) => {
          if (i === 0) return [organization, 100];
          return [organization, 0];
        }
      );
    }
    donationData.comment = proportionUtils.multiLiner(donationData);
    delete donationData.choosingProportions;
    const proportions = donationData.proportions;
    delete donationData.proportions;

    const donationType = donationData.type;
    delete donationData.type;

    let paymentURL;
    if (donationType === "onetime") {
      try {
        const donationEntity = await this.createOnetimeDonation(donationData);
        paymentURL = this.getOnetimePaymentURL(donationEntity);
        this.createOrganizationDonations(donationEntity, proportions);
      } catch (err) {
        console.log(err);
        return { success: false, reason: "Invalid donation" };
      }
    } else if (donationType === "recurring") {
      try {
        const donationEntity = await this.createRecurringDonation(donationData);
        paymentURL = this.getRecurringPaymentURL(donationEntity);
      } catch (err) {
        console.log(err);
        return { success: false, reason: "Invalid donation" };
      }
    } else {
      return { success: false, reason: "Invalid donation type" };
    }

    return { success: true, paymentURL: paymentURL };
  },

  validateProportions(organizationProportionPairs) {
    // Proportions add up to 100
    const sum = organizationProportionPairs.reduce(
      (prev, [_, proportion]) => prev + proportion,
      0
    );
    if (sum !== 100) return false;

    // All organizations exist
    const noUnknownOrganizations = organizationProportionPairs.every(
      ([organization, _]) =>
        strapi.query("organization").findOne({ name: organization })
    );
    if (!noUnknownOrganizations) return false;

    return true;
  },

  async createOrganizationDonations(donation, organizationProportionPairs) {
    organizationProportionPairs.forEach(
      async ([organizationName, proportion]) => {
        if (proportion === 0) return;

        const organization = await strapi
          .query("organization")
          .findOne({ name: organizationName });

        await strapi.services["organization-donations"].create({
          organization: organization.id,
          donation: donation.id,
          proportion: proportion / 100,
          amount: ((proportion * donation.amount) / 100).toFixed(2),
          forwarded: false,
        });
      }
    );
  },

  async confirm(ctx) {
    const paymentToken = ctx.request.query.payment_token;

    let decoded;
    try {
      decoded = montonio.decodePaymentToken(paymentToken);
    } catch (err) {
      console.error(err);
      return { success: false, reason: err };
    }

    if (decoded.status !== "finalized") {
      return { success: false, reason: "Payment not finalized" };
    }

    const id = Number(decoded.merchant_reference);

    let donation;
    try {
      donation = await strapi.services.donations.findOne({ id });
    } catch (err) {
      console.error(err);
      return { success: false, reason: err };
    }

    if (!donation) {
      return { success: false, reason: "Donation doesn't exist" };
    }
    if (donation.finalized) {
      return { success: false, reason: "Donation already confirmed" };
    }

    try {
      await strapi.services.donations.update(
        { id },
        {
          finalized: true,
          iban: decoded.customer_iban || "",
          paymentMethod: decoded.payment_method_name || "",
        }
      );
    } catch (err) {
      console.error(err);
      return { success: false, reason: err };
    }

    try {
      this.sendConfirmationEmail(id);
    } catch (err) {
      console.error(err);
    }

    return { success: true };
  },

  async decode(ctx) {
    const paymentToken = ctx.request.query.payment_token;

    let decoded;
    try {
      decoded = montonio.decodePaymentToken(paymentToken);
    } catch (err) {
      console.error(err);
      return { success: false, reason: err };
    }

    if (decoded.status !== "finalized") {
      return { success: false, reason: "Payment not finalized" };
    }

    const id = Number(decoded.merchant_reference);

    let donation;
    try {
      donation = await strapi.services.donations.find({ id }, [
        "organization_donations",
        "organization_donations.organization",
      ]);
    } catch (err) {
      console.error(err);
      return { success: false, reason: err };
    }

    const organizations = [...donation[0].organization_donations]
      .sort((a, b) => {
        if (
          a.organization.order !== undefined &&
          b.organization.order !== undefined &&
          a.organization.order !== b.organization.order
        ) {
          return a.organization.order - b.organization.order;
        }
        return a.organization.id - b.organization.id;
      })
      .map((organization) => ({
        name: organization.organization.name,
        amount: organization.amount,
        proportion: organization.proportion,
      }));

    const { firstName, lastName, amount, currency, ...restOfDonation } =
      donation[0];
    return {
      success: true,
      donation: {
        firstName,
        lastName,
        amount,
        currency,
        organizations,
      },
    };
  },

  donationsSum(donations) {
    return donations.reduce((prev, cur) => prev + cur.amount, 0);
  },

  async getChristmas2022Sum() {
    let sum;
    try {
      const donationEntities = await strapi.query("donations").find({
        created_at_gt: "2022-11-27T00:00:00Z",
        created_at_lt: "2023-01-01T00:00:00Z",
        finalized: true,
      });

      const donations = donationEntities.map((entity) =>
        sanitizeEntity(entity, {
          model: strapi.models.donations,
        })
      );

      const manualDonationEntities = await strapi
        .query("manual-donations")
        .find({
          datetime_gt: "2022-11-27T00:00:00Z",
          datetime_lt: "2023-01-01T00:00:00Z",
        });

      const manualDonations = manualDonationEntities.map((entity) =>
        sanitizeEntity(entity, {
          model: strapi.models.donations,
        })
      );

      sum = this.donationsSum(donations) + this.donationsSum(manualDonations);
      sum = Math.floor(sum * 100) / 100;
    } catch (err) {
      console.error(err);
      return 0;
    }
    return sum;
  },

  async getTotalSum() {
    let sum;
    try {
      const donationEntities = await strapi
        .query("donations")
        .find({ finalized: true });

      const donations = donationEntities.map((entity) =>
        sanitizeEntity(entity, {
          model: strapi.models.donations,
        })
      );

      const manualDonationEntities = await strapi
        .query("manual-donations")
        .find();

      const manualDonations = manualDonationEntities.map((entity) =>
        sanitizeEntity(entity, {
          model: strapi.models.donations,
        })
      );

      sum = this.donationsSum(donations) + this.donationsSum(manualDonations);
      sum = Math.floor(sum * 100) / 100;
    } catch (err) {
      console.error(err);
      return 0;
    }
    return sum;
  },

  async totalDonations() {
    return {
      success: true,
      total: await this.getTotalSum(),
      christmas2022: await this.getChristmas2022Sum(),
    };
  },
};
