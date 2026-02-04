// Vercel Serverless Function for Stripe Webhooks
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Get raw body for webhook signature verification
    const body = JSON.stringify(req.body);
    
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Initialize Supabase client with service role key for admin operations
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Get customer and subscription details
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const userEmail = session.customer_email;
        const tenantId = session.metadata?.tenant_id;
        const planName = session.metadata?.plan_name;

        if (subscriptionId && tenantId) {
          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Find user by email
          const { data: users } = await supabase
            .from('users')
            .select('id')
            .eq('email', userEmail)
            .eq('tenant_id', tenantId)
            .limit(1);

          if (users && users.length > 0) {
            const userId = users[0].id;

            // Create or update user subscription
            const { error: upsertError } = await supabase
              .from('user_subscriptions')
              .upsert({
                tenant_id: tenantId,
                user_id: userId,
                user_email: userEmail,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                plan_name: planName,
                plan_tier: getPlanTier(planName),
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                projects_limit: getProjectsLimit(planName),
                projects_used: 0
              }, {
                onConflict: 'tenant_id,user_id'
              });

            if (upsertError) {
              console.error('Error upserting subscription:', upsertError);
            }
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        // Update subscription status
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null
          })
          .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
          console.error('Error updating subscription:', updateError);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Mark subscription as canceled
        const { error: cancelError } = await supabase
          .from('user_subscriptions')
          .update({
            status: 'canceled',
            cancel_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        if (cancelError) {
          console.error('Error canceling subscription:', cancelError);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        
        // Update subscription status to active
        if (invoice.subscription) {
          const { error: updateError } = await supabase
            .from('user_subscriptions')
            .update({
              status: 'active'
            })
            .eq('stripe_subscription_id', invoice.subscription);

          if (updateError) {
            console.error('Error updating subscription status:', updateError);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        // Update subscription status to past_due
        if (invoice.subscription) {
          const { error: updateError } = await supabase
            .from('user_subscriptions')
            .update({
              status: 'past_due'
            })
            .eq('stripe_subscription_id', invoice.subscription);

          if (updateError) {
            console.error('Error updating subscription status:', updateError);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Helper functions
function getPlanTier(planName) {
  if (!planName) return 'free';
  
  const name = planName.toLowerCase();
  if (name.includes('enterprise')) return 'enterprise';
  if (name.includes('pro')) return 'pro';
  return 'free';
}

function getProjectsLimit(planName) {
  if (!planName) return 3;
  
  const name = planName.toLowerCase();
  if (name.includes('enterprise')) return 999;
  if (name.includes('pro')) return 50;
  return 3;
}

// Configure the API route to receive raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}