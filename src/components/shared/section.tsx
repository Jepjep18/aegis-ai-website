import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export function Section({
  children,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "relative py-24 lg:py-32",
        className
      )}
    >
      {children}
    </section>
  );
}