"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
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

import { useMutation } from "@/lib/hooks/useMutation";
import { getErrorMessage } from "@/lib/api/errors";
import { FormDialog } from "../common/FormDialog";

const NONE = "__none__";

type UpdateVars = {
  id: string;
  body: { name: string; parentId: string | null };
};

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

  const update = useMutation<Category, UpdateVars>((vars) =>
    updateCategory(vars.id, vars.body),
  );

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

    if (open) void loadParents();
  }, [open, category?.id]);

  async function handleSubmit() {
    if (!category) return;

    const trimmed = name.trim();
    if (!trimmed) return;

    const { error } = await update.mutate({
      id: category.id,
      body: {
        name: trimmed,
        parentId: parentId === NONE ? null : parentId,
      },
    });

    if (error) {
      toast.error(getErrorMessage(error, "Error actualizando categoría"));
      return;
    }

    toast.success("Categoría actualizada");
    onOpenChange(false);
    onUpdated();
  }

  function handleOpenChange(v: boolean) {
    onOpenChange(v);

    if (!v) {
      setName("");
      setParentId(NONE);
      update.setError(null);
    }
  }

  const canSubmit = !!category && !!name.trim() && !update.loading;

 return (
  <FormDialog
    open={open}
    onOpenChange={handleOpenChange}
    title="Editar categoría"
    canSubmit={canSubmit}
    loading={update.loading}
    submitText="Guardar cambios"
    submittingText="Guardando..."
    onSubmit={handleSubmit}
  >
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
  </FormDialog>
);
}