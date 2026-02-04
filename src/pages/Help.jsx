import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Sparkles, Wand2, Layout, MessageSquare, Download, Zap } from 'lucide-react';

export default function Help() {
  const faqs = [
    {
      question: "What is the 5P Framework?",
      answer: "The 5P Framework (Person, Problem, Plan, Pivot, Payoff) is a structured approach to planning your app. It helps you define WHO you're building for, WHAT problem you're solving, HOW they currently deal with it, your SOLUTION, and the expected IMPACT."
    },
    {
      question: "How do I create a project?",
      answer: "Click 'New Plan' from the Dashboard. You can either use the guided 5P wizard (step-by-step) or Quick Mode (direct prompt entry). The wizard walks you through each phase with AI suggestions to help craft your prompt."
    },
    {
      question: "What are Templates?",
      answer: "Templates are pre-built project structures for common app types (e-commerce, education, portfolio, etc.). They pre-fill the 5P framework with industry-specific examples to jumpstart your planning."
    },
    {
      question: "How does AI Prompt Refinement work?",
      answer: "After generating your initial prompt, use the Prompt Editor to refine it. You can manually edit the text, use 'AI Refine' for automatic improvements, or chat with the AI assistant to make specific adjustments."
    },
    {
      question: "What are Wireframes?",
      answer: "Wireframes are static visual representations of your app's key pages (landing page, dashboard, etc.). They show layout and structure without functionality - like screenshots of what your app could look like."
    },
    {
      question: "How do I export Wireframes?",
      answer: "In the Prompt Editor, switch to the 'Wireframes' tab. Each wireframe has an 'Export' button that downloads it as a PNG image you can use in presentations or documentation."
    },
    {
      question: "What's the difference between Preview and Wireframes?",
      answer: "The Visual Preview provides a detailed text description of your app's design and user experience. Wireframes show actual visual mockups of specific pages with layout and components."
    },
    {
      question: "Can I save my custom prompts?",
      answer: "Yes! Every project automatically saves your prompt. You can return to any project and continue refining it. Admins can also create Templates from successful projects."
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "5P Wizard",
      description: "Step-by-step guided process through Person, Problem, Plan, Pivot, and Payoff phases with AI suggestions at each step."
    },
    {
      icon: Wand2,
      title: "AI Refinement",
      description: "Automatically improve your prompt with AI, or manually edit and refine for maximum precision."
    },
    {
      icon: MessageSquare,
      title: "Chat Assistant",
      description: "Conversational AI that helps you adjust specific parts of your prompt (e.g., 'make it more technical')."
    },
    {
      icon: Layout,
      title: "Wireframes",
      description: "AI-generated static HTML/CSS wireframes for 3-4 key pages showing visual structure and layout."
    },
    {
      icon: Download,
      title: "Export Tools",
      description: "Download wireframes as PNG images and copy your final prompt to use anywhere."
    },
    {
      icon: Zap,
      title: "Design Suggestions",
      description: "Get AI-recommended color palettes, typography, icons, and component structures."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/Dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-4">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Help & Documentation</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            How to Use Nexus Developer AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn how to plan your app like a developer using our AI-powered prompt generation system
          </p>
        </div>

        {/* Features Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-indigo-600" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge className="bg-indigo-600 text-white text-sm px-2 py-1">1</Badge>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Choose Your Starting Point</h3>
                <p className="text-sm text-gray-600">
                  Start from scratch with 'New Plan', or browse Templates for pre-filled structures based on your industry.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-indigo-600 text-white text-sm px-2 py-1">2</Badge>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Complete the 5P Framework</h3>
                <p className="text-sm text-gray-600">
                  Answer questions about your target user (Person), the problem they face, their current approach (Plan), your solution (Pivot), and expected outcomes (Payoff).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-indigo-600 text-white text-sm px-2 py-1">3</Badge>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Generate & Refine Your Prompt</h3>
                <p className="text-sm text-gray-600">
                  AI generates a comprehensive build prompt. Use the Prompt Editor to refine it manually, with AI assistance, or through chat.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-indigo-600 text-white text-sm px-2 py-1">4</Badge>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Review Design & Wireframes</h3>
                <p className="text-sm text-gray-600">
                  Get AI-generated design suggestions (colors, typography, icons) and static wireframes showing your app's visual structure. Export wireframes for presentations.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-indigo-600 text-white text-sm px-2 py-1">5</Badge>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Copy & Build</h3>
                <p className="text-sm text-gray-600">
                  Copy your final prompt and use it with AI development tools, share it with developers, or reference it during your build process.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Still have questions? Need help with your project?
          </p>
          <Link to="/Dashboard">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Start Planning Your App
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}