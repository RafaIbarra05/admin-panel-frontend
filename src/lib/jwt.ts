export type JwtPayload = {
  exp?: number;
  iat?: number;
  sub?: string | number;
  email?: string;
  [key: string]: unknown;
};

function base64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;

  // Edge runtime: atob existe
  const decoded = atob(padded);

  // Manejo seguro de UTF-8
  try {
    return decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
  } catch {
    return decoded;
  }
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payload = parts[1];
    const json = base64UrlDecode(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isJwtExpired(payload: JwtPayload): boolean {
  if (!payload?.exp || typeof payload.exp !== "number") return false; // si no hay exp, no lo vencemos acá
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}
