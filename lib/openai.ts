/**
 * OpenAI API Client
 * 
 * Handles all communication with OpenAI's API
 * Used by the agent orchestrator to make LLM calls
 */

import OpenAI from 'openai';

// Initialize client (API key from environment)
let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    openaiClient = new OpenAI({
      apiKey,
      baseURL: baseURL || 'https://api.openai.com/v1', // Default to OpenAI if not set
    });
  }

  return openaiClient;
}

export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Make a completion request to OpenAI
 */
export async function makeCompletion(request: LLMRequest): Promise<LLMResponse> {
  try {
    const client = getClient();

    const response = await client.chat.completions.create({
      model: 'openai/gpt-4-turbo-preview', // OpenRouter format
      messages: [
        {
          role: 'system',
          content: request.systemPrompt,
        },
        {
          role: 'user',
          content: request.userPrompt,
        },
      ],
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 2000,
      response_format: request.responseFormat === 'json' 
        ? { type: 'json_object' }
        : undefined,
    });

    const content = response.choices[0]?.message?.content ?? '';

    return {
      content,
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(
      error instanceof Error 
        ? `OpenAI API failed: ${error.message}`
        : 'OpenAI API failed with unknown error'
    );
  }
}

/**
 * Make a streaming completion request
 * Useful for real-time UI updates
 */
export async function* makeStreamingCompletion(
  request: LLMRequest
): AsyncGenerator<string, void, unknown> {
  try {
    const client = getClient();

    const stream = await client.chat.completions.create({
      model: 'openai/gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: request.systemPrompt,
        },
        {
          role: 'user',
          content: request.userPrompt,
        },
      ],
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 2000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('OpenAI Streaming Error:', error);
    throw new Error(
      error instanceof Error 
        ? `OpenAI streaming failed: ${error.message}`
        : 'OpenAI streaming failed with unknown error'
    );
  }
}

/**
 * Parse JSON response from LLM
 * Handles cases where LLM adds markdown code blocks
 */
export function parseJSONResponse<T>(content: string): T {
  // Remove markdown code blocks if present
  let cleaned = content.trim();
  
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error}`);
  }
}

/**
 * Check if API key is configured
 */
export function isConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Get usage statistics (mock for now)
 */
export function getUsageStats() {
  return {
    totalRequests: 0,
    totalTokens: 0,
    estimatedCost: 0,
  };
}
