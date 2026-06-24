import { cn } from "@/lib/utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeStyles = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Spinner({ size = "md", className, label = "Loading" }: SpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)} role="status">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-slate-600 border-t-blue-500",
          sizeStyles[size],
        )}
        aria-hidden="true"
      />
      {label && (
        <span className="text-sm text-slate-400">{label}</span>
      )}
    </div>
  );
}
