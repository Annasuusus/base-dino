import type { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "../../../lib/cookies";
import { verifySession } from "../../../lib/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const session = verifySession(cookies.base_battleship_session);

  if (!session) {
    res.status(200).json({ address: null });
    return;
  }

  res.status(200).json({ address: session.address });
}
