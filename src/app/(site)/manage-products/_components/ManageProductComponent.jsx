"use client";

import { useEffect, useState } from "react";
import ProductCardComponent from "@/components/ProductCardComponent";
import CreateProductButton from "./CreateProductButtonComponent";
import ProductModal from "./ProductModalComponent";

function productToFormValues(p) {
  return {
    productId: p.productId ?? "",
    name: p.name ?? p.productName ?? "",
    description: p.description ?? "",
    colors: Array.isArray(p.colors) ? p.colors : [],
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    price: String(p.price ?? ""),
    categoryId: String(p.categoryId ?? ""),
    imageUrl: p.imageUrl ?? "",
  };
}

export default function ManageProductComponent({ products, categories }) {
  const [items, setItems] = useState(products);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [modalInitial, setModalInitial] = useState(null);

  useEffect(() => {
    setItems(products);
  }, [products]);

  const openCreate = () => {
    setModalMode("create");
    setModalInitial(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode("edit");
    setModalInitial(productToFormValues(product));
    setModalOpen(true);
  };

  const handleProductDeleted = (productId) => {
    const id = String(productId);
    setItems((prev) =>
      prev.filter((p) => String(p.productId ?? p.id) !== id),
    );
  };

  return (
    <>
      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <CreateProductButton onOpenCreate={openCreate} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-600">
              No products yet.
            </div>
          ) : (
            items.map((p) => (
              <ProductCardComponent
                key={String(p.productId ?? p.id)}
                product={p}
                isShowThreeDots={true}
                onEditProduct={openEdit}
                onProductDeleted={handleProductDeleted}
              />
            ))
          )}
        </div>
      </section>

      <ProductModal
        open={modalOpen}
        mode={modalMode}
        categories={categories}
        initialValues={modalInitial ?? undefined}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
