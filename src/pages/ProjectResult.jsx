import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Sparkles, ArrowLeft, LayoutGrid, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import WireframeViewer from '@/components/WireframeViewer';

export default function ProjectResult() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const [generatingWireframe, setGeneratingWireframe] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [wireframeData, setWireframeData] = useState(null);
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
    
    // Check if wireframe already exists
    if (found.wireframe_data) {
      setWireframeData(found.wireframe_data);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(project.generated_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateWireframe = async () => {
    setGeneratingWireframe(true);
    try {
      const user = await base44.auth.me();
      const token = await base44.auth.getToken();
      
      const response = await fetch('/api/generate-wireframe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          authToken: token
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setWireframeData(data.wireframe);
        setShowWireframe(true);
        
        // Reload project to get updated data
        await loadProject();
      } else {
        alert('Failed to generate wireframe: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Wireframe generation error:', error);
      alert('Failed to generate wireframe. Please try again.');
    } finally {
      setGeneratingWireframe(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/Dashboard">
            <Button variant="ghost" className="mb-4 rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-foreground mb-2">
                {project.title}
              </h1>
              <p className="text-muted-foreground">
                Your AI-generated build prompt is ready!
              </p>
            </div>
            <div className="flex gap-3">
              {wireframeData ? (
                <Button 
                  variant="outline" 
                  className="gap-2 rounded-xl"
                  onClick={() => setShowWireframe(!showWireframe)}
                >
                  <LayoutGrid className="h-4 w-4" />
                  {showWireframe ? 'Hide' : 'Show'} Wireframe
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="gap-2 rounded-xl"
                  onClick={handleGenerateWireframe}
                  disabled={generatingWireframe}
                >
                  {generatingWireframe ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <LayoutGrid className="h-4 w-4" />
                      Generate Wireframe
                    </>
                  )}
                </Button>
              )}
              <Link to={`/PromptEditor?id=${project.id}`}>
                <Button variant="outline" className="gap-2 rounded-xl">
                  <Sparkles className="h-4 w-4" />
                  Edit & Preview
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wireframe Viewer */}
        {showWireframe && wireframeData && (
          <Card className="mb-8 border-2 border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <LayoutGrid className="h-5 w-5 text-primary" />
                App Wireframe Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <WireframeViewer wireframeData={wireframeData} />
            </CardContent>
          </Card>
        )}

        {/* Generated Prompt */}
        <Card className="mb-8 border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Build Prompt
              </CardTitle>
              <Button
                onClick={handleCopy}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
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
            <div className="bg-card rounded-xl p-6 border border-border">
              <ReactMarkdown className="prose prose-slate max-w-none dark:prose-invert">
                {project.generated_prompt}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* 5P Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-border">
            <CardHeader className="bg-accent/5">
              <CardTitle className="text-lg text-foreground">👤 Person</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Industry:</strong> {project.person_industry}</p>
              <p><strong>Role:</strong> {project.person_role}</p>
              <p><strong>Environment:</strong> {project.person_environment}</p>
              {project.person_tone && <p><strong>Tone:</strong> {project.person_tone}</p>}
              {project.person_visual && <p><strong>Visual:</strong> {project.person_visual}</p>}
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="bg-accent/5">
              <CardTitle className="text-lg text-foreground">⚠️ Problem</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-foreground">{project.problem_description}</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="bg-accent/5">
              <CardTitle className="text-lg text-foreground">📋 Plan (Current)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p><strong>Tools:</strong> {project.plan_current_tools}</p>
              {project.plan_workflows && (
                <p className="mt-2"><strong>Workflow:</strong> {project.plan_workflows}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="bg-accent/5">
              <CardTitle className="text-lg text-foreground">💡 Pivot (Solution)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-foreground">{project.pivot_solution}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border border-border">
            <CardHeader className="bg-accent/5">
              <CardTitle className="text-lg text-foreground">🎯 Payoff</CardTitle>
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