import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { parseCookies, setCookie } from "../../../../lib/cookies";
import { verifySession } from "../../../../lib/auth";
import { submitScore } from "../../../../lib/battleshipScoreStore";

type Body = { score?: number };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { score } = req.body as Body;
  if (typeof score !== "number" || Number.isNaN(score) || score < 0) {
    res.status(400).json({ error: "Invalid score" });
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const session = verifySession(cookies.base_dino_session);
  let identity = session?.address;

  if (!identity) {
    const guestCookie = cookies.base_dino_guest;
    const guestId = guestCookie || crypto.randomBytes(8).toString("hex");
    identity = `guest:${guestId}`;
    if (!guestCookie) {
      const isProd = process.env.NODE_ENV === "production";
      setCookie(res, "base_dino_guest", guestId, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
      });
    }
  }

  const entry = submitScore(identity, Math.floor(score));
  res.status(200).json({ address: entry.address, best: entry.score });
}
