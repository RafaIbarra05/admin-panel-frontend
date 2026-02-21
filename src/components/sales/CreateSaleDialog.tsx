"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";

import { listProducts, type Product } from "@/lib/api/products";
import { createSale } from "@/lib/api/sales";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type DraftItem = {
  productId: string;
  quantity: number;
};

type Props = {
  onCreated?: () => void;
  triggerLabel?: string;
};

export function CreateSaleDialog({
  onCreated,
  triggerLabel = "Generar venta",
}: Props) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

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
        const data = await listProducts();
        if (!cancelled) setProducts(data);
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
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  }

  function validateDraft(draft: DraftItem[]) {
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

    const normalizedItems = validateDraft(items);

    await createSale({ items: normalizedItems });

    toast.success("Venta creada correctamente", {
      description: `${normalizedItems.length} producto(s) agregados`,
    });

    // Reset del form
    setItems([{ productId: "", quantity: 1 }]);

    // Cierra modal
    setOpen(false);

    // Actualiza UI
    onCreated?.();
    router.refresh();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "No se pudo crear la venta.";

    setError(msg);

    toast.error("No se pudo crear la venta", {
      description: msg,
    });
  } finally {
    setSubmitting(false);
  }
}

  const canSubmit =
    !submitting &&
    items.some((x) => x.productId.trim() !== "" && Number(x.quantity) > 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 px-5 bg-[#0b1220] hover:bg-[#0b1220]/90 text-white text-sm font-medium tracking-tight">
          <Plus className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Generar venta</DialogTitle>
          <DialogDescription>
            Seleccioná productos y cantidades para crear una venta.
          </DialogDescription>
        </DialogHeader>

        {/* Scroll interno para que no se rompa el layout */}
        <div className="max-h-[65vh] pr-1">
          <div className="overflow-y-auto max-h-[60vh]">
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
                value={row.productId}
                onValueChange={(v) => updateRow(idx, { productId: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar producto" />
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
            </div>

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
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>

          <Button type="button" onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear venta"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}