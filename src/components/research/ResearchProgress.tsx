"use client";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils/cn";
import {
  PROGRESS_STEPS,
  getStepStatus,
  type StepStatus,
} from "@/lib/utils/research-ui";
import type { ResearchProgress } from "@/types/research";

interface ResearchProgressPanelProps {
  progress: ResearchProgress | null;
  visible: boolean;
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "completed") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="relative flex h-7 w-7 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-30" />
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20 ring-1 ring-blue-500/50">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-400" />
        </span>
      </span>
    );
  }

  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 bg-slate-800/60">
      <span className="h-2 w-2 rounded-full bg-slate-600" />
    </span>
  );
}

export function ResearchProgressPanel({
  progress,
  visible,
}: ResearchProgressPanelProps) {
  if (!visible) return null;

  const percent = progress?.progress ?? 0;
  const currentStep = progress?.step;

  return (
    <Card
      title="Live Analysis Progress"
      subtitle={progress?.message ?? "Initializing agents…"}
      icon={
        <svg className="h-5 w-5 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      }
      className="shimmer-bg animate-slide-up"
    >
      <ProgressBar value={percent} className="mb-6" />

      <ul className="space-y-3">
        {PROGRESS_STEPS.map((step) => {
          const status = getStepStatus(step, percent, currentStep);

          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                status === "active" && "bg-blue-500/10 ring-1 ring-blue-500/20",
                status === "completed" && "bg-emerald-500/5",
              )}
            >
              <StepIcon status={status} />
              <span
                className={cn(
                  "flex-1 text-sm font-medium",
                  status === "completed" && "text-emerald-400",
                  status === "active" && "text-blue-300",
                  status === "pending" && "text-slate-500",
                )}
              >
                {status === "completed" && "✓ "}
                {step.label}
              </span>
              {status === "active" && (
                <span className="text-xs text-blue-400/80">In progress…</span>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
