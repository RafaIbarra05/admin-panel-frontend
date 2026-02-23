"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProductsTable } from "./ProductsTable";

export function ProductsView() {
  const router = useRouter();

  return (
    <div className="max-w-7xl w-full space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Gestioná el catálogo de productos del ecommerce.
          </p>
        </div>

        <button
          className="h-9 px-3 rounded-md bg-[#0b1220] text-white text-sm font-medium hover:opacity-90"
          onClick={() => router.push("/productos/new")}
        >
          Nuevo producto
        </button>
      </div>

      <ProductsTable />
    </div>
  );
}