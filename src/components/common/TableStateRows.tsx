"use client";

import * as React from "react";

export function TableStateRows({
  colSpan,
  loading,
  isEmpty,
  emptyText = "No hay datos para mostrar.",
  loadingText = "Cargando...",
}: {
  colSpan: number;
  loading: boolean;
  isEmpty: boolean;
  emptyText?: string;
  loadingText?: string;
}) {
  if (loading) {
    return (
      <tr>
        <td className="px-4 py-6 text-muted-foreground" colSpan={colSpan}>
          {loadingText}
        </td>
      </tr>
    );
  }

  if (isEmpty) {
    return (
      <tr>
        <td className="px-4 py-6 text-muted-foreground" colSpan={colSpan}>
          {emptyText}
        </td>
      </tr>
    );
  }

  return null;
}