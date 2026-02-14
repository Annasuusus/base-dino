import type { NextApiRequest, NextApiResponse } from "next";
import { getLeaderboard } from "../../../../lib/battleshipScoreStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const leaderboard = getLeaderboard(5);
  res.status(200).json({ leaderboard });
}
