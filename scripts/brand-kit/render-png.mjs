// Rasterise the brand-kit SVGs to PNG (social posts, email, print proofs).
// Usage: node scripts/brand-kit/render-png.mjs
import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "..", "..", "public", "assets", "brand");
for (const f of readdirSync(dir).filter((f) => f.endsWith(".svg"))) {
  const density = f.startsWith("logo") ? 288 : 72; // logos at 4x for crisp print/email use
  await sharp(join(dir, f), { density }).png({ compressionLevel: 9 }).toFile(join(dir, f.replace(".svg", ".png")));
  console.log("rendered", f.replace(".svg", ".png"));
}
