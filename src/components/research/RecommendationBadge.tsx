import { Badge } from "@/components/ui/Badge";
import { getRecommendationVariant } from "@/lib/utils/research-ui";
import type { Recommendation } from "@/types/research";

interface RecommendationBadgeProps {
  recommendation: Recommendation;
  className?: string;
}

export function RecommendationBadge({
  recommendation,
  className,
}: RecommendationBadgeProps) {
  return (
    <div className={className}>
      <p className="mb-2 text-center text-sm font-medium text-slate-400">
        Recommendation
      </p>
      <Badge
        variant={getRecommendationVariant(recommendation)}
        className="px-5 py-2 text-sm"
      >
        {recommendation}
      </Badge>
    </div>
  );
}
