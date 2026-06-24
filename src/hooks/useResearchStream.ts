"use client";

import { useCallback, useRef, useState } from "react";
import type { ResearchStreamEvent } from "@/types/api";
import type { ResearchProgress, ResearchResult } from "@/types/research";

export type ResearchStatus = "idle" | "loading" | "success" | "error";

interface UseResearchStreamReturn {
  status: ResearchStatus;
  progress: ResearchProgress | null;
  result: ResearchResult | null;
  error: string | null;
  analyze: (companyName: string) => Promise<void>;
  reset: () => void;
}

function parseSSEChunk(chunk: string): ResearchStreamEvent | null {
  const trimmed = chunk.trim();
  if (!trimmed.startsWith("data:")) return null;

  try {
    return JSON.parse(trimmed.slice(5).trim()) as ResearchStreamEvent;
  } catch {
    return null;
  }
}

async function consumeSSEStream(
  response: Response,
  onEvent: (event: ResearchStreamEvent) => void,
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const event = parseSSEChunk(part);
      if (event) onEvent(event);
    }
  }

  if (buffer.trim()) {
    const event = parseSSEChunk(buffer);
    if (event) onEvent(event);
  }
}

export function useResearchStream(): UseResearchStreamReturn {
  const [status, setStatus] = useState<ResearchStatus>("idle");
  const [progress, setProgress] = useState<ResearchProgress | null>(null);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
    setProgress(null);
    setResult(null);
    setError(null);
  }, []);

  const analyze = useCallback(async (companyName: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setProgress(null);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/research/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
        signal: controller.signal,
      });

      if (!response.ok && response.headers.get("content-type")?.includes("application/json")) {
        const body = (await response.json()) as { error?: { message?: string } };
        throw new Error(body.error?.message ?? `Request failed (${response.status})`);
      }

      let completed = false;

      await consumeSSEStream(response, (event) => {
        switch (event.type) {
          case "progress":
            setProgress(event.payload);
            break;
          case "complete":
            completed = true;
            setResult(event.payload);
            setStatus("success");
            break;
          case "error":
            setError(event.payload.message);
            setStatus("error");
            break;
        }
      });

      if (!completed && !controller.signal.aborted) {
        setStatus("error");
        setError("Analysis ended without a result");
      }
    } catch (err) {
      if (controller.signal.aborted) return;

      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      setStatus("error");
    }
  }, []);

  return { status, progress, result, error, analyze, reset };
}
