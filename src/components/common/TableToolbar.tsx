"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

export function TableToolbar({
  value,
  onChange,
  placeholder = "Buscar...",
  actions,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <div className="w-full max-w-95">
        <Input
          placeholder={placeholder}
          className="bg-[#f9fafb] border-[#e5e7eb]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}