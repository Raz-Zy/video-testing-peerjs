"use client";

import { useCartStore } from "@/utils/cart";
import { Button } from "@heroui/react";
import { sileo } from "sileo";

export default function ButtonAddComponent({ product }) {
  const addItemOrMerge = useCartStore((s) => s.addItemOrMerge);

  const handleAddToCart = () => {
    const productId = product.productId ?? product.id;
    const productName = product.name ?? product.productName;
    const color = Array.isArray(product.colors)?.[0] ?? "";
    const size = Array.isArray(product.sizes)?.[0] ?? "";
    addItemOrMerge({
      productId,
      productName,
      color,
      size,
      price: product.price,
      qty: 1,
      imageUrl: product.imageUrl ?? null,
    });

    // Sileo returns a toast id; we use it to dismiss from a custom close control.
    let toastId;
    toastId = sileo.success({
      title: "Added to cart",
      duration: 4000,
      description: (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm">{productName} is in your cart.</span>
          <a
            href="#"
            role="button"
            aria-label="Dismiss"
            data-sileo-button
            className="text-sm font-semibold text-gray-900/70 transition hover:text-gray-900"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              sileo.dismiss(toastId);
            }}
          >
            ✕
          </a>
        </div>
      ),
    });
  };

  return (
    <Button
      isIconOnly
      aria-label="Add to cart"
      className="size-11 rounded-full bg-lime-400 text-xl font-light text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95"
      onPress={handleAddToCart}
    >
      +
    </Button>
  );
}
