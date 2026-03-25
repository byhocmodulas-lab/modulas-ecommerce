export function formatPrice(
  amount: number,
  currency = "INR",
  locale  = "en-IN",
): string {
  return new Intl.NumberFormat(locale, {
    style:    "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
