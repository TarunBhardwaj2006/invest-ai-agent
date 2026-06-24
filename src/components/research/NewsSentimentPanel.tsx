import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getSentimentVariant } from "@/lib/utils/research-ui";
import type { NewsSentimentAnalysis } from "@/types/research";

interface NewsSentimentPanelProps {
  data: NewsSentimentAnalysis;
}

export function NewsSentimentPanel({ data }: NewsSentimentPanelProps) {
  return (
    <Card
      title="News Sentiment"
      subtitle={`Score: ${data.sentimentScore > 0 ? "+" : ""}${data.sentimentScore}`}
      icon={
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant={getSentimentVariant(data.overallSentiment)}>
          {data.overallSentiment}
        </Badge>
        {data.keyThemes.map((theme) => (
          <Badge key={theme}>{theme}</Badge>
        ))}
      </div>

      <p className="mb-4 text-sm leading-relaxed text-slate-400">{data.summary}</p>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-400">Recent Coverage</h4>
        {data.articles.map((article, index) => (
          <article
            key={`${article.title}-${index}`}
            className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h5 className="text-sm font-medium text-slate-200">{article.title}</h5>
              <Badge variant={getSentimentVariant(article.sentiment)}>
                {article.sentiment}
              </Badge>
            </div>
            {article.date && (
              <p className="mt-1 text-xs text-slate-500">{article.date}</p>
            )}
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              {article.summary}
            </p>
          </article>
        ))}
      </div>
    </Card>
  );
}
