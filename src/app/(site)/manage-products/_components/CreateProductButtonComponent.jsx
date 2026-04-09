"use client";

import { Button } from "@heroui/react";

export default function CreateProductButton({ onOpenCreate }) {
  return (
    <Button
      color="success"
      variant="solid"
      radius="full"
      onPress={() => {
        if (typeof onOpenCreate === "function") {
          onOpenCreate();
        }
      }}
      startContent={<span aria-hidden>＋</span>}
      className="bg-lime-400 font-semibold text-gray-700 shadow-sm transition hover:bg-lime-300"
    >
      Create product
    </Button>
  );
}
