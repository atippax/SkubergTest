export default function calculate(prices: number[]): {
  discount: number;
  total: number;
} {
  const summary = prices.reduce((acc, price) => acc + price, 0);
  let discountRate = 0;
  if (prices.length > 5) {
    discountRate = 0.2;
  } else if (prices.length > 3) {
    discountRate = 0.1;
  }
  const sumWithCount = summary - summary * discountRate;
  return { discount: sumWithCount, total: summary };
}
