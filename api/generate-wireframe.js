import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId, authToken } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('created_by', user.email)
      .single();

    if (projectError || !project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Generate wireframe structure using OpenAI
    const wireframePrompt = `You are a UX/UI expert. Based on this app specification, generate a detailed wireframe structure in JSON format.

PROJECT DETAILS:
- Industry: ${project.person_industry}
- Role: ${project.person_role}
- Problem: ${project.problem_description}
- Solution: ${project.pivot_solution}
- Visual Style: ${project.person_visual || 'Modern and clean'}
- Tone: ${project.person_tone || 'Professional'}

Generate a wireframe with these sections:
1. Header/Navigation
2. Main content areas (3-5 sections)
3. Key features/components
4. Data displays
5. Action buttons/CTAs

Return JSON with this structure:
{
  "appName": "string",
  "tagline": "string",
  "colorScheme": { "primary": "hex", "secondary": "hex", "accent": "hex" },
  "layout": {
    "header": {
      "logo": "string",
      "navigation": ["item1", "item2", ...]
    },
    "hero": {
      "headline": "string",
      "subheadline": "string",
      "cta": "string"
    },
    "sections": [
      {
        "title": "string",
        "type": "dashboard|form|list|grid|detail",
        "description": "string",
        "components": ["component1", "component2", ...]
      }
    ],
    "sidebar": {
      "items": ["item1", "item2", ...]
    }
  },
  "keyFeatures": [
    {
      "name": "string",
      "description": "string",
      "icon": "string"
    }
  ],
  "dataModels": [
    {
      "name": "string",
      "fields": ["field1", "field2", ...]
    }
  ]
}

Make it specific to their industry and problem. Be creative but practical.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a UX/UI expert who creates detailed, practical wireframe specifications for web applications.'
        },
        {
          role: 'user',
          content: wireframePrompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const wireframeData = JSON.parse(completion.choices[0].message.content);

    // Save wireframe to project
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        wireframe_data: wireframeData,
        wireframe_generated_at: new Date().toISOString()
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('Error saving wireframe:', updateError);
      return res.status(500).json({ error: 'Failed to save wireframe' });
    }

    return res.status(200).json({
      success: true,
      wireframe: wireframeData
    });

  } catch (error) {
    console.error('Wireframe generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate wireframe',
      details: error.message 
    });
  }
}
