import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';

export default function VisualPreview() {
  const [project, setProject] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const data = await base44.entities.Project.list();
      const found = data.find(p => p.id === projectId);
      setProject(found);

      if (found?.generated_prompt) {
        await generatePreview(found);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePreview = async (projectData) => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this app development prompt, create a visual description of what the app would look like. Include:
1. Overall layout and structure
2. Color scheme and visual style
3. Key UI components and their arrangement
4. User flow and navigation
5. Specific design elements

App Prompt:
${projectData.generated_prompt}

Generate a detailed visual description that a designer or developer could use to visualize the app.`,
        add_context_from_internet: false
      });

      setPreview(response);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <span className="text-gray-600">Loading preview...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to={`/ProjectResult?id=${projectId}`}>
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Project
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            Visual Preview
          </h1>
          <p className="text-gray-600 text-lg">{project.title}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Visual Description */}
          <Card className="border-2 border-indigo-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle>App Visual Description</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {preview ? (
                <div className="prose prose-slate max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{preview}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mock UI Preview */}
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle>UI Mockup</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-gray-100 rounded-lg p-8 min-h-[500px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <Sparkles className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                      <p className="text-gray-700 font-medium">Visual Mockup</p>
                      <p className="text-sm text-gray-500 mt-2 px-4">
                        Based on your prompt specifications
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 max-w-sm">
                    This is a conceptual preview. Use the generated prompt with AI builders like Base44, Cursor, or Claude to create the actual app.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Key Features Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {project.person_industry && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Target Industry</h3>
                  <p className="text-blue-800">{project.person_industry}</p>
                </div>
              )}
              {project.person_role && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">User Role</h3>
                  <p className="text-purple-800">{project.person_role}</p>
                </div>
              )}
              {project.pivot_solution && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Core Solution</h3>
                  <p className="text-green-800 line-clamp-3">{project.pivot_solution}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}