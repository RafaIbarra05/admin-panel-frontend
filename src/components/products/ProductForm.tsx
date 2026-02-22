"use client";

import * as React from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { listCategories, type Category } from "@/lib/api/categories";
import {
  createProduct,
  getProductById,
  updateProduct,
  type Product,
} from "@/lib/api/products";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  productId?: string; // required en edit
  onSaved?: () => void;
  onLoadingChange?: (v: boolean) => void;
  onCanSubmitChange?: (v: boolean) => void;
};

export function ProductForm({
  mode,
  productId,
  onSaved,
  onLoadingChange,
  onCanSubmitChange,
}: Props) {
  const [loading, setLoading] = React.useState(false);

  const [categories, setCategories] = React.useState<Category[]>([]);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<string>("");

  const canSubmit = name.trim().length > 1 && !loading;

  React.useEffect(() => {
    onCanSubmitChange?.(canSubmit);
  }, [canSubmit, onCanSubmitChange]);

  React.useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  // Carga inicial: categorías y, si edit, el producto
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        const cats = await listCategories({ page: 1, limit: 200 });
        if (!cancelled) setCategories(cats.data);

        if (mode === "edit") {
          if (!productId) throw new Error("Falta productId para editar.");
          const p: Product = await getProductById(productId);

          if (!cancelled) {
            setName(p.name ?? "");
            setDescription((p as any).description ?? "");
            setCategoryId((p as any).categoryId ?? "");
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Error cargando formulario";
        toast.error(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, productId]);

  async function submit() {
    try {
      setLoading(true);

      const payload: any = {
        name: name.trim(),
        description: description.trim() || null,
        categoryId: categoryId || null,
      };

      if (mode === "create") {
        await createProduct(payload);
        toast.success("Producto creado");
      } else {
        if (!productId) throw new Error("Falta productId para editar.");
        await updateProduct(productId, payload);
        toast.success("Producto actualizado");
      }

      onSaved?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo guardar";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // Exponemos submit hacia el wrapper vía un callback global simple:
  // Alternativa más prolija: recibir onRegisterSubmit(fn) para que el wrapper lo guarde.
  // Para no complicar, te dejo el patrón con window event:
  React.useEffect(() => {
    function handler() {
      if (canSubmit) submit();
    }
    window.addEventListener("product-form-submit", handler);
    return () => window.removeEventListener("product-form-submit", handler);
  }, [canSubmit, name, description, categoryId, mode, productId]); // eslint-disable-line

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label>Nombre *</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del producto"
          disabled={loading}
        />
      </div>

      <div className="grid gap-2">
        <Label>Descripción</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          disabled={loading}
        />
      </div>

      <div className="grid gap-2">
        <Label>Categoría</Label>
        <Select
          value={categoryId || "__none__"}
          onValueChange={(v) => setCategoryId(v === "__none__" ? "" : v)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="__none__">Sin categoría</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : null}
    </div>
  );
}