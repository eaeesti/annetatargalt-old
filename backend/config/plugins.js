module.exports = ({ env }) => ({
  upload: {
    provider: "cloudinary",
    providerOptions: {
      cloud_name: env("CLOUDINARY_NAME"),
      api_key: env("CLOUDINARY_API_KEY"),
      api_secret: env("CLOUDINARY_API_SECRET"),
    },
  },
  email: {
    provider: "sendinblue",
    providerOptions: {
      sendinblue_api_key: env("SIB_API_KEY"),
      sendinblue_default_from: env("SIB_DEFAULT_FROM", "info@annetatargalt.ee"),
      sendinblue_default_from_name: env(
        "SIB_DEFAULT_FROM_NAME",
        "Anneta Targalt"
      ),
    },
  },
});
