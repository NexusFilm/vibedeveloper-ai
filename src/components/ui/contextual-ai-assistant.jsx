import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageCircle, X, ChevronDown, ChevronUp, Lightbulb, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export function ContextualAIAssistant({ 
  currentStep, 
  projectData, 
  onSuggestionApply,
  className = "" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastContext, setLastContext] = useState('');

  // Generate contextual suggestions when project data changes
  useEffect(() => {
    const contextKey = JSON.stringify({ currentStep, ...projectData });
    if (contextKey !== lastContext && Object.keys(projectData).length > 0) {
      setLastContext(contextKey);
      generateContextualSuggestions();
    }
  }, [currentStep, projectData]);

  const generateContextualSuggestions = async () => {
    setIsLoading(true);
    try {
      const suggestions = await getStepSpecificSuggestions(currentStep, projectData);
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating contextual suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepSpecificSuggestions = async (step, data) => {
    const contextStr = Object.entries(data)
      .filter(([key, value]) => value && value.toString().trim())
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const prompts = {
      1: {
        title: "Define Your Target User",
        prompt: `Based on this partial user profile:
${contextStr}

As an expert business consultant, provide 3 actionable suggestions to help them better define their target user. Focus on:
1. Missing persona details that would be valuable
2. Industry-specific considerations
3. User environment factors that affect app design

Format as JSON array of objects with 'type', 'title', and 'description' fields.`,
        icon: Target
      },
      2: {
        title: "Identify Core Problems",
        prompt: `Based on this user profile:
${contextStr}

As a problem identification expert, provide 3 suggestions to help them better understand and articulate their user's pain points:
1. Specific problem areas to explore
2. Questions to ask to uncover hidden friction
3. Ways to quantify the problem impact

Format as JSON array of objects with 'type', 'title', and 'description' fields.`,
        icon: Lightbulb
      },
      3: {
        title: "Understand Current Solutions",
        prompt: `Based on this problem context:
${contextStr}

As a workflow optimization expert, provide 3 suggestions to help them better understand current solutions:
1. Tools they might be overlooking
2. Workflow inefficiencies to investigate
3. Integration opportunities

Format as JSON array of objects with 'type', 'title', and 'description' fields.`,
        icon: Zap
      },
      4: {
        title: "Design Your Solution",
        prompt: `Based on this complete problem and current state:
${contextStr}

As a product strategy expert, provide 3 suggestions for designing their solution:
1. Core features to prioritize
2. User experience considerations
3. Technical approach recommendations

Format as JSON array of objects with 'type', 'title', and 'description' fields.`,
        icon: Target
      },
      5: {
        title: "Define Success Metrics",
        prompt: `Based on this solution concept:
${contextStr}

As a business metrics expert, provide 3 suggestions for defining and measuring success:
1. Key performance indicators to track
2. User adoption metrics
3. Business impact measurements

Format as JSON array of objects with 'type', 'title', and 'description' fields.`,
        icon: Target
      }
    };

    const stepConfig = prompts[step];
    if (!stepConfig) return [];

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: stepConfig.prompt,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" }
                }
              }
            }
          }
        }
      });

      return {
        title: stepConfig.title,
        icon: stepConfig.icon,
        suggestions: response.suggestions || []
      };
    } catch (error) {
      console.error('Error generating step suggestions:', error);
      return { title: stepConfig.title, icon: stepConfig.icon, suggestions: [] };
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionApply) {
      onSuggestionApply(suggestion);
    }
  };

  const getStepProgress = () => {
    const totalFields = {
      1: ['person_industry', 'person_role', 'person_environment'],
      2: ['problem_description', 'problem_frequency', 'problem_impact'],
      3: ['plan_current_tools', 'plan_workflows'],
      4: ['pivot_solution'],
      5: ['payoff_time_saved', 'payoff_scale', 'payoff_summary']
    };

    const currentFields = totalFields[currentStep] || [];
    const completedFields = currentFields.filter(field => projectData[field]);
    
    return {
      completed: completedFields.length,
      total: currentFields.length,
      percentage: Math.round((completedFields.length / currentFields.length) * 100)
    };
  };

  const progress = getStepProgress();

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-80 shadow-lg border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {suggestions.icon && <suggestions.icon className="w-5 h-5 text-blue-500" />}
                    <CardTitle className="text-sm">{suggestions.title || 'AI Assistant'}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex-1 bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <span>{progress.completed}/{progress.total} complete</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Analyzing your progress...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {suggestions.suggestions?.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.type}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm mt-1">{suggestion.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                      </div>
                    ))}
                    
                    {(!suggestions.suggestions || suggestions.suggestions.length === 0) && (
                      <p className="text-sm text-gray-500 italic">
                        Complete more fields to get personalized suggestions.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-12 h-12 shadow-lg bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5" />
          {suggestions.suggestions?.length > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">
                {suggestions.suggestions.length}
              </span>
            </div>
          )}
        </div>
      </Button>
    </div>
  );
}

export default ContextualAIAssistant;