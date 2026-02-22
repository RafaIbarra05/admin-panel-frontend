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

import { createProduct } from "@/lib/api/products";
import { listCategories, type Category } from "@/lib/api/categories";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}

export function CreateProductDialog({ open, onOpenChange, onCreated }: Props) {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(false);

  const create = useMutation((vars: {
    name: string;
    price: number;
    categoryId: string;
  }) => createProduct(vars));

  // cargar categorías cuando abre
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
    const trimmed = name.trim();
    const numericPrice = Number(price);

    if (!trimmed || !numericPrice || !categoryId) return;

    const { error } = await create.mutate({
      name: trimmed,
      price: numericPrice,
      categoryId,
    });

    if (error) {
      toast.error(getErrorMessage(error, "Error creando producto"));
      return;
    }

    toast.success("Producto creado correctamente");

    setName("");
    setPrice("");
    setCategoryId("");

    onCreated();
    onOpenChange(false);
  }

  function handleOpenChange(v: boolean) {
    onOpenChange(v);

    if (!v) {
      setName("");
      setPrice("");
      setCategoryId("");
      create.setError(null);
    }
  }

  const canSubmit =
    !!name.trim() &&
    !!price &&
    !!categoryId &&
    !create.loading;

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Nuevo producto"
      canSubmit={canSubmit}
      loading={create.loading}
      submitText="Crear producto"
      submittingText="Creando..."
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