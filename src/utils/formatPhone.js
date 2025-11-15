export const formatPhone = (phone = "") => {
  const digits = phone.replace(/\D/g, ""); // remove anything that's not a number

  // Format as +XXX XX XXX XXXX or closest based on length
  if (digits.length <= 5) return digits;
  if (digits.length <= 8) return digits.replace(/(\d{3})(\d{2})(\d+)/, "$1 $2 $3");
  if (digits.length <= 10) return digits.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3");

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "+$1 $2 $3 $4");
};
