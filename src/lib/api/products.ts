export type Product = {
  id: string;
  name: string;
  price: string; // viene como string desde el backend
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
};

type ApiError = {
  message?: string;
};

async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function listProducts(): Promise<Product[]> {
  const res = await fetch("/api/products", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await parseJsonSafe<ApiError>(res);
    throw new Error(err?.message ?? "No se pudieron cargar los productos");
  }

  const data = await parseJsonSafe<Product[]>(res);
  return data ?? [];
}
