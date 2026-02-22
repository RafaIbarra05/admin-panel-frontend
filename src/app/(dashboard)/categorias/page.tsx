import { CategoriesView } from "@/components/categories";

export default function CategoriasPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Categorías</h1>
        <p className="text-sm text-muted-foreground">
          Administrá la estructura de categorías del ecommerce.
        </p>
      </div>

      <CategoriesView />
    </div>
  );
}