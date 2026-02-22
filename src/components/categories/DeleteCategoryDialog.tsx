"use client";

import * as React from "react";
import { toast } from "sonner";
import { deleteCategory } from "@/lib/api/categories";
import { useMutation } from "@/lib/hooks/useMutation";
import { getErrorMessage } from "@/lib/api/errors";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categoryId: string | null;
  categoryName: string | null;
  onDeleted: () => void;
}) {
  const del = useMutation<void, string>((id) => deleteCategory(id));

  async function handleConfirm() {
    if (!categoryId) return;

    const { error } = await del.mutate(categoryId);

    if (error) {
      toast.error(getErrorMessage(error, "Error eliminando categoría"));
      return;
    }

    toast.success("Categoría eliminada");
    onOpenChange(false);
    onDeleted();
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) del.setError(null);
      }}
      title="Eliminar categoría"
      description={
        <>
          Vas a eliminar <b>{categoryName ?? "esta categoría"}</b>. Esta acción
          no se puede deshacer.
        </>
      }
      confirmText="Eliminar"
      loading={del.loading}
      onConfirm={handleConfirm}
    />
  );
}