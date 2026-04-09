import ManageProductComponent from "./_components/ManageProductComponent";
import SortSelectComponent from "./_components/SortSelectComponent";
import { getAllCategoriesAction, getProductsAction } from "@/actions/product.actions";

const SORT_KEYS = new Set(["name_asc", "name_desc"]);

export default async function ManageProductsPage({ searchParams }) {
  const sp = await searchParams;
  const sort = typeof sp?.sort === "string" ? sp.sort : "name_asc";
  const sortKey = SORT_KEYS.has(sort) ? sort : "name_asc";

  const categories = await getAllCategoriesAction();
  const products = await getProductsAction();

  const sorted = [...(products?.payload ?? [])].sort((a, b) => {
    const aName = String(a?.name ?? a?.productName ?? "");
    const bName = String(b?.name ?? b?.productName ?? "");
    const byName = aName.localeCompare(bName);
    return sortKey === "name_desc" ? -byName : byName;
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Manage Products
          </h1>
          <p className="mt-2 text-gray-500">
            Create, update, and delete products in this demo (local state only).
          </p>
        </div>
        <SortSelectComponent sortKey={sortKey} />
      </header>
      <ManageProductComponent products={sorted} categories={categories?.payload} />
    </div>
  );
}
