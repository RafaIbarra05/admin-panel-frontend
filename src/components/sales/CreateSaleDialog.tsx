"use client";

import * as React from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { listProducts, type Product } from "@/lib/api/products";
import { createSale } from "@/lib/api/sales";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormDialog } from "@/components/common/FormDialog";

type DraftItem = { productId: string; quantity: number };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated?: () => void;
};

export function CreateSaleDialog({ open, onOpenChange, onCreated }: Props) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = React.useState(false);

  const [items, setItems] = React.useState<DraftItem[]>([
    { productId: "", quantity: 1 },
  ]);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Carga productos solo cuando abre el modal
  React.useEffect(() => {
    if (!open) return;

    let cancelled = false;

    (async () => {
      try {
        setError(null);
        setLoadingProducts(true);

        // listProducts devuelve paginado en tu proyecto
        const res = await listProducts({ page: 1, limit: 100 });
        if (!cancelled) setProducts(res.data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Error cargando productos");
        }
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  function addRow() {
    setItems((prev) => [...prev, { productId: "", quantity: 1 }]);
  }

  function removeRow(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRow(index: number, patch: Partial<DraftItem>) {
    setItems((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function normalizeItems(draft: DraftItem[]) {
    const filtered = draft
      .map((x) => ({
        productId: x.productId?.trim(),
        quantity: Number(x.quantity),
      }))
      .filter((x) => x.productId && x.quantity > 0);

    if (filtered.length === 0) {
      throw new Error("Agregá al menos un producto con cantidad válida.");
    }

    // Deduplicar productId sumando cantidades
    const map = new Map<string, number>();
    for (const it of filtered) {
      map.set(it.productId, (map.get(it.productId) ?? 0) + it.quantity);
    }

    return Array.from(map.entries()).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }

  async function handleSubmit() {
    try {
      setError(null);
      setSubmitting(true);

      const normalized = normalizeItems(items);

      await createSale({ items: normalized });

      toast.success("Venta creada correctamente", {
        description: `${normalized.length} producto(s) agregados`,
      });

      // reset
      setItems([{ productId: "", quantity: 1 }]);

      // cerrar
      onOpenChange(false);

      // refrescar tabla/lista
      onCreated?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo crear la venta.";
      setError(msg);
      toast.error("No se pudo crear la venta", { description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit =
    !submitting &&
    items.some((x) => x.productId.trim() !== "" && Number(x.quantity) > 0);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Generar venta"
      canSubmit={canSubmit}
      loading={submitting}
      submitText="Crear venta"
      submittingText="Creando..."
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-3 text-sm text-muted-foreground">
          <div className="col-span-8">Producto</div>
          <div className="col-span-3">Cantidad</div>
          <div className="col-span-1" />
        </div>

        {items.map((row, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-3 items-start">
            <div className="col-span-8">
              <Select
                value={row.productId || undefined}
                onValueChange={(v) => updateRow(idx, { productId: v })}
                disabled={submitting || loadingProducts}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={loadingProducts ? "Cargando..." : "Seleccionar producto"}
                  />
                </SelectTrigger>

                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-3">
              <Input
                type="number"
                min={1}
                value={row.quantity}
                onChange={(e) =>
                  updateRow(idx, { quantity: Number(e.target.value) })
                }
                disabled={submitting}
                className="bg-white"
              />
            </div>

            <div className="col-span-1 flex justify-end pt-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRow(idx)}
                disabled={submitting || items.length === 1}
                aria-label="Eliminar fila"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          onClick={addRow}
          disabled={submitting}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar ítem
        </Button>

        {loadingProducts && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando productos...
          </div>
        )}
      </div>
    </FormDialog>
  );
}