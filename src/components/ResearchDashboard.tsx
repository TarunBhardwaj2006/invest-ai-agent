"use client";

import { useCallback, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompanySearchForm } from "@/components/research/CompanySearchForm";
import { ResearchProgressPanel } from "@/components/research/ResearchProgress";
import { ResearchResults } from "@/components/research/ResearchResults";
import { ErrorAlert } from "@/components/research/ErrorAlert";
import { useResearchStream } from "@/hooks/useResearchStream";

export function ResearchDashboard() {
  const { status, progress, result, error, analyze, reset } =
    useResearchStream();
  const [lastQuery, setLastQuery] = useState("");

  const isLoading = status === "loading";

  const handleAnalyze = useCallback(
    async (companyName: string) => {
      setLastQuery(companyName);
      await analyze(companyName);
    },
    [analyze],
  );

  const handleRetry = useCallback(() => {
    if (lastQuery) {
      handleAnalyze(lastQuery);
    } else {
      reset();
    }
  }, [lastQuery, handleAnalyze, reset]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <CompanySearchForm
            onSubmit={handleAnalyze}
            loading={isLoading}
            disabled={isLoading}
          />

          {error && status === "error" && (
            <ErrorAlert message={error} onRetry={handleRetry} />
          )}

          <ResearchProgressPanel progress={progress} visible={isLoading} />

          {result && status === "success" && (
            <ResearchResults result={result} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
