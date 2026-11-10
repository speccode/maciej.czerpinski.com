// Browser QA on the built site (docs/). Uses installed Chrome via Playwright. Run: node scripts/qa-browser.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(root, "docs");
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  let f = path.join(DOCS, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end("nf"); }
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

const results = [];
const ok = (name, cond, detail = "") => { results.push({ name, pass: !!cond, detail }); console.log(`${cond ? "PASS" : "FAIL"} ${name}${cond ? "" : " :: " + detail}`); };
const lum = (rgb) => { const c = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const parse = (s) => s.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);

const browser = await chromium.launch({ channel: "chrome" });
const PAGES = ["/", "/pl/", "/faq/", "/pl/po-szkoleniu/"];
const WIDTHS = [1440, 1024, 768, 390, 320];
const externals = new Set();

// A. overflow + console errors
for (const scheme of ["light", "dark"]) {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme });
    for (const u of PAGES) {
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("request", (r) => { if (!r.url().startsWith(BASE)) externals.add(r.url()); });
      await page.goto(BASE + u, { waitUntil: "networkidle" });
      const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      ok(`A ${u} ${w}px ${scheme}: no horizontal scroll`, over <= 0, `overflow ${over}px`);
      ok(`A ${u} ${w}px ${scheme}: no console errors`, errors.length === 0, errors.join(" | "));
      await page.close();
    }
    await ctx.close();
  }
}

// B. themes
{
  const stored = await browser.newContext({ colorScheme: "dark" });
  await stored.addInitScript(() => { try { localStorage.setItem("theme", "light"); } catch (e) {} });
  let p = await stored.newPage(); await p.goto(BASE + "/", { waitUntil: "networkidle" });
  ok("B system dark + stored light => light bg", (await p.evaluate(() => getComputedStyle(document.body).backgroundColor)) === "rgb(251, 251, 253)");
  await stored.close();

  const sys = await browser.newContext({ colorScheme: "dark" });
  p = await sys.newPage(); await p.goto(BASE + "/", { waitUntil: "networkidle" });
  ok("B system dark, nothing stored => dark bg", (await p.evaluate(() => getComputedStyle(document.body).backgroundColor)) === "rgb(11, 11, 13)");
  await p.click("[data-theme-toggle]");
  ok("B toggle flips to light", (await p.evaluate(() => getComputedStyle(document.body).backgroundColor)) === "rgb(251, 251, 253)");
  ok("B toggle persists in localStorage", (await p.evaluate(() => localStorage.getItem("theme"))) === "light");
  await p.reload({ waitUntil: "networkidle" });
  ok("B persisted theme survives reload without flash (light)", (await p.evaluate(() => document.documentElement.getAttribute("data-theme"))) === "light");
  await sys.close();
}

// C. JS disabled
{
  const ctx = await browser.newContext({ colorScheme: "dark", javaScriptEnabled: false });
  const p = await ctx.newPage(); await p.goto(BASE + "/pl/", { waitUntil: "networkidle" });
  ok("C no-JS: renders in system theme (dark)", (await p.evaluate(() => getComputedStyle(document.body).backgroundColor)) === "rgb(11, 11, 13)");
  ok("C no-JS: h1 visible", await p.locator("h1").isVisible());
  ok("C no-JS: mail fallback text visible", await p.locator("#contact [data-email-text]").isVisible() && (await p.locator("#contact [data-email-text]").innerText()).includes("[at]"));
  await ctx.close();
}

// D. keyboard + E. contrast + F. above the fold
for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
  const p = await ctx.newPage(); await p.goto(BASE + "/pl/", { waitUntil: "networkidle" });
  await p.keyboard.press("Tab");
  ok(`D ${scheme}: first Tab focuses skip link`, await p.evaluate(() => document.activeElement.classList.contains("skip-link")));
  let reached = false, outline = "";
  for (let i = 0; i < 14 && !reached; i++) {
    await p.keyboard.press("Tab");
    reached = await p.evaluate(() => document.activeElement.matches(".hero .btn"));
  }
  if (reached) outline = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle + " " + getComputedStyle(document.activeElement).outlineWidth);
  ok(`D ${scheme}: Tab reaches hero button with visible focus`, reached && !outline.startsWith("none"), outline);
  for (const sel of [".hero h1 .grey", ".hero .proof span", ".hero__sub"]) {
    const [fg, bg] = await p.evaluate((s) => [getComputedStyle(document.querySelector(s)).color, getComputedStyle(document.body).backgroundColor], sel);
    const r = ratio(parse(fg), parse(bg));
    ok(`E ${scheme}: contrast ${sel} >= 4.5`, r >= 4.5, r.toFixed(2));
  }
  await ctx.close();
}
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage(); await p.goto(BASE + "/pl/", { waitUntil: "networkidle" });
  const m = await p.evaluate(() => {
    const b = (s) => document.querySelector(s).getBoundingClientRect();
    return { h1: b(".hero h1").bottom, sub: b(".hero__sub").bottom, btn: b(".hero .btn").bottom, photoTop: b(".hero__photo").top, vh: innerHeight };
  });
  ok(`F ${w}px: headline, subline, calendar button above the fold`, m.h1 < m.vh && m.sub < m.vh && m.btn < m.vh, JSON.stringify(m));
  ok(`F ${w}px: face visible above the fold`, m.photoTop < m.vh - 150, JSON.stringify(m));
  await ctx.close();
}

// H. phone links: text and inner spans must keep their spaces (no flex on links), 44px tap height
for (const w of [390, 320]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const p = await ctx.newPage(); await p.goto(BASE + "/pl/", { waitUntil: "networkidle" });
  const bad = await p.evaluate(() => [...document.querySelectorAll(".link-more, .cta, .site-nav a, .site-footer__links a")]
    .filter((a) => /flex/.test(getComputedStyle(a).display) || a.getBoundingClientRect().height < 43.5)
    .map((a) => a.textContent.trim().slice(0, 30) + " " + getComputedStyle(a).display + " h=" + Math.round(a.getBoundingClientRect().height)));
  ok(`H ${w}px: links are not flex and are >= 44px tall`, bad.length === 0, bad.join(" | "));
  await ctx.close();
}

// G. third-party requests
ok("G no third-party requests", externals.size === 0, [...externals].join(", "));

await browser.close(); server.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
