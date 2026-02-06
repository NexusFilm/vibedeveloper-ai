// Vercel Serverless Function for OpenAI integration
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Optional authentication - some LLM calls happen before login
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      });

      // Verify user is authenticated (non-blocking)
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.warn('Auth check failed, proceeding anyway:', authError.message);
      }
    }

    // Get request body - support both { prompt } and { messages } formats
    const { messages, prompt, model = 'gpt-4o', temperature = 0.7, max_tokens = 2000, response_json_schema } = req.body;

    // Build messages array from either format
    let chatMessages;
    if (messages && Array.isArray(messages)) {
      chatMessages = messages;
    } else if (prompt) {
      chatMessages = [
        { role: 'system', content: 'You are a helpful AI assistant for app development planning.' },
        { role: 'user', content: prompt }
      ];
    } else {
      return res.status(400).json({ error: 'Either "messages" array or "prompt" string is required' });
    }

    // Call OpenAI API
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const openaiBody = {
      model,
      messages: chatMessages,
      temperature,
      max_tokens,
    };

    // Add JSON response format if schema requested
    if (response_json_schema) {
      openaiBody.response_format = { type: 'json_object' };
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openaiBody),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return res.status(openaiResponse.status).json({ 
        error: 'OpenAI API error',
        details: errorText 
      });
    }

    const data = await openaiResponse.json();
    const content = data.choices[0].message.content;

    // If JSON schema was requested, try to parse and return the object
    if (response_json_schema) {
      try {
        const parsed = JSON.parse(content);
        return res.status(200).json(parsed);
      } catch (e) {
        return res.status(200).json({ content, usage: data.usage });
      }
    }

    return res.status(200).json(content);

  } catch (error) {
    console.error('Error in invoke-llm:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
