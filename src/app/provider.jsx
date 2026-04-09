"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sileo";
import "sileo/styles.css";

export default function Provider({ children, session }) {
  return (
    <SessionProvider session={session}>
      <HeroUIProvider>
        {children}
        <Toaster
          position="top-right"
          options={{
            fill: "#171717",
            roundness: 16,
            styles: {
              title: "text-white! text-lg!",
              description: "text-white/75! text-md pl-2",
              badge: "bg-white/10!",
              button: "bg-white/10! hover:bg-white/15!",
            },
          }}
        />
      </HeroUIProvider>
    </SessionProvider>
  );
}
