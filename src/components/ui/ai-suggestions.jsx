import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, Plus, Check, RefreshCw, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export function AISuggestions({ 
  fieldName,
  currentValue = '',
  context = {},
  onSuggestionClick,
  onSuggestionAppend,
  suggestionType = 'text', // 'text', 'chips', 'list'
  maxSuggestions = 4,
  autoGenerate = true,
  placeholder = "AI suggestions will appear here...",
  className = ""
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [usedSuggestions, setUsedSuggestions] = useState(new Set());

  // Auto-generate suggestions when context changes
  useEffect(() => {
    if (autoGenerate && Object.keys(context).length > 0 && suggestions.length === 0) {
      generateSuggestions();
    }
  }, [context, autoGenerate]);

  const generateSuggestions = async (regenerate = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldName,
          currentValue,
          context,
          suggestionType,
          maxSuggestions
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const newSuggestions = data.suggestions || [];
      setSuggestions(regenerate ? newSuggestions : [...suggestions, ...newSuggestions]);
      setIsVisible(true);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // Show error message instead of fallback
      setSuggestions([]);
      setIsVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const buildContextualPrompt = (fieldName, currentValue, context, type, maxSuggestions) => {
    const baseContext = Object.entries(context)
      .filter(([key, value]) => value && value.toString().trim())
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const prompts = {
      // Step 1 - Person
      person_industry: `Based on these common business contexts, suggest ${maxSuggestions} specific industry categories that might fit:
${baseContext}

Focus on specific, actionable industries like "Real Estate Brokerage", "Digital Marketing Agency", "Healthcare Practice", etc. Format as JSON array.`,

      person_role: `Based on this industry context:
${baseContext}

Suggest ${maxSuggestions} specific job roles/titles that would commonly face business challenges in this industry. Be specific (e.g., "Sales Manager", "Practice Administrator", "Course Creator"). Format as JSON array.`,

      person_environment: `Based on:
${baseContext}

Suggest ${maxSuggestions} work environment descriptions that would be typical for this role and industry. Include team size and work style (e.g., "Solo consultant working remotely", "Small team of 3-5 in shared office"). Format as JSON array.`,

      // Step 2 - Problem  
      problem_description: `Based on this user profile:
${baseContext}

Generate ${maxSuggestions} specific, common problems or pain points this person likely faces in their daily work. Each should be:
- Concrete and specific (not generic)
- Something that happens regularly
- Frustrating enough to want a solution
- 1-2 sentences max

Format as JSON array of problem descriptions.`,

      problem_frequency: `Based on this problem:
${baseContext}

Suggest ${maxSuggestions} realistic frequency options for how often this problem occurs. Be specific (e.g., "Every client onboarding", "2-3 times per week", "During every project kickoff"). Format as JSON array.`,

      problem_impact: `Based on this problem and frequency:
${baseContext}

Suggest ${maxSuggestions} specific impact statements describing what this problem costs them. Include time, money, stress, or opportunity costs (e.g., "3+ hours of manual work weekly", "Delayed project deliveries", "Client frustration and churn risk"). Format as JSON array.`,

      // Step 3 - Plan
      plan_current_tools: `Based on this problem context:
${baseContext}

Suggest ${maxSuggestions} specific tools or methods they likely use currently to handle this problem. Be realistic and specific (e.g., "Excel spreadsheets with manual formulas", "Email chains with attachments", "Google Calendar with manual reminders"). Format as JSON array.`,

      plan_workflows: `Based on these current tools and problem:
${baseContext}

Generate ${maxSuggestions} realistic workflow descriptions explaining their current process. Each should be 2-3 sentences describing step-by-step what they actually do. Make it specific and relatable. Format as JSON array.`,

      // Step 4 - Pivot
      pivot_solution: `Based on this complete problem context:
${baseContext}

Generate ${maxSuggestions} concise solution approaches for an app that would solve this problem. Each should:
- Address the core problem directly
- Be technically feasible
- Focus on the main value proposition
- Be 2-3 sentences max

Format as JSON array of solution descriptions.`,

      pivot_features: `Based on this solution concept:
${baseContext}

Suggest ${maxSuggestions} specific core features this app should have. Focus on MVP features that directly solve the problem. Be specific (e.g., "Drag-and-drop task scheduler", "Automated client email templates", "Real-time progress dashboard"). Format as JSON array.`,

      // Step 5 - Payoff
      payoff_time_saved: `Based on this solution and current problem:
${baseContext}

Suggest ${maxSuggestions} realistic time savings this app could provide. Be specific and believable (e.g., "2-3 hours per client project", "30 minutes daily on admin tasks", "4 hours weekly on reporting"). Format as JSON array.`,

      payoff_scale: `Based on this solution and time savings:
${baseContext}

Suggest ${maxSuggestions} realistic scale improvements this app could enable. Focus on capacity, efficiency, or growth (e.g., "Handle 50% more clients with same effort", "Reduce project turnaround by 2 days", "Scale to 100+ users without additional staff"). Format as JSON array.`,

      payoff_summary: `Based on this complete solution context:
${baseContext}

Generate ${maxSuggestions} compelling impact statements describing what this app will achieve. Each should be specific, measurable, and focused on business outcomes. Format as JSON array.`
    };

    return prompts[fieldName] || `Generate ${maxSuggestions} helpful suggestions for "${fieldName}" based on: ${baseContext}. Format as JSON array.`;
  };

  const handleSuggestionClick = (suggestion, index) => {
    setUsedSuggestions(prev => new Set([...prev, index]));
    
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else if (onSuggestionAppend) {
      onSuggestionAppend(suggestion);
    }
  };

  const handleAppendSuggestion = (suggestion, index) => {
    setUsedSuggestions(prev => new Set([...prev, index]));
    if (onSuggestionAppend) {
      onSuggestionAppend(suggestion);
    }
  };

  if (!isVisible && suggestions.length === 0 && !isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => generateSuggestions()}
          disabled={isLoading}
          className="text-xs"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Get AI Suggestions
        </Button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={`space-y-2 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">AI Suggestions</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => generateSuggestions(true)}
              disabled={isLoading}
              className="text-xs h-6 px-2"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating suggestions...
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-2">
            {suggestionType === 'chips' ? (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant={usedSuggestions.has(index) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => handleSuggestionClick(suggestion, index)}
                  >
                    {usedSuggestions.has(index) && <Check className="w-3 h-3 mr-1" />}
                    {suggestion}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all hover:shadow-sm border ${
                      usedSuggestions.has(index) 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-gray-700 flex-1">{suggestion}</p>
                        <div className="flex gap-1 flex-shrink-0">
                          {onSuggestionClick && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion, index)}
                              className="h-6 px-2 text-xs"
                            >
                              {usedSuggestions.has(index) ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                'Use'
                              )}
                            </Button>
                          )}
                          {onSuggestionAppend && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAppendSuggestion(suggestion, index)}
                              className="h-6 px-2 text-xs"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {suggestions.length === 0 && !isLoading && (
          <p className="text-sm text-gray-500 italic">{placeholder}</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default AISuggestions;