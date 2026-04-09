import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { auth } from "./auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PurelyStore",
  description:
    "Curated skincare, makeup, and fragrance — a student demo storefront.",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafafa] text-gray-900 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-0">
        <Provider session={session}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
