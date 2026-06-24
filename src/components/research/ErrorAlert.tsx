import { Button } from "@/components/ui/Button";

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div
      className="animate-fade-in rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-300">Analysis Failed</h3>
          <p className="mt-1 text-sm text-red-200/80">{message}</p>
          {onRetry && (
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
