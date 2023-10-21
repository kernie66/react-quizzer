import i18next from "i18next";

const shortScale = [
  "none",
  "million",
  "billion",
  "quadrillion",
  "quintillion",
  "septillion",
  "octillion",
];

export default function bigNumbersToText(number) {
  let result = new Intl.NumberFormat().format(number);
  const exp = Math.log10(number);
  if (exp >= 6) {
    const order = Math.floor((exp - 3) / 3);
    const value = Math.floor(number / 10 ** (order * 3 + 3));
    result = i18next.t(`numbers.${shortScale[order]}`, { count: value });
  }
  return result;
}
