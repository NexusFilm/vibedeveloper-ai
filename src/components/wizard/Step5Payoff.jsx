import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SmartTextarea } from "@/components/ui/smart-textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, ArrowLeft, Loader2, Sparkles, X, AlertCircle } from "lucide-react";
import PromptRefiner from './PromptRefiner';
import { base44 } from '@/api/base44Client';

const TIME_SAVED = ['2-5 hours/week', '5-10 hours/week', '10+ hours/week', '1 hour/day', '2+ hours/day'];
const SCALE = ['2x capacity', '3x capacity', '5x more clients', '10x more projects', '100+ more users'];

export default function Step5Payoff({ projectData, onUpdate, onComplete, onBack, isGenerating }) {
  const [formData, setFormData] = React.useState({
    payoff_time_saved: projectData.payoff_time_saved || '',
    payoff_scale: projectData.payoff_scale || '',
    payoff_summary: projectData.payoff_summary || ''
  });
  const [impactSuggestions, setImpactSuggestions] = React.useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
  const [saveError, setSaveError] = React.useState(null);

  React.useEffect(() => {
    if (projectData.pivot_solution && !projectData.payoff_summary) {
      generateSuggestions();
    }
  }, []);

  const generateSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on:
- Problem: ${projectData.problem_description}
- Solution: ${projectData.pivot_solution}
- Current Tools: ${projectData.plan_current_tools}

Generate 3 specific, measurable impact statements for what this app will achieve. Focus on time saved, efficiency gains, or business outcomes. Each should be 1 sentence. Format as JSON array of strings.`,
        response_json_schema: {
          type: "object",
          properties: {
            impacts: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      setImpactSuggestions(response.impacts || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImpactClick = (impact) => {
    setFormData(prev => ({ 
      ...prev, 
      payoff_summary: prev.payoff_summary 
        ? `${prev.payoff_summary}\n\n${impact}` 
        : impact 
    }));
  };

  const handleChipClick = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveError(null);
    onUpdate(formData);
    onComplete(formData);
  };

  const isValid = formData.payoff_time_saved || formData.payoff_summary;

  return (
    <Card className="max-w-3xl mx-auto bg-card border border-border shadow-lg rounded-2xl transition-all duration-300">
      <CardHeader className="pt-10 pb-8 px-10 border-b border-border">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-semibold text-foreground mb-1">Define the PAYOFF</CardTitle>
            <CardDescription className="text-base text-muted-foreground">What changes once this app exists?</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-10 pb-10">
        <form onSubmit={handleSubmit} className="space-y-8 pt-8">
          <div className="space-y-2">
            <Label htmlFor="time">How much time will this save?</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {TIME_SAVED.map(time => (
                <Badge
                  key={time}
                  variant={formData.payoff_time_saved === time ? "default" : "outline"}
                  className="cursor-pointer hover:bg-indigo-100"
                  onClick={() => handleChipClick('payoff_time_saved', time)}
                >
                  {time}
                </Badge>
              ))}
            </div>
            <Input
              id="time"
              placeholder="Or type your own..."
              value={formData.payoff_time_saved}
              onChange={(e) => handleChange('payoff_time_saved', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scale">What scale does this unlock?</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {SCALE.map(scale => (
                <Badge
                  key={scale}
                  variant={formData.payoff_scale === scale ? "default" : "outline"}
                  className="cursor-pointer hover:bg-indigo-100"
                  onClick={() => handleChipClick('payoff_scale', scale)}
                >
                  {scale}
                </Badge>
              ))}
            </div>
            <Input
              id="scale"
              placeholder="Or type your own..."
              value={formData.payoff_scale}
              onChange={(e) => handleChange('payoff_scale', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">What's the overall impact?</Label>
            
            {saveError && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Save error - but your data is safe</p>
                  <p className="text-red-700 text-xs mt-1">{saveError}</p>
                  <p className="text-red-700 text-xs mt-2">Your progress is saved locally. Click Generate to continue.</p>
                </div>
              </div>
            )}
            
            {loadingSuggestions && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-900 mb-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is calculating potential impact metrics...
              </div>
            )}

            {impactSuggestions.length > 0 && (
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                  Projected Impact - Click to add
                </div>
                <div className="space-y-2">
                  {impactSuggestions.map((impact, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleImpactClick(impact)}
                      className="w-full text-left p-3 bg-gradient-to-r from-yellow-50 to-blue-50 hover:from-yellow-100 hover:to-blue-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-all"
                    >
                      {impact}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              <SmartTextarea
                id="summary"
                placeholder="Describe success. What will you be able to do that you can't do now? How will you measure impact?"
                value={formData.payoff_summary}
                onChange={(e) => handleChange('payoff_summary', e.target.value)}
                rows={4}
                className="resize-none pr-10"
              />
              {formData.payoff_summary && (
                <button
                  type="button"
                  onClick={() => handleChange('payoff_summary', '')}
                  className="absolute top-2 right-2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
            
            <PromptRefiner 
              value={formData.payoff_summary}
              onAccept={(refined) => handleChange('payoff_summary', refined)}
              context={`Solution: ${projectData.pivot_solution}. Time saved: ${formData.payoff_time_saved}`}
              fieldName="Impact Summary"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 py-6 text-base font-medium rounded-xl"
              disabled={isGenerating}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1 py-6 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-sm transition-all"
              disabled={!isValid || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Prompt...
                </>
              ) : (
                'Generate Build Prompt ✨'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}