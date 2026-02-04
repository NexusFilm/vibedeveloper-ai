import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, BookOpen, Briefcase, GraduationCap, Wrench, Users, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORY_ICONS = {
  'e-commerce': ShoppingCart,
  'productivity': BookOpen,
  'portfolio': Briefcase,
  'education': GraduationCap,
  'service': Wrench,
  'social': Users
};

const CATEGORY_COLORS = {
  'e-commerce': 'bg-green-500/20 text-green-300 border-green-400/50',
  'productivity': 'bg-blue-500/20 text-blue-300 border-blue-400/50',
  'portfolio': 'bg-purple-500/20 text-purple-300 border-purple-400/50',
  'education': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
  'service': 'bg-orange-500/20 text-orange-300 border-orange-400/50',
  'social': 'bg-pink-500/20 text-pink-300 border-pink-400/50'
};

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await base44.entities.Template.list();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = async (template) => {
    // Create new project from template
    const newProject = await base44.entities.Project.create({
      title: `${template.title} Project`,
      status: 'draft',
      current_step: 1,
      person_industry: template.person_industry,
      person_role: template.person_role,
      person_environment: template.person_environment,
      problem_description: template.problem_description,
      problem_frequency: template.problem_frequency,
      problem_impact: template.problem_impact,
      plan_current_tools: template.plan_current_tools,
      plan_workflows: template.plan_workflows,
      pivot_solution: template.pivot_solution
    });

    navigate(`/NewProject?id=${newProject.id}`);
  };

  const categories = ['all', ...new Set(templates.map(t => t.category))];
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl mb-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">AI Prompt Planning Templates</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            Start with a Template
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
            Choose a business idea template to jumpstart your app planning process. 
            Each template pre-fills the 5P framework to help you create better prompts.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className={selectedCategory === cat 
                ? 'bg-white text-gray-900' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => {
            const Icon = CATEGORY_ICONS[template.category] || Sparkles;
            const colorClass = CATEGORY_COLORS[template.category] || 'bg-gray-500/20 text-gray-300 border-gray-400/50';
            
            return (
              <Card key={template.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${colorClass}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {template.is_featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/50">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-white">{template.title}</CardTitle>
                  <CardDescription className="text-white/70">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full bg-white hover:bg-gray-100 text-gray-900"
                  >
                    Use This Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No templates available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}