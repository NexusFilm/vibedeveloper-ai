import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

  // Database helpers
  async createProject(projectData) {
    const user = await this.getCurrentUser();
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...projectData,
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

  async getProjects(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_date', { ascending: false });
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

  // LLM Integration via Vercel Serverless Function
  async invokeLLM(payload) {
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token;
    
    const response = await fetch('/api/invoke-llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to invoke LLM');
    }
    
    return await response.json();
  },

  // User subscription helpers
  async getUserSubscription(userEmail) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_email', userEmail)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data;
  },

  // Template helpers
  async getTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  },

  // Example projects
  async getExampleProjects() {
    const { data, error } = await supabase
      .from('example_projects')
      .select('*')
      .order('title');
    if (error) throw error;
    return data;
  }
};
