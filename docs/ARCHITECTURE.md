# Architecture — AI Investment Research Agent

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                        │
│  CompanySearchForm → ResearchProgress → ResearchResults         │
│         │                    ▲                                  │
│         │  POST /api/research/stream (SSE)                      │
└─────────┼────────────────────┼──────────────────────────────────┘
          ▼                    │
┌─────────────────────────────────────────────────────────────────┐
│              Next.js 15 Route Handlers (Node.js)                │
│  /api/research          — synchronous full response             │
│  /api/research/stream   — Server-Sent Events for live progress  │
│  /api/health            — liveness probe                        │
└─────────┼───────────────────────────────────────────────────────┘
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    research-service.ts                          │
│  Validates input → invokes LangGraph → maps state to API DTO    │
└─────────┼───────────────────────────────────────────────────────┘
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LangGraph Workflow                           │
│  research_company → analyze_strengths_risks →                     │
│  analyze_developments → generate_recommendation → END           │
└─────────┼───────────────────────────────────────────────────────┘
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Gemini (ChatGoogleGenerativeAI)  +  Tools (web-search, lookup) │
└─────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
investment-research-agent/
├── docs/
│   └── ARCHITECTURE.md          # This document
├── public/                      # Static assets (favicon, logos)
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout, fonts, metadata
│   │   ├── page.tsx             # Main research dashboard
│   │   ├── globals.css          # Tailwind directives + CSS vars
│   │   └── api/                 # Node.js backend (Route Handlers)
│   │       ├── health/route.ts
│   │       └── research/
│   │           ├── route.ts         # POST — full JSON response
│   │           └── stream/route.ts  # POST — SSE streaming
│   │
│   ├── components/
│   │   ├── layout/              # Shell components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── research/            # Domain-specific UI
│   │   │   ├── CompanySearchForm.tsx
│   │   │   ├── ResearchProgress.tsx
│   │   │   ├── InvestmentScoreCard.tsx
│   │   │   ├── RecommendationBadge.tsx
│   │   │   ├── StrengthsRisksPanel.tsx
│   │   │   ├── RecentDevelopments.tsx
│   │   │   ├── DetailedReasoning.tsx
│   │   │   └── ResearchResults.tsx   # Composes all result panels
│   │   └── ui/                  # Reusable primitives
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       └── Spinner.tsx
│   │
│   ├── hooks/                   # Client-side data fetching
│   │   ├── useResearch.ts       # Non-streaming API call
│   │   └── useResearchStream.ts # SSE consumer with progress
│   │
│   ├── lib/
│   │   ├── langgraph/           # Agent orchestration
│   │   │   ├── graph.ts         # Graph builder + compile
│   │   │   ├── state.ts         # Re-exports state annotation
│   │   │   ├── nodes/           # One file per graph node
│   │   │   │   ├── research-company.ts
│   │   │   │   ├── analyze-strengths-risks.ts
│   │   │   │   ├── analyze-developments.ts
│   │   │   │   └── generate-recommendation.ts
│   │   │   └── edges/
│   │   │       └── routing.ts   # Conditional edge logic (if needed)
│   │   ├── llm/
│   │   │   ├── gemini.ts        # ChatGoogleGenerativeAI singleton
│   │   │   └── prompts/         # Prompt templates per stage
│   │   │       ├── research.ts
│   │   │       ├── analysis.ts
│   │   │       └── recommendation.ts
│   │   ├── tools/               # LangChain tools bound to LLM
│   │   │   ├── web-search.ts    # Tavily / Serper / Gemini grounding
│   │   │   └── company-lookup.ts
│   │   ├── services/
│   │   │   └── research-service.ts  # API ↔ graph bridge
│   │   └── utils/
│   │       ├── errors.ts        # AppError, error codes
│   │       └── validation.ts    # Zod schemas for API input
│   │
│   └── types/                   # Shared TypeScript contracts
│       ├── research.ts          # Domain models
│       ├── api.ts               # Request/response DTOs
│       ├── langgraph.ts         # Graph state annotation
│       └── index.ts
│
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Design Principles

| Principle | How it's applied |
|-----------|------------------|
| **Separation of concerns** | UI (`components/`), API (`app/api/`), agent logic (`lib/langgraph/`), LLM config (`lib/llm/`) are isolated |
| **Single source of truth for types** | `src/types/` defines contracts shared by graph nodes, API, and UI |
| **One node per file** | Each LangGraph step is independently testable |
| **Server-only AI code** | All LangGraph/Gemini imports live under `lib/` and are only called from Route Handlers |

---

## Components

### Layout Layer

| Component | Responsibility |
|-----------|----------------|
| `Header` | App title, optional nav, disclaimer ("Not financial advice") |
| `Footer` | Attribution, links, version |

### Research Domain Layer

| Component | Props / State | Responsibility |
|-----------|---------------|----------------|
| `CompanySearchForm` | `onSubmit(companyName)` | Text input + submit; client-side validation |
| `ResearchProgress` | `progress: ResearchProgress` | Step indicator, progress bar, status message |
| `InvestmentScoreCard` | `score: number` | Visual gauge (0–100) with color bands |
| `RecommendationBadge` | `recommendation: Recommendation` | INVEST (green) / HOLD (amber) / DO NOT INVEST (red) |
| `StrengthsRisksPanel` | `analysis: StrengthsRisksAnalysis` | Two-column strengths vs. risks lists |
| `RecentDevelopments` | `analysis: RecentDevelopmentsAnalysis` | Timeline of news with impact badges |
| `DetailedReasoning` | `recommendation: InvestmentRecommendation` | Full reasoning text + key factors |
| `ResearchResults` | `result: ResearchResult` | Orchestrates all result sub-components |

### UI Primitives

Lightweight, unstyled-by-default building blocks (`Button`, `Card`, `Input`, `Badge`, `Spinner`) to keep research components focused on domain logic.

### Page Composition (`app/page.tsx`)

```
Header
  └── CompanySearchForm
  └── ResearchProgress (visible while loading)
  └── ResearchResults (visible on completion)
Footer
```

---

## API Routes

All routes use the **Node.js runtime** (`export const runtime = "nodejs"`) because LangGraph and LangChain require Node APIs.

### `GET /api/health`

| | |
|---|---|
| **Purpose** | Liveness/readiness probe for deployment |
| **Response** | `{ status: "ok", timestamp, version }` |
| **Auth** | None |

### `POST /api/research`

| | |
|---|---|
| **Purpose** | Run full research pipeline; return complete result |
| **Body** | `{ companyName: string }` |
| **Success** | `200 { success: true, data: ResearchResult }` |
| **Errors** | `400` validation, `429` rate limit, `500` agent failure |
| **Timeout** | Configure via `maxDuration` (Vercel Pro: up to 300s) |

**Flow:**
1. Parse & validate body with Zod (`validation.ts`)
2. Call `researchService.run({ companyName })`
3. Service invokes compiled LangGraph
4. Map final graph state → `ResearchResult` DTO
5. Return JSON

### `POST /api/research/stream`

| | |
|---|---|
| **Purpose** | Same pipeline with real-time progress via SSE |
| **Body** | `{ companyName: string }` |
| **Events** | `progress`, `partial`, `complete`, `error` |

**Why two endpoints?** The streaming route improves UX during long Gemini calls; the sync route is simpler for testing, scripts, and CI.

---

## LangGraph Workflow

### Graph Topology

Linear pipeline — each node depends on the previous node's output:

```
START
  │
  ▼
research_company ──────────────────────────► CompanyProfile
  │
  ▼
analyze_strengths_risks ───────────────────► StrengthsRisksAnalysis
  │
  ▼
analyze_developments ──────────────────────► RecentDevelopmentsAnalysis
  │
  ▼
generate_recommendation ───────────────────► InvestmentRecommendation
  │
  ▼
 END
```

### Node Specifications

#### 1. `research_company`

- **Input:** `state.companyInput.companyName`
- **Tools:** `web-search`, `company-lookup`
- **LLM task:** Gather company overview — sector, business model, market position, key metrics
- **Output:** `state.companyProfile`
- **Progress:** `{ step: "researching", progress: 25 }`

#### 2. `analyze_strengths_risks`

- **Input:** `state.companyProfile`
- **LLM task:** Structured analysis of competitive strengths and investment risks
- **Output:** `state.strengthsRisks` (structured JSON via `withStructuredOutput`)
- **Progress:** `{ step: "analyzing_strengths_risks", progress: 50 }`

#### 3. `analyze_developments`

- **Input:** `state.companyProfile`
- **Tools:** `web-search` (recent news query)
- **LLM task:** Summarize last 3–6 months of material developments
- **Output:** `state.recentDevelopments`
- **Progress:** `{ step: "analyzing_developments", progress: 75 }`

#### 4. `generate_recommendation`

- **Input:** `companyProfile`, `strengthsRisks`, `recentDevelopments`
- **LLM task:** Synthesize into score (0–100), recommendation enum, detailed reasoning
- **Output:** `state.recommendation`
- **Progress:** `{ step: "completed", progress: 100 }`

### Graph Builder (`lib/langgraph/graph.ts`)

```typescript
// Pseudocode — to be implemented in Phase 2
const workflow = new StateGraph(ResearchStateAnnotation)
  .addNode("research_company", researchCompanyNode)
  .addNode("analyze_strengths_risks", analyzeStrengthsRisksNode)
  .addNode("analyze_developments", analyzeDevelopmentsNode)
  .addNode("generate_recommendation", generateRecommendationNode)
  .addEdge(START, "research_company")
  .addEdge("research_company", "analyze_strengths_risks")
  .addEdge("analyze_strengths_risks", "analyze_developments")
  .addEdge("analyze_developments", "generate_recommendation")
  .addEdge("generate_recommendation", END);

export const researchGraph = workflow.compile();
```

### Error Handling in Graph

- Each node wraps LLM calls in try/catch
- Failures append to `state.errors[]` and set `progress.step = "error"`
- Optional: conditional edge in `routing.ts` to retry or short-circuit

### Streaming Integration

Use LangGraph's `.stream()` or `.streamEvents()` in `research-service.ts` to emit progress updates as each node completes, forwarded to the client as SSE.

---

## State Design

### LangGraph State (`ResearchGraphState`)

Defined in `src/types/langgraph.ts` using LangGraph's `Annotation` API:

| Channel | Type | Set By | Consumed By |
|---------|------|--------|-------------|
| `companyInput` | `CompanyInput` | API entry | `research_company` |
| `companyProfile` | `CompanyProfile \| null` | `research_company` | analysis nodes |
| `strengthsRisks` | `StrengthsRisksAnalysis \| null` | `analyze_strengths_risks` | `generate_recommendation` |
| `recentDevelopments` | `RecentDevelopmentsAnalysis \| null` | `analyze_developments` | `generate_recommendation` |
| `recommendation` | `InvestmentRecommendation \| null` | `generate_recommendation` | API response mapper |
| `progress` | `ResearchProgress` | every node | SSE stream |
| `errors` | `string[]` | any node on failure | error handler |

**Reducer strategy:**
- Scalar outputs (`companyProfile`, etc.): replace (`(_, next) => next`)
- `errors`: append (`(prev, next) => [...prev, ...next]`)
- `progress`: replace (latest wins)

### Client State (React)

Managed in `useResearchStream` hook:

```typescript
interface ClientResearchState {
  status: "idle" | "loading" | "success" | "error";
  progress: ResearchProgress | null;
  result: ResearchResult | null;
  error: string | null;
}
```

State transitions:

```
idle ──[submit]──► loading ──[SSE complete]──► success
                      │
                      └──[SSE error / fetch fail]──► error
```

No global state library needed — single-page flow with local `useState` is sufficient.

### API ↔ Graph ↔ UI Data Flow

```
CompanyInput (form)
    → ResearchRequest (API body)
        → ResearchGraphState.companyInput (graph entry)
            → ResearchResult (graph exit, assembled from state channels)
                → ResearchResponse.data (API JSON)
                    → ClientResearchState.result (React)
```

---

## Deployment Strategy

### Recommended Platform: **Vercel**

Best fit for Next.js 15 with zero-config App Router support.

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Build command | `npm run build` |
| Output | `.next` (default) |
| Node version | 20.x |
| Runtime | Node.js for `/api/*` routes |

**Environment variables (Vercel dashboard):**
- `GOOGLE_API_KEY` — required
- `SEARCH_API_KEY` — optional, for web search tool

**Function config** (in route files or `vercel.json`):

```json
{
  "functions": {
    "src/app/api/research/route.ts": { "maxDuration": 120 },
    "src/app/api/research/stream/route.ts": { "maxDuration": 120 }
  }
}
```

> Hobby plan limits serverless functions to 10s/60s. For a multi-step LangGraph pipeline, **Vercel Pro** (up to 300s) or an alternative below is recommended.

### Alternative: **Railway / Render / Fly.io**

For longer-running agents or if Vercel timeouts are too restrictive:

1. Deploy Next.js as a **long-running Node server** (`next start`) instead of serverless
2. No `maxDuration` ceiling
3. Set `PORT` env var; Railway/Render auto-detect

### Alternative: **Split Architecture**

If the assignment requires an explicit "Node.js backend":

```
Frontend (Vercel)  ──HTTP──►  Agent API (Railway Express/Fastify)
                                    └── LangGraph + Gemini
```

In this case, move `lib/langgraph/` and `lib/llm/` to a separate `server/` package. The current monolithic Next.js structure is simpler and preferred unless the assignment explicitly demands separation.

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml (Phase 5)
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
```

### Production Checklist

- [ ] `GOOGLE_API_KEY` set in deployment env (never committed)
- [ ] Rate limiting on `/api/research` (e.g., `@upstash/ratelimit` or middleware)
- [ ] Input sanitization via Zod (max company name length)
- [ ] Disclaimer in UI: "AI-generated research, not financial advice"
- [ ] Error boundaries in React for graceful UI failures
- [ ] `/api/health` wired to uptime monitoring
- [ ] Structured logging (node name, latency, token usage) in each graph node

### Local Development

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # static analysis
npm run lint       # ESLint
```

---

## Implementation Phases

| Phase | Scope | Key Files |
|-------|-------|-----------|
| **1** ✅ | Structure + architecture | All folders, types, configs |
| **2** | LangGraph + Gemini | `lib/langgraph/*`, `lib/llm/*`, `lib/tools/*` |
| **3** | API layer | `app/api/*`, `lib/services/research-service.ts` |
| **4** | Frontend UI | `components/*`, `hooks/*`, `app/page.tsx` |
| **5** | Polish + deploy | CI, rate limiting, Vercel config |

---

## Key Dependencies

| Package | Role |
|---------|------|
| `next@15` | Framework + API routes |
| `@langchain/langgraph` | Agent workflow orchestration |
| `@langchain/google-genai` | Gemini chat model |
| `langchain` | Tools, structured output, prompts |
| `zod` | Runtime validation for API + structured LLM output |
