export function formatToRupiah(amount: number): string {
  if (isNaN(amount)) {
    throw new Error("Invalid number");
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}
