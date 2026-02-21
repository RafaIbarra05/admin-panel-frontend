"use client";

import { CreateSaleDialog } from "@/components/sales/CreateSaleDialog";

export function VentasClient({ onCreated }: { onCreated: () => void }) {
  return <CreateSaleDialog triggerLabel="Nuevo Pedido" onCreated={onCreated} />;
}