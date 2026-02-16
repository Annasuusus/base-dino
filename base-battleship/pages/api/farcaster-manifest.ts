import type { NextApiRequest, NextApiResponse } from "next";

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
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0b1120",
    subtitle: "Класична гра проти комп'ютера",
    description: "Морський бій — топи кораблі ворожого флоту!",
    screenshotUrls: [`${ROOT_URL}/og.png`],
    primaryCategory: "games",
    tags: ["game", "battleship", "miniapp"],
    heroImageUrl: `${ROOT_URL}/og.png`,
    tagline: "Грати",
    ogTitle: "Морський бій",
    ogDescription: "Класична гра Морський бій проти комп'ютера.",
    ogImageUrl: `${ROOT_URL}/og.png`,
    noindex: true,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).json(manifest);
}
