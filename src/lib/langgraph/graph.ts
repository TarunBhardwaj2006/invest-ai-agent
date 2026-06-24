import { END, START, StateGraph } from "@langchain/langgraph";
import { ResearchStateAnnotation } from "@/types/langgraph";
import {
  financialHealthNode,
  investmentDecisionNode,
  newsSentimentNode,
  researchCompanyNode,
  riskAssessmentNode,
} from "./nodes";

let compiledGraph: ReturnType<typeof buildResearchGraph> | null = null;

function buildResearchGraph() {
  const workflow = new StateGraph(ResearchStateAnnotation)
    .addNode("research_company", researchCompanyNode)
    .addNode("financial_health", financialHealthNode)
    .addNode("news_sentiment", newsSentimentNode)
    .addNode("risk_assessment", riskAssessmentNode)
    .addNode("investment_decision", investmentDecisionNode)
    .addEdge(START, "research_company")
    .addEdge("research_company", "financial_health")
    .addEdge("financial_health", "news_sentiment")
    .addEdge("news_sentiment", "risk_assessment")
    .addEdge("risk_assessment", "investment_decision")
    .addEdge("investment_decision", END);

  return workflow.compile();
}

export function getResearchGraph() {
  if (!compiledGraph) {
    compiledGraph = buildResearchGraph();
  }

  return compiledGraph;
}

export function resetResearchGraph(): void {
  compiledGraph = null;
}
