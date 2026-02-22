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

export type PaginatedResponse<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export async function listCategories(
  params: {
    page?: number;
    limit?: number;
  } = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const res = await fetch(`/api/categories?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "Error cargando categorías");
  }

  return data as PaginatedResponse<Category>;
}
export async function createCategory(payload: {
  name: string;
  parentId?: string;
}) {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "Error creando categoría");
  }

  return data;
}
export async function deleteCategory(id: string) {
  const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });

  // 204 = OK sin body
  if (res.status === 204) return;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? "Error eliminando categoría");
  }

  return data;
}
export async function updateCategory(
  id: string,
  body: { name?: string; parentId?: string | null; position?: number },
) {
  const res = await fetch(`/api/categories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message ?? "Error actualizando categoría");
  return data;
}
