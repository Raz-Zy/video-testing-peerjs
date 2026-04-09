"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { sileo } from "sileo";
import { useCartStore } from "@/utils/cart";
import { ratingProductAction } from "@/actions/product.actions";

const COLOR_BG_CLASS = {
  red: "bg-red-300",
  blue: "bg-blue-300",
  green: "bg-green-300",
  gray: "bg-gray-300",
  white: "bg-white",
};
const COLOR_BORDER_CLASS = {
  red: "border-red-500",
  blue: "border-blue-500",
  green: "border-green-500",
  gray: "border-gray-500",
  white: "border-slate-500",
};

function formatMoney(n) {
  return n.toFixed(2);
}

function clampStar(n) {
  const x = Math.floor(Number(n));
  if (Number.isNaN(x) || x < 0) return 0;
  return Math.min(5, x);
}

export default function ProductDetailView({
  product,
  categoryLabel,
  prevProductId,
  nextProductId,
  productItems = [],
}) {
  const router = useRouter();
  const colorOptions = Array.isArray(product.colors) ? product.colors : [];
  const sizeOptions = Array.isArray(product.sizes) ? product.sizes : [];
  const [selectedColor, setSelectedColor] = useState(colorOptions[0] ?? "");
  const [size, setSize] = useState(sizeOptions[0] ?? "");
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [star, setStar] = useState(() => clampStar(product.star));
  const [ratingBusy, setRatingBusy] = useState(false);
  const [ratingError, setRatingError] = useState("");

  const listPrice = Math.round(product.price * 1.14 * 100) / 100;

  const mainSrc = product.imageUrl ?? null;

  const addItem = useCartStore((s) => s.addItem);
  const productName = product.name ?? product.productName;
  const productId = product.productId ?? product.id;

  useEffect(() => {
    setStar(clampStar(product.star));
  }, [product.productId, product.id, product.star]);

  const onRate = async (value) => {
    setRatingError("");
    setRatingBusy(true);
    try {
      const res = await ratingProductAction(String(productId), value);
      const ok = res?.status === "200 OK" || res?.status === "201 CREATED";
      if (ok) {
        const next =
          res?.payload?.star != null ? clampStar(res.payload.star) : clampStar(value);
        setStar(next);
        router.refresh();
      } else {
        setRatingError(
          typeof res?.message === "string" ? res.message : "Could not save rating.",
        );
      }
    } catch {
      setRatingError("Could not save rating.");
    } finally {
      setRatingBusy(false);
    }
  };

  const onAddToCart = () => {
    addItem({
      productId,
      productName,
      color: selectedColor,
      size,
      price: product.price,
      qty,
      imageUrl: product.imageUrl ?? null,
    });

    // Sileo returns a toast id; we use it to dismiss from a custom close control.
    let toastId;
    toastId = sileo.success({
      title: "Added to cart",
      duration: 4000,
      description: (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm">
            {qty} × {productName} — open the cart when you’re ready to checkout.
          </span>
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
    setJustAdded(true);
  };

  return (
    <div className="mx-auto w-full max-w-7xl py-10 lg:py-14">
      <nav
        className="flex flex-wrap items-center gap-1 text-sm text-gray-500"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="transition hover:text-gray-900">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link href="/products" className="transition hover:text-gray-900">
          Products
        </Link>
        <span aria-hidden>/</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-800">
          {product.name ?? product.productName}
        </span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
            {mainSrc ? (
              <Image
                src={mainSrc}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                alt={product.productName ?? product.name ?? "Product image"}
              />
            ) : (
              <div className="flex size-full items-center justify-center text-sm text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {prevProductId ? (
              <Link
                href={`/products/${prevProductId}`}
                className="hidden rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:bg-gray-50 sm:inline-flex"
                aria-label="Previous product"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
            ) : (
              <span className="hidden rounded-full border border-gray-100 bg-gray-50 p-2 text-gray-300 sm:inline-flex">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </span>
            )}
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
              {productItems.map((item) => {
                const selected = String(item.id) === String(product.productId ?? product.id);
                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className={`relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:size-24 ${
                      selected
                        ? "border-blue-600 shadow-sm"
                        : "border-1 border-gray-200"
                    }`}
                    aria-label={`View ${item.name}`}
                  >
                    <div className="relative size-full">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-linear-to-br from-gray-100 to-indigo-50/40 text-xs text-gray-400">
                          —
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            {nextProductId ? (
              <Link
                href={`/products/${nextProductId}`}
                className="hidden rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:bg-gray-50 sm:inline-flex"
                aria-label="Next product"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <span className="hidden rounded-full border border-gray-100 bg-gray-50 p-2 text-gray-300 sm:inline-flex">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              {product.name ?? product.productName}
            </h1>
            <div
              className="flex items-center gap-0.5"
              role="group"
              aria-label="Product rating"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={ratingBusy}
                  onClick={() => onRate(n)}
                  className={`rounded p-0.5 text-2xl leading-none transition hover:scale-110 disabled:opacity-50 ${
                    n <= star ? "text-amber-400" : "text-gray-200"
                  }`}
                  aria-label={`Rate ${n} out of 5`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          {ratingError && (
            <p className="mt-1 text-sm text-red-600">{ratingError}</p>
          )}
          {product.brand && (
            <p className="mt-1 text-lg text-gray-500">{product.brand}</p>
          )}

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <p className="text-3xl font-semibold tabular-nums text-blue-900">
              ${formatMoney(product.price)}
            </p>
            <p className="text-lg text-gray-400 line-through tabular-nums">
              ${formatMoney(listPrice)}
            </p>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-900">
              Choose a color
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {colorOptions.map((color) => {
                const on = selectedColor === color;
                const colorKey = String(color).toLowerCase();
                const colorBg = COLOR_BG_CLASS[colorKey] ?? "bg-slate-200";
                const colorBorder = COLOR_BORDER_CLASS[colorKey] ?? "border-slate-500";
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      on
                        ? `${colorBorder} text-gray-900`
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    } ${colorBg}`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Selected: {selectedColor || "N/A"}
            </p>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-900">Choose a size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizeOptions.map((opt) => {
                const on = size === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSize(opt)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      on
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className={`mr-2 inline-block size-2 rounded-full ${
                        on ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      aria-hidden
                    />
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-8 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {justAdded && (
            <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
              Added to cart —{" "}
              <Link href="/cart" className="underline underline-offset-2">
                view cart
              </Link>
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 shadow-sm">
              <Button
                isIconOnly
                variant="light"
                className="px-4 py-2 text-lg rounded-l-full text-gray-600 hover:text-gray-900"
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </Button>
              <span className="min-w-10 text-center text-sm font-semibold tabular-nums">
                {qty}
              </span>
              <Button
                isIconOnly
                variant="light"
                className="px-4 py-2 text-lg rounded-r-full text-gray-600 hover:text-gray-900"
                onPress={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </Button>
            </div>
            <Button
              variant="solid"
              onPress={onAddToCart}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-950 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 sm:flex-initial sm:min-w-[200px]"
            >
              <span aria-hidden>🛍</span>
              Add to cart
            </Button>
          </div>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50/80 p-5 shadow-sm">
            <div className="flex gap-3">
              <span className="text-xl" aria-hidden>
                ↩
              </span>
              <div>
                <p className="font-semibold text-gray-900">
                  Free 30-day returns
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  See return policy details in cart.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
