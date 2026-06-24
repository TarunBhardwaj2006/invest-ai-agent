import type { ResearchStep } from "@/types/research";

export interface ProgressStep {
  id: string;
  label: string;
  threshold: number;
  stepKey: ResearchStep;
}

export const PROGRESS_STEPS: ProgressStep[] = [
  {
    id: "research",
    label: "Company Research",
    threshold: 20,
    stepKey: "researching",
  },
  {
    id: "financial",
    label: "Financial Health Analysis",
    threshold: 40,
    stepKey: "analyzing_financial_health",
  },
  {
    id: "news",
    label: "News Sentiment Analysis",
    threshold: 60,
    stepKey: "analyzing_news_sentiment",
  },
  {
    id: "risk",
    label: "Risk Assessment",
    threshold: 80,
    stepKey: "assessing_risks",
  },
  {
    id: "decision",
    label: "Investment Decision",
    threshold: 100,
    stepKey: "completed",
  },
];

export type StepStatus = "pending" | "active" | "completed";

export function getStepStatus(
  step: ProgressStep,
  progressPercent: number,
  currentStep: ResearchStep | undefined,
): StepStatus {
  if (progressPercent >= step.threshold) return "completed";

  if (currentStep === step.stepKey) return "active";

  const stepIndex = PROGRESS_STEPS.findIndex((s) => s.id === step.id);
  const prevThreshold = stepIndex > 0 ? PROGRESS_STEPS[stepIndex - 1].threshold : 0;

  if (progressPercent > prevThreshold && progressPercent < step.threshold) {
    return "active";
  }

  return "pending";
}

export function getRecommendationVariant(
  recommendation: string,
): "success" | "warning" | "danger" {
  switch (recommendation) {
    case "INVEST":
      return "success";
    case "HOLD":
      return "warning";
    default:
      return "danger";
  }
}

export function getSentimentVariant(
  sentiment: string,
): "success" | "warning" | "danger" | "default" {
  switch (sentiment) {
    case "positive":
      return "success";
    case "negative":
      return "danger";
    case "neutral":
      return "warning";
    default:
      return "default";
  }
}

export function getRiskVariant(
  level: string,
): "success" | "warning" | "danger" | "default" {
  switch (level) {
    case "low":
      return "success";
    case "moderate":
      return "warning";
    case "high":
    case "critical":
      return "danger";
    default:
      return "default";
  }
}

export function getSeverityVariant(
  severity: string,
): "success" | "warning" | "danger" {
  switch (severity) {
    case "low":
      return "success";
    case "medium":
      return "warning";
    default:
      return "danger";
  }
}
