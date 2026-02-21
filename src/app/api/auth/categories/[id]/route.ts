import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

async function authHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${BACKEND_URL}/categories/${params.id}`, {
    headers: { ...(await authHeader()) },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/categories/${params.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const res = await fetch(`${BACKEND_URL}/categories/${params.id}`, {
    method: "DELETE",
    headers: { ...(await authHeader()) },
  });

  if (res.status === 204) return new NextResponse(null, { status: 204 });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
