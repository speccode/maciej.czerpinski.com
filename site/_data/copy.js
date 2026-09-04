const CALENDLY = "https://calendly.com/maciej-czerpinski/consulting";

// Real counts since Oct 2022: Altkom, Sages, YourFutureSkills, Softiq.
const TRAINING_STATS = {
  trainings: 40,
  days: 76,
  hours: 616,
  people: 283,
};

module.exports = {
  en: {
    nav: [
      { label: "About", href: "/about/" },
      { label: "Training", href: "/training/" },
      { label: "Blog", href: "/blog/" },
      { label: "Contact", href: "/contact/" },
    ],
    langSwitch: { href: "/pl/", label: "PL" },
    common: { newTabHint: "(opens in new tab)" },
    hero: {
      greeting: "Hi, I'm Maciej.",
      tagline: "Let's code the planet together.",
      lines: [
        "Tech Lead who makes AI-assisted development actually work.",
        "15+ years in PHP/Laravel and distributed systems - I lead teams where legacy systems without documentation, with business pressure, and new AI tooling collide.",
        "I train teams (Event Storming, DDD, Clean Code) and run Spec-Driven Development consulting and SDLC process rollout -> speccode.com",
      ],
      talents: "Learner / Individualization / Strategic / Analytical / Maximizer",
      ctaLabel: "Let's talk",
      ctaHref: CALENDLY,
    },
    homeTeaser: {
      aboutEyebrow: "What I do",
      aboutSummary: "Most of my work starts where someone else's roadmap stalled.",
      aboutCtaLabel: "More about me",
      aboutCtaHref: "/about/",
      trainingEyebrow: "Training",
      trainingSummary:
        "Event Storming, Domain-Driven Design, Clean Code, Refactoring, reliable AI SDLC.",
      trainingCtaLabel: "See training",
      trainingCtaHref: "/training/",
      testimonialsHeading: "What participants say",
      testimonialsCtaLabel: "See all reviews",
      testimonialsCtaHref: "/training/#testimonials",
    },
    about: {
      heading: "About",
      paragraphs: [
        "I lead engineering teams through the hardest parts of software: legacy systems without documentation, business pressure, and AI tooling that hasn't earned its hype yet.",
        "I take on projects everyone agrees matter and nobody starts - the ones postponed for years - and I ship them end-to-end.",
        "I review more code than I write - several engineers I've mentored now lead their own teams.",
      ],
      ctaLabel: "Let's talk",
      ctaHref: CALENDLY,
    },
    training: {
      heading: "Training",
      intro:
        "I train engineering teams in workshops that compound: Event Storming to find the real domain, Domain-Driven Design to model it, Clean Code and Refactoring to keep it maintainable, and reliable AI SDLC to ship with AI without the chaos.",
      topicsLabel: "I train engineering teams:",
      topics: [
        "Event Storming",
        "Domain-Driven Design",
        "Clean Code",
        "Refactoring",
        "Implementing reliable AI SDLC",
      ],
      testimonialsHeading: "What participants say",
      ctaLabel: "Book a training conversation",
      ctaHref: CALENDLY,
      statsLabel: `${TRAINING_STATS.trainings} trainings · ${TRAINING_STATS.days} days · ${TRAINING_STATS.hours} hours · ${TRAINING_STATS.people} people trained`,
    },
    blogTeaser: {
      heading: "Latest posts",
      viewAllLabel: "All posts",
    },
    blogIndex: {
      heading: "Blog",
      empty: "Nothing here yet - check back soon.",
    },
    contact: {
      heading: "Contact",
      intro: "Fastest way to reach me is to grab time directly on my calendar.",
      ctaLabel: "Let's talk",
      ctaHref: CALENDLY,
      linksHeading: "Elsewhere",
      links: [
        { type: "email", label: "Email", subject: "Hi%20Maciej", icon: "mail" },
        { type: "link", label: "LinkedIn", href: "https://www.linkedin.com/in/maciejczerpinski/", icon: "linkedin" },
        { type: "link", label: "GitHub", href: "https://github.com/speccode", icon: "github" },
        { type: "link", label: "speccode.com", href: "https://speccode.com", icon: "external" },
      ],
    },
    postFooter: {
      backLabel: "← All posts",
      ctaLabel: "Found this useful? Say hi",
      ctaSubject: "About%20your%20post",
    },
    theme: {
      toggleLabel: "Toggle theme",
    },
  },
  pl: {
    nav: [
      { label: "O mnie", href: "/pl/about/" },
      { label: "Szkolenia", href: "/pl/training/" },
      { label: "Blog", href: "/blog/" },
      { label: "Kontakt", href: "/pl/contact/" },
    ],
    langSwitch: { href: "/", label: "EN" },
    common: { newTabHint: "(otwiera się w nowej karcie)" },
    hero: {
      greeting: "Cześć, jestem Maciej.",
      tagline: "Let's code the planet together.",
      lines: [
        "Tech Lead, który sprawia że AI w developmencie naprawdę działa.",
        "15+ lat w PHP/Laravel i systemach rozproszonych - prowadzę zespoły tam, gdzie zderzają się legacy bez dokumentacji, presja biznesu i nowe narzędzia AI.",
        "Szkolę zespoły (Event Storming, DDD, Clean Code) oraz prowadzę konsulting Spec-Driven Development i wdrażanie procesów SDLC -> speccode.com",
      ],
      talents: "Learner / Individualization / Strategic / Analytical / Maximizer",
      ctaLabel: "Pogadajmy",
      ctaHref: CALENDLY,
    },
    homeTeaser: {
      aboutEyebrow: "Czym się zajmuję",
      aboutSummary: "Najczęściej zaczynam tam, gdzie czyjś plan utknął.",
      aboutCtaLabel: "Więcej o mnie",
      aboutCtaHref: "/pl/about/",
      trainingEyebrow: "Szkolenia",
      trainingSummary:
        "Event Storming, Domain-Driven Design, Clean Code, refaktoryzacja, wdrażanie niezawodnego SDLC z AI.",
      trainingCtaLabel: "Zobacz szkolenia",
      trainingCtaHref: "/pl/training/",
      testimonialsHeading: "Co mówią uczestnicy",
      testimonialsCtaLabel: "Zobacz wszystkie opinie",
      testimonialsCtaHref: "/pl/training/#testimonials",
    },
    about: {
      heading: "O mnie",
      paragraphs: [
        "Prowadzę zespoły inżynierskie przez to, co najtrudniejsze w oprogramowaniu: systemy legacy bez dokumentacji, presję biznesową i narzędzia AI, które jeszcze nie spełniają obietnic.",
        "Prowadzę zespoły przez projekty, które inni odkładają latami - i dowożę je end-to-end.",
        "Więcej code review robię niż kodu piszę - kilku inżynierów, których mentorowałem, prowadzi dziś własne zespoły.",
      ],
      ctaLabel: "Pogadajmy",
      ctaHref: CALENDLY,
    },
    training: {
      heading: "Szkolenia",
      intro:
        "Szkolę zespoły w warsztatach, które się uzupełniają: Event Storming, żeby znaleźć prawdziwą domenę, DDD, żeby ją zamodelować, Clean Code i refaktoryzacja, żeby dało się to utrzymać, oraz wdrażanie niezawodnego SDLC z AI, żeby dowozić bez chaosu.",
      topicsLabel: "Szkolę zespoły inżynierskie:",
      topics: [
        "Event Storming",
        "Domain-Driven Design",
        "Clean Code",
        "Refaktoryzacja",
        "Wdrażanie niezawodnego SDLC z AI",
      ],
      testimonialsHeading: "Co mówią uczestnicy",
      ctaLabel: "Umów rozmowę o szkoleniu",
      ctaHref: CALENDLY,
      statsLabel: `${TRAINING_STATS.trainings} szkoleń · ${TRAINING_STATS.days} dni · ${TRAINING_STATS.hours} godzin · ${TRAINING_STATS.people} przeszkolonych osób`,
    },
    blogTeaser: {
      heading: "Ostatnie wpisy",
      viewAllLabel: "Wszystkie posty",
    },
    blogIndex: {
      heading: "Blog",
      empty: "Nic tu jeszcze nie ma - zajrzyj później.",
    },
    contact: {
      heading: "Kontakt",
      intro: "Najszybciej złapiesz mnie przez rezerwację terminu w kalendarzu.",
      ctaLabel: "Pogadajmy",
      ctaHref: CALENDLY,
      linksHeading: "Gdzie indziej",
      links: [
        { type: "email", label: "Email", subject: "Cze%C5%9B%C4%87%20Maciej", icon: "mail" },
        { type: "link", label: "LinkedIn", href: "https://www.linkedin.com/in/maciejczerpinski/", icon: "linkedin" },
        { type: "link", label: "GitHub", href: "https://github.com/speccode", icon: "github" },
        { type: "link", label: "speccode.com", href: "https://speccode.com", icon: "external" },
      ],
    },
    postFooter: {
      backLabel: "← Wszystkie posty",
      ctaLabel: "Przydatne? Napisz do mnie",
      ctaSubject: "W%20sprawie%20wpisu",
    },
    theme: {
      toggleLabel: "Zmień motyw",
    },
  },
};
