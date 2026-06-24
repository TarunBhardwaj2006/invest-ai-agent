import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-700 text-slate-200",
  success: "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30",
  danger: "bg-red-500/20 text-red-400 ring-1 ring-red-500/30",
  info: "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
