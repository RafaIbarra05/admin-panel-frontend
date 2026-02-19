import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";

type SaleRow = {
  id: string;
  cliente: string;
  email: string;
  order: string;
  fecha: string;
  estado: "Enviado" | "En Preparación" | "Cancelado";
  total: string;
  metodo: string;
  pago: "Pagado" | "Fallido";
};

const mock: SaleRow[] = [
  {
    id: "1",
    cliente: "Jaime González Correa",
    email: "jaimegonzalez_09@yahoo.com.mx",
    order: "AB1850E7",
    fecha: "18 ago 25",
    estado: "Enviado",
    total: "$99.00",
    metodo: "Tarjeta",
    pago: "Pagado",
  },
  {
    id: "2",
    cliente: "Santiago Perez Baglivo",
    email: "santiagoperezbaglivo@gmail.com",
    order: "05CA2CBB",
    fecha: "17 ago 25",
    estado: "En Preparación",
    total: "$589.00",
    metodo: "Tarjeta",
    pago: "Pagado",
  },
  {
    id: "3",
    cliente: "Santiago Perez Baglivo",
    email: "santiagoperezbaglivo@gmail.com",
    order: "81B17300",
    fecha: "17 ago 25",
    estado: "Cancelado",
    total: "$1,199.00",
    metodo: "Tarjeta",
    pago: "Fallido",
  },
];

function StatusBadge({ value }: { value: SaleRow["estado"] }) {
  // Por qué: en el Figma el estado cambia de color; lo mapeamos a estilos fijos.
  if (value === "Enviado") {
    return (
      <Badge className="bg-[#e7efff] text-[#2b5cff] hover:bg-[#e7efff] font-medium">
        Enviado
      </Badge>
    );
  }
  if (value === "En Preparación") {
    return (
      <Badge className="bg-[#ffe9cf] text-[#b45309] hover:bg-[#ffe9cf] font-medium">
        En Preparación
      </Badge>
    );
  }
  return (
    <Badge className="bg-[#ffe0e0] text-[#b91c1c] hover:bg-[#ffe0e0] font-medium">
      Cancelado
    </Badge>
  );
}

function PayBadge({ value }: { value: SaleRow["pago"] }) {
  // Por qué: el Figma muestra “Pagado” negro y “Fallido” rojo.
  if (value === "Pagado") {
    return (
      <Badge className="bg-[#0b1220] text-white hover:bg-[#0b1220] font-medium">
        Pagado
      </Badge>
    );
  }
  return (
    <Badge className="bg-[#ff2d2d] text-white hover:bg-[#ff2d2d] font-medium">
      Fallido
    </Badge>
  );
}

export default function VentasPage() {
  return (
    <div className="max-w-7xl w-full">
      {/* Header de página */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Ventas</h1>

       
    <Button className="h-10 px-5 bg-[#0b1220] hover:bg-[#0b1220]/90 text-white text-sm font-medium tracking-tight">
   Nuevo Pedido
    </Button>
      </div>

      {/* Card principal */}
      <Card className="rounded-2xl border border-[#e5e7eb] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Listado de Ventas
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Buscador */}
          <div className="max-w-95 mb-6">
            <Input placeholder="Buscar por nombre..."
            className="bg-[#f9fafb] border-[#e5e7eb]" />
          </div>

          {/* Tabla */}
          <div className="mt-4 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[#f9fafb] text-xs uppercase tracking-wide text-muted-foreground">
                <tr className="border-b">
                  <th className="text-left font-medium px-4 py-3">Cliente</th>
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
                {mock.map((row) => (
                  <tr key={row.id} className="border-b last:border-b-0 hover:bg-[#fafafa] transition-colors">
                    {/* Cliente */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                          {row.cliente.split(" ")[0]?.[0]}
                        </div>
                        <div className="leading-tight">
                          <div className="font-semibold">{row.cliente}</div>
                          <div className="text-muted-foreground text-xs">
                            {row.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Orden */}
                    <td className="px-4 py-4">
                      <div className="font-semibold">{row.order}</div>
                      <div className="text-muted-foreground text-xs">
                        {row.fecha}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-5 align-middle">
                      <StatusBadge value={row.estado} />
                    </td>

                    {/* Total */}
                    <td className="px-4 py-5 align-middle">
                      <div className="font-semibold">{row.total}</div>
                      <div className="text-muted-foreground text-xs">
                        {row.metodo}
                      </div>
                    </td>

                    {/* Pago */}
                    <td className="px-4 py-5 align-middle">
                      <PayBadge value={row.pago} />
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-5 align-middle">
                      <div className="flex items-center gap-4">
                        <button className="text-muted-foreground hover:text-foreground">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground">
                          <Pencil className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
