// Per-training after-training pages: /pl/po-szkoleniu/<slug>/ (+ short alias /po/<slug>/).
// Each material file lives once in site/materialy/; trainings reference it by key.
const materials = {
  "ul-cheatsheet": {
    label: "Pytania, które pomagają budować Ubiquitous Language (PDF)",
    href: "/materialy/ubiquitous-language-cheatsheet.pdf",
  },
  "bc-cheatsheet": {
    label: "Pytania, które pomagają znaleźć Bounded Contexts (PDF)",
    href: "/materialy/bounded-contexts-cheatsheet.pdf",
  },
  "cm-cheatsheet": {
    label: "Context Mapping: pytania, które pomagają wybrać wzorzec (PDF)",
    href: "/materialy/context-mapping-cheatsheet.pdf",
  },
  "wt-cheatsheet": {
    label: "Wzorce taktyczne: dziewięć klocków modelu (PDF)",
    href: "/materialy/tactical-patterns-cheatsheet.pdf",
  },
};

const trainings = [
  { slug: "ddd", name: "Event Storming + DDD", materials: ["ul-cheatsheet", "bc-cheatsheet", "cm-cheatsheet", "wt-cheatsheet"] },
];

module.exports = trainings.map((t) => ({
  ...t,
  materials: t.materials.map((key) => {
    if (!materials[key]) throw new Error(`afterTrainings: unknown material "${key}" in "${t.slug}"`);
    return materials[key];
  }),
}));
