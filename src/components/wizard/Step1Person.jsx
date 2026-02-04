import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, ArrowRight } from "lucide-react";
import HelpTooltip from './HelpTooltip';

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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChipClick = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      <Card className="max-w-3xl mx-auto bg-white border-0 shadow-2xl rounded-xl transform hover:shadow-3xl transition-all duration-300">
        <CardHeader className="pt-10 pb-8 px-10 border-b border-gray-100">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-1">Define the PERSON</CardTitle>
              <CardDescription className="text-base text-gray-500">Who is this app for?</CardDescription>
            </div>
          </div>
        </CardHeader>
      <CardContent className="px-10 pb-10">
        <form onSubmit={handleSubmit} className="space-y-8 pt-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="industry" className="text-sm font-semibold text-gray-900 tracking-wide uppercase text-xs">What industry or sector? *</Label>
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
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    formData.person_industry === industry
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
            <Input
              id="industry"
              placeholder="Or type your own..."
              value={formData.person_industry}
              onChange={(e) => handleChange('person_industry', e.target.value)}
              className="rounded-lg border border-gray-200 focus:border-gray-400 focus:ring-0"
              required
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Label htmlFor="role" className="text-sm font-semibold text-gray-900 tracking-wide uppercase text-xs">What's their role or position? *</Label>
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
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    formData.person_role === role
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <Input
              id="role"
              placeholder="Or type your own..."
              value={formData.person_role}
              onChange={(e) => handleChange('person_role', e.target.value)}
              className="rounded-lg border border-gray-200 focus:border-gray-400 focus:ring-0"
              required
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Label htmlFor="environment" className="text-sm font-semibold text-gray-900 tracking-wide uppercase text-xs">Work environment? *</Label>
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
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    formData.person_environment === env
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
            <Input
              id="environment"
              placeholder="Or type your own..."
              value={formData.person_environment}
              onChange={(e) => handleChange('person_environment', e.target.value)}
              className="rounded-lg border border-gray-200 focus:border-gray-400 focus:ring-0"
              required
            />
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t border-gray-200 bg-gray-50/50 -mx-10 px-10 pb-6">
            <Label htmlFor="tone" className="text-sm font-semibold text-gray-900 tracking-wide uppercase text-xs">How should the app feel?</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map(tone => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => handleChipClick('person_tone', tone)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    formData.person_tone === tone
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
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
              className="rounded-lg border border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div className="space-y-4 pb-6">
            <Label htmlFor="visual" className="text-sm font-semibold text-gray-900 tracking-wide uppercase text-xs">Visual style preference?</Label>
            <div className="flex flex-wrap gap-2">
              {VISUALS.map(visual => (
                <button
                  key={visual}
                  type="button"
                  onClick={() => handleChipClick('person_visual', visual)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    formData.person_visual === visual
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
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
              className="rounded-lg border border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-8 py-6 text-base font-semibold bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg hover:shadow-xl transition-all"
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