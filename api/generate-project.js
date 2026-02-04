// Vercel Serverless Function for AI Project Generation
import { createClient } from '@supabase/supabase-js';

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

    // Get tenant ID from header or request body
    const tenantId = req.headers['x-tenant-id'] || req.body.tenant_id;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    // Verify user has access to this tenant
    const { data: membership, error: membershipError } = await supabase
      .from('tenant_members')
      .select('role')
      .eq('tenant_id', tenantId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return res.status(403).json({ error: 'Access denied to this tenant' });
    }

    // Get request body
    const { 
      prompt, 
      projectType = 'web-app',
      framework = 'react',
      styling = 'tailwind',
      features = []
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Project prompt is required' });
    }

    // Generate project structure and code using AI
    const systemPrompt = `You are VibeDeveloper AI, an expert at generating complete web application projects.
    
    Generate a detailed project structure and implementation for: ${prompt}
    
    Project Requirements:
    - Type: ${projectType}
    - Framework: ${framework}
    - Styling: ${styling}
    - Features: ${features.join(', ')}
    
    Provide a JSON response with:
    {
      "title": "Project Title",
      "description": "Brief description",
      "wireframe_data": {
        "pages": [...],
        "components": [...],
        "navigation": {...}
      },
      "components": {
        "component_name": {
          "code": "component code",
          "props": [...],
          "dependencies": [...]
        }
      },
      "pages": {
        "page_name": {
          "code": "page code",
          "route": "/route",
          "components": [...]
        }
      },
      "package_json": {...},
      "readme": "README content"
    }`;

    // Call OpenAI API
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return res.status(openaiResponse.status).json({ 
        error: 'OpenAI API error',
        details: errorText 
      });
    }

    const aiResponse = await openaiResponse.json();
    const generatedContent = aiResponse.choices[0].message.content;

    // Parse the AI response
    let projectData;
    try {
      projectData = JSON.parse(generatedContent);
    } catch (e) {
      // If JSON parsing fails, create a basic structure
      projectData = {
        title: 'Generated Project',
        description: 'AI-generated project',
        wireframe_data: {},
        components: {},
        pages: {},
        package_json: {},
        readme: generatedContent
      };
    }

    // Save project to database
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        tenant_id: tenantId,
        user_id: user.id,
        created_by: user.email,
        title: projectData.title,
        description: projectData.description,
        prompt: prompt,
        wireframe_data: projectData.wireframe_data,
        components: projectData.components,
        pages: projectData.pages,
        status: 'generated'
      })
      .select()
      .single();

    if (projectError) {
      console.error('Database error:', projectError);
      return res.status(500).json({ error: `Database error: ${projectError.message}` });
    }

    return res.status(200).json({
      project,
      generated_content: projectData,
      usage: aiResponse.usage
    });

  } catch (error) {
    console.error('Error in generate-project:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}