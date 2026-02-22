"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  listCategories,
  updateCategory,
  type Category,
} from "@/lib/api/categories";

const NONE = "__none__";

export function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  onUpdated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  category: Category | null;
  onUpdated: () => void;
}) {
  const [name, setName] = React.useState("");
  const [parentId, setParentId] = React.useState<string>(NONE);

  const [parents, setParents] = React.useState<Category[]>([]);
  const [loadingParents, setLoadingParents] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // precargar inputs cuando abre o cambia la category
  React.useEffect(() => {
    if (!open || !category) return;
    setName(category.name ?? "");
    setParentId(category.parentId ?? NONE);
  }, [open, category]);

  // cargar opciones de padres (y excluir la misma categoría para evitar "padre=yo")
  React.useEffect(() => {
    async function loadParents() {
      try {
        setLoadingParents(true);
        const res = await listCategories({ page: 1, limit: 100 });
        setParents(res.data.filter((c) => c.id !== category?.id));
      } catch {
        // no crítico
      } finally {
        setLoadingParents(false);
      }
    }

    if (open) loadParents();
  }, [open, category?.id]);

  async function handleSubmit() {
    if (!category) return;

    try {
      setLoading(true);

      await updateCategory(category.id, {
        name: name.trim(),
        parentId: parentId === NONE ? null : parentId,
      });

      toast.success("Categoría actualizada");
      onOpenChange(false);
      onUpdated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error actualizando categoría");
    } finally {
      setLoading(false);
    }
  }
function handleOpenChange(v: boolean) {
  onOpenChange(v);

  if (!v) {
    setName("");
    setParentId(NONE);
  }
}
  const canSubmit = !!category && !!name.trim() && !loading;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar categoría</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nombre de la categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Select value={parentId} onValueChange={setParentId}>
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingParents ? "Cargando categorías..." : "Categoría padre (opcional)"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Sin padre</SelectItem>
              {parents.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}