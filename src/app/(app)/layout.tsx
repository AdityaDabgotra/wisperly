import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

export default function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <> <Navbar/>{children}</>;
}
