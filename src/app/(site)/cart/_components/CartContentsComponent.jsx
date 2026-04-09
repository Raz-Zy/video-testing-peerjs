"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@heroui/react";
import { sileo } from "sileo";
import { getProductById } from "@/data/mockData";
import { cartToOrderRequest, useCartStore } from "@/utils/cart";
import { orderProductsAction } from "@/actions/product.actions";

export default function CartContents() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQty = useCartStore((s) => s.setQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const subtotal = items.reduce((sum, line) => {
    const price = Number(line?.price) || 0;
    const q = Number(line?.qty) > 0 ? line.qty : 1;
    return sum + price * q;
  }, 0);

  const onCheckout = async () => {
    setCheckoutMessage("");
    const body = cartToOrderRequest(items);
    if (body.orderDetailRequests.length === 0) return;

    setCheckoutBusy(true);
    try {
      const res = await orderProductsAction(body);
      const ok =
        res?.status === "200 CREATED" ||
        res?.status === "201 CREATED" ||
        res?.status === "200 OK";
      if (ok) {
        sileo.success({
          title: "Order placed",
          description:
            typeof res?.message === "string"
              ? res.message
              : "Your order was submitted successfully.",
        });
        clearCart();
        router.push("/orders");
      } else {
        setCheckoutMessage(
          typeof res?.message === "string"
            ? res.message
            : "Checkout failed. Sign in and try again.",
        );
      }
    } catch {
      setCheckoutMessage("Checkout failed. Please try again.");
    } finally {
      setCheckoutBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center shadow-sm">
        <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
        <p className="mt-2 text-gray-500">
          Open a product, set quantity, then tap “Add to cart”.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex rounded-full bg-blue-950 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-900"
        >
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{items.length}</span>{" "}
        {items.length === 1 ? "product" : "products"} in cart
      </p>

      <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {items.map((line, index) => {
          const product =
            getProductById(line.productId) ?? {
              productId: line.productId,
              productName: line.productName ?? "Product",
              brand: "",
              price: line.price ?? 0,
              imageUrl: line.imageUrl,
            };
          const src = product.imageUrl ?? line.imageUrl;
          const q = Number(line?.qty) > 0 ? line.qty : 1;
          const lineTotal = (Number(product.price) || 0) * q;

          return (
            <div
              key={`${line.productId}-${line.color}-${line.size}-${index}`}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5"
            >
              <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:mx-0">
                {src ? (
                  <Image
                    src={src}
                    alt={product.productName}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <Link
                  href={`/products/${product.productId}`}
                  className="font-semibold text-gray-900 hover:text-blue-900"
                >
                  {product.productName}
                </Link>
                <p className="mt-1 text-sm text-gray-600">{product.brand}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {line.color} · {line.size}
                </p>
                <p className="mt-2 text-sm font-semibold tabular-nums text-gray-900">
                  ${Number(product.price).toFixed(2)} each
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 sm:ml-auto sm:items-end">
                <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50">
                  <Button
                    isIconOnly
                    variant="light"
                    className="min-w-9 rounded-l-full text-base text-gray-700"
                    onPress={() => setQty(index, q - 1)}
                    isDisabled={q <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </Button>
                  <span className="min-w-9 text-center text-sm font-semibold tabular-nums text-gray-900">
                    {q}
                  </span>
                  <Button
                    isIconOnly
                    variant="light"
                    className="min-w-9 rounded-r-full text-base text-gray-700"
                    onPress={() => setQty(index, q + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </Button>
                </div>
                <p className="text-base font-semibold tabular-nums text-gray-900">
                  ${lineTotal.toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-sm font-medium cursor-pointer text-red-600 underline-offset-2 hover:text-red-700 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between text-base sm:text-lg">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold tabular-nums text-gray-900">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Tax and shipping calculated at checkout (demo).
        </p>
        {checkoutMessage && (
          <p className="mt-4 text-sm font-medium text-red-600">{checkoutMessage}</p>
        )}
        <Button
          variant="solid"
          isDisabled={checkoutBusy}
          onPress={onCheckout}
          className="mt-6 w-full rounded-full bg-slate-700 py-3.5 text-sm font-semibold text-white"
        >
          {checkoutBusy ? "Placing order…" : "Checkout"}
        </Button>
        <Button
          variant="bordered"
          onPress={clearCart}
          className="mt-3 w-full rounded-full border border-gray-200 bg-gray-100 py-3.5 text-sm font-medium text-gray-800 hover:bg-gray-200"
        >
          Clear cart
        </Button>
      </div>
    </div>
  );
}
