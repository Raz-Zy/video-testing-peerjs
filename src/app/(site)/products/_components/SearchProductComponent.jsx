"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchProductComponent() {
  const [nameQuery, setNameQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    const next = e.target.value;
    setNameQuery(next);
    const q = next.trim();
    router.replace(q ? `/products?name=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <div className="w-full lg:w-80">
      <input
        id="product-name-search"
        value={nameQuery}
        onChange={(e) => handleSearch(e)}
        placeholder="Search by product name..."
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
      />
    </div>
  );
}
