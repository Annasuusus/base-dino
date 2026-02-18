#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.CF_PAGES_URL || "https://battleship.pages.dev";

const manifest = {
  accountAssociation: {
    header: process.env.FARCASTER_HEADER || "",
    payload: process.env.FARCASTER_PAYLOAD || "",
    signature: process.env.FARCASTER_SIGNATURE || "",
  },
  miniapp: {
    version: "1",
    name: "Морський бій",
    homeUrl: BASE_URL + "/",
    iconUrl: BASE_URL + "/icon.png",
    splashImageUrl: BASE_URL + "/splash.png",
    splashBackgroundColor: "#0b1120",
    subtitle: "Класична гра проти комп'ютера",
    description: "Морський бій — топи кораблі ворожого флоту!",
    screenshotUrls: [BASE_URL + "/og.png"],
    primaryCategory: "games",
    tags: ["game", "battleship", "miniapp"],
    heroImageUrl: BASE_URL + "/og.png",
    tagline: "Грати",
    ogTitle: "Морський бій",
    ogDescription: "Класична гра Морський бій проти комп'ютера.",
    ogImageUrl: BASE_URL + "/og.png",
    noindex: true,
  },
};

const dir = path.join(__dirname, "..", "public", ".well-known");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "farcaster.json"), JSON.stringify(manifest, null, 0));
console.log("OK public/.well-known/farcaster.json");
