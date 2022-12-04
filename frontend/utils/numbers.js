export const round = (number, digits = 0) => {
  return Math.round(number * 10 ** digits) / 10 ** digits;
};
