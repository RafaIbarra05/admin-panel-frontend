import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwtPayload, isJwtExpired } from "@/lib/jwt";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = decodeJwtPayload(token);

  if (!payload || isJwtExpired(payload)) {
    return NextResponse.json({ message: "Token expired" }, { status: 401 });
  }

  return NextResponse.json({
    id: payload.sub,
    email: payload.email,
  });
}
