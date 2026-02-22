import Link from "next/link";

import { getSaleServer } from "@/lib/api/sales.server";
import { formatMoneyARS, formatDateTime } from "@/lib/format";

const moneyToNumber = (v: string) => Number(v);

export default async function SaleDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const sale = await getSaleServer(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        {/* Left: Title + Back button */}
        <div>
          <h1 className="text-2xl font-semibold">Venta</h1>

          <Link
            href="/ventas"
            className="mt-2 inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted transition"
          >
            ← Volver a ventas
          </Link>
        </div>

        {/* Right: Meta info */}
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {formatDateTime(sale.createdAt)}
          </p>
          <p className="text-xs text-muted-foreground">ID: {sale.id}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground border-b bg-[#f9fafb]">
          <div className="col-span-6">Producto</div>
          <div className="col-span-2 text-right">Cantidad</div>
          <div className="col-span-2 text-right">Precio</div>
          <div className="col-span-2 text-right">Subtotal</div>
        </div>

        {sale.items.map((it) => {
          const unit = moneyToNumber(it.unitPrice);
          const subtotal = unit * it.quantity;

          return (
            <div
              key={it.id}
              className="grid grid-cols-12 gap-2 px-4 py-4 text-sm border-b last:border-b-0"
            >
              <div className="col-span-6">{it.product?.name ?? "—"}</div>
              <div className="col-span-2 text-right">{it.quantity}</div>
              <div className="col-span-2 text-right">
                {formatMoneyARS(it.unitPrice)}
              </div>
              <div className="col-span-2 text-right">
                {formatMoneyARS(subtotal.toFixed(2))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="flex justify-end">
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-xl font-semibold">
            {formatMoneyARS(sale.total)}
          </div>
        </div>
      </div>
    </div>
  );
}