import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, ArrowRight } from "lucide-react";
import HelpTooltip from './HelpTooltip';
import { SmartInput } from '@/components/ui/smart-input';
import { AISuggestions } from '@/components/ui/ai-suggestions';

const INDUSTRIES = ['Real Estate', 'Education', 'Healthcare', 'Consulting', 'E-commerce', 'Nonprofit', 'Creative Services', 'Finance', 'Legal'];
const ROLES = ['Founder', 'Solo Operator', 'Administrator', 'Sales Professional', 'Teacher', 'Consultant', 'Manager', 'Freelancer'];
const ENVIRONMENTS = ['Solo operator', 'Small team (2-5)', 'Team (6-15)', 'Remote', 'In-person', 'Hybrid'];
const TONES = ['Professional', 'Approachable', 'Efficient', 'Inspirational', 'Friendly'];
const VISUALS = ['Minimal', 'Professional', 'Modern', 'Utilitarian', 'Expressive'];

export default function Step1Person({ projectData, onUpdate, onNext }) {
  const [formData, setFormData] = React.useState({
    person_industry: projectData.person_industry || '',
    person_role: projectData.person_role || '',
    person_environment: projectData.person_environment || '',
    person_tone: projectData.person_tone || '',
    person_visual: projectData.person_visual || ''
  });
  const [showCustomInputs, setShowCustomInputs] = React.useState({
    industry: false,
    role: false,
    environment: false
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChipClick = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Hide custom input when chip is selected
    if (field === 'person_industry') setShowCustomInputs(prev => ({ ...prev, industry: false }));
    if (field === 'person_role') setShowCustomInputs(prev => ({ ...prev, role: false }));
    if (field === 'person_environment') setShowCustomInputs(prev => ({ ...prev, environment: false }));
  };

  const handleCustomInput = (field, show) => {
    setShowCustomInputs(prev => ({ ...prev, [field]: show }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onNext();
  };

  const isValid = formData.person_industry && formData.person_role && formData.person_environment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="max-w-3xl mx-auto bg-card border border-border shadow-lg rounded-2xl transition-all duration-300">
        <CardHeader className="pt-10 pb-8 px-10 border-b border-border">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-3xl font-semibold text-foreground mb-1">Define the PERSON</CardTitle>
              <CardDescription className="text-base text-muted-foreground">Who is this app for?</CardDescription>
            </div>
          </div>
        </CardHeader>
      <CardContent className="px-10 pb-10">
        <form onSubmit={handleSubmit} className="space-y-8 pt-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="industry" className="text-sm font-medium text-foreground tracking-wide uppercase text-xs">What industry or sector? *</Label>
              <HelpTooltip 
                title="Why Industry Matters"
                content="Selecting the right industry helps the AI understand the context, terminology, and common challenges specific to your field. This ensures more relevant suggestions."
                aiTip="Be as specific as possible. 'Real Estate - Residential' is better than just 'Real Estate'."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map(industry => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => handleChipClick('person_industry', industry)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    formData.person_industry === industry
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Input
                id="industry"
                placeholder="Or type your own..."
                value={formData.person_industry}
                onChange={(e) => handleChange('person_industry', e.target.value)}
                onFocus={() => handleCustomInput('industry', true)}
                className="rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
              {showCustomInputs.industry && (
                <AISuggestions
                  fieldName="person_industry"
                  currentValue={formData.person_industry}
                  context={{}}
                  onSuggestionClick={(suggestion) => handleChange('person_industry', suggestion)}
                  suggestionType="chips"
                  maxSuggestions={6}
                  autoGenerate={true}
                />
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Label htmlFor="role" className="text-sm font-medium text-foreground tracking-wide uppercase text-xs">What's their role or position? *</Label>
              <HelpTooltip 
                title="Role Defines User Needs"
                content="The role determines what features and workflows will be most valuable. A 'Manager' needs different tools than a 'Solo Operator'."
                aiTip="Think about the primary person who will use this app daily, not just who approved it."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleChipClick('person_role', role)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    formData.person_role === role
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Input
                id="role"
                placeholder="Or type your own..."
                value={formData.person_role}
                onChange={(e) => handleChange('person_role', e.target.value)}
                onFocus={() => handleCustomInput('role', true)}
                className="rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
              {showCustomInputs.role && (
                <AISuggestions
                  fieldName="person_role"
                  currentValue={formData.person_role}
                  context={{ person_industry: formData.person_industry }}
                  onSuggestionClick={(suggestion) => handleChange('person_role', suggestion)}
                  suggestionType="chips"
                  maxSuggestions={6}
                  autoGenerate={true}
                />
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Label htmlFor="environment" className="text-sm font-medium text-foreground tracking-wide uppercase text-xs">Work environment? *</Label>
              <HelpTooltip 
                title="Environment Shapes Features"
                content="Solo operators need simple, fast workflows. Teams need collaboration features, permissions, and shared visibility."
                aiTip="Consider where the work happens: at a desk, on the go, or moving between locations."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {ENVIRONMENTS.map(env => (
                <button
                  key={env}
                  type="button"
                  onClick={() => handleChipClick('person_environment', env)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    formData.person_environment === env
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Input
                id="environment"
                placeholder="Or type your own..."
                value={formData.person_environment}
                onChange={(e) => handleChange('person_environment', e.target.value)}
                onFocus={() => handleCustomInput('environment', true)}
                className="rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
              {showCustomInputs.environment && (
                <AISuggestions
                  fieldName="person_environment"
                  currentValue={formData.person_environment}
                  context={{ 
                    person_industry: formData.person_industry,
                    person_role: formData.person_role 
                  }}
                  onSuggestionClick={(suggestion) => handleChange('person_environment', suggestion)}
                  suggestionType="chips"
                  maxSuggestions={6}
                  autoGenerate={true}
                />
              )}
            </div>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t border-border bg-accent/5 -mx-10 px-10 pb-6 rounded-b-2xl">
            <Label htmlFor="tone" className="text-sm font-medium text-foreground tracking-wide uppercase text-xs">How should the app feel?</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map(tone => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => handleChipClick('person_tone', tone)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    formData.person_tone === tone
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
            <Input
              id="tone"
              placeholder="Or type your own..."
              value={formData.person_tone}
              onChange={(e) => handleChange('person_tone', e.target.value)}
              className="rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-4 pb-6">
            <Label htmlFor="visual" className="text-sm font-medium text-foreground tracking-wide uppercase text-xs">Visual style preference?</Label>
            <div className="flex flex-wrap gap-2">
              {VISUALS.map(visual => (
                <button
                  key={visual}
                  type="button"
                  onClick={() => handleChipClick('person_visual', visual)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    formData.person_visual === visual
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-card border border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {visual}
                </button>
              ))}
            </div>
            <Input
              id="visual"
              placeholder="Or type your own..."
              value={formData.person_visual}
              onChange={(e) => handleChange('person_visual', e.target.value)}
              className="rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-8 py-6 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-sm transition-all"
            disabled={!isValid}
          >
            Next: Define the Problem <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
      </Card>
    </motion.div>
  );
}