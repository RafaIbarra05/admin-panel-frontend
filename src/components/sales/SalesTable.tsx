"use client";

import * as React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { toast } from "sonner";

import { listSales, type Sale } from "@/lib/api/sales";
import { usePaginatedResource } from "@/lib/hooks/usePaginatedResource";

import { TableToolbar } from "@/components/common/TableToolbar";
import { TableStateRows } from "@/components/common/TableStateRows";
import { PaginationControls } from "@/components/common/PaginationControls";

import { formatMoneyARS, formatDateTime } from "@/lib/format";
import { CreateSaleDialog } from "./CreateSaleDialog";

export function SalesTable() {
  const [openCreate, setOpenCreate] = React.useState(false);
  const [q, setQ] = React.useState("");

  const {
    data,
    meta,
    loading,
    error,
    page,
    setPage,
    refetch,
  } = usePaginatedResource<Sale>(listSales, { initialPage: 1, initialLimit: 10 });

  React.useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const totalPages = meta?.totalPages ?? 1;

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return data;

    return data.filter((sale) => {
      const code = sale.id.replace(/[^a-z0-9]/gi, "").slice(-8).toLowerCase();
      const products = (sale.items ?? [])
        .map((it) => it.product?.name?.toLowerCase() ?? "")
        .join(" ");

      return (
        code.includes(needle) ||
        sale.id.toLowerCase().includes(needle) ||
        products.includes(needle)
      );
    });
  }, [q, data]);

  return (
    <div>
      <TableToolbar
        value={q}
        onChange={setQ}
        placeholder="Buscar por venta, producto o código..."
        actions={
          <button
            onClick={() => setOpenCreate(true)}
            className="h-9 px-3 rounded-md bg-[#0b1220] text-white text-sm font-medium hover:opacity-90"
          >
            Nueva venta
          </button>
        }
      />

      <div className="mt-4 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#f9fafb] text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b">
              <th className="text-left font-medium px-4 py-3">Fecha</th>
              <th className="text-left font-medium px-4 py-3">Total</th>
              <th className="text-left font-medium px-4 py-3">Items</th>
              <th className="text-left font-medium px-4 py-3">Productos</th>
              <th className="text-left font-medium px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <TableStateRows
              colSpan={5}
              loading={loading}
              isEmpty={!loading && filtered.length === 0}
              loadingText="Cargando ventas..."
              emptyText="No hay ventas para mostrar."
            />

            {!loading &&
              filtered.length > 0 &&
              filtered.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b last:border-b-0 hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-4 py-4">{formatDateTime(sale.createdAt)}</td>

                  <td className="px-4 py-4 font-semibold">
                    {formatMoneyARS(sale.total)}
                  </td>

                  <td className="px-4 py-4">{sale.items.length}</td>

                  <td className="px-4 py-4">
                    {sale.items
                      .slice(0, 2)
                      .map((i) => i.product.name)
                      .join(", ")}
                    {sale.items.length > 2 ? "…" : ""}
                  </td>

                  <td className="px-4 py-4">
                    <Link
                      href={`/ventas/${sale.id}`}
                      className="text-muted-foreground hover:text-foreground inline-flex"
                      aria-label="Ver venta"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
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
        onPrev={() => setPage(Math.max(1, page - 1))}
        onNext={() => setPage(Math.min(totalPages, page + 1))}
      />

      <CreateSaleDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreated={() => {
          setOpenCreate(false);
          refetch();
        }}
      />
    </div>
  );
}