import { supabaseAdmin } from '@/lib/supabase-admin';
import { conversations, knowledgeItems, leads, settings } from '@/lib/mock-data';

export async function listKnowledgeItems() {
  const { data, error } = await supabaseAdmin
    .from('knowledge_items')
    .select('id,title,content,category,status,source,created_at,updated_at')
    .order('created_at', { ascending: false });

  if (error || !data) return knowledgeItems;
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    content: item.content,
    keywords: [],
  }));
}

export async function listLeads() {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('id,name,phone,email,interest,source,status,created_at')
    .order('created_at', { ascending: false });

  if (error || !data) return leads;
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    phone: item.phone,
    email: item.email ?? '',
    interest: item.interest ?? '',
    source: item.source,
    status: item.status,
    createdAt: item.created_at,
  }));
}

export async function listConversations() {
  const { data, error } = await supabaseAdmin
    .from('conversations')
    .select('id,session_id,source,status,created_at')
    .order('created_at', { ascending: false });

  if (error || !data) return conversations;
  return data.map((item) => ({
    id: item.id,
    customer: item.session_id,
    source: item.source,
    status: item.status,
    lastMessage: 'Load messages from messages table in next step',
    updatedAt: item.created_at,
  }));
}

export async function getAppSettings() {
  const { data, error } = await supabaseAdmin
    .from('settings')
    .select('company_name,bot_name,welcome_message,fallback_message,handoff_message,notification_email')
    .limit(1)
    .maybeSingle();

  if (error || !data) return settings;
  return {
    companyName: data.company_name,
    botName: data.bot_name,
    welcomeMessage: data.welcome_message,
    fallbackMessage: data.fallback_message,
    handoffMessage: data.handoff_message,
    notificationEmail: data.notification_email ?? '',
  };
}

export async function createLead(input: {
  conversationId?: string | null;
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  source?: string;
}) {
  const payload = {
    conversation_id: input.conversationId ?? null,
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    interest: input.interest ?? null,
    source: input.source ?? 'website',
    status: 'new',
  };

  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert(payload)
    .select('id,name,phone,email,interest,source,status,created_at')
    .single();

  if (error || !data) {
    return {
      id: `mock_${Date.now()}`,
      name: input.name,
      phone: input.phone,
      email: input.email ?? '',
      interest: input.interest ?? '',
      source: input.source ?? 'website',
      status: 'new',
      createdAt: new Date().toISOString(),
      fallback: true,
      error: error?.message,
    };
  }

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email ?? '',
    interest: data.interest ?? '',
    source: data.source,
    status: data.status,
    createdAt: data.created_at,
  };
}
