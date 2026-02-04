import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ozzjcuamqslxjcfgtfhj.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Tenant-ID');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fieldName, currentValue, context, suggestionType = 'text', maxSuggestions = 4 } = req.body;

    if (!fieldName) {
      return res.status(400).json({ error: 'fieldName is required' });
    }

    // Build contextual prompt
    const contextStr = Object.entries(context || {})
      .filter(([key, value]) => value && value.toString().trim())
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const prompt = buildPromptForField(fieldName, currentValue, contextStr, suggestionType, maxSuggestions);

    // Call OpenAI API (or your preferred LLM)
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business consultant helping users build better app specifications. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse JSON response
    let suggestions;
    try {
      const parsed = JSON.parse(content);
      suggestions = parsed.suggestions || [];
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    return res.status(200).json({ suggestions });

  } catch (error) {
    console.error('AI Suggestions API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate suggestions',
      details: error.message 
    });
  }
}

function buildPromptForField(fieldName, currentValue, contextStr, suggestionType, maxSuggestions) {
  const prompts = {
    // Step 1 - Person
    person_industry: `Based on common business contexts, suggest ${maxSuggestions} specific industry categories. Focus on specific, actionable industries like "Real Estate Brokerage", "Digital Marketing Agency", "Healthcare Practice", etc. Format as JSON array: {"suggestions": ["industry1", "industry2", ...]}`,

    person_role: `Based on this industry context:
${contextStr}

Suggest ${maxSuggestions} specific job roles/titles that would commonly face business challenges in this industry. Be specific (e.g., "Sales Manager", "Practice Administrator", "Course Creator"). Format as JSON array: {"suggestions": ["role1", "role2", ...]}`,

    person_environment: `Based on:
${contextStr}

Suggest ${maxSuggestions} work environment descriptions that would be typical for this role and industry. Include team size and work style (e.g., "Solo consultant working remotely", "Small team of 3-5 in shared office"). Format as JSON array: {"suggestions": ["env1", "env2", ...]}`,

    // Step 2 - Problem  
    problem_description: `Based on this user profile:
${contextStr}

Generate ${maxSuggestions} specific, common problems or pain points this person likely faces in their daily work. Each should be:
- Concrete and specific (not generic)
- Something that happens regularly
- Frustrating enough to want a solution
- 1-2 sentences max

Format as JSON array: {"suggestions": ["problem1", "problem2", ...]}`,

    problem_frequency: `Based on this problem:
${contextStr}

Suggest ${maxSuggestions} realistic frequency options for how often this problem occurs. Be specific (e.g., "Every client onboarding", "2-3 times per week", "During every project kickoff"). Format as JSON array: {"suggestions": ["freq1", "freq2", ...]}`,

    problem_impact: `Based on this problem and frequency:
${contextStr}

Suggest ${maxSuggestions} specific impact statements describing what this problem costs them. Include time, money, stress, or opportunity costs (e.g., "3+ hours of manual work weekly", "Delayed project deliveries", "Client frustration and churn risk"). Format as JSON array: {"suggestions": ["impact1", "impact2", ...]}`,

    // Step 3 - Plan
    plan_current_tools: `Based on this problem context:
${contextStr}

Suggest ${maxSuggestions} specific tools or methods they likely use currently to handle this problem. Be realistic and specific (e.g., "Excel spreadsheets with manual formulas", "Email chains with attachments", "Google Calendar with manual reminders"). Format as JSON array: {"suggestions": ["tool1", "tool2", ...]}`,

    plan_workflows: `Based on these current tools and problem:
${contextStr}

Generate ${maxSuggestions} realistic workflow descriptions explaining their current process. Each should be 2-3 sentences describing step-by-step what they actually do. Make it specific and relatable. Format as JSON array: {"suggestions": ["workflow1", "workflow2", ...]}`,

    // Step 4 - Pivot
    pivot_solution: `Based on this complete problem context:
${contextStr}

Generate ${maxSuggestions} concise solution approaches for an app that would solve this problem. Each should:
- Address the core problem directly
- Be technically feasible
- Focus on the main value proposition
- Be 2-3 sentences max

Format as JSON array: {"suggestions": ["solution1", "solution2", ...]}`,

    // Step 5 - Payoff
    payoff_time_saved: `Based on this solution and current problem:
${contextStr}

Suggest ${maxSuggestions} realistic time savings this app could provide. Be specific and believable (e.g., "2-3 hours per client project", "30 minutes daily on admin tasks", "4 hours weekly on reporting"). Format as JSON array: {"suggestions": ["time1", "time2", ...]}`,

    payoff_scale: `Based on this solution and time savings:
${contextStr}

Suggest ${maxSuggestions} realistic scale improvements this app could enable. Focus on capacity, efficiency, or growth (e.g., "Handle 50% more clients with same effort", "Reduce project turnaround by 2 days", "Scale to 100+ users without additional staff"). Format as JSON array: {"suggestions": ["scale1", "scale2", ...]}`,

    payoff_summary: `Based on this complete solution context:
${contextStr}

Generate ${maxSuggestions} compelling impact statements describing what this app will achieve. Each should be specific, measurable, and focused on business outcomes. Format as JSON array: {"suggestions": ["impact1", "impact2", ...]}`
  };

  return prompts[fieldName] || `Generate ${maxSuggestions} helpful suggestions for "${fieldName}" based on: ${contextStr}. Format as JSON array: {"suggestions": ["suggestion1", "suggestion2", ...]}`;
}