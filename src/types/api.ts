import type { ResearchProgress, ResearchResult } from "./research";

/** POST /api/research request body */
export interface ResearchRequest {
  companyName: string;
}

/** POST /api/research success response */
export interface ResearchResponse {
  success: true;
  data: ResearchResult;
}

/** POST /api/research error response */
export interface ResearchErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ResearchApiResponse = ResearchResponse | ResearchErrorResponse;

/** SSE stream events from POST /api/research/stream */
export type ResearchStreamEvent =
  | { type: "progress"; payload: ResearchProgress }
  | { type: "partial"; payload: Partial<ResearchResult> }
  | { type: "complete"; payload: ResearchResult }
  | { type: "error"; payload: { message: string } };

/** GET /api/health response */
export interface HealthResponse {
  status: "ok";
  timestamp: string;
  version: string;
}
