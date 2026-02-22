"use client";

import * as React from "react";
import { ProductsTable } from "./ProductsTable";
import { CreateProductDialog } from "./CreateProductDialog";

export function ProductsView() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

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
          onClick={() => setCreateOpen(true)}
        >
          Nuevo producto
        </button>
      </div>

      <div className="mt-6">
        <ProductsTable refreshKey={refreshKey} />
      </div>

      <CreateProductDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}