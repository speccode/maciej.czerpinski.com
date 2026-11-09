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
