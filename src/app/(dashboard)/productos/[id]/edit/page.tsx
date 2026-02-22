import { ProductFormView } from "@/components/products/ProductFormView";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <ProductFormView mode="edit" productId={id} />;
}