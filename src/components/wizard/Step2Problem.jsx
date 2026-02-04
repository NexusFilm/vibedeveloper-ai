import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import HelpTooltip from './HelpTooltip';
import { EnhancedSmartTextarea } from '@/components/ui/enhanced-smart-textarea';
import { AISuggestions } from '@/components/ui/ai-suggestions';

const FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Every client interaction', 'Every project', 'Constantly'];
const IMPACTS = ['5+ hours/week', '10+ hours/week', 'Missed opportunities', 'High stress', 'Lost revenue', 'Client dissatisfaction'];

export default function Step2Problem({ projectData, onUpdate, onNext, onBack }) {
  const [formData, setFormData] = React.useState({
    problem_description: projectData.problem_description || '',
    problem_frequency: projectData.problem_frequency || '',
    problem_impact: projectData.problem_impact || ''
  });
  const [suggestions, setSuggestions] = React.useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);

  React.useEffect(() => {
    if (projectData.person_industry && projectData.person_role && !projectData.problem_description) {
      generateSuggestions();
    }
  }, []);

  const generateSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this user persona:
- Industry: ${projectData.person_industry}
- Role: ${projectData.person_role}
- Environment: ${projectData.person_environment}

Generate 3 common, specific problems or friction points they likely face in their daily work. Format as a JSON array of strings. Each problem should be 1-2 sentences, concrete, and relatable.`,
        response_json_schema: {
          type: "object",
          properties: {
            problems: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      setSuggestions(response.problems || []);
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
      problem_description: prev.problem_description 
        ? `${prev.problem_description}\n\n${suggestion}` 
        : suggestion 
    }));
  };

  const handleChipClick = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onNext();
  };

  const isValid = formData.problem_description;

  return (
    <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm transform hover:shadow-3xl transition-shadow duration-300">
      <CardHeader className="pt-10 pb-8 px-10 border-b border-gray-100">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center shadow-lg">
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-1">Identify the PROBLEM</CardTitle>
            <CardDescription className="text-base text-gray-500">What's the real friction or pain point?</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-10 pb-10">
        <form onSubmit={handleSubmit} className="space-y-8 pt-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="problem" className="text-sm font-semibold text-gray-900 tracking-wide uppercase text-xs">What's the specific problem or friction? *</Label>
              <HelpTooltip 
                title="Be Specific About the Problem"
                content="Instead of 'disorganized', describe what disorganization looks like: 'I can't find client emails when they call' or 'I forget to follow up with leads'."
                aiTip="The more concrete and measurable your problem statement, the better the AI can design solutions."
              />
            </div>
            
            {loadingSuggestions && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-900 mb-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is analyzing common challenges for {projectData.person_role}s...
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                  AI Suggestions - Click to add
                </div>
                <div className="space-y-2">
                  {suggestions.map((suggestion, idx) => {
                    const colors = [
                      'from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border-orange-200',
                      'from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200',
                      'from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200'
                    ];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full text-left p-3 bg-gradient-to-r ${colors[idx % colors.length]} border rounded-lg text-sm text-gray-700 transition-all shadow-sm hover:shadow-md`}
                      >
                        {suggestion}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="relative">
              <EnhancedSmartTextarea
                label=""
                fieldName="problem_description"
                value={formData.problem_description}
                onChange={(value) => handleChange('problem_description', value)}
                context={{
                  person_industry: projectData.person_industry,
                  person_role: projectData.person_role,
                  person_environment: projectData.person_environment
                }}
                placeholder="Be specific. Example: 'I spend hours each week manually copying data between spreadsheets and my CRM' or 'I lose track of which clients I haven't followed up with'"
                aiSuggestions={true}
                aiRefinement={true}
                minRows={4}
                className="resize-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <Label htmlFor="frequency" className="text-sm font-semibold text-gray-900 tracking-wide uppercase text-xs">How often does this happen?</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {FREQUENCIES.map(freq => (
                <Badge
                  key={freq}
                  variant={formData.problem_frequency === freq ? "default" : "outline"}
                  className="cursor-pointer hover:bg-orange-100"
                  onClick={() => handleChipClick('problem_frequency', freq)}
                >
                  {freq}
                </Badge>
              ))}
            </div>
            <SmartTextarea
              id="frequency"
              placeholder="Or describe your own..."
              value={formData.problem_frequency}
              onChange={(e) => handleChange('problem_frequency', e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <Label htmlFor="impact" className="text-sm font-semibold text-gray-900 tracking-wide uppercase text-xs">What does this cost you?</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {IMPACTS.map(impact => (
                <Badge
                  key={impact}
                  variant={formData.problem_impact === impact ? "default" : "outline"}
                  className="cursor-pointer hover:bg-orange-100"
                  onClick={() => handleChipClick('problem_impact', impact)}
                >
                  {impact}
                </Badge>
              ))}
            </div>
            <SmartTextarea
              id="impact"
              placeholder="Or describe your own..."
              value={formData.problem_impact}
              onChange={(e) => handleChange('problem_impact', e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
            <Button 
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 py-6 text-base font-semibold rounded-xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1 py-6 text-base font-semibold bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg hover:shadow-xl transition-all"
              disabled={!isValid}
            >
              Next: Current Plan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}