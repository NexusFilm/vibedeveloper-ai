/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ozzjcuamqslxjcfgtfhj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96empjdWFtcXNseGpjZmd0ZmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNDIyNDUsImV4cCI6MjA4NDgxODI0NX0.7_7R-abUO8xfEYH7_GPwQWP6dmQU9kOs8C-wbFDoO7M';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Tenant context management
let currentTenantId = null;

export const setTenantContext = (tenantId) => {
  currentTenantId = tenantId;
};

export const getTenantContext = () => currentTenantId;

// Get tenant by domain/subdomain
export const getTenantByDomain = async (domain) => {
  const { data, error } = await supabase.rpc('get_tenant_by_domain', { domain_name: domain });
  if (error) throw error;
  return data;
};

// Helper functions for common operations
export const supabaseHelpers = {
  // Auth helpers
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async signInWithOAuth(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/Dashboard`
      }
    });
    if (error) throw error;
    return data;
  },

  // Tenant helpers
  async getUserTenants(userId) {
    const { data, error } = await supabase
      .from('tenant_members')
      .select(`
        tenant_id,
        role,
        tenants (
          id,
          name,
          slug,
          domain,
          subdomain,
          settings
        )
      `)
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async joinTenant(tenantId, userId, role = 'member') {
    const { data, error } = await supabase
      .from('tenant_members')
      .insert([{
        tenant_id: tenantId,
        user_id: userId,
        role
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Database helpers (tenant-aware)
  async createProject(projectData) {
    const user = await this.getCurrentUser();
    const tenantId = getTenantContext();
    
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...projectData,
        tenant_id: tenantId,
        created_by: user.email,
        user_id: user.id
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getProjects(filters = {}) {
    const tenantId = getTenantContext();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    let query = supabase
      .from('projects')
      .select('*')
      .eq('tenant_id', tenantId);

    // Apply filters if provided
    if (filters.created_by) {
      query = query.eq('created_by', filters.created_by);
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    query = query.order('updated_date', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getProjectById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // AI Generation via Vercel API
  async generateProject(prompt, options = {}) {
    const tenantId = getTenantContext();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token;
    
    const response = await fetch('/api/generate-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Tenant-ID': tenantId
      },
      body: JSON.stringify({
        tenant_id: tenantId,
        prompt,
        ...options
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate project');
    }
    
    return await response.json();
  },

  // LLM Integration via Vercel API
  async invokeLLM(payload) {
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token;
    
    const response = await fetch('/api/invoke-llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to invoke LLM');
    }
    
    return await response.json();
  },

  // AI Suggestions via Vercel API
  async generateAISuggestions(fieldName, currentValue = '', context = {}, options = {}) {
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token;
    
    const response = await fetch('/api/ai-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fieldName,
        currentValue,
        context,
        suggestionType: options.suggestionType || 'text',
        maxSuggestions: options.maxSuggestions || 4
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate AI suggestions');
    }
    
    return await response.json();
  },

  // Stripe checkout via Vercel API
  async createCheckoutSession(priceId, planName) {
    const tenantId = getTenantContext();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token;
    
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Tenant-ID': tenantId
      },
      body: JSON.stringify({
        priceId,
        tenantId,
        planName
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }
    
    return await response.json();
  },

  // User subscription helpers
  async getUserSubscription(userEmail) {
    const tenantId = getTenantContext();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_email', userEmail)
      .eq('tenant_id', tenantId)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data;
  },

  // Template helpers
  async getTemplates() {
    const tenantId = getTenantContext();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name');
    if (error) throw error;
    return data;
  },

  // Example projects
  async getExampleProjects() {
    const tenantId = getTenantContext();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const { data, error } = await supabase
      .from('example_projects')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('title');
    if (error) throw error;
    return data;
  },

  // Pricing plans
  async getPricingPlans() {
    const tenantId = getTenantContext();
    if (!tenantId) {
      throw new Error('No tenant context set');
    }

    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data;
  }
};
