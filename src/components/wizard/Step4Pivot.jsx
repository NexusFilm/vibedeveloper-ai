import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SmartTextarea } from "@/components/ui/smart-textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight, ArrowLeft, Sparkles, Loader2, X } from "lucide-react";
import HelpTooltip from './HelpTooltip';
import PromptRefiner from './PromptRefiner';
import { base44 } from '@/api/base44Client';

export default function Step4Pivot({ projectData, onUpdate, onNext, onBack }) {
  const [formData, setFormData] = React.useState({
    pivot_solution: projectData.pivot_solution || ''
  });
  const [suggestions, setSuggestions] = React.useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);

  React.useEffect(() => {
    if (projectData.problem_description && projectData.plan_current_tools && !projectData.pivot_solution) {
      generateSuggestions();
    }
  }, []);

  const generateSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on:
- Problem: ${projectData.problem_description}
- Current Tools: ${projectData.plan_current_tools}
- Role: ${projectData.person_role}

Generate 2 concise solution approaches for an app that would solve this problem. Each should be 2-3 sentences focusing on the core value proposition. Format as JSON array of strings.`,
        response_json_schema: {
          type: "object",
          properties: {
            solutions: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      setSuggestions(response.solutions || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({ 
      ...prev,
      pivot_solution: prev.pivot_solution 
        ? `${prev.pivot_solution}\n\n${suggestion}` 
        : suggestion 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onNext();
  };

  const isValid = formData.pivot_solution;

  return (
    <Card className="max-w-3xl mx-auto bg-card border border-border shadow-lg rounded-2xl transition-all duration-300">
      <CardHeader className="pt-10 pb-8 px-10 border-b border-border">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-semibold text-foreground mb-1">Design the PIVOT</CardTitle>
            <CardDescription className="text-base text-muted-foreground">What's the solution you want to build?</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-10 pb-10">
        <form onSubmit={handleSubmit} className="space-y-8 pt-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="solution" className="text-sm font-semibold text-gray-900 tracking-wide uppercase text-xs">Describe your app solution *</Label>
              <HelpTooltip 
                title="Focus on Core Value"
                content="Describe what the app does, not how. Focus on outcomes: 'Automatically tracks follow-ups' rather than 'Has a calendar with reminders'."
                aiTip="Start with the main action verb: 'Helps me...', 'Tracks...', 'Automates...' - this keeps it user-focused."
              />
            </div>
            
            {loadingSuggestions && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-900 mb-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is crafting solution ideas based on your context...
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                  AI Solution Ideas - Click to use
                </div>
                <div className="space-y-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 bg-gradient-to-r from-yellow-50 to-blue-50 hover:from-yellow-100 hover:to-blue-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              <SmartTextarea
                id="solution"
                placeholder="What will this app do? Focus on the core functionality. Example: 'A lightweight CRM that auto-populates client contact info, tracks follow-up dates, stores property photos by client, and sends daily digest emails of who to contact today.'"
                value={formData.pivot_solution}
                onChange={(e) => handleChange('pivot_solution', e.target.value)}
                rows={6}
                required
                className="resize-none pr-10"
              />
              {formData.pivot_solution && (
                <button
                  type="button"
                  onClick={() => handleChange('pivot_solution', '')}
                  className="absolute top-2 right-2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
            
            <PromptRefiner 
              value={formData.pivot_solution}
              onAccept={(refined) => handleChange('pivot_solution', refined)}
              context={`Problem: ${projectData.problem_description}. Current tools: ${projectData.plan_current_tools}`}
              fieldName="Solution Description"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Keep it focused. The AI will help define specific features, data models, and UI direction in the next step based on everything you've shared.
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 py-6 text-base font-medium rounded-xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1 py-6 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-sm transition-all"
              disabled={!isValid}
            >
              Next: Define the Payoff <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}