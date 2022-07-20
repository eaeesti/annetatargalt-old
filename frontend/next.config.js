const { withPlausibleProxy } = require("next-plausible");

module.exports = withPlausibleProxy()({
  i18n: {
    locales: ["et"],
    defaultLocale: "et",
  },
});
