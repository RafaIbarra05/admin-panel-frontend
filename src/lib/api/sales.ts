export type CreateSaleInput = {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

export type SaleItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string; // string en backend
  product: {
    id: string;
    name: string;
  };
};

export type Sale = {
  id: string;
  createdAt: string;
  total: string; // string en backend
  items: SaleItem[];
};

export type SalesResponse = {
  data: Sale[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export async function listSales(params?: {
  page?: number;
  limit?: number;
}): Promise<SalesResponse> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  const res = await fetch(`/api/sales?page=${page}&limit=${limit}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await parseJsonSafe<ApiError>(res);
    throw new Error(err?.message ?? "No se pudieron cargar las ventas");
  }

  const data = await parseJsonSafe<SalesResponse>(res);

  // fallback seguro
  return (
    data ?? {
      data: [],
      meta: { page, limit, total: 0, totalPages: 1 },
    }
  );
}

export async function createSale(payload: CreateSaleInput): Promise<Sale> {
  const res = await fetch("/api/sales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await parseJsonSafe<ApiError>(res);
    throw new Error(err?.message ?? "No se pudo crear la venta");
  }

  const data = await parseJsonSafe<Sale>(res);
  if (!data) throw new Error("Respuesta inválida al crear la venta");

  return data;
}
