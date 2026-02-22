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
import { ApiError } from "@/lib/api/client";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}

const NONE = "__none__";

export function CreateCategoryDialog({ open, onOpenChange, onCreated }: Props) {
  const [name, setName] = React.useState("");
  const [parentId, setParentId] = React.useState<string>(NONE);

  const [parents, setParents] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingParents, setLoadingParents] = React.useState(false);

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

    if (open) loadParents();
  }, [open]);

  async function handleSubmit() {
    try {
      setLoading(true);

      await createCategory({
        name: name.trim(),
        ...(parentId !== NONE ? { parentId } : {}),
      });

      toast.success("Categoría creada correctamente");
      setName("");
      setParentId(NONE);
      onCreated();
    } catch (e) {
  const err = e as ApiError;
  toast.error(err.message);
  if (err.status === 401) {
    // opcional: redirigir a login, etc.
  }
} finally {
      setLoading(false);
    }
  }

  const canSubmit = !!name.trim() && !loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva categoría</DialogTitle>
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
                  loadingParents
                    ? "Cargando categorías..."
                    : "Categoría padre (opcional)"
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
            {loading ? "Creando..." : "Crear categoría"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}