// src/lib/api/sales.server.ts
import { headers, cookies } from "next/headers";
import type { Sale } from "./sales";

function buildOrigin(h: Headers) {
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) throw new Error("Missing host header");
  return `${proto}://${host}`;
}

function buildCookieHeader(all: { name: string; value: string }[]) {
  return all.map((c) => `${c.name}=${c.value}`).join("; ");
}

export async function getSaleServer(id: string): Promise<Sale> {
  const h = await headers();
  const origin = buildOrigin(h);

  const c = await cookies();
  const cookieHeader = buildCookieHeader(c.getAll());

  const res = await fetch(`${origin}/api/sales/${id}`, {
    method: "GET",
    headers: { cookie: cookieHeader }, // CLAVE
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Error fetching sale");
  }

  return res.json();
}
