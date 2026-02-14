import type { NextApiResponse } from "next";

type CookieOptions = {
  path?: string;
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
  maxAge?: number;
  expires?: Date;
};

export function parseCookies(header?: string) {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  const pairs = header.split(";");
  for (const pair of pairs) {
    const [rawName, ...rest] = pair.trim().split("=");
    if (!rawName) continue;
    const value = rest.join("=");
    cookies[rawName] = decodeURIComponent(value || "");
  }
  return cookies;
}

export function setCookie(
  res: NextApiResponse,
  name: string,
  value: string,
  options: CookieOptions = {}
) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path ?? "/"}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push("Secure");
  if (typeof options.maxAge === "number") parts.push(`Max-Age=${options.maxAge}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  res.setHeader("Set-Cookie", parts.join("; "));
}
