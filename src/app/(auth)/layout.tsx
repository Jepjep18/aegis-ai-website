import type { ReactNode } from "react";

import AuthLayout from "@/components/auth/layout/AuthLayout";

interface Props {
  children: ReactNode;
}

export default function Layout({
  children,
}: Props) {
  return <AuthLayout>{children}</AuthLayout>;
}