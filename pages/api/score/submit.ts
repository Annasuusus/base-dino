import type { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "../../../lib/cookies";
import { verifySession } from "../../../lib/auth";
import { submitScore } from "../../../lib/scoreStore";

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
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const entry = submitScore(session.address, Math.floor(score));
  res.status(200).json({ address: entry.address, best: entry.score });
}
