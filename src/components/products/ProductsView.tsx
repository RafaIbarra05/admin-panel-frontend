"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProductsTable } from "./ProductsTable";

export function ProductsView() {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Gestioná el catálogo de productos del ecommerce.
          </p>
        </div>

        <button
          className="h-9 px-4 rounded-md bg-black text-white text-sm"
          onClick={() => router.push("/productos/new")}
        >
          Nuevo producto
        </button>
      </div>

      <div className="mt-6">
        <ProductsTable />
      </div>
    </div>
  );
}