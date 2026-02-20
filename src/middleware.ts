import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;

  // Rutas que requieren login
  const isProtected =
    pathname === "/" ||
    pathname.startsWith("/ventas") ||
    pathname.startsWith("/categorias") ||
    pathname.startsWith("/productos");

  // Si intenta entrar a una ruta protegida sin token -> /login?next=...
  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  // Si intenta ir a /login estando logueado -> redirigir a next o /ventas
  if (pathname === "/login" && token) {
    const next = req.nextUrl.searchParams.get("next");
    const target = next && next.startsWith("/") ? next : "/ventas";

    const url = req.nextUrl.clone();
    url.pathname = target;
    url.search = "";
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
