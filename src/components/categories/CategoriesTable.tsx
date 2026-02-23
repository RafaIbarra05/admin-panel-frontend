"use client";

import * as React from "react";
import { listCategories, type Category } from "@/lib/api/categories";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { EditCategoryDialog } from "./EditCategoryDialog";
import { usePaginatedResource } from "@/lib/hooks/usePaginatedResource";
import { TableToolbar } from "../common/TableToolbar";
import { TableStateRows } from "../common/TableStateRows";
import { PaginationControls } from "../common/PaginationControls";

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function parentLabel(cat: Category) {
  return cat.parent?.name ?? "—";
}

export function CategoriesTable({
  refreshKey = 0,
  onDeleted,
}: {
  refreshKey?: number;
  onDeleted?: () => void;
}) {
  const [q, setQ] = React.useState("");

  const {
    data: rows,
    loading,
    error,
    page,
    setPage,
    totalPages,
    refetch,
  } = usePaginatedResource<Category>(listCategories, {
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

    return rows.filter((c) => {
      const name = c.name?.toLowerCase() ?? "";
      const parent = c.parent?.name?.toLowerCase() ?? "";
      return name.includes(needle) || parent.includes(needle);
    });
  }, [q, rows]);

  const [selected, setSelected] = React.useState<Category | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      <TableToolbar
        value={q}
        onChange={setQ}
        placeholder="Buscar por categoría o padre..."
      />

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b border-slate-200/60">
              <th className="text-left font-medium px-4 py-3">Categoría</th>
              <th className="text-left font-medium px-4 py-3">Padre</th>
              <th className="text-left font-medium px-4 py-3">Productos</th>
              <th className="text-left font-medium px-4 py-3">Hijos</th>
              <th className="text-left font-medium px-4 py-3">Creada</th>
              <th className="text-left font-medium px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <TableStateRows
              colSpan={6}
              loading={loading}
              isEmpty={!loading && filtered.length === 0}
              loadingText="Cargando categorías..."
              emptyText="No hay categorías para mostrar."
            />

            {!loading && filtered.length > 0
              ? filtered.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-slate-200/60 last:border-b-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold">{cat.name}</div>
                      <div className="text-muted-foreground text-xs">
                        Posición: {cat.position ?? "—"}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-medium">{parentLabel(cat)}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold">{cat.productsCount ?? 0}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold">{cat.childrenCount ?? 0}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-muted-foreground text-xs">
                        {formatDate(cat.createdAt)}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-4">
                        <button
                          className="text-blue-600 text-sm hover:underline"
                          onClick={() => {
                            setSelected(cat);
                            setEditOpen(true);
                          }}
                        >
                          Editar
                        </button>

                        <button
                          className="text-red-600 text-sm hover:underline"
                          onClick={() => {
                            setSelected(cat);
                            setDeleteOpen(true);
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
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

      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        categoryId={selected?.id ?? null}
        categoryName={selected?.name ?? null}
        onDeleted={() => onDeleted?.()}
      />

      <EditCategoryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        category={selected}
        onUpdated={() => {
          setEditOpen(false);
          setSelected(null);
          refetch();
        }}
      />
    </div>
  );
}