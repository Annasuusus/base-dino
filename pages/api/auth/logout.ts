import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "../../../lib/cookies";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const isProd = process.env.NODE_ENV === "production";

  setCookie(res, "base_dino_session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    expires: new Date(0),
  });

  res.status(200).json({ ok: true });
}
