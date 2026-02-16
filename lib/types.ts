/**
 * AI Agent Type Definitions
 * 
 * These types define the structure of data flowing through our 3-step AI agent:
 * 1. Planner → Creates structured plan
 * 2. Generator → Converts plan to code
 * 3. Explainer → Explains decisions
 */

export interface ComponentSelection {
  type: string;
  props: Record<string, any>;
  children?: ComponentSelection[] | string;
}

export interface LayoutPlan {
  structure: 'single' | 'sidebar-main' | 'navbar-content' | 'dashboard' | 'modal-overlay';
  components: ComponentSelection[];
  reasoning: string;
}

export interface GeneratedCode {
  code: string;
  imports: string[];
  valid: boolean;
  errors?: string[];
}

export interface Explanation {
  summary: string;
  decisions: {
    component: string;
    reason: string;
  }[];
  tradeoffs?: string[];
}

export interface AgentResponse {
  plan: LayoutPlan;
  code: GeneratedCode;
  explanation: Explanation;
  version: number;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  agentResponse?: AgentResponse;
  timestamp: number;
}

export interface GenerationRequest {
  userIntent: string;
  conversationHistory: ChatMessage[];
  previousCode?: string;
  isModification: boolean;
}
