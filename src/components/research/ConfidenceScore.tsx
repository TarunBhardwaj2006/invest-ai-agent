interface ConfidenceScoreProps {
  confidence: number;
}

export function ConfidenceScore({ confidence }: ConfidenceScoreProps) {
  const clamped = Math.min(100, Math.max(0, confidence));

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-400">Confidence Score</span>
        <span className="font-medium text-slate-200">{clamped}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-1000"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
