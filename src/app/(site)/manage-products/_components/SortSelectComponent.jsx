"use client";

import { Select, SelectItem } from "@heroui/react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
];

export default function SortSelectComponent({ sortKey }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500">Sort</span>
      <Select
        aria-label="Sort products"
        selectedKeys={new Set([sortKey])}
        selectionMode="single"
        disallowEmptySelection
        onSelectionChange={(keys) => {
          if (keys === "all") return;
          const [next] = Array.from(keys);
          const value = String(next ?? "name_asc");
          router.replace(`/manage-products?sort=${value}`);
        }}
        placeholder="Sort"
        variant="faded"
        classNames={{
          base: "w-44 max-w-44",
          trigger: "rounded-full border-1.5 border-gray-200 hover:border-lime-300! data-[open=true]:border-lime-400! cursor-pointer",
        }}
      >
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} textValue={o.label} className="data-[hover=true]:bg-lime-100!">
            {o.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
