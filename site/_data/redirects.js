// Legacy Gatsby URLs (pre 2026-07-28 migration) -> current URLs.
// GitHub Pages has no server-side redirects, so each entry becomes a static
// stub page (meta refresh + canonical) via site/redirects.njk.
module.exports = [
  { from: "/remote-event-storming/", to: "/blog/remote-event-storming/" },
  // Short alias for the QR code on the last training slide. Target is the PL page (participants are mostly Polish).
  { from: "/po/", to: "/pl/po-szkoleniu/" },
  { from: "/tags/", to: "/blog/" },
  { from: "/tags/event-storming/", to: "/blog/" },
  { from: "/tags/miro/", to: "/blog/" },
];
