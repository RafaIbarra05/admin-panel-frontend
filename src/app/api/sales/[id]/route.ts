import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const token = (await cookies()).get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/sales/${ctx.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[/api/sales/:id GET] error:", error);
    return NextResponse.json(
      { message: "Error fetching sale" },
      { status: 500 },
    );
  }
}
