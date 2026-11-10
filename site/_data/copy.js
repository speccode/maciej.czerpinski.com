const testimonials = require("./testimonials");
const { pluralPl } = require("../_lib/plural-pl");

const CALENDLY = "https://calendly.com/maciej-czerpinski/consulting";
const LINKEDIN = "https://www.linkedin.com/in/maciejczerpinski/";

// Real counts since Oct 2022: Altkom, Sages, YourFutureSkills, Softiq.
const TRAINING_STATS = {
  trainings: 43,
  days: 82,
  hours: 664,
  people: 302,
};

// PL number + noun phrase, so the grammar follows the number (TRAINING_STATS is bumped by a skill).
const PL = {
  people: ["przeszkolona osoba", "przeszkolone osoby", "przeszkolonych osób"],
  peopleLabel: ["osoba przeszkolona", "osoby przeszkolone", "osób przeszkolonych"],
  hours: ["godzina", "godziny", "godzin"],
  hoursLabel: ["godzina warsztatów", "godziny warsztatów", "godzin warsztatów"],
  trainings: ["szkolenie", "szkolenia", "szkoleń"],
  days: ["dzień", "dni", "dni"],
};
const pl = (n, key) => pluralPl(n, PL[key]);

// The training card quote is taken from testimonials.js (never retyped here).
const pickQuote = (lang, needle) => {
  const t = testimonials[lang].find((x) => x.quote.includes(needle));
  if (!t) throw new Error(`copy.js: no testimonial containing "${needle}" in ${lang}`);
  return { text: t.quote, by: t.role };
};

// Texts marked EN-DRAFT are an assistant draft awaiting Maciej's approval.
// Texts marked DRAFT-PENDING-APPROVAL are drafts in both languages (not yet confirmed by Maciej).
const copy = {
  en: {
    nav: [
      { label: "About", href: "/about/" },
      { label: "Training", href: "/training/" },
      { label: "Blog", href: "/blog/" },
      { label: "Contact", href: "/contact/" },
    ],
    langSwitch: { href: "/pl/", label: "PL" },
    common: { newTabHint: "(opens in new tab)", skip: "Skip to content" },
    // EN-DRAFT
    hero: {
      h1: "I go in where it hurts most.",
      h1Grey: "I stay until the team runs on its own.",
      sub: "Forward Deployed Engineer, trainer and consultant. 15+ years in the IT trenches.",
      ctaLabel: "Book a call",
      ctaHref: CALENDLY,
      secondaryLabel: "See training",
      secondaryHref: "/training/",
      photoAlt: "Maciej Czerpiński",
    },
    proof: [
      { value: String(TRAINING_STATS.people), label: "people trained" },
      { value: String(TRAINING_STATS.hours), label: "workshop hours" },
      { value: String(TRAINING_STATS.trainings), label: "trainings" },
      { value: "15+", label: "years in software engineering" },
    ],
    // EN-DRAFT, DRAFT-PENDING-APPROVAL
    offer: {
      h2: "What people come to me with.",
      h2Grey: "Four problems, four ways in.",
      cards: [
        {
          id: "legacy",
          need: "Need to rebuild a legacy system?",
          title: "A team that understands its system and changes it safely",
          desc: "You get a map of the domain, a rebuild done together with your team, and documentation so you don't need me to keep going.",
          steps: [
            { name: "Recon" },
            { name: "Action" },
            { name: "Handover" },
          ],
          ctaLabel: "Let's talk about legacy",
          ctaHref: CALENDLY,
        },
        {
          id: "ai",
          need: "Need to roll out AI SDLC?",
          title: "AI that generates code you can maintain",
          desc: "Your team turns requirements into a specification and drives AI from it. It works by a process, not by gut feeling.",
          steps: [
            { name: "Recon" },
            { name: "Action" },
            { name: "Handover" },
          ],
          ctaLabel: "Let's talk about AI",
          ctaHref: CALENDLY,
        },
        {
          id: "cto",
          need: "Need a CTO for part of the time?",
          title: "A technical leader who gets into the code, without the cost of a full-time CTO",
          desc: "I learn your goals, help define a vision and realistic but ambitious KPIs, then lead the team to reach them. Hands in the code, not in an ivory tower.",
          steps: [
            { name: "Recon" },
            { name: "Direction and KPIs" },
            { name: "Leading in the trenches" },
          ],
          ctaLabel: "Let's talk about CTO",
          ctaHref: CALENDLY,
        },
        {
          id: "training",
          need: "Need just a training?",
          title: "A team that leaves with a skill, not just notes",
          desc: "Participants practise on real cases.",
          topics: "Event Storming, DDD, Clean Code, refactoring, SDLC with AI.",
          quote: pickQuote("en", "Lots of practice"),
          steps: [
            { name: "Expectations" },
            { name: "Programme" },
            { name: "Workshop" },
          ],
          ctaLabel: "See training",
          ctaHref: "/training/",
        },
      ],
    },
    evidence: {
      h2: "What participants say.",
      moreLabel: "See all reviews",
      moreHref: "/training/#testimonials",
    },
    aboutHome: { h2: "About me", ctaLabel: "More about me", ctaHref: "/about/" },
    about: {
      heading: "About",
      paragraphs: [
        "I lead engineering teams through the hardest parts of software: legacy systems without documentation, business pressure, and AI tooling that hasn't earned its hype yet.",
        "I take on projects everyone agrees matter and nobody starts - the ones postponed for years - and I ship them end-to-end.",
        "I review more code than I write - several engineers I've mentored now lead their own teams.",
      ],
      ctaLabel: "Book a call",
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
      h2: "Let's start with a conversation.",
      intro: "Fastest way to reach me is to grab time directly on my calendar.",
      ctaLabel: "Book a call",
      ctaHref: CALENDLY,
      mailLabel: "Prefer to write? Email",
      mailSubject: "Hi%20Maciej",
      linksHeading: "Elsewhere",
      links: [
        { type: "email", label: "Email", subject: "Hi%20Maciej", icon: "mail" },
        { type: "link", label: "LinkedIn", href: LINKEDIN, icon: "linkedin" },
        { type: "link", label: "GitHub", href: "https://github.com/speccode", icon: "github" },
        { type: "link", label: "speccode.com", href: "https://speccode.com", icon: "external" },
      ],
    },
    // EN-DRAFT, DRAFT-PENDING-APPROVAL
    faq: {
      h2: "Questions and answers",
      linkLabel: "See all questions",
      linkHref: "/faq/",
      items: [
        {
          home: true,
          q: "What is a Forward Deployed Engineer?",
          a: "An engineer who doesn't stop at recommendations. I do the recon, go where it hurts most, do what needs doing, and for the length of the mission I can work inside your company. I leave when the team runs on its own.",
        },
        {
          home: true,
          q: "How is a fractional CTO different from a full-time CTO?",
          a: "You get a technical leader for part of the time, without the cost of a full-time CTO. I learn your goals, help set the technical direction and the KPIs, then lead the team, getting into the code when needed.",
        },
        {
          home: true,
          q: "Is the training on-site or online?",
          a: "Either: at your place or online. I write the programme to fit your team after a short conversation about your expectations.",
        },
        {
          home: true,
          q: "How does working together look?",
          a: "Three steps: recon (a map of the domain and the pain), action (working together with your team) and handover (documentation and training, so the team works without me).",
        },
        {
          q: "Which training topics do you teach?",
          a: `Event Storming, Domain-Driven Design, Clean Code, Refactoring and implementing a reliable AI SDLC. So far: ${TRAINING_STATS.trainings} trainings and ${TRAINING_STATS.people} people trained.`,
        },
        {
          q: "What is AI SDLC and why Spec-Driven Development?",
          a: "AI SDLC is a software development lifecycle in which AI is a full participant. In Spec-Driven Development the team turns requirements into a specification and drives AI from it. AI multiplies patterns: if the code is chaos, AI generates more chaos, faster.",
        },
      ],
    },
    // EN-DRAFT
    afterTraining: {
      title: "Thank you - after the training",
      h1: "Thank you for the workshop.",
      text: "If you'd like to stay in touch, connect with me on LinkedIn. I'd be glad to hear what you're taking away from the training.",
      linkedinLabel: "Connect on LinkedIn",
      linkedinHref: LINKEDIN,
      feedbackLabel: "Tell me what you took away",
      feedbackSubject: "Training%20feedback",
    },
    postFooter: {
      bookLabel: "Book a call",
      bookHref: CALENDLY,
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
    common: { newTabHint: "(otwiera się w nowej karcie)", skip: "Przejdź do treści" },
    hero: {
      h1: "Wchodzę tam, gdzie boli najbardziej.",
      h1Grey: "Zostaję, aż zespół działa sam.",
      sub: "Forward Deployed Engineer, trener i konsultant. 15+ lat w okopach IT.",
      ctaLabel: "Umów rozmowę",
      ctaHref: CALENDLY,
      secondaryLabel: "Zobacz szkolenia",
      secondaryHref: "/pl/training/",
      photoAlt: "Maciej Czerpiński",
    },
    proof: [
      { value: String(TRAINING_STATS.people), label: pl(TRAINING_STATS.people, "peopleLabel") },
      { value: String(TRAINING_STATS.hours), label: pl(TRAINING_STATS.hours, "hoursLabel") },
      { value: String(TRAINING_STATS.trainings), label: pl(TRAINING_STATS.trainings, "trainings") },
      { value: "15+", label: "lat w inżynierii oprogramowania" },
    ],
    // DRAFT-PENDING-APPROVAL
    offer: {
      h2: "Z czym do mnie przychodzą.",
      h2Grey: "Cztery problemy, cztery sposoby wejścia.",
      cards: [
        {
          id: "legacy",
          need: "Potrzebujesz przebudować legacy?",
          title: "Zespół, który rozumie swój system i bezpiecznie go zmienia",
          desc: "Dostajesz mapę domeny, przebudowę zrobioną razem z zespołem i dokumentację, dzięki której nie potrzebujecie mnie, żeby ruszyć dalej.",
          steps: [
            { name: "Rozpoznanie" },
            { name: "Działanie" },
            { name: "Oddanie" },
          ],
          ctaLabel: "Porozmawiajmy o legacy",
          ctaHref: CALENDLY,
        },
        {
          id: "ai",
          need: "Potrzebujesz wdrożyć AI SDLC?",
          title: "AI, które generuje kod, który da się utrzymać",
          desc: "Zespół zamienia wymagania na specyfikację i z niej prowadzi AI. Pracuje według procesu, nie na wyczucie.",
          steps: [
            { name: "Rozpoznanie" },
            { name: "Działanie" },
            { name: "Oddanie" },
          ],
          ctaLabel: "Porozmawiajmy o AI",
          ctaHref: CALENDLY,
        },
        {
          id: "cto",
          need: "Potrzebujesz CTO na część etatu?",
          title: "Techniczny lider, który wchodzi w kod, bez kosztu etatu CTO",
          desc: "Poznaję Twoje cele, pomagam zdefiniować wizję i realne, ale ambitne KPI, a potem prowadzę zespół w ich osiąganiu. Z rękami w kodzie, nie z wieży z kości słoniowej.",
          steps: [
            { name: "Rozpoznanie" },
            { name: "Kierunek i KPI" },
            { name: "Prowadzenie w okopach" },
          ],
          ctaLabel: "Porozmawiajmy o CTO",
          ctaHref: CALENDLY,
        },
        {
          id: "training",
          need: "Potrzebujesz samego szkolenia?",
          title: "Zespół, który wychodzi z umiejętnością, nie z notatkami",
          desc: "Uczestnicy ćwiczą na realnych przypadkach.",
          topics: "Event Storming, DDD, Clean Code, refaktoryzacja, SDLC z AI.",
          quote: pickQuote("pl", "Dużo praktyki"),
          steps: [
            { name: "Oczekiwania" },
            { name: "Program" },
            { name: "Warsztat" },
          ],
          ctaLabel: "Zobacz szkolenia",
          ctaHref: "/pl/training/",
        },
      ],
    },
    evidence: {
      h2: "Co mówią uczestnicy.",
      moreLabel: "Zobacz wszystkie opinie",
      moreHref: "/pl/training/#testimonials",
    },
    aboutHome: { h2: "O mnie", ctaLabel: "Więcej o mnie", ctaHref: "/pl/about/" },
    about: {
      heading: "O mnie",
      paragraphs: [
        "Prowadzę zespoły inżynierskie przez to, co najtrudniejsze w oprogramowaniu: systemy legacy bez dokumentacji, presję biznesową i narzędzia AI, które jeszcze nie spełniają obietnic.",
        "Prowadzę zespoły przez projekty, które inni odkładają latami - i dowożę je end-to-end.",
        "Więcej code review robię niż kodu piszę - kilku inżynierów, których mentorowałem, prowadzi dziś własne zespoły.",
      ],
      ctaLabel: "Umów rozmowę",
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
      statsLabel: `${TRAINING_STATS.trainings} ${pl(TRAINING_STATS.trainings, "trainings")} · ${TRAINING_STATS.days} ${pl(TRAINING_STATS.days, "days")} · ${TRAINING_STATS.hours} ${pl(TRAINING_STATS.hours, "hours")} · ${TRAINING_STATS.people} ${pl(TRAINING_STATS.people, "people")}`,
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
      h2: "Zacznijmy od rozmowy.",
      intro: "Najszybciej złapiesz mnie przez rezerwację terminu w kalendarzu.",
      ctaLabel: "Umów rozmowę",
      ctaHref: CALENDLY,
      mailLabel: "Wolisz napisać? Mail",
      mailSubject: "Cze%C5%9B%C4%87%20Maciej",
      linksHeading: "Gdzie indziej",
      links: [
        { type: "email", label: "Email", subject: "Cze%C5%9B%C4%87%20Maciej", icon: "mail" },
        { type: "link", label: "LinkedIn", href: LINKEDIN, icon: "linkedin" },
        { type: "link", label: "GitHub", href: "https://github.com/speccode", icon: "github" },
        { type: "link", label: "speccode.com", href: "https://speccode.com", icon: "external" },
      ],
    },
    // DRAFT-PENDING-APPROVAL
    faq: {
      h2: "Pytania i odpowiedzi",
      linkLabel: "Zobacz wszystkie pytania",
      linkHref: "/pl/faq/",
      items: [
        {
          home: true,
          q: "Kim jest Forward Deployed Engineer?",
          a: "To inżynier, który nie kończy na rekomendacjach. Robię rozpoznanie, wchodzę tam, gdzie boli najbardziej, robię to, co trzeba, a na czas misji mogę pracować w Twojej firmie. Wychodzę, gdy zespół radzi sobie sam.",
        },
        {
          home: true,
          q: "Czym fractional CTO różni się od etatowego CTO?",
          a: "Dostajesz technicznego lidera na część czasu, bez kosztu etatu CTO. Poznaję Twoje cele, pomagam ustalić kierunek techniczny i KPI, a potem prowadzę zespół, wchodząc w kod, gdy trzeba.",
        },
        {
          home: true,
          q: "Czy szkolenia są u klienta, czy online?",
          a: "Jedno i drugie: u Ciebie lub online. Program piszę na miarę po krótkiej rozmowie o oczekiwaniach.",
        },
        {
          home: true,
          q: "Jak wygląda współpraca?",
          a: "Trzy kroki: rozpoznanie (mapa domeny i bólu), działanie (praca razem z zespołem) i oddanie (dokumentacja i szkolenie, żeby zespół działał beze mnie).",
        },
        {
          q: "Jakie tematy szkoleń prowadzisz?",
          a: `Event Storming, Domain-Driven Design, Clean Code, refaktoryzacja i wdrażanie niezawodnego SDLC z AI. Do tej pory: ${TRAINING_STATS.trainings} ${pl(TRAINING_STATS.trainings, "trainings")} i ${TRAINING_STATS.people} ${pl(TRAINING_STATS.people, "people")}.`,
        },
        {
          q: "Czym jest AI SDLC i dlaczego Spec-Driven Development?",
          a: "AI SDLC to cykl wytwarzania oprogramowania, w którym AI jest pełnoprawnym uczestnikiem. W Spec-Driven Development zespół zamienia wymagania na specyfikację i z niej prowadzi AI. AI to multiplikator wzorców: jeśli kod jest chaosem, AI generuje więcej chaosu, szybciej.",
        },
      ],
    },
    afterTraining: {
      title: "Dziękuję - po szkoleniu",
      h1: "Dziękuję za warsztat.",
      text: "Jeśli chcesz zostać w kontakcie, połącz się ze mną na LinkedIn. Chętnie przeczytam, co zabierasz ze szkolenia.",
      linkedinLabel: "Połącz się na LinkedIn",
      linkedinHref: LINKEDIN,
      feedbackLabel: "Napisz, co zabierasz ze szkolenia",
      feedbackSubject: "Opinia%20po%20szkoleniu",
    },
    postFooter: {
      bookLabel: "Umów rozmowę",
      bookHref: CALENDLY,
      backLabel: "← Wszystkie posty",
      ctaLabel: "Przydatne? Napisz do mnie",
      ctaSubject: "W%20sprawie%20wpisu",
    },
    theme: {
      toggleLabel: "Zmień motyw",
    },
  },
};

module.exports = copy;
