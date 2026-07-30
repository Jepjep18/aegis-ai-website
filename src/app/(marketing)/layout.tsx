import type { ReactNode } from "react";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout//footer/Footer";

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}