"use client";

import * as React from "react";
import { toast } from "sonner";
import { deleteProduct } from "@/lib/api/products";
import { useMutation } from "@/lib/hooks/useMutation";
import { getErrorMessage } from "@/lib/api/errors";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export function DeleteProductDialog({
  open,
  onOpenChange,
  productId,
  productName,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  productId: string | null;
  productName: string | null;
  onDeleted: () => void;
}) {
  const del = useMutation<void, string>((id) => deleteProduct(id));

  async function handleConfirm() {
    if (!productId) return;

    const { error } = await del.mutate(productId);

    if (error) {
      toast.error(getErrorMessage(error, "Error eliminando producto"));
      return;
    }

    toast.success("Producto eliminado correctamente");
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
      title="Eliminar producto"
      description={
        <>
          Vas a eliminar <b>{productName ?? "este producto"}</b>. Esta acción
          no se puede deshacer.
        </>
      }
      confirmText="Eliminar"
      loading={del.loading}
      onConfirm={handleConfirm}
    />
  );
}