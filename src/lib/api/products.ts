import { apiFetch } from "./client";
import type { PaginatedResponse } from "./types";

export type Product = {
  id: string;
  name: string;
  price: string; // backend lo devuelve como string
  categoryId: string;
  position: number;
  createdAt: string;
  updatedAt: string;

  category?: {
    id: string;
    name: string;
  } | null;

  // opcional para la tabla
  categoryName?: string;
};

export async function listProducts(
  params: { page?: number; limit?: number } = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const res = await apiFetch<PaginatedResponse<Product>>(
    `/api/products?page=${page}&limit=${limit}`,
    { cache: "no-store" },
  );

  return {
    ...res,
    data: res.data.map((p) => ({
      ...p,
      categoryName: p.category?.name ?? "—",
    })),
  };
}

export async function createProduct(payload: {
  name: string;
  price: number | string;
  categoryId: string;
}) {
  return apiFetch<Product>("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(
  id: string,
  body: {
    name?: string;
    price?: number | string;
    categoryId?: string;
  },
) {
  return apiFetch<Product>(`/api/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deleteProduct(id: string) {
  return apiFetch<void>(`/api/products/${id}`, {
    method: "DELETE",
  });
}

export async function getProductById(id: string) {
  const res = await fetch(`/api/products/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Error obteniendo producto");
  }

  return res.json();
}
