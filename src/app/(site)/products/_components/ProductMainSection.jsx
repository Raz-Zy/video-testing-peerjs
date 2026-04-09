"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import ShopCardComponent from "@/components/shop/ShopCardComponent";

/** Single-slider presets: maximum price (minimum is always $0). */
function categoryStatsFromProducts(products, categories) {
  // Start with all categories from the API so even empty ones appear.
  const stats = (Array.isArray(categories) ? categories : []).map((c) => ({
    id: String(c.categoryId ?? c.id ?? ""),
    count: 0,
    label: c.name ?? c.categoryName ?? `Category ${c.categoryId ?? c.id}`,
  }));

  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    const categoryId = String(product.categoryId ?? "");
    let index = -1;

    for (let j = 0; j < stats.length; j += 1) {
      if (stats[j].id === categoryId) {
        index = j;
        break;
      }
    }
    if (index !== -1) {
      stats[index].count += 1;
    }
  }

  stats.sort((a, b) => a.label.localeCompare(b.label));
  return stats;
}

function filterProducts(products, maxPrice, selectedCategories, nameQuery) {
  const q = nameQuery.trim().toLowerCase();
  return products.filter((p) => {
    if (Number(p.price) > maxPrice) return false;
    const selected = Array.isArray(selectedCategories) ? selectedCategories : [];
    if (selected.length > 0 && !selected.includes(String(p.categoryId))) return false;
    if (q.length > 0) {
      const name = String(p.productName ?? p.name ?? "").toLowerCase();
      if (!name.includes(q)) return false;
    }
    return true;
  });
}

export default function ProductMainSection({ products = [], categories = [], nameQueryParam = "" }) {
  const computedPriceMax = Math.max(
    300,
    ...products.map((p) => Number(p.price) || 0),
  );
  const QUICK_MAX = [
    { id: "50", label: "Under $50", max: 50 },
    { id: "100", label: "Under $100", max: 100 },
    { id: "150", label: "Under $150", max: 150 },
    { id: "all", label: "All prices", max: computedPriceMax },
  ];
  const categoryStats = categoryStatsFromProducts(products, categories);

  const [maxPrice, setMaxPrice] = useState(computedPriceMax);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeQuickId, setActiveQuickId] = useState(null);
  const nameQuery = String(nameQueryParam ?? "");

  const filtered = filterProducts(products, maxPrice, selectedCategories, nameQuery);

  const reset = () => {
    setMaxPrice(computedPriceMax);
    setSelectedCategories([]);
    setActiveQuickId(null);
  };

  const onRangeChange = (value) => {
    const v = Math.min(Math.max(0, Number(value)), computedPriceMax);
    setMaxPrice(v);
    setActiveQuickId(null);
  };

  const applyQuickMax = (preset) => {
    setMaxPrice(preset.max);
    setActiveQuickId(preset.id);
  };

  const toggleCategory = (id) => {
    const key = String(id);
    const exists = selectedCategories.includes(key);

    if (exists) {
      const next = selectedCategories.filter((value) => value !== key);
      setSelectedCategories(next);
    } else {
      setSelectedCategories([...selectedCategories, key]);
    }
  };

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
      <div className="w-full shrink-0 lg:w-64 xl:w-72">
        <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
            <Button
              size="sm"
              variant="secondary"
              onPress={reset}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Reset filters
            </Button>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Price range
            </p>
            <p className="mt-2 text-sm tabular-nums text-gray-700">
              $0 – ${maxPrice}
              {maxPrice >= computedPriceMax && (
                <span className="text-gray-400"> (no limit)</span>
              )}
            </p>
            <div className="mt-4">
              <label htmlFor="price-range" className="sr-only">
                Maximum price
              </label>
              <input
                id="price-range"
                type="range"
                min={0}
                max={computedPriceMax}
                step={1}
                value={maxPrice}
                onChange={(e) => onRangeChange(e.target.value)}
                className="w-full accent-gray-900"
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>${computedPriceMax}</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Quick select
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {QUICK_MAX.map((preset) => {
                const active = activeQuickId === preset.id;
                return (
                  <Button
                    key={preset.id}
                    size="sm"
                    variant={active ? "solid" : "secondary"}
                    onPress={() => applyQuickMax(preset)}
                    aria-pressed={active}
                    className={`rounded-xl border py-2.5 text-center text-xs font-medium transition ${
                      active
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Categories
            </p>
            <ul className="mt-3 space-y-1">
              {categoryStats.map((c) => {
                const checked = selectedCategories.includes(c.id);
                return (
                  <li key={c.id}>
                    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-xl py-2 pl-0 pr-1 text-sm text-gray-800 hover:bg-gray-50">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(c.id)}
                          className="size-4 rounded border-gray-300 accent-gray-900"
                        />
                        {c.label}
                      </span>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs tabular-nums text-gray-500">
                        {c.count}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs text-gray-400">
              Select none to include all categories.
            </p>
          </div>
        </aside>
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-6 text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium tabular-nums text-gray-900">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "product" : "products"}
          {filtered.length !== products.length && (
            <span className="text-gray-400">
              {" "}
              (of {products.length})
            </span>
          )}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center shadow-sm">
            <p className="font-medium text-gray-900">No products match these filters</p>
            <p className="mt-2 text-sm text-gray-500">
              Try raising the price limit or clearing category filters.
            </p>
            <Button
              variant="solid"
              onPress={reset}
              className="mt-6 rounded-full border border-gray-900 bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Reset all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <ShopCardComponent
                key={product.productId}
                product={product}
                categoryLabel={
                  categories.find((c) => String(c.categoryId) === String(product.categoryId))
                    ?.name ??
                  categories.find((c) => String(c.categoryId) === String(product.categoryId))
                    ?.categoryName
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
