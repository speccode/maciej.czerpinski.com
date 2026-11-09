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
