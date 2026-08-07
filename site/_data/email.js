// Single source for the contact address. Split into user/domain so no
// template ever prints a literal "user@domain" string into the HTML -
// assembly happens in js/email.js at runtime (basic spambot deterrent).
module.exports = {
  user: "hello",
  domain: "czerpinski.com",
};
