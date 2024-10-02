import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import Loader from "@/components/common/Loader";
import { DataProvider } from "@/app/appcontext";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MIST",
  description: "Maintenance Apps",
  // manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataProvider>
      <html lang="en">
        <body suppressHydrationWarning={true}>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">{children}</div>
        </body>
      </html>
    </DataProvider>
  );
}
