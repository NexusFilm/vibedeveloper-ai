import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Check, Sparkles, Wand2, Loader2, Layout, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import WireframeViewer from '@/components/WireframeViewer';
import ChatRefinement from '@/components/ChatRefinement';

export default function PromptEditor() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [designSuggestions, setDesignSuggestions] = useState(null);
  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false);
  const [wireframes, setWireframes] = useState([]);
  const [isGeneratingWireframes, setIsGeneratingWireframes] = useState(false);
  const [activeView, setActiveView] = useState('preview');
  
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
    setPrompt(found.generated_prompt || '');
    setOriginalPrompt(found.generated_prompt || '');
    
    if (found.generated_prompt) {
      generatePreview(found.generated_prompt);
      generateDesignSuggestions(found.generated_prompt);
      generateWireframes(found.generated_prompt);
    }
  };

  const generateWireframes = async (promptText) => {
    setIsGeneratingWireframes(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this app development prompt, generate static HTML/CSS wireframe code for 3-4 key pages. These should be non-interactive visual representations only.

${promptText}

For each page, provide:
1. page_name: Short descriptive name (e.g., "Landing Page", "Dashboard", "Profile")
2. html_code: Complete HTML with inline CSS styling for the wireframe. Use gray boxes, simple borders, placeholder text. Make it look like a wireframe sketch, not a full design. Include basic structure: header, nav, main content, footer. Use semantic colors from the design palette if available.

Generate wireframes for the most important pages based on the app's core features.

Return ONLY valid JSON array, no explanations.`,
        response_json_schema: {
          type: "object",
          properties: {
            wireframes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  page_name: { type: "string" },
                  html_code: { type: "string" }
                }
              }
            }
          }
        }
      });
      setWireframes(response.wireframes || []);
    } catch (error) {
      console.error('Error generating wireframes:', error);
    } finally {
      setIsGeneratingWireframes(false);
    }
  };

  const generateDesignSuggestions = async (promptText) => {
    setIsGeneratingDesign(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this app development prompt, generate comprehensive design suggestions:

${promptText}

Provide design recommendations in JSON format with:
1. color_palette: Array of 5 hex colors (primary, secondary, accent, background, text) with names
2. typography: Font pairing suggestions (headings and body)
3. icon_style: Recommended icon style and 5 specific icon names from lucide-react
4. layout_structure: Recommended layout pattern
5. components: List of 5-7 key UI components needed
6. wireframe_description: Detailed text description of the main screen layout

Return ONLY valid JSON, no explanations.`,
        response_json_schema: {
          type: "object",
          properties: {
            color_palette: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  hex: { type: "string" },
                  usage: { type: "string" }
                }
              }
            },
            typography: {
              type: "object",
              properties: {
                headings: { type: "string" },
                body: { type: "string" }
              }
            },
            icon_style: { type: "string" },
            icon_suggestions: {
              type: "array",
              items: { type: "string" }
            },
            layout_structure: { type: "string" },
            components: {
              type: "array",
              items: { type: "string" }
            },
            wireframe_description: { type: "string" }
          }
        }
      });
      setDesignSuggestions(response);
    } catch (error) {
      console.error('Error generating design:', error);
    } finally {
      setIsGeneratingDesign(false);
    }
  };

  const generatePreview = async (promptText) => {
    setIsGeneratingPreview(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this app development prompt, create a detailed visual description of what the app would look like. Include:
1. Overall layout structure (header, sidebar, main content)
2. Color scheme and visual style
3. Key UI components and their arrangement
4. User flow and navigation patterns
5. Specific design elements and interactions

App Prompt:
${promptText}

Generate a vivid, detailed visual description that a designer could use to visualize the app.`,
        add_context_from_internet: false
      });
      setPreview(response);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleRefine = async () => {
    setIsRefining(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert app architect. Review and refine this build prompt to make it more comprehensive and actionable for developers. Keep the same intent but improve clarity, structure, and completeness.

Current prompt:
${prompt}

Generate an improved version that:
- Maintains the core requirements
- Adds technical clarity where needed
- Structures information logically
- Includes specific implementation guidance
- Highlights potential edge cases or considerations

Return only the refined prompt, no explanations.`,
        add_context_from_internet: false
      });
      
      setPrompt(response);
      setOriginalPrompt(response);
      await base44.entities.Project.update(projectId, {
        generated_prompt: response
      });
      
      generatePreview(response);
      generateDesignSuggestions(response);
      generateWireframes(response);
    } catch (error) {
      console.error('Error refining prompt:', error);
      alert('Failed to refine prompt. Please try again.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleSave = async () => {
    try {
      await base44.entities.Project.update(projectId, {
        generated_prompt: prompt
      });
      setOriginalPrompt(prompt);
      alert('Prompt saved successfully!');
      generatePreview(prompt);
      generateDesignSuggestions(prompt);
      generateWireframes(prompt);
    } catch (error) {
      console.error('Error saving prompt:', error);
      alert('Failed to save prompt.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPrompt(originalPrompt);
  };

  const handleChatUpdate = async (updatedPrompt) => {
    setPrompt(updatedPrompt);
    setOriginalPrompt(updatedPrompt);
    await base44.entities.Project.update(projectId, {
      generated_prompt: updatedPrompt
    });
    
    // Regenerate all visualizations
    generatePreview(updatedPrompt);
    generateDesignSuggestions(updatedPrompt);
    generateWireframes(updatedPrompt);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const hasChanges = prompt !== originalPrompt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/Dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{project.title}</h1>
                <p className="text-xs text-gray-500">Split View Prompt Editor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {hasChanges && (
                <>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    Save Changes
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefine}
                disabled={isRefining}
                className="gap-2"
              >
                {isRefining ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Refining...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-3 w-3" />
                    AI Refine
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={handleCopy}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="grid lg:grid-cols-4 h-[calc(100vh-73px)]">
        {/* Left: Editor */}
        <div className="border-r border-gray-200 bg-white flex flex-col lg:col-span-1">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Prompt Editor
              </h2>
              <Badge variant="outline" className="text-xs">
                {prompt.length} characters
              </Badge>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-full p-6 font-mono text-sm text-gray-800 resize-none focus:outline-none bg-white"
              placeholder="Your app development prompt will appear here..."
            />
          </div>
        </div>

        {/* Middle: Design Suggestions */}
        <div className="border-r border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50/30 flex flex-col lg:col-span-1 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-purple-600" />
              Design Suggestions
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            {isGeneratingDesign ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto" />
                  <p className="text-sm text-gray-600">Generating design...</p>
                </div>
              </div>
            ) : designSuggestions ? (
              <>
                {/* Color Palette */}
                <Card className="bg-white shadow-sm">
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-3 text-gray-900">Color Palette</h3>
                    <div className="space-y-2">
                      {designSuggestions.color_palette?.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-lg shadow-sm border border-gray-200"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900">{color.name}</p>
                            <p className="text-xs text-gray-500">{color.hex}</p>
                            <p className="text-xs text-gray-600">{color.usage}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Typography */}
                <Card className="bg-white shadow-sm">
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-3 text-gray-900">Typography</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Headings</p>
                        <p className="text-sm font-semibold text-gray-900">{designSuggestions.typography?.headings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Body</p>
                        <p className="text-sm text-gray-900">{designSuggestions.typography?.body}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Icons */}
                <Card className="bg-white shadow-sm">
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-3 text-gray-900">Icon Style</h3>
                    <p className="text-xs text-gray-600 mb-3">{designSuggestions.icon_style}</p>
                    <div className="flex flex-wrap gap-2">
                      {designSuggestions.icon_suggestions?.map((icon, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {icon}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Layout */}
                <Card className="bg-white shadow-sm">
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-3 text-gray-900">Layout Structure</h3>
                    <p className="text-xs text-gray-700">{designSuggestions.layout_structure}</p>
                  </div>
                </Card>

                {/* Components */}
                <Card className="bg-white shadow-sm">
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-3 text-gray-900">Key Components</h3>
                    <div className="space-y-1.5">
                      {designSuggestions.components?.map((comp, idx) => (
                        <div key={idx} className="text-xs text-gray-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                          {comp}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Wireframe */}
                <Card className="bg-white shadow-sm">
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-3 text-gray-900">Wireframe Layout</h3>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {designSuggestions.wireframe_description}
                    </p>
                  </div>
                </Card>
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-400 text-sm">No design suggestions yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Refinement */}
        <div className="border-r border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50/30 flex flex-col lg:col-span-1">
          <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-600" />
              AI Assistant
            </h2>
          </div>
          
          <div className="flex-1 overflow-hidden p-4">
            <ChatRefinement 
              currentPrompt={prompt}
              onPromptUpdate={handleChatUpdate}
            />
          </div>
        </div>

        {/* Right: Preview & Wireframes */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col lg:col-span-1">
          <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                {activeView === 'preview' ? (
                  <>
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    Visual Preview
                  </>
                ) : (
                  <>
                    <Layout className="h-4 w-4 text-green-600" />
                    Wireframes
                  </>
                )}
              </h2>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant={activeView === 'preview' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('preview')}
                  className="h-7 text-xs"
                >
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  variant={activeView === 'wireframes' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('wireframes')}
                  className="h-7 text-xs"
                >
                  Wireframes
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {activeView === 'preview' ? (
              <>
                {isGeneratingPreview ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                      <p className="text-sm text-gray-600">Generating preview...</p>
                    </div>
                  </div>
                ) : preview ? (
                  <Card className="bg-white shadow-sm">
                    <div className="p-4">
                      <div className="prose prose-sm prose-slate max-w-none">
                        <ReactMarkdown>{preview}</ReactMarkdown>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-sm">No preview available</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {isGeneratingWireframes ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
                      <p className="text-sm text-gray-600">Building wireframes...</p>
                    </div>
                  </div>
                ) : (
                  <WireframeViewer wireframes={wireframes} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}