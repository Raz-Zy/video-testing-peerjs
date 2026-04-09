import { notFound } from "next/navigation";
import { getAllCategoriesAction, getProductsAction } from "@/actions/product.actions";
import ProductDetailView from "../_components/ProductDetailView";

export async function generateMetadata({ params }) {
  const { productId } = await params;
  const productsRes = await getProductsAction();
  const products = productsRes?.payload ?? [];
  const product =
    products.find((p) => String(p.productId) === String(productId)) ??
    products.find((p) => String(p.id) === String(productId));
  if (!product) return { title: "Product | PurelyStore" };
  return {
    title: `${product.productName ?? product.name ?? "Product"} | PurelyStore`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { productId } = await params;
  const [productsRes, categoriesRes] = await Promise.all([
    getProductsAction(),
    getAllCategoriesAction(),
  ]);
  const products = productsRes?.payload ?? [];
  const categories = categoriesRes?.payload ?? [];
  const product =
    products.find((p) => String(p.productId) === String(productId)) ??
    products.find((p) => String(p.id) === String(productId));
  if (!product) notFound();
  const currentIndex = products.findIndex(
    (p) =>
      String(p.productId) === String(productId) ||
      String(p.id) === String(productId),
  );
  const prevProductId =
    currentIndex > 0
      ? String(products[currentIndex - 1].productId ?? products[currentIndex - 1].id)
      : null;
  const nextProductId =
    currentIndex >= 0 && currentIndex < products.length - 1
      ? String(products[currentIndex + 1].productId ?? products[currentIndex + 1].id)
      : null;
  const categoryLabel =
    categories.find((c) => String(c.categoryId) === String(product.categoryId))?.name ??
    categories.find((c) => String(c.categoryId) === String(product.categoryId))?.categoryName ??
    "Unknown category";
  const productItems = products.map((p) => ({
    id: String(p.productId ?? p.id),
    name: p.productName ?? p.name ?? "Product",
    imageUrl: p.imageUrl ?? null,
  }));
  return (
    <ProductDetailView
      product={product}
      categoryLabel={categoryLabel}
      prevProductId={prevProductId}
      nextProductId={nextProductId}
      productItems={productItems}
    />
  );
}
