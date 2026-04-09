"use client";

import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import ProductCardComponent from "../ProductCardComponent";

const PAGE_SIZE = 8;
const ALL_TAB = "all";

function buildCategoryTabs(categories) {
  const rows = Array.isArray(categories) ? categories : [];
  return [
    { id: ALL_TAB, label: "All" },
    ...rows.map((c) => ({
      id: String(c.categoryId ?? c.id ?? ""),
      label: c.categoryName ?? c.name ?? `Category ${c.categoryId ?? c.id}`,
    })).filter((t) => t.id && t.id !== ALL_TAB),
  ];
}

function filterProductsByCategoryTab(products, tabId) {
  if (tabId === ALL_TAB) return products;
  return products.filter((p) => String(p.categoryId ?? "") === tabId);
}

export default function LandingEssentialComponent({ products = [], categories = [] }) {
  const tabs = useMemo(() => buildCategoryTabs(categories), [categories]);
  const [tab, setTab] = useState(ALL_TAB);
  const [showAll, setShowAll] = useState(false);

  const filtered = filterProductsByCategoryTab(products, tab);
  const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  const canLoadMore = !showAll && filtered.length > PAGE_SIZE;

  return (
    <section id="shop" className="mx-auto w-full max-w-7xl py-16 lg:py-20">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Our skincare essentials
        </h2>
        <p className="mt-2 max-w-lg text-gray-500">
          Filter by category — browse essentials from our catalog.
        </p>
      </div>

      <div
        className="mt-10 flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Product categories"
      >
        {tabs.map((t) => {
          const on = tab === t.id;
          return (
            <Button
              key={t.id}
              role="tab"
              aria-selected={on}
              onPress={() => {
                setTab(t.id);
                setShowAll(false);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                on
                  ? "bg-lime-400 text-gray-900 shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </Button>
          );
        })}
      </div>

      {products.length === 0 && (
        <p className="mt-12 text-center text-gray-500">
          No products loaded — sign in or check that the API is running.
        </p>
      )}

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {visible.map((product, index) => (
          <ProductCardComponent
            product={product}
            key={product.productId ?? product.id ?? index}
            isShowThreeDots={false}
          />
        ))}
      </div>

      {products.length > 0 && filtered.length === 0 && (
        <p className="mt-12 text-center text-gray-500">
          No products in this category — try &quot;All&quot;.
        </p>
      )}

      {canLoadMore && (
        <div className="mt-12 flex justify-center">
          <Button
            variant="secondary"
            onPress={() => setShowAll(true)}
            className="rounded-full border border-gray-200 bg-white px-10 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
