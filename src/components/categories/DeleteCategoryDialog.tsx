"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCategory } from "@/lib/api/categories";
import { toast } from "sonner";

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
  const [loading, setLoading] = React.useState(false);

  async function handleDelete() {
    if (!categoryId) return;

    try {
      setLoading(true);
      await deleteCategory(categoryId);
      toast.success("Categoría eliminada");
      onOpenChange(false);
      onDeleted();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error eliminando categoría");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a eliminar <b>{categoryName ?? "esta categoría"}</b>. Esta acción
            no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}