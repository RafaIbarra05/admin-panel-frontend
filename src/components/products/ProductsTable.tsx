"use client";

import * as React from "react";
import { listProducts, type Product } from "@/lib/api/products";
import { usePaginatedResource } from "@/lib/hooks/usePaginatedResource";
import { TableToolbar } from "@/components/common/TableToolbar";
import { TableStateRows } from "@/components/common/TableStateRows";
import { PaginationControls } from "@/components/common/PaginationControls";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { CreateProductDialog } from "./CreateProductDialog";
import { EditProductDialog } from "./EditProductDialog";

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

export function ProductsTable({
  refreshKey = 0,
}: {
  refreshKey?: number;
}) {
  const [q, setQ] = React.useState("");

  const {
    data: rows,
    loading,
    error,
    page,
    totalPages,
    setPage,
    refetch,
  } = usePaginatedResource<Product>(listProducts, {
    initialPage: 1,
    initialLimit: 10,
  });

  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter((p) => {
      const name = p.name?.toLowerCase() ?? "";
      const category = p.categoryName?.toLowerCase() ?? "";
      return name.includes(needle) || category.includes(needle);
    });
  }, [q, rows]);

  const [selected, setSelected] = React.useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  return (
    <div>
      <TableToolbar
        value={q}
        onChange={setQ}
        placeholder="Buscar por producto o categoría..."
       
/>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive mb-4">
          {error}
        </div>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#f9fafb] text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b">
              <th className="text-left font-medium px-4 py-3">Producto</th>
              <th className="text-left font-medium px-4 py-3">Categoría</th>
              <th className="text-left font-medium px-4 py-3">Precio</th>
              <th className="text-left font-medium px-4 py-3">Creado</th>
              <th className="text-left font-medium px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <TableStateRows
              colSpan={5}
              loading={loading}
              isEmpty={!loading && filtered.length === 0}
              loadingText="Cargando productos..."
              emptyText="No hay productos para mostrar."
            />

            {!loading &&
              filtered.length > 0 &&
              filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b last:border-b-0 hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-4 py-4 font-semibold">
                    {product.name}
                  </td>

                  <td className="px-4 py-4">
                    {product.categoryName}
                  </td>

                  <td className="px-4 py-4 font-semibold">
                    ${Number(product.price).toFixed(2)}
                  </td>

                  <td className="px-4 py-4 text-muted-foreground text-xs">
                    {formatDate(product.createdAt)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-3">
                    <button
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => {
                        setSelected(product);
                        setEditOpen(true);
                    }}
                    >
                    Editar
                    </button>

                    <button
                    className="text-red-600 text-sm hover:underline"
                    onClick={() => {
                        setSelected(product);
                        setDeleteOpen(true);
                    }}
                    >
                    Eliminar
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
      <DeleteProductDialog
  open={deleteOpen}
  onOpenChange={setDeleteOpen}
  productId={selected?.id ?? null}
  productName={selected?.name ?? null}
  onDeleted={() => {
    setSelected(null);
    refetch();
  }}
/>
<EditProductDialog
  open={editOpen}
  onOpenChange={setEditOpen}
  product={selected}
  onUpdated={() => {
    setSelected(null);
    refetch();
  }}
/>
    </div>
  );
}