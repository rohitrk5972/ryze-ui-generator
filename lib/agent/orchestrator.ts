/**
 * Agent Orchestrator
 * 
 * This is the main entry point that coordinates the 3-step AI agent pipeline:
 * 1. Planner → Interprets intent, creates structured plan
 * 2. Generator → Converts plan to React code
 * 3. Explainer → Explains decisions in plain English
 * 
 * This file handles:
 * - Sequential agent execution
 * - Error handling and recovery
 * - Validation between steps
 * - Modification vs. fresh generation logic
 */

import { GenerationRequest, AgentResponse, LayoutPlan } from '../types';
import { planLayout, validatePlan, PLANNER_SYSTEM_PROMPT } from './planner';
import { generateCodeFromPlan, validateGeneratedCode, GENERATOR_SYSTEM_PROMPT } from './generator';
import { generateExplanation, EXPLAINER_SYSTEM_PROMPT } from './explainer';

export interface OrchestrationResult {
  success: boolean;
  response?: AgentResponse;
  error?: string;
  step?: 'planner' | 'generator' | 'explainer';
}

/**
 * Main orchestration function
 * Executes the 3-step agent pipeline
 */
export async function orchestrateGeneration(
  request: GenerationRequest
): Promise<OrchestrationResult> {
  try {
    console.log('🎯 Starting agent orchestration...');
    console.log('User Intent:', request.userIntent);
    console.log('Is Modification:', request.isModification);

    // STEP 1: PLANNER
    console.log('\n📋 Step 1: Planning...');
    const plan = await executePlannerStep(request);
    
    // Validate plan
    const planValidation = validatePlan(plan);
    if (!planValidation.valid) {
      return {
        success: false,
        error: `Plan validation failed: ${planValidation.errors.join(', ')}`,
        step: 'planner',
      };
    }
    console.log('✅ Plan valid:', plan.structure);

    // STEP 2: GENERATOR
    console.log('\n⚙️ Step 2: Generating code...');
    const code = generateCodeFromPlan(plan);
    
    // Validate generated code
    const codeValidation = validateGeneratedCode(code.code);
    if (!codeValidation.valid) {
      return {
        success: false,
        error: `Code validation failed: ${codeValidation.errors.join(', ')}`,
        step: 'generator',
      };
    }
    console.log('✅ Code generated, length:', code.code.length);

    // STEP 3: EXPLAINER
    console.log('\n📝 Step 3: Generating explanation...');
    const explanation = generateExplanation(plan, code);
    console.log('✅ Explanation generated');

    // Assemble final response
    const response: AgentResponse = {
      plan,
      code,
      explanation,
      version: Date.now(), // Simple versioning using timestamp
      timestamp: Date.now(),
    };

    console.log('\n✨ Orchestration complete!');

    return {
      success: true,
      response,
    };
  } catch (error) {
    console.error('❌ Orchestration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute Planner Step
 * Calls LLM to interpret intent and create plan
 */
async function executePlannerStep(request: GenerationRequest): Promise<LayoutPlan> {
  const { makeCompletion, parseJSONResponse } = await import('../openai');
  
  // Determine if this is a modification
  const previousPlan = request.previousCode 
    ? extractPlanFromCode(request.previousCode)
    : undefined;

  const userPrompt = buildPlannerPrompt(request, previousPlan);
  
  // Call OpenAI API
  const response = await makeCompletion({
    systemPrompt: PLANNER_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.7,
    maxTokens: 2000,
    responseFormat: 'json',
  });

  // Parse the JSON response
  const plan = parseJSONResponse<LayoutPlan>(response.content);
  
  return plan;
}

/**
 * Build the complete prompt for the planner
 */
function buildPlannerPrompt(
  request: GenerationRequest,
  previousPlan?: LayoutPlan
): string {
  let prompt = request.userIntent;

  if (request.isModification && previousPlan) {
    prompt += `\n\nCONTEXT: This is a modification request. Here's the current plan:\n${JSON.stringify(previousPlan, null, 2)}\n\nPlease make incremental changes to this plan based on the user's request. Do NOT recreate everything from scratch.`;
  }

  // Add conversation history for context
  if (request.conversationHistory.length > 1) {
    prompt += '\n\nRECENT CONVERSATION:\n';
    request.conversationHistory.slice(-3).forEach(msg => {
      prompt += `${msg.role}: ${msg.content}\n`;
    });
  }

  return prompt;
}

/**
 * Extract plan from existing code
 * Used when user wants to modify existing UI
 */
function extractPlanFromCode(code: string): LayoutPlan | undefined {
  // This is a simplified version
  // In production, this would parse the code more robustly
  try {
    // Try to infer structure from code
    let structure: LayoutPlan['structure'] = 'single';
    
    if (code.includes('<Sidebar') && code.includes('<Navbar')) {
      structure = 'dashboard';
    } else if (code.includes('<Sidebar')) {
      structure = 'sidebar-main';
    } else if (code.includes('<Navbar')) {
      structure = 'navbar-content';
    } else if (code.includes('<Modal')) {
      structure = 'modal-overlay';
    }

    return {
      structure,
      components: [], // Would need proper parsing here
      reasoning: 'Extracted from existing code',
    };
  } catch (error) {
    return undefined;
  }
}

/**
 * Validate entire agent response
 */
export function validateAgentResponse(response: AgentResponse): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate plan
  const planValidation = validatePlan(response.plan);
  if (!planValidation.valid) {
    errors.push(...planValidation.errors.map(e => `Plan: ${e}`));
  }

  // Validate code
  const codeValidation = validateGeneratedCode(response.code.code);
  if (!codeValidation.valid) {
    errors.push(...codeValidation.errors.map(e => `Code: ${e}`));
  }

  // Validate explanation exists
  if (!response.explanation.summary) {
    errors.push('Explanation: Missing summary');
  }

  if (response.explanation.decisions.length === 0) {
    errors.push('Explanation: No decisions provided');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get agent system prompts for reference
 */
export function getAgentPrompts() {
  return {
    planner: PLANNER_SYSTEM_PROMPT,
    generator: GENERATOR_SYSTEM_PROMPT,
    explainer: EXPLAINER_SYSTEM_PROMPT,
  };
}
