"use client";

import * as React from "react";
import { VentasClient } from "@/components/sales/VentasClient";
import { SalesTable } from "@/components/sales/SalesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VentasView() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div className="max-w-7xl w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Ventas</h1>

        <VentasClient onCreated={() => setRefreshKey((k) => k + 1)} />
      </div>

      <Card className="rounded-2xl border border-[#e5e7eb] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Listado de Ventas
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SalesTable refreshKey={refreshKey} />
        </CardContent>
      </Card>
    </div>
  );
}