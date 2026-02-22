"use client";

import * as React from "react";

export function PaginationControls({
  page,
  totalPages,
  loading,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </div>

      <div className="flex gap-2">
        <button
          className="h-9 px-3 rounded-md border border-[#e5e7eb] text-sm disabled:opacity-50"
          onClick={onPrev}
          disabled={loading || page <= 1}
        >
          Anterior
        </button>

        <button
          className="h-9 px-3 rounded-md border border-[#e5e7eb] text-sm disabled:opacity-50"
          onClick={onNext}
          disabled={loading || page >= totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}