import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";

type SessionPayload = {
  address: string;
  issuedAt: string;
};

export function signSession(payload: SessionPayload) {
  const json = JSON.stringify(payload);
  const base = Buffer.from(json).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(base).digest("hex");
  return `${base}.${sig}`;
}

export function verifySession(token?: string) {
  if (!token) return null;
  const [base, sig] = token.split(".");
  if (!base || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(base).digest("hex");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(base, "base64url").toString("utf8")
    ) as SessionPayload;
    if (!payload?.address) return null;
    return payload;
  } catch {
    return null;
  }
}
