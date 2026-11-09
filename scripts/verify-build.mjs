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
