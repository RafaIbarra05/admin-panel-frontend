"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoriesTable } from "./CategoriesTable";
import { CreateCategoryDialog } from "./CreateCategoryDialog";

export function CategoriesView() {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  function handleCreated() {
    setRefreshKey((k) => k + 1);
    setOpen(false);
  }

  return (
    <div className="max-w-7xl w-full space-y-6">
      {/* Header unificado (igual a Ventas) */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Categorías</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administrá la estructura de categorías del ecommerce.
          </p>
        </div>

        <button
  type="button"
  onClick={() => setOpen(true)}
  className="h-9 px-3 rounded-md bg-[#0b1220] text-white text-sm font-medium hover:opacity-90"
>
  Nueva categoría
</button>
      </div>

      <CategoriesTable
        refreshKey={refreshKey}
        onDeleted={() => setRefreshKey((k) => k + 1)}
      />

      <CreateCategoryDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={handleCreated}
      />
    </div>
  );
}