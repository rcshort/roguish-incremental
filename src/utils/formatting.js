export const formatNumber = (num) => {
  if (num >= 1e6) return num.toExponential(2);
  return Math.floor(num).toLocaleString();
};