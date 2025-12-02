export default function formatCurrency(amount = 0) {
  // Customize currency / locale as needed
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}
