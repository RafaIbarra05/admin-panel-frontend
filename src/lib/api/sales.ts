// src/lib/api/sales.ts
import { apiFetch } from "@/lib/api/client";
import type { PaginatedResponse } from "@/lib/api/types";

export type MoneyString = string; // e.g. "3000.00"

export type SaleItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: MoneyString;
  product: {
    id: string;
    name: string;
  };
};

export type Sale = {
  id: string;
  createdAt: string; // ISO
  total: MoneyString;
  items: SaleItem[];
};

export type SalesPaginatedResponse = PaginatedResponse<Sale>;

export type CreateSalePayload = {
  items: Array<{ productId: string; quantity: number }>;
};

export function listSales(params: { page: number; limit: number }) {
  const qs = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  return apiFetch<SalesPaginatedResponse>(`/api/sales?${qs.toString()}`, {
    method: "GET",
  });
}

export function getSale(id: string) {
  return apiFetch<Sale>(`/api/sales/${id}`, { method: "GET" });
}

export function createSale(payload: CreateSalePayload) {
  return apiFetch<Sale>(`/api/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
