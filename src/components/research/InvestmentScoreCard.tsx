import { cn } from "@/lib/utils/cn";

interface InvestmentScoreCardProps {
  score: number;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function getStrokeColor(score: number): string {
  if (score >= 70) return "#34d399";
  if (score >= 40) return "#fbbf24";
  return "#f87171";
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "Strong";
  if (score >= 40) return "Moderate";
  return "Weak";
}

export function InvestmentScoreCard({ score, className }: InvestmentScoreCardProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={getStrokeColor(clamped)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-bold", getScoreColor(clamped))}>
            {clamped}
          </span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-400">
        Investment Score —{" "}
        <span className="text-slate-200">{getScoreLabel(clamped)}</span>
      </p>
    </div>
  );
}
