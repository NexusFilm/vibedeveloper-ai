import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Sparkles, ArrowLeft, LayoutGrid } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ProjectResult() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    const user = await base44.auth.me();
    const data = await base44.entities.Project.filter({ created_by: user.email });
    const found = data.find(p => p.id === projectId);
    
    if (!found) {
      navigate('/Dashboard');
      return;
    }
    
    setProject(found);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(project.generated_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/Dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {project.title}
              </h1>
              <p className="text-gray-600">
                Your AI-generated build prompt is ready!
              </p>
            </div>
            <div className="flex gap-3">
              <Link to={`/PromptEditor?id=${project.id}`}>
                <Button variant="outline" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Edit & Preview
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Generated Prompt */}
        <Card className="mb-8 border-2 border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Your Build Prompt
              </CardTitle>
              <Button
                onClick={handleCopy}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" /> Copy Prompt
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <ReactMarkdown className="prose prose-slate max-w-none">
                {project.generated_prompt}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* 5P Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">👤 Person</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Industry:</strong> {project.person_industry}</p>
              <p><strong>Role:</strong> {project.person_role}</p>
              <p><strong>Environment:</strong> {project.person_environment}</p>
              {project.person_tone && <p><strong>Tone:</strong> {project.person_tone}</p>}
              {project.person_visual && <p><strong>Visual:</strong> {project.person_visual}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚠️ Problem</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{project.problem_description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📋 Plan (Current)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p><strong>Tools:</strong> {project.plan_current_tools}</p>
              {project.plan_workflows && (
                <p className="mt-2"><strong>Workflow:</strong> {project.plan_workflows}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Pivot (Solution)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{project.pivot_solution}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">🎯 Payoff</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {project.payoff_time_saved && (
                <p><strong>Time Saved:</strong> {project.payoff_time_saved}</p>
              )}
              {project.payoff_scale && (
                <p><strong>Scale Unlocked:</strong> {project.payoff_scale}</p>
              )}
              {project.payoff_summary && (
                <p><strong>Impact:</strong> {project.payoff_summary}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}