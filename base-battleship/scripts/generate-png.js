#!/usr/bin/env node
/**
 * Base spec: icon PNG 1024×1024, splash 200×200, hero/og 1200×630
 */
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");

const PUBLIC = path.join(__dirname, "..", "public");
const DARK = 0x0b1120ff; // #0b1120

async function run() {
  const sizes = [
    [1024, 1024, "icon.png"],
    [200, 200, "splash.png"],
    [1200, 630, "og.png"],
  ];
  for (const [w, h, name] of sizes) {
    const img = new Jimp(w, h, DARK);
    await img.writeAsync(path.join(PUBLIC, name));
    console.log("Generated", name);
  }
}

run().catch((e) => {
  console.error("PNG gen failed:", e.message);
  process.exit(1);
});
