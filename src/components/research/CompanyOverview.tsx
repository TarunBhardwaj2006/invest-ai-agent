import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { CompanyProfile } from "@/types/research";

interface CompanyOverviewProps {
  company: CompanyProfile;
}

export function CompanyOverview({ company }: CompanyOverviewProps) {
  return (
    <Card
      title="Company Overview"
      subtitle={company.ticker ? `${company.ticker}${company.sector ? ` · ${company.sector}` : ""}` : company.sector}
      icon={
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      }
    >
      <p className="leading-relaxed text-slate-300">{company.description}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {company.industry && (
          <MetaItem label="Industry" value={company.industry} />
        )}
        {company.marketCap && (
          <MetaItem label="Market Cap" value={company.marketCap} />
        )}
        {company.headquarters && (
          <MetaItem label="Headquarters" value={company.headquarters} />
        )}
        {company.founded && (
          <MetaItem label="Founded" value={company.founded} />
        )}
      </div>

      {company.keyProducts.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-2 text-sm font-medium text-slate-400">Key Products & Services</h4>
          <div className="flex flex-wrap gap-2">
            {company.keyProducts.map((product) => (
              <Badge key={product} variant="info">{product}</Badge>
            ))}
          </div>
        </div>
      )}

      {company.competitors.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-slate-400">Competitors</h4>
          <div className="flex flex-wrap gap-2">
            {company.competitors.map((competitor) => (
              <Badge key={competitor}>{competitor}</Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-800/50 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
}
