import { NextResponse } from "next/server";

const ROOT_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://mygame-iota-one.vercel.app";

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
    screenshotUrls: [`${ROOT_URL}/og.svg`],
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

export async function GET() {
  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
