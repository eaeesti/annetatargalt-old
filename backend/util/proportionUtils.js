module.exports = {
  oneLiner(donationData) {
    return this.asStrings(donationData).join("; ");
  },

  multiLiner(donationData) {
    return this.asStrings(donationData).join("\n");
  },

  markdownList(donationData) {
    return "* " + this.asStrings(donationData).join("\n* ");
  },

  asStrings({ proportions, amount, currency }) {
    let strings = proportions
      .filter(([_, proportion]) => proportion > 0)
      .map(([organization, proportion]) => {
        const proportionateAmount = ((proportion * amount) / 100).toFixed(2);
        return `${organization} - ${proportion}% (${proportionateAmount} ${currency})`;
      });
    return strings;
  },
};
