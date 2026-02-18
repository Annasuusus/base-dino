#!/usr/bin/env node
/**
 * Generates public/.well-known/farcaster.json from env at build time.
 * Base: https://docs.base.org/mini-apps/core-concepts/manifest
 */
const fs = require("fs");
const path = require("path");

const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mygame-iota-one.vercel.app";
const miniappName = process.env.MINIAPP_NAME || "Морський бій";
const miniappDescription = process.env.MINIAPP_DESCRIPTION || "Морський бій — топи кораблі ворожого флоту!";
const miniappSubtitle = process.env.MINIAPP_SUBTITLE || "Класична гра проти комп'ютера";
const miniappTagline = process.env.MINIAPP_TAGLINE || "Грати";
const miniappCategory = process.env.MINIAPP_CATEGORY || "games";
const miniappTags = process.env.MINIAPP_TAGS ? process.env.MINIAPP_TAGS.split(",").map((s) => s.trim()) : ["game", "battleship", "miniapp"];
const splashBg = process.env.MINIAPP_SPLASH_BG || "#0b1120";
const iconPath = process.env.MINIAPP_ICON_PATH || "/icon.png";
const splashPath = process.env.MINIAPP_SPLASH_PATH || "/splash.png";
const ogPath = process.env.MINIAPP_OG_PATH || "/og.png";

const manifest = {
  accountAssociation: {
    header: process.env.FARCASTER_HEADER || "",
    payload: process.env.FARCASTER_PAYLOAD || "",
    signature: process.env.FARCASTER_SIGNATURE || "",
  },
  miniapp: {
    version: "1",
    name: miniappName,
    homeUrl: ROOT_URL,
    iconUrl: `${ROOT_URL}${iconPath}`,
    splashImageUrl: `${ROOT_URL}${splashPath}`,
    splashBackgroundColor: splashBg,
    subtitle: miniappSubtitle,
    description: miniappDescription,
    screenshotUrls: [`${ROOT_URL}${ogPath}`],
    primaryCategory: miniappCategory,
    tags: miniappTags,
    heroImageUrl: `${ROOT_URL}${ogPath}`,
    tagline: miniappTagline,
    ogTitle: miniappName,
    ogDescription: miniappDescription,
    ogImageUrl: `${ROOT_URL}${ogPath}`,
    noindex: true,
  },
};

const dir = path.join(__dirname, "..", "public", ".well-known");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "farcaster.json"), JSON.stringify(manifest, null, 0));
console.log("Generated public/.well-known/farcaster.json");
