// Checks the built site in docs/. Run: npm run verify (builds first).
// Append new checks to the CHECKS list; each returns nothing or throws.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DOCS = process.env.DOCS_DIR || path.join(root, "docs");

export function fileFor(urlPath) {
  const p = path.join(DOCS, urlPath);
  if (urlPath.endsWith("/")) return path.join(p, "index.html");
  return p;
}
export function read(urlPath) {
  const f = fileFor(urlPath);
  if (!fs.existsSync(f)) throw new Error(`missing built file for ${urlPath} (${f})`);
  return fs.readFileSync(f, "utf8");
}
export function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

export const CHECKS = [];
export function check(name, fn) {
  CHECKS.push({ name, fn });
}

// ---- Task 1: baseline regression net ----
const BASELINE_PATHS = [
  "/", "/pl/", "/about/", "/pl/about/", "/training/", "/pl/training/",
  "/contact/", "/pl/contact/", "/blog/", "/blog/remote-event-storming/",
  "/remote-event-storming/", "/tags/", "/sitemap.xml", "/llms.txt", "/robots.txt", "/CNAME",
];
for (const p of BASELINE_PATHS) check(`baseline: ${p} is built`, () => read(p));

for (const p of ["/", "/pl/", "/about/", "/pl/about/", "/training/", "/pl/training/", "/contact/", "/pl/contact/"]) {
  check(`baseline: ${p} has hreflang en, pl, x-default`, () => {
    const html = read(p);
    for (const l of ["en", "pl", "x-default"]) {
      assert(html.includes(`hreflang="${l}"`), `no hreflang ${l}`);
    }
  });
}

check("baseline: sitemap is well-formed and lists /pl/", () => {
  const xml = read("/sitemap.xml");
  assert(xml.startsWith("<?xml"), "no xml header");
  assert((xml.match(/<urlset/g) || []).length === 1 && xml.includes("</urlset>"), "urlset malformed");
  assert(xml.includes("https://maciej.czerpinski.com/pl/</loc>"), "/pl/ missing");
});

// ---- Task 2: assets ----
const size = (u) => { const f = fileFor(u); assert(fs.existsSync(f), `missing ${u}`); return fs.statSync(f).size; };
check("assets: Inter font built", () => assert(size("/fonts/inter-variable.woff2") > 10000, "font too small"));
for (const w of [600, 1200]) {
  for (const ext of ["avif", "webp", "jpg"]) {
    check(`assets: portrait-${w}.${ext} built`, () => size(`/img/portrait-${w}.${ext}`));
  }
}
check("assets: portrait jpg budgets", () => {
  assert(size("/img/portrait-1200.jpg") < 250 * 1024, "1200 jpg >= 250KB");
  assert(size("/img/portrait-600.jpg") < 90 * 1024, "600 jpg >= 90KB");
});
check("assets: og.jpg is 1200x630", () => {
  const b = fs.readFileSync(fileFor("/img/og.jpg"));
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xc3) {
      const h = b.readUInt16BE(i + 5), w = b.readUInt16BE(i + 7);
      assert(w === 1200 && h === 630, `size ${w}x${h}`);
      return;
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error("no SOF marker");
});

// ---- Task 3: design system and base layout ----
function allHtml(dir = DOCS, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) allHtml(f, out);
    else if (e.name.endsWith(".html")) out.push(f);
  }
  return out;
}
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
function tokenBlocks() {
  const css = read("/css/style.css");
  const grab = (selRe) => {
    const m = css.match(new RegExp(selRe + "\\s*\\{([^}]*)\\}"));
    assert(m, `token block not found: ${selRe}`);
    const get = (n) => (m[1].match(new RegExp(`--${n}:\\s*(#[0-9a-fA-F]{6})`)) || [])[1];
    return { bg: get("bg"), ink: get("ink"), grey: get("grey"), sub: get("sub"), line: get("line"), btnBg: get("btn-bg"), btnInk: get("btn-ink") };
  };
  return {
    light: grab(":root"),
    mediaDark: grab(':root:not\\(\\[data-theme="light"\\]\\)'),
    attrDark: grab(':root\\[data-theme="dark"\\]'),
  };
}
check("design: no Google Fonts anywhere in built html", () => {
  const bad = allHtml().filter((f) => fs.readFileSync(f, "utf8").includes("fonts.googleapis.com"));
  assert(!bad.length, `google fonts in ${bad.length} files, e.g. ${bad[0]}`);
});
check("design: og:image and twitter:image are /img/og.jpg", () => {
  const html = read("/");
  assert(html.includes('property="og:image" content="https://maciej.czerpinski.com/img/og.jpg"'), "og:image");
  assert(html.includes('name="twitter:image" content="https://maciej.czerpinski.com/img/og.jpg"'), "twitter:image");
});
check("design: font preloaded, favicon linked", () => {
  const html = read("/");
  assert(html.includes('rel="preload" href="/fonts/inter-variable.woff2"'), "font preload");
  assert(html.includes('rel="icon"'), "favicon link");
  assert(fs.existsSync(fileFor("/img/favicon.svg")), "favicon file");
});
check("design: light tokens match spec", () => {
  const t = tokenBlocks().light;
  const want = { bg: "#fbfbfd", ink: "#1d1d1f", grey: "#6e6e73", sub: "#515154", line: "#e5e5ea", btnBg: "#1d1d1f", btnInk: "#ffffff" };
  for (const k of Object.keys(want)) assert(t[k]?.toLowerCase() === want[k], `light --${k}: ${t[k]} != ${want[k]}`);
});
for (const key of ["mediaDark", "attrDark"]) {
  check(`design: dark tokens (${key}) match spec`, () => {
    const t = tokenBlocks()[key];
    const want = { bg: "#0b0b0d", ink: "#f5f5f7", grey: "#8e8e93", sub: "#a1a1a6", line: "#2c2c2e", btnBg: "#f5f5f7", btnInk: "#1d1d1f" };
    for (const k of Object.keys(want)) assert(t[k]?.toLowerCase() === want[k], `${key} --${k}: ${t[k]} != ${want[k]}`);
  });
}
check("design: text contrast >= 4.5 in both themes", () => {
  const b = tokenBlocks();
  for (const [name, t] of Object.entries({ light: b.light, dark: b.attrDark })) {
    for (const k of ["ink", "grey", "sub"]) assert(contrast(t[k], t.bg) >= 4.5, `${name} ${k} on bg = ${contrast(t[k], t.bg).toFixed(2)}`);
    assert(contrast(t.btnInk, t.btnBg) >= 4.5, `${name} button contrast`);
  }
});
check("design: reduced-motion and focus-visible present", () => {
  const css = read("/css/style.css");
  assert(css.includes("prefers-reduced-motion: reduce"), "reduced motion");
  assert(css.includes(":focus-visible"), "focus-visible");
});

// ---- Task 4: copy data ----
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const loadCopy = () => {
  const f = path.join(root, "site/_data/copy.js");
  delete require.cache[f];
  return require(f);
};
const shape = (v) =>
  Array.isArray(v) ? "[" + (v.length ? shape(v[0]) : "") + "]"
  : v && typeof v === "object" ? "{" + Object.keys(v).sort().map((k) => k + ":" + shape(v[k])).join(",") + "}"
  : typeof v;
const strings = (v, out = []) => {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out));
  return out;
};
check("copy: en and pl have identical key shape", () => {
  const c = loadCopy();
  assert(shape(c.en) === shape(c.pl), "en/pl shape differs:\nEN " + shape(c.en) + "\nPL " + shape(c.pl));
});
check("copy: offer has 4 cards in order, 3 steps each", () => {
  const c = loadCopy();
  for (const l of ["en", "pl"]) {
    const cards = c[l].offer.cards;
    assert(cards.map((x) => x.id).join() === "legacy,ai,cto,training", `${l} ids`);
    cards.forEach((x) => assert(x.steps.length === 3, `${l} ${x.id} steps`));
  }
});
check("copy: PL hero and proof match spec", () => {
  const c = loadCopy().pl;
  assert(c.hero.h1 === "Wchodzę tam, gdzie boli najbardziej.", "h1");
  assert(c.hero.h1Grey === "Zostaję, aż zespół działa sam.", "h1Grey");
  assert(c.hero.sub === "Forward Deployed Engineer, trener i konsultant. 15+ lat w okopach IT.", "sub");
  assert(c.hero.ctaLabel === "Umów rozmowę", "cta");
  assert(c.proof.map((x) => x.value).join() === "302,664,43,15+", "proof values " + c.proof.map((x) => x.value));
});
check("copy: no PHP or Gallup in hero/proof", () => {
  const c = loadCopy();
  for (const l of ["en", "pl"]) {
    const t = strings([c[l].hero, c[l].proof]).join(" ");
    assert(!/php/i.test(t), `${l} PHP in hero/proof`);
    assert(!/learner|gallup|strategic/i.test(t), `${l} talents in hero`);
  }
});
check("copy: AI card asks about AI SDLC, cto card minimal wording", () => {
  const c = loadCopy();
  for (const l of ["en", "pl"]) assert(/AI SDLC/.test(c[l].offer.cards[1].need), `${l} AI SDLC in need`);
  assert(c.pl.offer.cards[2].steps.map((x) => x.name).join() === "Rozpoznanie,Kierunek i KPI,Prowadzenie w okopach", "cto steps");
});
check("copy: training card quote comes from testimonials.js", () => {
  const c = loadCopy(), t = require(path.join(root, "site/_data/testimonials.js"));
  for (const l of ["en", "pl"]) {
    const q = c[l].offer.cards[3].quote;
    assert(q && t[l].some((x) => x.quote === q.text), `${l} quote not found in testimonials`);
  }
  assert(c.pl.offer.cards[3].quote.text === "Dużo praktyki popartej realnymi przykładami.", "PL quote text");
});
check("copy: FAQ has >=6 items, 4-6 on home, no money claims", () => {
  const c = loadCopy();
  for (const l of ["en", "pl"]) {
    const items = c[l].faq.items;
    assert(items.length >= 6, `${l} faq items ${items.length}`);
    const home = items.filter((i) => i.home).length;
    assert(home >= 4 && home <= 6, `${l} home faq ${home}`);
    assert(!/PLN|zł|\$|€/.test(strings(items).join(" ")), `${l} faq mentions money`);
  }
});
check("copy: contact and afterTraining fields present", () => {
  const c = loadCopy();
  for (const l of ["en", "pl"]) {
    assert(c[l].contact.mailLabel && c[l].contact.h2, `${l} contact`);
    assert(c[l].afterTraining.linkedinHref === "https://www.linkedin.com/in/maciejczerpinski/", `${l} linkedin`);
    assert(c[l].afterTraining.feedbackSubject, `${l} feedbackSubject`);
  }
});
check("copy: EN drafts are flagged in source", () => {
  assert(fs.readFileSync(path.join(root, "site/_data/copy.js"), "utf8").includes("EN-DRAFT"), "no EN-DRAFT marker");
});

// ---- Task 5: homepage ----
const CALENDLY_URL = "https://calendly.com/maciej-czerpinski/consulting";
const HOME_IDS = ["hero", "offer", "proof", "about", "blog", "contact", "faq"];
export const sectionHtml = (html, id) => {
  const m = html.match(new RegExp('<section[^>]*id="' + id + '"[\\s\\S]*?</section>'));
  assert(m, `section #${id} not found`);
  return m[0];
};
const count = (s, re) => (s.match(re) || []).length;
const stripTags = (h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const homeStats = {};
for (const [url, lang] of [["/", "en"], ["/pl/", "pl"]]) {
  check(`home ${url}: sections in spec order`, () => {
    const main = read(url).split('<main id="main">')[1];
    const ids = [...main.matchAll(/<section[^>]*\sid="([a-z-]+)"/g)].map((m) => m[1]);
    assert(ids.join() === HOME_IDS.join(), `ids: ${ids.join()}`);
  });
  check(`home ${url}: hero text, calendly button, no talents`, () => {
    const c = loadCopy()[lang].hero;
    const hero = sectionHtml(read(url), "hero");
    const text = stripTags(hero);
    for (const t of [c.h1, c.h1Grey, c.sub]) assert(text.includes(t), `hero lacks: ${t}`);
    assert(new RegExp('<a[^>]*class="btn"[^>]*href="' + CALENDLY_URL + '"[^>]*target="_blank"|<a[^>]*href="' + CALENDLY_URL + '"[^>]*class="btn"[^>]*target="_blank"').test(hero), "no Calendly .btn with target=_blank");
    assert(!/talents|php/i.test(hero), "talents or PHP in hero");
    assert(count(hero, /<strong>/g) === 4, "hero proof bar needs 4 stats");
    assert(hero.includes("<picture>") && hero.includes('fetchpriority="high"') && hero.includes('width="1200"'), "hero picture");
  });
  check(`home ${url}: 4 offer cards, 3 steps each, topics+quote on training`, () => {
    const offer = sectionHtml(read(url), "offer");
    assert(count(offer, /class="card"/g) === 4, "cards");
    assert(count(offer, /class="step"/g) === 12, "steps");
    assert(offer.includes("card__quote"), "training quote");
    const c = loadCopy()[lang].offer;
    assert(stripTags(offer).includes(c.cards[3].quote.text), "quote text");
  });
  check(`home ${url}: 3 evidence quotes, about, latest blog links (max 3)`, () => {
    const html = read(url);
    assert(count(sectionHtml(html, "proof"), /class="quote"/g) === 3, "quotes");
    assert(sectionHtml(html, "about").includes(loadCopy()[lang].about.paragraphs[0].slice(0, 40)), "about text");
    const posts = fs.readdirSync(path.join(root, "site/blog/posts")).filter((f) => f.endsWith(".md")).length;
    assert(count(sectionHtml(html, "blog"), /<li>/g) === Math.min(3, posts), "blog items");
  });
  check(`home ${url}: faq 4-6 details; contact has calendly and mail fallback`, () => {
    const html = read(url);
    const n = count(sectionHtml(html, "faq"), /<details/g);
    assert(n >= 4 && n <= 6, `faq details ${n}`);
    const contact = sectionHtml(html, "contact");
    assert(contact.includes(CALENDLY_URL), "calendly in contact");
    assert(contact.includes("data-email-user=") && contact.includes("hello [at] czerpinski.com"), "mail link fallback");
    assert(!/hello@czerpinski\.com/.test(html), "literal address in html");
  });
  check(`home ${url}: record structure for parity`, () => {
    const h = read(url);
    homeStats[lang] = [count(h, /class="card"/g), count(h, /class="step"/g), count(h, /class="quote"/g), count(h, /<details/g), count(h, /<li>/g)].join();
  });
}
check("home: EN and PL have the same structure counts", () => {
  assert(homeStats.en === homeStats.pl, `EN ${homeStats.en} vs PL ${homeStats.pl}`);
});

// ---- append later tasks above this line ----

if (import.meta.url === `file://${process.argv[1]}`) {
  let failed = 0;
  for (const { name, fn } of CHECKS) {
    try {
      fn();
      console.log(`PASS ${name}`);
    } catch (e) {
      failed++;
      console.log(`FAIL ${name}: ${e.message}`);
    }
  }
  console.log(`\n${CHECKS.length - failed}/${CHECKS.length} passed`);
  process.exit(failed ? 1 : 0);
}
