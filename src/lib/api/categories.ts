import { apiFetch } from "./client";
import type { PaginatedResponse } from "./types";

export type Category = {
  id: string;
  name: string;
  position: number;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  childrenCount: number;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
};

export async function listCategories(
  params: { page?: number; limit?: number } = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  return apiFetch<PaginatedResponse<Category>>(
    `/api/categories?page=${page}&limit=${limit}`,
    { cache: "no-store" },
  );
}

export async function createCategory(payload: {
  name: string;
  parentId?: string;
}) {
  return apiFetch<Category>("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: string) {
  return apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" });
}

export async function updateCategory(
  id: string,
  body: { name?: string; parentId?: string | null; position?: number },
) {
  return apiFetch<Category>(`/api/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}
