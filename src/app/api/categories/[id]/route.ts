import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

async function readJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await readJsonSafe(res);

    // Si backend devuelve 204, no hay body => data null, y está bien.
    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(data ?? {}, { status: res.status });
  } catch (err) {
    console.error("DELETE /api/categories/[id] failed:", err);
    return NextResponse.json(
      { message: "Error deleting category" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const body = await request.json();

    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Error updating category" },
      { status: 500 },
    );
  }
}
