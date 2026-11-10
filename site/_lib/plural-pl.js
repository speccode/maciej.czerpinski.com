// Polish plural: forms = [one, few, many]. 1 -> one; 2-4 (not 12-14) -> few; else many.
function pluralPl(n, forms) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return forms[1];
  return forms[2];
}
module.exports = { pluralPl };
