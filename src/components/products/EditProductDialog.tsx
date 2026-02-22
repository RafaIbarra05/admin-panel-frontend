"use client";

import * as React from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormDialog } from "@/components/common/FormDialog";
import { useMutation } from "@/lib/hooks/useMutation";
import { getErrorMessage } from "@/lib/api/errors";

import {
  updateProduct,
  type Product,
} from "@/lib/api/products";
import { listCategories, type Category } from "@/lib/api/categories";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product | null;
  onUpdated: () => void;
}

export function EditProductDialog({
  open,
  onOpenChange,
  product,
  onUpdated,
}: Props) {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(false);

  const update = useMutation<
    Product,
    { id: string; body: { name: string; price: number; categoryId: string } }
  >((vars) => updateProduct(vars.id, vars.body));

  // Precargar datos cuando se abre
  React.useEffect(() => {
    if (!open || !product) return;

    setName(product.name ?? "");
    setPrice(product.price ?? "");
    setCategoryId(product.categoryId ?? "");
  }, [open, product]);

  // Cargar categorías
  React.useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const res = await listCategories({ page: 1, limit: 100 });
        setCategories(res.data);
      } catch {
        // no crítico
      } finally {
        setLoadingCategories(false);
      }
    }

    if (open) void loadCategories();
  }, [open]);

  async function handleSubmit() {
    if (!product) return;

    const trimmed = name.trim();
    const numericPrice = Number(price);

    if (!trimmed || !numericPrice || !categoryId) return;

    const { error } = await update.mutate({
      id: product.id,
      body: {
        name: trimmed,
        price: numericPrice,
        categoryId,
      },
    });

    if (error) {
      toast.error(getErrorMessage(error, "Error actualizando producto"));
      return;
    }

    toast.success("Producto actualizado correctamente");
    onUpdated();
    onOpenChange(false);
  }

  function handleOpenChange(v: boolean) {
    onOpenChange(v);

    if (!v) {
      setName("");
      setPrice("");
      setCategoryId("");
      update.setError(null);
    }
  }

  const canSubmit =
    !!product &&
    !!name.trim() &&
    !!price &&
    !!categoryId &&
    !update.loading;

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Editar producto"
      canSubmit={canSubmit}
      loading={update.loading}
      submitText="Guardar cambios"
      submittingText="Guardando..."
      onSubmit={handleSubmit}
    >
      <Input
        placeholder="Nombre del producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Precio"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <Select value={categoryId} onValueChange={setCategoryId}>
        <SelectTrigger>
          <SelectValue
            placeholder={
              loadingCategories
                ? "Cargando categorías..."
                : "Seleccionar categoría"
            }
          />
        </SelectTrigger>

        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormDialog>
  );
}