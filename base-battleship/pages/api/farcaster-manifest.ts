import type { NextApiRequest, NextApiResponse } from "next";

const manifest = {
  accountAssociation: {
    header: process.env.FARCASTER_HEADER || "",
    payload: process.env.FARCASTER_PAYLOAD || "",
    signature: process.env.FARCASTER_SIGNATURE || "",
  },
  miniapp: {
    version: "1",
    name: "Морський бій",
    homeUrl: "https://mygame-iota-one.vercel.app",
    iconUrl: "https://mygame-iota-one.vercel.app/icon.svg",
    splashImageUrl: "https://mygame-iota-one.vercel.app/splash.svg",
    splashBackgroundColor: "#0b1120",
    subtitle: "Класична гра проти комп'ютера",
    description: "Морський бій — топи кораблі ворожого флоту!",
    webhookUrl: "https://mygame-iota-one.vercel.app/api/webhook",
    screenshotUrls: [] as string[],
    primaryCategory: "games",
    tags: ["game", "battleship", "miniapp"],
    heroImageUrl: "https://mygame-iota-one.vercel.app/og.svg",
    tagline: "Грати",
    ogTitle: "Морський бій",
    ogDescription: "Класична гра Морський бій проти комп'ютера.",
    ogImageUrl: "https://mygame-iota-one.vercel.app/og.svg",
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
