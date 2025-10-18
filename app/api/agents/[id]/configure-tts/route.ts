import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabase-server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    const body = await request.json();
    const { tts_provider, tts_voice_id, greeting_message } = body;

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    if (tts_provider && tts_provider !== 'odiadev') {
      return NextResponse.json(
        { error: 'Only ODIADEV TTS provider is supported' },
        { status: 400 }
      );
    }

    // Update agent TTS configuration
    const updateData: any = {};
    if (tts_provider) updateData.tts_provider = tts_provider;
    if (tts_voice_id) updateData.tts_voice_id = tts_voice_id;
    if (greeting_message) updateData.greeting_message = greeting_message;

    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', agentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating agent TTS config:', error);
      return NextResponse.json(
        { error: 'Failed to update agent TTS configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      agent: data,
      message: 'TTS configuration updated successfully'
    });
  } catch (error) {
    console.error('Error in configure-tts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
