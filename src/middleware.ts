import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;

  // Si va a una ruta del dashboard y no hay token => login
  const isProtected =
    pathname === "/" ||
    pathname.startsWith("/ventas") ||
    pathname.startsWith("/categorias") ||
    pathname.startsWith("/productos");

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Si intenta ir a /login y ya está logueado => dashboard
  if (pathname === "/login" && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/ventas";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
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
