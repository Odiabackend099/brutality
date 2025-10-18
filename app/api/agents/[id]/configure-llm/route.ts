import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabase-server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    const body = await request.json();
    const { 
      llm_provider, 
      llm_model, 
      llm_temperature, 
      llm_max_tokens, 
      system_prompt 
    } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    if (llm_provider && llm_provider !== 'groq') {
      return NextResponse.json(
        { error: 'Only Groq LLM provider is supported' },
        { status: 400 }
      );
    }

    // Update agent LLM configuration
    const updateData: any = {};
    if (llm_provider) updateData.llm_provider = llm_provider;
    if (llm_model) updateData.llm_model = llm_model;
    if (llm_temperature !== undefined) updateData.llm_temperature = llm_temperature;
    if (llm_max_tokens !== undefined) updateData.llm_max_tokens = llm_max_tokens;
    if (system_prompt !== undefined) updateData.system_prompt = system_prompt;

    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', agentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating agent LLM config:', error);
      return NextResponse.json(
        { error: 'Failed to update agent LLM configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      agent: data,
      message: 'LLM configuration updated successfully'
    });
  } catch (error) {
    console.error('Error in configure-llm:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
