import { Card } from "@/components/ui/Card";
import type { ResearchResult } from "@/types/research";
import { CompanyOverview } from "./CompanyOverview";
import { FinancialHealthPanel } from "./FinancialHealthPanel";
import { NewsSentimentPanel } from "./NewsSentimentPanel";
import { RisksPanel } from "./RisksPanel";
import { OpportunitiesPanel } from "./OpportunitiesPanel";
import { InvestmentScoreCard } from "./InvestmentScoreCard";
import { RecommendationBadge } from "./RecommendationBadge";
import { ConfidenceScore } from "./ConfidenceScore";
import { DetailedReasoning } from "./DetailedReasoning";

interface ResearchResultsProps {
  result: ResearchResult;
}

export function ResearchResults({ result }: ResearchResultsProps) {
  const { company, financialHealth, newsSentiment, riskAssessment, decision } =
    result;

  return (
    <div className="animate-slide-up space-y-6">
      <Card className="border-blue-500/20 bg-gradient-to-br from-slate-900/80 to-blue-950/20">
        <div className="grid gap-8 md:grid-cols-3 md:items-center">
          <InvestmentScoreCard score={decision.score} />
          <div className="flex flex-col items-center justify-center gap-4">
            <RecommendationBadge recommendation={decision.recommendation} />
          </div>
          <div className="flex items-center px-4">
            <ConfidenceScore confidence={decision.confidence} />
          </div>
        </div>
      </Card>

      <CompanyOverview company={company} />

      <div className="grid gap-6 lg:grid-cols-2">
        <FinancialHealthPanel data={financialHealth} />
        <NewsSentimentPanel data={newsSentiment} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RisksPanel
          riskAssessment={riskAssessment}
          decisionRisks={decision.risks}
        />
        <OpportunitiesPanel opportunities={decision.opportunities} />
      </div>

      <DetailedReasoning reasoning={decision.reasoning} />

      <p className="text-center text-xs text-slate-600">
        Generated at {new Date(result.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}
