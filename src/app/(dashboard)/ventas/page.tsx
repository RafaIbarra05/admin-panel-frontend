import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateSaleDialog } from "@/components/sales/CreateSaleDialog";
import { SalesTable } from "@/components/sales/SalesTable";

export default function VentasPage() {
  return (
    <div className="max-w-7xl w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Ventas</h1>

        {/* Client component: abre modal y crea la venta */}
        <CreateSaleDialog triggerLabel="Nuevo Pedido" />
      </div>

      <Card className="rounded-2xl border border-[#e5e7eb] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Listado de Ventas
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Client component: tabla + buscador + paginación */}
          <SalesTable />
        </CardContent>
      </Card>
    </div>
  );
}