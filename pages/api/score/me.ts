import type { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "../../../lib/cookies";
import { verifySession } from "../../../lib/auth";
import { getUserBest } from "../../../lib/scoreStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const session = verifySession(cookies.base_dino_session);
  let identity = session?.address;
  if (!identity && cookies.base_dino_guest) {
    identity = `guest:${cookies.base_dino_guest}`;
  }
  if (!identity) {
    res.status(200).json({ best: null });
    return;
  }

  const best = getUserBest(identity);
  res.status(200).json({ best });
}
