import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return NextResponse.json({ message: "Missing API_URL" }, { status: 500 });
  }

  const res = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Login failed" },
      { status: res.status },
    );
  }

  const token = data?.access_token;
  if (!token) {
    return NextResponse.json(
      { message: "Missing access_token" },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ ok: true });

  // Cookie httpOnly: no accesible desde JS del navegador
  response.cookies.set("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1h (igual que tu JWT)
  });

  return response;
}
