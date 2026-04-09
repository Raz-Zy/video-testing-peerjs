"use client";

import { Button } from "@heroui/react";
import { signOut } from "next-auth/react";

export default function ButtonComponent({ children, action }) {
    
  return (
    <Button
      variant="primary"
      isIconOnly={action === "logout"}
      className={ action ? `rounded-full text-sm transition ${action === "logout" ? "hover:text-red-500 w-fit h-fit" : ""}` : "rounded-full bg-lime-400 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-lime-300"}
      onPress={() => {
        if(action === "logout") {
            signOut({ callbackUrl: "/login" });
        }
      }}
    >
      {children}
    </Button>
  );
}
