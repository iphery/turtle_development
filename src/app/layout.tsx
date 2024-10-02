import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import Loader from "@/components/common/Loader";
import { DataProvider } from "@/app/appcontext";

import { Metadata } from "next";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Logbook",
  description: "Logistic Apps",
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
          <ToastContainer />
          <div className="dark:bg-boxdark-2 dark:text-bodydark">{children}</div>
        </body>
      </html>
    </DataProvider>
  );
}
