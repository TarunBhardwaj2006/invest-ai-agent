import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function Card({ children, className, title, subtitle, icon }: CardProps) {
  return (
    <section className={cn("glass-card p-6 animate-fade-in", className)}>
      {(title || subtitle) && (
        <header className="mb-4 flex items-start gap-3">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-blue-400">
              {icon}
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>
            )}
          </div>
        </header>
      )}
      {children}
    </section>
  );
}
