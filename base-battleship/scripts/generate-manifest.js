#!/usr/bin/env node
/**
 * Generates farcaster.json from env vars at build time.
 * Vercel exposes FARCASTER_HEADER, FARCASTER_PAYLOAD, FARCASTER_SIGNATURE.
 */
const fs = require("fs");
const path = require("path");

const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mygame-iota-one.vercel.app";

const manifest = {
  accountAssociation: {
    header: process.env.FARCASTER_HEADER || "",
    payload: process.env.FARCASTER_PAYLOAD || "",
    signature: process.env.FARCASTER_SIGNATURE || "",
  },
  miniapp: {
    version: "1",
    name: "Морський бій",
    homeUrl: ROOT_URL,
    iconUrl: `${ROOT_URL}/icon.svg`,
    splashImageUrl: `${ROOT_URL}/splash.svg`,
    splashBackgroundColor: "#0b1120",
    subtitle: "Класична гра проти комп'ютера",
    description: "Морський бій — топи кораблі ворожого флоту!",
    webhookUrl: `${ROOT_URL}/api/webhook`,
    screenshotUrls: [],
    primaryCategory: "games",
    tags: ["game", "battleship", "miniapp"],
    heroImageUrl: `${ROOT_URL}/og.svg`,
    tagline: "Грати",
    ogTitle: "Морський бій",
    ogDescription: "Класична гра Морський бій проти комп'ютера.",
    ogImageUrl: `${ROOT_URL}/og.svg`,
    noindex: true,
  },
};

const dir = path.join(__dirname, "..", "public", ".well-known");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "farcaster.json"), JSON.stringify(manifest, null, 0));
console.log("Generated public/.well-known/farcaster.json");
