"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { listSales, type Sale } from "@/lib/api/sales";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function formatMoney(value: string) {
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function orderCode(id: string) {
  // Figma usa algo tipo "AB1850E7". Derivamos desde id.
  return id.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase();
}

function StatusBadge() {
  // Backend no trae estado. Placeholder limpio y consistente.
  return (
    <Badge className="bg-[#ffe9cf] text-[#b45309] hover:bg-[#ffe9cf] font-medium">
      En Preparación
    </Badge>
  );
}

function PayBadge() {
  // Backend no trae pago. Placeholder.
  return (
    <Badge className="bg-[#0b1220] text-white hover:bg-[#0b1220] font-medium">
      Pagado
    </Badge>
  );
}

function getSaleTitle(sale: Sale) {
  return `Venta #${orderCode(sale.id)}`;
}

function getSaleSubtitle(sale: Sale) {
  // Resumen de items: "3 ítems • Coca Cola, Pepsi"
  const count =
    sale.items?.reduce((acc, it) => acc + (it.quantity ?? 0), 0) ?? 0;

  const names = Array.from(
    new Set((sale.items ?? []).map((it) => it.product?.name).filter(Boolean))
  ).slice(0, 2);

  const namesText = names.length ? names.join(", ") : "—";
  return `${count} ítems • ${namesText}`;
}

export function SalesTable() {
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [rows, setRows] = React.useState<Sale[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const res = await listSales({ page, limit });
      setRows(res.data);
      setTotalPages(res.meta.totalPages || 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando ventas");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter((sale) => {
      const title = getSaleTitle(sale).toLowerCase(); // "venta #XXXX"
      const subtitle = getSaleSubtitle(sale).toLowerCase(); // "3 ítems • coca cola"
      const code = orderCode(sale.id).toLowerCase(); // "R70F52U9"
      return (
        title.includes(needle) ||
        subtitle.includes(needle) ||
        code.includes(needle)
      );
    });
  }, [q, rows]);

  return (
    <div>
      <div className="max-w-95 mb-6">
        <Input
          placeholder="Buscar por venta, producto o código..."
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
              <th className="text-left font-medium px-4 py-3">Venta</th>
              <th className="text-left font-medium px-4 py-3">
                Número de Orden
              </th>
              <th className="text-left font-medium px-4 py-3">Estado</th>
              <th className="text-left font-medium px-4 py-3">Total</th>
              <th className="text-left font-medium px-4 py-3">Pago</th>
              <th className="text-left font-medium px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  Cargando ventas...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  No hay ventas para mostrar.
                </td>
              </tr>
            ) : (
              filtered.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b last:border-b-0 hover:bg-[#fafafa] transition-colors"
                >
                  {/* Venta */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                        V
                      </div>
                      <div className="leading-tight">
                        <div className="font-semibold">{getSaleTitle(sale)}</div>
                        <div className="text-muted-foreground text-xs">
                          {getSaleSubtitle(sale)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Orden */}
                  <td className="px-4 py-4">
                    <div className="font-semibold">{orderCode(sale.id)}</div>
                    <div className="text-muted-foreground text-xs">
                      {formatDate(sale.createdAt)}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-5 align-middle">
                    <StatusBadge />
                  </td>

                  {/* Total */}
                  <td className="px-4 py-5 align-middle">
                    <div className="font-semibold">{formatMoney(sale.total)}</div>
                    <div className="text-muted-foreground text-xs">Tarjeta</div>
                  </td>

                  {/* Pago */}
                  <td className="px-4 py-5 align-middle">
                    <PayBadge />
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-5 align-middle">
                    <button className="text-muted-foreground hover:text-foreground">
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
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
    </div>
  );
}