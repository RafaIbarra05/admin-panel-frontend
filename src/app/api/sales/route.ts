import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get("access_token")?.value; // <- sin await

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Reenviar query params (page, limit, etc.)
    const url = new URL(req.url);
    const qs = url.searchParams.toString();
    const upstreamUrl = `${API_URL}/sales${qs ? `?${qs}` : ""}`;

    const res = await fetch(upstreamUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[/api/sales GET] error:", error);
    return NextResponse.json(
      { message: "Error fetching sales" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${API_URL}/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[/api/sales POST] error:", error);
    return NextResponse.json(
      { message: "Error creating sale" },
      { status: 500 },
    );
  }
}
