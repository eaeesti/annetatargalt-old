"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");
const { recipient } = require("../../../util/banks");

module.exports = {
  async create(ctx) {
    const emailsData = sanitizeEntity(await strapi.query("emails").findOne(), {
      model: strapi.models["emails"],
    });

    const submission = {
      ...ctx.request.body,
      responded: false,
    };

    if (
      !submission.message ||
      submission.message.length === 0 ||
      submission.message.length > 500
    ) {
      return { success: false, reason: "Invalid message" };
    }

    try {
      await strapi.services["contact-submissions"].create(submission);
    } catch (err) {
      console.error(err);
      return { success: false, reason: "Failed to save submission" };
    }

    const recipientEmails =
      emailsData.contactFormSubmissionRecipients.split(/\r\n|\r|\n/);

    const emailPromises = recipientEmails.map(
      (recipientEmail) =>
        new Promise(async (resolve, reject) => {
          try {
            await strapi.plugins["email"].services.email.sendTemplatedEmail(
              {
                to: recipientEmail,
                replyTo:
                  submission.email || emailsData.automatedEmailsReplyToAddress,
              },
              {
                subject: emailsData.contactFormSubmissionTitle,
                text: emailsData.contactFormSubmissionTemplate,
                html: emailsData.contactFormSubmissionTemplateHtml,
              },
              {
                message: ctx.request.body.message,
                name: ctx.request.body.name || emailsData.anonymousName,
                email: ctx.request.body.email || emailsData.anonymousEmail,
              }
            );
            resolve();
          } catch (err) {
            reject(err);
          }
        })
    );

    try {
      await Promise.all(emailPromises);
    } catch (err) {
      console.error(err);
      return { success: false, reason: "Failed to send email" };
    }

    return { success: true };
  },
};
