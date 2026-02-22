"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ProductFormPage({
  title,
  backHref = "/productos",
  children,
  canSubmit,
  loading,
  submitText = "Guardar",
  submittingText = "Guardando...",
  onSubmit,
}: {
  title: string;
  backHref?: string;
  children: React.ReactNode;
  canSubmit: boolean;
  loading: boolean;
  submitText?: string;
  submittingText?: string;
  onSubmit: () => void | Promise<void>;
}) {
  return (
    <div className="space-y-6">
      {/* Header simple */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Completá los datos y guardá los cambios.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="ghost" disabled={loading}>
            <Link href={backHref}>Cancelar</Link>
          </Button>

          <Button onClick={onSubmit} disabled={!canSubmit || loading}>
            {loading ? submittingText : submitText}
          </Button>
        </div>
      </div>

      {/* Contenido */}
      <div className="rounded-xl border bg-white p-6">{children}</div>
    </div>
  );
}