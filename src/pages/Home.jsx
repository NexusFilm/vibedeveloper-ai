import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Zap, Target, ArrowRight, Palette, Layout, MessageSquare, Download, Wand2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Home() {
  const handleGetStarted = () => {
    window.location.href = '/Auth';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-white">AI Prompt Agent for App Planning</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-white">Plan Your App</span>
          <br />
          <span className="text-primary">
            Like a Developer
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Learn to create professional AI prompts for app development. 
          Our 5P framework guides you through planning like an expert developer—no coding required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-primary hover:bg-primary/90 text-white rounded-xl shadow-2xl hover:shadow-3xl transition-all font-semibold"
          >
            Start Building Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Link to={createPageUrl('Examples')}>
            <Button 
              variant="outline"
              size="lg"
              className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/30 text-white rounded-xl shadow-xl font-semibold w-full sm:w-auto"
            >
              See Student Projects
              <Sparkles className="ml-2 h-5 w-5 text-primary" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all">
            <div className="h-12 w-12 bg-primary/30 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/50">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">5P Planning Framework</h3>
            <p className="text-white/80 text-sm">
              Master prompt engineering through Person, Problem, Plan, Pivot, and Payoff structure
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all">
            <div className="h-12 w-12 bg-primary/30 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/50">
              <Wand2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Prompt Refinement</h3>
            <p className="text-white/80 text-sm">
              Get expert-level suggestions to craft clear, actionable development prompts
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all sm:col-span-2 md:col-span-1">
            <div className="h-12 w-12 bg-primary/30 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/50">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Developer Thinking</h3>
            <p className="text-white/80 text-sm">
              Learn to plan apps systematically—essential for working with AI or real developers
            </p>
          </div>
        </div>

        {/* Feature Showcase Section */}
        <div className="mt-16 sm:mt-24 max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
            Everything You Need to Plan Professional Apps
          </h2>
          <p className="text-white/80 text-center mb-8 sm:mb-12 text-base sm:text-lg px-4">
            Visual design tools, AI assistance, and wireframe generation—all in one place
          </p>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Wireframes */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-primary/30 rounded-lg flex items-center justify-center border border-primary/50">
                    <Layout className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Static Wireframes</h3>
                </div>
                <p className="text-white/70 text-sm mb-4">
                  AI-generated HTML/CSS wireframes for your app's key pages. Export as PNG for presentations and documentation.
                </p>
                <div className="bg-white/5 border border-white/20 rounded-lg p-4 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Layout className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-xs text-white/60">Landing Page Wireframe</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Color Palettes */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-primary/30 rounded-lg flex items-center justify-center border border-primary/50">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Design Suggestions</h3>
                </div>
                <p className="text-white/70 text-sm mb-4">
                  Get AI-recommended color palettes, typography, icon sets, and component suggestions tailored to your app.
                </p>
                <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                  <div className="flex gap-2 mb-3">
                    <div className="h-10 w-10 rounded bg-primary border border-white/20"></div>
                    <div className="h-10 w-10 rounded bg-indigo-600 border border-white/20"></div>
                    <div className="h-10 w-10 rounded bg-slate-800 border border-white/20"></div>
                    <div className="h-10 w-10 rounded bg-gray-100 border border-white/20"></div>
                  </div>
                  <p className="text-xs text-white/60">AI-Generated Color Palette</p>
                </div>
              </div>
            </Card>

            {/* Chat Refinement */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-primary/30 rounded-lg flex items-center justify-center border border-primary/50">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">AI Chat Assistant</h3>
                </div>
                <p className="text-white/70 text-sm mb-4">
                  Conversational AI helps you refine your prompt iteratively. Just ask to adjust specific aspects like tone or features.
                </p>
                <div className="bg-white/5 border border-white/20 rounded-lg p-3 space-y-2">
                  <div className="bg-primary/40 text-white text-xs p-2 rounded-lg">
                    Make it more technical
                  </div>
                  <div className="bg-white/10 text-white text-xs p-2 rounded-lg">
                    I've updated your prompt...
                  </div>
                </div>
              </div>
            </Card>

            {/* Export Tools */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-primary/30 rounded-lg flex items-center justify-center border border-primary/50">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Export Everything</h3>
                </div>
                <p className="text-white/70 text-sm mb-4">
                  Download wireframes as images, copy your refined prompt, and take all your planning materials anywhere you need.
                </p>
                <div className="bg-white/5 border border-white/20 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <Download className="h-10 w-10 text-primary mx-auto mb-2" />
                    <p className="text-xs text-white/60">Export as PNG</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}