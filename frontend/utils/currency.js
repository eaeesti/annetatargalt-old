const currencyUtils = {
  toSymbol: (currency) => {
    return {
      EUR: "€",
    }[currency];
  },
};

export { currencyUtils };
