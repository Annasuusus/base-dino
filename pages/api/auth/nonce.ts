import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { setCookie } from "../../../lib/cookies";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const nonce = crypto.randomBytes(16).toString("hex");
  const isProd = process.env.NODE_ENV === "production";

  setCookie(res, "base_dino_nonce", nonce, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
  });

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ nonce });
}
