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
import {
  createCategory,
  listCategories,
  type Category,
} from "@/lib/api/categories";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useMutation } from "@/lib/hooks/useMutation";
import { getErrorMessage } from "@/lib/api/errors";
import { FormDialog } from "../common/FormDialog";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}

const NONE = "__none__";

type CreateVars = { name: string; parentId?: string };

export function CreateCategoryDialog({ open, onOpenChange, onCreated }: Props) {
  const [name, setName] = React.useState("");
  const [parentId, setParentId] = React.useState<string>(NONE);

  const [parents, setParents] = React.useState<Category[]>([]);
  const [loadingParents, setLoadingParents] = React.useState(false);

  const create = useMutation<Category, CreateVars>((vars) => createCategory(vars));

  React.useEffect(() => {
    async function loadParents() {
      try {
        setLoadingParents(true);
        const res = await listCategories({ page: 1, limit: 100 });
        setParents(res.data);
      } catch {
        // no es crítico: el dialog puede funcionar igual sin padre
      } finally {
        setLoadingParents(false);
      }
    }

    if (open) void loadParents();
  }, [open]);

  async function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;

    const payload: CreateVars =
      parentId !== NONE ? { name: trimmed, parentId } : { name: trimmed };

    const { error } = await create.mutate(payload);

    if (error) {
      toast.error(getErrorMessage(error, "Error creando categoría"));
      return;
    }

    toast.success("Categoría creada correctamente");
    setName("");
    setParentId(NONE);

    onCreated();
    onOpenChange(false); // opcional pero recomendado
  }

  function handleOpenChange(v: boolean) {
    onOpenChange(v);

    if (!v) {
      setName("");
      setParentId(NONE);
      create.setError(null);
    }
  }

  const canSubmit = !!name.trim() && !create.loading;

  return (
  <FormDialog
    open={open}
    onOpenChange={handleOpenChange}
    title="Nueva categoría"
    canSubmit={canSubmit}
    loading={create.loading}
    submitText="Crear categoría"
    submittingText="Creando..."
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