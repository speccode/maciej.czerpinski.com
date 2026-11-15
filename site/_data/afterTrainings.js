// Per-training after-training pages: /pl/po-szkoleniu/<slug>/ (+ short alias /po/<slug>/).
// Each material file lives once in site/materialy/; trainings reference it by key.
const materials = {
  "ul-cheatsheet": {
    label: "Pytania, które pomagają budować Ubiquitous Language (PDF)",
    href: "/materialy/ubiquitous-language-cheatsheet.pdf",
  },
};

const trainings = [
  { slug: "ddd", name: "Event Storming + DDD", materials: ["ul-cheatsheet"] },
];

module.exports = trainings.map((t) => ({
  ...t,
  materials: t.materials.map((key) => {
    if (!materials[key]) throw new Error(`afterTrainings: unknown material "${key}" in "${t.slug}"`);
    return materials[key];
  }),
}));
