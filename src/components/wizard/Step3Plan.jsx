import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SmartTextarea } from "@/components/ui/smart-textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, ArrowLeft, Sparkles, Loader2, X, Plus, Check } from "lucide-react";
import { base44 } from '@/api/base44Client';

const TOOLS = ['Google Sheets', 'Excel', 'Email', 'Sticky Notes', 'CRM', 'Notion', 'Trello', 'Shared Docs', 'Calendar', 'Manual tracking'];

export default function Step3Plan({ projectData, onUpdate, onNext, onBack }) {
  const [formData, setFormData] = React.useState({
    plan_current_tools: projectData.plan_current_tools || '',
    plan_workflows: projectData.plan_workflows || ''
  });
  const [toolSuggestions, setToolSuggestions] = React.useState([]);
  const [workflowSuggestions, setWorkflowSuggestions] = React.useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
  const [loadingWorkflowSuggestions, setLoadingWorkflowSuggestions] = React.useState(false);
  const [selectedTools, setSelectedTools] = React.useState([]);

  React.useEffect(() => {
    if (projectData.person_industry && projectData.problem_description) {
      if (!projectData.plan_current_tools) {
        generateSuggestions();
      }
      if (!projectData.plan_workflows && formData.plan_current_tools) {
        generateWorkflowSuggestions();
      }
    }
  }, [formData.plan_current_tools]);

  const generateSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on:
- Industry: ${projectData.person_industry}
- Role: ${projectData.person_role}
- Problem: ${projectData.problem_description}

Generate 4 common tools or methods they likely use currently to deal with this problem. Be specific and realistic (e.g., "Excel spreadsheets", "Email chains", "Google Calendar", "Paper notes"). Format as a JSON array of strings.`,
        response_json_schema: {
          type: "object",
          properties: {
            tools: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      setToolSuggestions(response.tools || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const generateWorkflowSuggestions = async () => {
    if (!formData.plan_current_tools) return;
    
    setLoadingWorkflowSuggestions(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on:
- Problem: ${projectData.problem_description}
- Current Tools: ${formData.plan_current_tools}
- Role: ${projectData.person_role}

Generate 2 realistic workflow descriptions explaining how they currently handle this problem using these tools. Each should be 2-3 sentences describing step-by-step what they actually do. Make it specific and relatable. Format as JSON array of strings.`,
        response_json_schema: {
          type: "object",
          properties: {
            workflows: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      setWorkflowSuggestions(response.workflows || []);
    } catch (error) {
      console.error('Error generating workflow suggestions:', error);
    } finally {
      setLoadingWorkflowSuggestions(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWorkflowClick = (workflow) => {
    setFormData(prev => ({ 
      ...prev, 
      plan_workflows: prev.plan_workflows 
        ? `${prev.plan_workflows}\n\n${workflow}` 
        : workflow 
    }));
  };

  const handleToolClick = (tool) => {
    const newTools = selectedTools.includes(tool)
      ? selectedTools.filter(t => t !== tool)
      : [...selectedTools, tool];
    setSelectedTools(newTools);
    setFormData(prev => ({ ...prev, plan_current_tools: newTools.join(', ') }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onNext();
  };

  const isValid = formData.plan_current_tools;

  return (
    <Card className="max-w-3xl mx-auto bg-card border border-border shadow-lg rounded-2xl transition-all duration-300">
      <CardHeader className="pt-10 pb-8 px-10 border-b border-border">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-semibold text-foreground mb-1">Understand the PLAN</CardTitle>
            <CardDescription className="text-base text-muted-foreground">How are you currently handling this?</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-10 pb-10">
        <form onSubmit={handleSubmit} className="space-y-8 pt-8">
          <div className="space-y-2">
            <Label htmlFor="tools">What tools or methods do you currently use? *</Label>
            
            {loadingSuggestions && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-900 mb-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is analyzing typical workflows for this problem...
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-2">
              {toolSuggestions.length > 0 && (
                <>
                  <div className="w-full flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                    AI Detected Common Tools
                  </div>
                  {toolSuggestions.map(tool => {
                    const isSelected = selectedTools.includes(tool) || formData.plan_current_tools.includes(tool);
                    return (
                      <Badge
                        key={tool}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-gradient-to-r from-yellow-500 to-blue-600 text-white border-transparent' 
                            : 'bg-gradient-to-r from-yellow-50 to-blue-50 hover:from-yellow-100 hover:to-blue-100 border-gray-200'
                        }`}
                        onClick={() => handleToolClick(tool)}
                      >
                        {tool}
                      </Badge>
                    );
                  })}
                </>
              )}
              
              {TOOLS.map(tool => (
                <Badge
                  key={tool}
                  variant={selectedTools.includes(tool) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-purple-100"
                  onClick={() => handleToolClick(tool)}
                >
                  {tool}
                </Badge>
              ))}
            </div>
            <div className="relative">
              <SmartTextarea
                id="tools"
                placeholder="Selected or type your own..."
                value={formData.plan_current_tools}
                onChange={(e) => handleChange('plan_current_tools', e.target.value)}
                rows={2}
                required
                className="resize-none pr-10"
              />
              {formData.plan_current_tools && (
                <button
                  type="button"
                  onClick={() => handleChange('plan_current_tools', '')}
                  className="absolute top-2 right-2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workflows">What's your current workflow or workaround?</Label>
            
            {loadingWorkflowSuggestions && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-900 mb-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is mapping your typical workflow...
              </div>
            )}

            {workflowSuggestions.length > 0 && (
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                  AI-Suggested Workflows
                </div>
                <div className="space-y-2">
                  {workflowSuggestions.map((workflow, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all"
                    >
                      <p className="text-sm text-gray-700 mb-3">{workflow}</p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleWorkflowClick(workflow)}
                          className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add to Workflow
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              <SmartTextarea
                id="workflows"
                placeholder="Walk through what you actually do step-by-step. What's 'working enough' but inefficient?"
                value={formData.plan_workflows}
                onChange={(e) => handleChange('plan_workflows', e.target.value)}
                rows={4}
                className="resize-none pr-10"
              />
              {formData.plan_workflows && (
                <button
                  type="button"
                  onClick={() => handleChange('plan_workflows', '')}
                  className="absolute top-2 right-2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
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
              Next: Design the Pivot <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}