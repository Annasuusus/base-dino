import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Base manifest: https://docs.base.org/mini-apps/core-concepts/manifest
 * Must be available at https://your-domain.com/.well-known/farcaster.json
 */
function getManifest() {
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

  return {
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
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).json(getManifest());
}
