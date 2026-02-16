/**
 * API Route: /api/generate
 * 
 * Main endpoint for UI generation
 * Handles both fresh generation and iterative modifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { orchestrateGeneration } from '@/lib/agent/orchestrator';
import { GenerationRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    const generationRequest: GenerationRequest = {
      userIntent: body.userIntent,
      conversationHistory: body.conversationHistory || [],
      previousCode: body.previousCode,
      isModification: body.isModification || false,
    };

    // Validate request
    if (!generationRequest.userIntent) {
      return NextResponse.json(
        { error: 'userIntent is required' },
        { status: 400 }
      );
    }

    // Execute agent pipeline
    console.log('📨 Received generation request');
    const result = await orchestrateGeneration(generationRequest);

    if (!result.success) {
      console.error('❌ Generation failed:', result.error);
      return NextResponse.json(
        { 
          error: result.error || 'Generation failed',
          step: result.step,
        },
        { status: 500 }
      );
    }

    console.log('✅ Generation successful');
    
    // Return successful response
    return NextResponse.json({
      success: true,
      data: result.response,
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
