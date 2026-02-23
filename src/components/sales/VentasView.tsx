"use client";

import * as React from "react";
import { VentasClient } from "@/components/sales/VentasClient";
import { SalesTable } from "@/components/sales/SalesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VentasView() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div className="max-w-7xl w-full space-y-6">
      {/* Header unificado */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Ventas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestioná y supervisá las ventas del ecommerce.
          </p>
        </div>

        <VentasClient onCreated={() => setRefreshKey((k) => k + 1)} />
      </div>

      {/* Card estandarizada */}
      <Card className="rounded-xl border border-slate-200/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Listado de ventas
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SalesTable refreshKey={refreshKey} />
        </CardContent>
      </Card>
    </div>
  );
}