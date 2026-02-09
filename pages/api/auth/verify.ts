import type { NextApiRequest, NextApiResponse } from "next";
import { getAddress } from "ethers";
import { SiweMessage } from "siwe";
import { parseCookies, setCookie } from "../../../lib/cookies";
import { signSession } from "../../../lib/auth";

type Body = {
  address?: string;
  signature?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { address, signature, message } = req.body as Body;
  if (!address || !signature || !message) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  const cookies = parseCookies(req.headers.cookie);
  const nonce = cookies.base_dino_nonce;
  if (!nonce) {
    res.status(401).json({ error: "Invalid nonce" });
    return;
  }

  try {
    const siwe = new SiweMessage(message);
    const host = req.headers.host || "";
    const result = await siwe.verify({ signature, nonce });
    if (!result.success) {
      res.status(401).json({ error: "Signature invalid" });
      return;
    }
    if (siwe.domain !== host) {
      res.status(401).json({ error: "Invalid domain" });
      return;
    }
    if (siwe.chainId !== 8453) {
      res.status(401).json({ error: "Invalid chain" });
      return;
    }
    if (getAddress(siwe.address) !== getAddress(address)) {
      res.status(401).json({ error: "Signature mismatch" });
      return;
    }
  } catch {
    res.status(401).json({ error: "Signature invalid" });
    return;
  }

  const token = signSession({
    address: getAddress(address),
    issuedAt: new Date().toISOString(),
  });

  const isProd = process.env.NODE_ENV === "production";

  setCookie(res, "base_dino_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
  });

  setCookie(res, "base_dino_nonce", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    expires: new Date(0),
  });

  res.status(200).json({ address: getAddress(address) });
}
