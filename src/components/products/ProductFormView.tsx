"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { listCategories, type Category } from "@/lib/api/categories";
import {
  createProduct,
  updateProduct,
  getProductById,
  type Product,
} from "@/lib/api/products";

type Mode = "create" | "edit";

const NONE = "__none__";

function parseMoneyToNumber(value: string | number | null | undefined) {
  if (value == null) return NaN;
  if (typeof value === "number") return value;
  // "1500.00" -> 1500
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

export function ProductFormView({
  mode,
  productId,
}: {
  mode: Mode;
  productId?: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const [categories, setCategories] = React.useState<Category[]>([]);

  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState<string>(""); // input string
  const [position, setPosition] = React.useState<string>("0"); // input string
  const [categoryId, setCategoryId] = React.useState<string>(NONE);

  const priceNumber = parseMoneyToNumber(price);
  const positionNumber = Number(position);

  const canSubmit =
    name.trim().length >= 2 &&
    Number.isFinite(priceNumber) &&
    priceNumber > 0 &&
    Number.isFinite(positionNumber) &&
    positionNumber >= 0 &&
    !loading;

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        // categorías (paginadas en tu API)
        const cats = await listCategories({ page: 1, limit: 200 });
        if (!cancelled) setCategories(cats.data);

        if (mode === "edit") {
          if (!productId) throw new Error("Falta productId.");
          const p: Product = await getProductById(productId);

          if (!cancelled) {
            setName(p.name ?? "");
            setPrice(String(parseMoneyToNumber(p.price))); // "1500.00" => "1500"
            setPosition(String(p.position ?? 0));
            setCategoryId(p.categoryId ?? NONE);
          }
        } else {
          // defaults create
          if (!cancelled) {
            setCategoryId(NONE);
          }
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error cargando formulario");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, productId]);

  async function onSubmit() {
    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        price: priceNumber, // number ✅
        position: positionNumber, // number ✅
        categoryId: categoryId === NONE ? null : categoryId, // ajustá según tu backend
      };

      // Si tu backend REQUIERE categoryId siempre, reemplazá por:
      // if (categoryId === NONE) throw new Error("Seleccioná una categoría.");
      // y mandá categoryId sin null.

      if (mode === "create") {
        await createProduct(payload as any);
        toast.success("Producto creado");
      } else {
        if (!productId) throw new Error("Falta productId.");
        await updateProduct(productId, payload as any);
        toast.success("Producto actualizado");
      }

      router.push("/productos");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header simple */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            {mode === "create" ? "Crear producto" : "Editar producto"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Vista wrapper que reutiliza el mismo formulario (create/edit).
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => router.push("/productos")}
          >
            Cancelar
          </Button>

          <Button disabled={!canSubmit} onClick={onSubmit}>
            {loading
              ? "Guardando..."
              : mode === "create"
              ? "Crear"
              : "Guardar cambios"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 space-y-5">
        <div className="grid gap-2">
          <Label>Nombre *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            placeholder="Nombre del producto"
          />
        </div>

        <div className="grid gap-2">
          <Label>Precio *</Label>
          <Input
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={loading}
            placeholder="1500"
          />
          {!Number.isFinite(priceNumber) && price.length > 0 ? (
            <p className="text-xs text-destructive">Precio inválido</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label>Posición</Label>
          <Input
            type="number"
            min={0}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            disabled={loading}
            placeholder="0"
          />
        </div>

        <div className="grid gap-2">
          <Label>Categoría</Label>
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={NONE}>Sin categoría</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}