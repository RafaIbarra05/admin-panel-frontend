"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { listCategories, type Category } from "@/lib/api/categories";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { EditCategoryDialog } from "./EditCategoryDialog";

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
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [rows, setRows] = React.useState<Category[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const res = await listCategories({ page, limit });
      setRows(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando categorías");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, refreshKey]);

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
    <div>
      <div className="max-w-95 mb-6">
        <Input
          placeholder="Buscar por categoría o padre..."
          className="bg-[#f9fafb] border-[#e5e7eb]"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive mb-4">
          {error}
        </div>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#f9fafb] text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b">
              <th className="text-left font-medium px-4 py-3">Categoría</th>
              <th className="text-left font-medium px-4 py-3">Padre</th>
              <th className="text-left font-medium px-4 py-3">Productos</th>
              <th className="text-left font-medium px-4 py-3">Hijos</th>
              <th className="text-left font-medium px-4 py-3">Creada</th>
              <th className="text-left font-medium px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
  {loading ? (
    <tr>
      <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
        Cargando categorías...
      </td>
    </tr>
  ) : filtered.length === 0 ? (
    <tr>
      <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
        No hay categorías para mostrar.
      </td>
    </tr>
  ) : (
    filtered.map((cat) => (
      <tr
        key={cat.id}
        className="border-b last:border-b-0 hover:bg-[#fafafa] transition-colors"
      >
        <td className="px-4 py-4">
          <div className="font-semibold">{cat.name}</div>
          <div className="text-muted-foreground text-xs">
            Position: {cat.position ?? "—"}
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="font-medium">{parentLabel(cat)}</div>
        </td>

        <td className="px-4 py-4">
          <div className="font-semibold">
            {cat.productsCount ?? 0}
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="font-semibold">
            {cat.childrenCount ?? 0}
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="text-muted-foreground text-xs">
            {formatDate(cat.createdAt)}
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="flex gap-3">
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
  )}
</tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </div>

        <div className="flex gap-2">
          <button
            className="h-9 px-3 rounded-md border border-[#e5e7eb] text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={loading || page <= 1}
          >
            Anterior
          </button>
          <button
            className="h-9 px-3 rounded-md border border-[#e5e7eb] text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={loading || page >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
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
    load(); // o setRefreshKey((k)=>k+1)
  }}
/>
    </div>
  );
}