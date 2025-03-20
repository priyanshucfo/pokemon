"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [search, setSearch] = useState("");

  return (
    <html lang="en">
      <body>
        <Navbar setSearch={setSearch} />
        {children}
      </body>
    </html>
  );
}
