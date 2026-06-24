# AI Investment Research Agent

A Next.js 15 application that uses LangGraph.js and the Gemini API to research companies and generate structured investment recommendations.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers (Node.js runtime)
- **AI:** LangChain.js, LangGraph.js, Google Gemini API

## Quick Start

```bash
cp .env.example .env.local
# Add your GOOGLE_API_KEY

npm install
npm run dev
```

## Documentation

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the full system design.

## Project Status

**Phase 1 (current):** Folder structure and architecture — complete  
**Phase 2:** LangGraph workflow + Gemini integration  
**Phase 3:** API routes + streaming  
**Phase 4:** UI components  
**Phase 5:** Deployment
