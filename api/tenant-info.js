// Vercel Serverless Function for Tenant Information
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get tenant identifier from query params
    const { domain, slug, subdomain, id } = req.query;
    
    if (!domain && !slug && !subdomain && !id) {
      return res.status(400).json({ error: 'Domain, slug, subdomain, or id is required' });
    }

    // Build query conditions
    let query = supabase
      .from('tenants')
      .select('id, name, slug, domain, subdomain, settings, is_active')
      .eq('is_active', true);

    if (id) {
      query = query.eq('id', id);
    } else if (domain) {
      query = query.eq('domain', domain);
    } else if (subdomain) {
      query = query.eq('subdomain', subdomain);
    } else if (slug) {
      query = query.eq('slug', slug);
    }

    const { data: tenant, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Tenant not found' });
      }
      throw error;
    }

    return res.status(200).json({ tenant });

  } catch (error) {
    console.error('Error in tenant-info:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}