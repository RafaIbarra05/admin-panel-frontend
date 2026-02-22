import { apiFetch } from "./client";
import type { PaginatedResponse } from "./types";

export type Product = {
  id: string;
  name: string;
  price: string; // backend lo devuelve como string
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
};

export async function listProducts(
  params: { page?: number; limit?: number } = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  return apiFetch<PaginatedResponse<Product>>(
    `/api/products?page=${page}&limit=${limit}`,
    { cache: "no-store" },
  );
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
