// Vercel Serverless Function for Stripe Checkout
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Tenant-ID'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication using Supabase
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get request body
    const { priceId, tenantId, planName } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // If tenantId is provided, verify user has access to this tenant
    if (tenantId) {
      const { data: membership, error: membershipError } = await supabase
        .from('tenant_members')
        .select('role')
        .eq('tenant_id', tenantId)
        .eq('user_id', user.id)
        .single();

      if (membershipError || !membership) {
        return res.status(403).json({ error: 'Access denied to this tenant' });
      }

      // Get the pricing plan details if tenant-specific
      const { data: pricingPlan } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('tenant_id', tenantId)
        .or(`stripe_price_id_monthly.eq.${priceId},stripe_price_id_yearly.eq.${priceId}`)
        .single();

      if (!pricingPlan) {
        return res.status(400).json({ error: 'Invalid pricing plan for this tenant' });
      }
    }

    // Get origin for redirect URLs
    const origin = req.headers.origin || req.headers.referer || 'https://vibedeveloperai.vercel.app';

    // Create Stripe checkout session
    const sessionData = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: priceId.includes('subscription') || planName ? 'subscription' : 'payment',
      success_url: `${origin}/Dashboard?payment=success`,
      cancel_url: `${origin}/Pricing?payment=cancelled`,
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        user_email: user.email || '',
      },
    };

    // Add tenant-specific metadata if provided
    if (tenantId) {
      sessionData.metadata.tenant_id = tenantId;
      sessionData.metadata.plan_name = planName;
      
      if (sessionData.mode === 'subscription') {
        sessionData.subscription_data = {
          metadata: {
            tenant_id: tenantId,
            user_id: user.id,
            plan_name: planName,
          },
        };
      }
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    return res.status(200).json({ 
      url: session.url,
      session_id: session.id 
    });

  } catch (error) {
    console.error('Error in create-checkout:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
