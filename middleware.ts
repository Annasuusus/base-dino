import type { NextRequest } from "next/server";

const WELL_KNOWN_PATH = "/.well-known/farcaster.json";

function getManifest() {
  const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mygame-iota-one.vercel.app";
  return {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || "",
      payload: process.env.FARCASTER_PAYLOAD || "",
      signature: process.env.FARCASTER_SIGNATURE || "",
    },
    miniapp: {
      version: "1",
      name: process.env.MINIAPP_NAME || "Морський бій",
      homeUrl: ROOT_URL,
      iconUrl: `${ROOT_URL}/icon.png`,
      splashImageUrl: `${ROOT_URL}/splash.png`,
      splashBackgroundColor: process.env.MINIAPP_SPLASH_BG || "#0b1120",
      subtitle: process.env.MINIAPP_SUBTITLE || "Класична гра проти комп'ютера",
      description: process.env.MINIAPP_DESCRIPTION || "Морський бій — топи кораблі ворожого флоту!",
      screenshotUrls: [`${ROOT_URL}/og.png`],
      primaryCategory: process.env.MINIAPP_CATEGORY || "games",
      tags: process.env.MINIAPP_TAGS ? process.env.MINIAPP_TAGS.split(",").map((s: string) => s.trim()) : ["game", "battleship", "miniapp"],
      heroImageUrl: `${ROOT_URL}/og.png`,
      tagline: process.env.MINIAPP_TAGLINE || "Грати",
      ogTitle: process.env.MINIAPP_NAME || "Морський бій",
      ogDescription: process.env.MINIAPP_DESCRIPTION || "Морський бій — топи кораблі ворожого флоту!",
      ogImageUrl: `${ROOT_URL}/og.png`,
      noindex: true,
    },
  };
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === WELL_KNOWN_PATH) {
    const body = JSON.stringify(getManifest());
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
  return;
}

export const config = {
  matcher: [WELL_KNOWN_PATH],
};
