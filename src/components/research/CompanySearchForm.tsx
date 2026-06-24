"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

interface CompanySearchFormProps {
  onSubmit: (companyName: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

const MIN_LENGTH = 1;
const MAX_LENGTH = 200;

export function CompanySearchForm({
  onSubmit,
  loading = false,
  disabled = false,
}: CompanySearchFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function validate(value: string): string | null {
    const trimmed = value.trim();

    if (trimmed.length < MIN_LENGTH) {
      return "Please enter a company name";
    }

    if (trimmed.length > MAX_LENGTH) {
      return `Company name must be ${MAX_LENGTH} characters or fewer`;
    }

    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate(companyName);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onSubmit(companyName.trim());
  }

  return (
    <Card
      title="Company Search"
      subtitle="Enter a company name to begin multi-agent analysis"
      icon={
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Company Name"
            placeholder="e.g. Apple Inc., Tesla, Microsoft"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              if (error) setError(null);
            }}
            error={error ?? undefined}
            disabled={loading || disabled}
            autoComplete="organization"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={disabled}
          className="w-full sm:w-auto sm:min-w-[140px]"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </Button>
      </form>
    </Card>
  );
}
