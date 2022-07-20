module.exports = {
  iban: "EE247700771002681879",
  recipient: "MTÜ Efektiivne Altruism Eesti",
  description: "Anneta Targalt püsiannetus",

  urlWithParams: (url, params) => {
    return `${url}?${new URLSearchParams(params)}`;
  },

  createRecurringPaymentLink: function (bank, paymentData) {
    let baseUrl;
    let params;
    if (bank === "swedbank") {
      baseUrl =
        "https://www.swedbank.ee/private/d2d/payments2/standing_order/new";
      params = {
        "standingOrder.beneficiaryAccountNumber": this.iban,
        "standingOrder.beneficiaryName": this.recipient,
        "standingOrder.amount": paymentData.amount,
        "standingOrder.details": this.description,
      };
    } else if (bank === "lhv") {
      baseUrl = "https://www.lhv.ee/portfolio/payment_standing_add.cfm";
      params = {
        i_receiver_name: this.recipient,
        i_receiver_account_no: this.iban,
        i_payment_desc: this.description,
        i_amount: paymentData.amount,
      };
    } else if (bank === "seb") {
      baseUrl = "https://e.seb.ee/ip/ipank";
      params = {
        UID: "b889b482-f137-45b9-aa61-f4a67f0649c7",
        act: "ADDSOSMARTPAYM",
        lang: "EST",
        field1: "benname",
        value1: this.recipient,
        field3: "benacc",
        value3: this.iban,
        field10: "desc",
        value10: this.description,
        field11: "refid",
        value11: "",
        field5: "amount",
        value5: paymentData.amount,
        sofield1: "frequency",
        sovalue1: 3,
        paymtype: "REMSEBEE",
        field6: "currency",
        value6: "EUR",
        sofield2: "startdt",
        sofield3: "enddt",
        sovalue4: "CIF",
        sofield4: "paymtype",
      };
    } else if (bank === "coop") {
      const redirectUrl = "https://i.cooppank.ee/permpmtnew";
      baseUrl = "https://i.cooppank.ee/sso/";
      params = {
        return: this.urlWithParams(redirectUrl, {
          SaajaKonto: this.iban,
          SaajaNimi: this.recipient,
          MaksePohjus: this.description,
          Vaaring: "EUR",
          MakseSumma: paymentData.amount,
        }),
      };
    } else if (bank === "luminor") {
      baseUrl = "https://luminor.ee/?m=login-modal";
      params = {};
    } else if (bank === "citadele") {
      baseUrl = "https://online.citadele.lv/ibbf/en_ee";
      params = {};
    } else {
      throw "Unknown bank";
    }

    return this.urlWithParams(baseUrl, params);
  },
};
