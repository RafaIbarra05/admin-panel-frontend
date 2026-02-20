import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Dejar pasar archivos/recursos y API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value;
  const isAuthenticated = Boolean(token);
  const isPublic = isPublicPath(pathname);

  // Si está logueado y quiere ir a /login -> mandalo al dashboard
  if (isAuthenticated && isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/ventas";
    return NextResponse.redirect(url);
  }

  // Si NO está logueado y quiere ir a ruta privada -> mandalo a /login
  if (!isAuthenticated && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname); // opcional para volver luego
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Aplicar middleware a todo (excepto lo filtrado arriba)
export const config = {
  matcher: ["/:path*"],
};
