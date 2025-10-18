import { createServiceSupabase } from '@/lib/supabase-server';

export interface ConversationSession {
  id: string;
  agent_id: string;
  call_sid?: string;
  phone_number?: string;
  status: 'active' | 'ended' | 'paused';
  context: Record<string, any>;
  started_at: string;
  ended_at?: string;
}

export interface ConversationMessage {
  id: string;
  session_id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  audio_url?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export async function createConversationSession({
  agentId,
  callSid,
  phoneNumber,
  context = {}
}: {
  agentId: string;
  callSid?: string;
  phoneNumber?: string;
  context?: Record<string, any>;
}): Promise<ConversationSession> {
  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from('conversation_sessions')
      .insert({
        agent_id: agentId,
        call_sid: callSid,
        phone_number: phoneNumber,
        status: 'active',
        context
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation session:', error);
      throw new Error('Failed to create conversation session');
    }

    return data;
  } catch (error) {
    console.error('createConversationSession error:', error);
    throw error;
  }
}

export async function getConversationSession(sessionId: string): Promise<ConversationSession> {
  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching conversation session:', error);
      throw new Error('Failed to fetch conversation session');
    }

    return data;
  } catch (error) {
    console.error('getConversationSession error:', error);
    throw error;
  }
}

export async function updateConversationSession(
  sessionId: string, 
  updates: Partial<ConversationSession>
): Promise<void> {
  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase
      .from('conversation_sessions')
      .update(updates)
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating conversation session:', error);
      throw new Error('Failed to update conversation session');
    }
  } catch (error) {
    console.error('updateConversationSession error:', error);
    throw error;
  }
}

export async function saveMessage({
  sessionId,
  role,
  content,
  audioUrl,
  metadata = {}
}: {
  sessionId: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  audioUrl?: string;
  metadata?: Record<string, any>;
}): Promise<ConversationMessage> {
  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from('conversation_messages')
      .insert({
        session_id: sessionId,
        role,
        content,
        audio_url: audioUrl,
        metadata
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      throw new Error('Failed to save message');
    }

    return data;
  } catch (error) {
    console.error('saveMessage error:', error);
    throw error;
  }
}

export async function getConversationHistory(sessionId: string): Promise<ConversationMessage[]> {
  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching conversation history:', error);
      throw new Error('Failed to fetch conversation history');
    }

    return data || [];
  } catch (error) {
    console.error('getConversationHistory error:', error);
    throw error;
  }
}

export async function getAgent(agentId: string): Promise<any> {
  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (error) {
      console.error('Error fetching agent:', error);
      throw new Error('Failed to fetch agent');
    }

    return data;
  } catch (error) {
    console.error('getAgent error:', error);
    throw error;
  }
}

export async function endConversationSession(sessionId: string): Promise<void> {
  try {
    await updateConversationSession(sessionId, {
      status: 'ended',
      ended_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('endConversationSession error:', error);
    throw error;
  }
}
