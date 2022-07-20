const colors = require(`tailwindcss/colors`);

module.exports = {
  mode: "jit", // see https://tailwindcss.com/docs/just-in-time-mode
  purge: ["./components/**/*.js", "./pages/**/*.js", "./utils/*.js"],
  darkMode: false, // or "media" or "class"
  theme: {
    extend: {
      colors: {
        primary: colors.teal,
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "2rem",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: "#333",
            a: {
              color: theme("colors.primary.700"),
              transition: "opacity 0.15s ease",
              "&:hover": {
                opacity: 0.7,
              },
            },
            strong: {
              color: "inherit",
            },
          },
        },
        header: {
          css: {
            color: "white",
            a: {
              color: "#99F6E4",
              transition: "opacity 0.15s ease",
              "&:hover": {
                opacity: 0.7,
              },
            },
            strong: {
              color: "white",
            },
          },
        },
        donationbox: {
          css: {
            a: {
              fontWeight: 700,
              color: theme("colors.primary.700"),
              textDecoration: "none",
              whiteSpace: "nowrap",
            },
          },
        },
      }),
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    fontFamily: {
      body: ['"DM Sans"', "sans-serif"],
    },
    backgroundSize: {
      "100%": "100%",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/custom-forms")],
};
