import { getAllCategoriesAction, getProductsAction } from "@/actions/product.actions";
import ProductMainSection from "./_components/ProductMainSection";
import SearchProductComponent from "./_components/SearchProductComponent";

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const name = sp?.name ?? "";

  const categoriesRes = await getAllCategoriesAction();
  const productsRes = await getProductsAction();

  const categories = categoriesRes?.payload ?? [];
  const products = productsRes?.payload ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl py-12 sm:py-16">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Luxury beauty products
          </h1>
          <p className="mt-2 text-gray-500">
            Use the filters to narrow by price and brand.
          </p>
        </div>

        <SearchProductComponent />
      </header>

      <div className="mt-12">
        <ProductMainSection products={products} categories={categories} nameQueryParam={name} />
      </div>
    </div>
  );
}
