import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwtPayload, isJwtExpired } from "@/lib/jwt";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;

  // Validación liviana: token existe + no está expirado
  let isTokenValid = false;

  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload && !isJwtExpired(payload)) {
      isTokenValid = true;
    }
  }

  const isProtected =
    pathname === "/" ||
    pathname.startsWith("/ventas") ||
    pathname.startsWith("/categorias") ||
    pathname.startsWith("/productos");

  // Si ruta protegida y token inválido/ausente -> login con next
  if (isProtected && !isTokenValid) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname + search);

    const res = NextResponse.redirect(loginUrl);

    // Si había token pero era inválido/expirado, lo limpiamos para evitar loops
    if (token) {
      res.cookies.set("access_token", "", {
        path: "/",
        maxAge: 0,
      });
    }

    return res;
  }

  // Si está logueado y entra a /login -> redirigir a next o /ventas
  if (pathname === "/login" && isTokenValid) {
    const next = req.nextUrl.searchParams.get("next");
    const target = next && next.startsWith("/") ? next : "/ventas";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // Debug headers (temporal)
  const res = NextResponse.next();
  res.headers.set("x-mw-path", pathname);
  res.headers.set("x-mw-has-token", token ? "1" : "0");

  if (token) {
    const payload = decodeJwtPayload(token);
    res.headers.set("x-mw-payload", payload ? "1" : "0");
    res.headers.set("x-mw-exp", String(payload?.exp ?? ""));
    res.headers.set(
      "x-mw-expired",
      payload ? String(isJwtExpired(payload)) : "payload-null",
    );
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/ventas/:path*",
    "/categorias/:path*",
    "/productos/:path*",
  ],
};
