
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WidgetProps {
  children: ReactNode;
  className?: string;
}

export function Widget({ children, className }: WidgetProps) {
  return (
    <div
      className={cn(
        "bg-foreground border border-border rounded-lg p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
