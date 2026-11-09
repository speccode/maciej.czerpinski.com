// One-off asset build: portrait variants, og.jpg, font copy. Run: node scripts/make-images.mjs [source.jpg]
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = process.argv[2] || "/Users/maciejczerpinski/Documents/IMG_2496.jpg";
const IMG = "site/img";
const meta = await sharp(SRC).metadata();
// 4:5 crop, keep the top (face), trim the bottom.
const h = Math.round((meta.width * 5) / 4);
const crop = { left: 0, top: 0, width: meta.width, height: Math.min(h, meta.height) };
const base = () => sharp(SRC).rotate().extract(crop);

for (const w of [600, 1200]) {
  const r = () => base().resize(w, Math.round((w * 5) / 4));
  await r().avif({ quality: 50 }).toFile(`${IMG}/portrait-${w}.avif`);
  await r().webp({ quality: 78 }).toFile(`${IMG}/portrait-${w}.webp`);
  await r().jpeg({ quality: 78, mozjpeg: true }).toFile(`${IMG}/portrait-${w}.jpg`);
}

const pw = 504; // 630 * 4/5
const portrait = await base().resize(pw, 630).jpeg({ quality: 85 }).toBuffer();
const svg = Buffer.from(`<svg width="696" height="630" xmlns="http://www.w3.org/2000/svg">
  <style>.n{font:700 64px Helvetica,Arial,sans-serif;fill:#1d1d1f;letter-spacing:-2px}.r{font:500 30px Helvetica,Arial,sans-serif;fill:#6e6e73}</style>
  <text class="n" x="72" y="290">Maciej</text><text class="n" x="72" y="360">Czerpiński</text>
  <text class="r" x="72" y="430">Forward Deployed Engineer,</text><text class="r" x="72" y="470">trener i konsultant</text></svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#fbfbfd" } })
  .composite([{ input: svg, left: 0, top: 0 }, { input: portrait, left: 1200 - pw, top: 0 }])
  .jpeg({ quality: 85 })
  .toFile(`${IMG}/og.jpg`);

fs.mkdirSync("site/fonts", { recursive: true });
const f = "node_modules/@fontsource-variable/inter/files";
fs.copyFileSync(path.join(f, "inter-latin-wght-normal.woff2"), "site/fonts/inter-variable.woff2");
fs.copyFileSync(path.join(f, "inter-latin-ext-wght-normal.woff2"), "site/fonts/inter-variable-ext.woff2");
console.log("done");
