import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap } from 'lucide-react';
import ProgressBar from '../components/wizard/ProgressBar';
import Step1Person from '../components/wizard/Step1Person';
import Step2Problem from '../components/wizard/Step2Problem';
import Step3Plan from '../components/wizard/Step3Plan';
import Step4Pivot from '../components/wizard/Step4Pivot';
import Step5Payoff from '../components/wizard/Step5Payoff';

export default function NewProject() {
  const navigate = useNavigate();
  const DRAFT_KEY = 'nexus_draft_project';
  
  // Load draft from localStorage on mount
  const loadDraft = () => {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : {
      title: 'Untitled Project',
      status: 'draft',
      current_step: 1
    };
  };

  const [currentStep, setCurrentStep] = useState(() => loadDraft().current_step || 1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quickMode, setQuickMode] = useState(false);
  const [projectData, setProjectData] = useState(loadDraft);

  // Save draft to localStorage whenever projectData changes
  React.useEffect(() => {
    if (projectData.status === 'draft' || projectData.status === 'in_progress') {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(projectData));
    }
  }, [projectData]);

  const updateProjectData = (data) => {
    setProjectData(prev => ({ ...prev, ...data }));
  };

  const handleNext = async () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    // Auto-save progress
    try {
      if (projectData.id) {
        await base44.entities.Project.update(projectData.id, {
          current_step: nextStep,
          status: nextStep === 5 ? 'in_progress' : 'draft',
          ...projectData
        });
      } else {
        const created = await base44.entities.Project.create({
          ...projectData,
          current_step: nextStep,
          status: 'draft'
        });
        setProjectData(prev => ({ ...prev, id: created.id }));
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      // Continue anyway - user can still proceed
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleComplete = async (finalData) => {
    setIsGenerating(true);
    
    try {
      // Clear the draft from localStorage since we're submitting
      localStorage.removeItem(DRAFT_KEY);
      
      // Generate the build prompt using AI
      const promptData = { ...projectData, ...finalData };
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert app architect. Based on the 5P framework below, generate a comprehensive, copy-paste ready build prompt for an app builder.

PERSON:
- Industry: ${promptData.person_industry}
- Role: ${promptData.person_role}
- Environment: ${promptData.person_environment}
- Tone: ${promptData.person_tone || 'Professional and approachable'}
- Visual: ${promptData.person_visual || 'Clean and modern'}

PROBLEM:
${promptData.problem_description}
Frequency: ${promptData.problem_frequency || 'Not specified'}
Impact: ${promptData.problem_impact || 'Not specified'}

PLAN (Current Behavior):
Tools: ${promptData.plan_current_tools}
Workflows: ${promptData.plan_workflows || 'Not specified'}

PIVOT (Solution):
${promptData.pivot_solution}

PAYOFF:
Time Saved: ${promptData.payoff_time_saved || 'Not specified'}
Scale: ${promptData.payoff_scale || 'Not specified'}
Summary: ${promptData.payoff_summary || 'Not specified'}

Generate a comprehensive build prompt that includes:
1. App Purpose (1-2 sentences)
2. Target User (based on PERSON)
3. Core Features (3-7 features, bulleted)
4. Data Structure (high-level description)
5. UI/UX Direction (visual tone, color philosophy, layout logic - intelligently selected based on the person and problem)
6. Constraints (what NOT to build in v1)
7. Success Metrics (based on PAYOFF)

Make it copy-paste ready for Base44, Cursor, Claude, or any AI code generator.`,
        add_context_from_internet: false
      });

      const generatedPrompt = response;

      // Determine niche based on industry
      const niche = promptData.person_industry?.toLowerCase() || 'general';

      // Update project with generated prompt
      const finalUpdate = {
        generated_prompt: generatedPrompt,
        status: 'complete',
        niche: niche,
        title: `${promptData.person_role} - ${niche.charAt(0).toUpperCase() + niche.slice(1)} App`,
        ...promptData
      };
      
      if (projectData.id) {
        await base44.entities.Project.update(projectData.id, finalUpdate);
      } else {
        const created = await base44.entities.Project.create(finalUpdate);
        setProjectData(prev => ({ ...prev, id: created.id }));
      }

      // Navigate to the result page
      navigate(`/ProjectResult?id=${projectData.id}`);
    } catch (error) {
      console.error('Error generating prompt:', error);
      alert('Failed to generate prompt. Please try again.');
      // Restore draft on error
      localStorage.setItem(DRAFT_KEY, JSON.stringify(projectData));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to="/Dashboard">
            <Button variant="ghost" className="gap-2 hover:bg-white/50 rounded-lg">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-blue-500 to-blue-600 blur-3xl opacity-20" />
            <h1 className="relative text-6xl font-black text-gray-900 mb-1 tracking-tight" style={{ textShadow: '0 2px 40px rgba(59, 130, 246, 0.3)' }}>
              AI Prompt Planner
            </h1>
          </div>
          <p className="text-gray-800 text-lg mb-8 font-semibold tracking-wide">
            Create professional app prompts with the 5P framework
          </p>
          
          <div className="inline-flex gap-2 p-1.5 bg-white rounded-lg shadow-sm border border-gray-100">
            <Button
              variant={!quickMode ? "default" : "ghost"}
              onClick={() => setQuickMode(false)}
              className={`gap-2 rounded-md ${!quickMode ? 'bg-gradient-to-r from-yellow-500 to-blue-600 text-white' : 'hover:bg-gray-50'}`}
            >
              Guided Mode
            </Button>
            <Button
              variant={quickMode ? "default" : "ghost"}
              onClick={() => setQuickMode(true)}
              className={`gap-2 rounded-md ${quickMode ? 'bg-gradient-to-r from-yellow-500 to-blue-600 text-white' : 'hover:bg-gray-50'}`}
            >
              <Zap className="h-4 w-4" />
              Quick Mode
            </Button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {quickMode ? (
            <QuickPromptMode
              key="quick"
              projectData={projectData}
              onComplete={handleComplete}
              isGenerating={isGenerating}
            />
          ) : (
            <motion.div
              key="guided"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {!isGenerating && <ProgressBar currentStep={currentStep} />}

        {currentStep === 1 && (
          <Step1Person
            projectData={projectData}
            onUpdate={updateProjectData}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2Problem
            projectData={projectData}
            onUpdate={updateProjectData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <Step3Plan
            projectData={projectData}
            onUpdate={updateProjectData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <Step4Pivot
            projectData={projectData}
            onUpdate={updateProjectData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 5 && (
          <Step5Payoff
            projectData={projectData}
            onUpdate={updateProjectData}
            onComplete={handleComplete}
            onBack={handleBack}
            isGenerating={isGenerating}
          />
        )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function QuickPromptMode({ projectData, onComplete, isGenerating }) {
  const [prompt, setPrompt] = React.useState('');
  const [title, setTitle] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !title.trim()) return;

    await onComplete({
      ...projectData,
      title,
      problem_description: prompt,
      quick_mode: true
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl border-0 shadow-2xl p-10 transform hover:shadow-3xl transition-all duration-300"
    >
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500 to-blue-600 rounded-xl mb-4">
          <Zap className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Quick Prompt Mode</h2>
        <p className="text-gray-600">
          Describe your app idea and get a structured development prompt
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Real Estate CRM"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your app idea *
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: I need an app to manage real estate listings, track client interactions, schedule property viewings, and generate reports. It should work for a team of 5 agents and handle about 50 properties at a time."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
            rows={8}
            required
          />
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 Tip: Include who will use it, what problem it solves, and key features you need
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isGenerating || !prompt.trim() || !title.trim()}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm font-medium"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Zap className="h-5 w-5" />
              </motion.div>
              Creating your development prompt...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-2" />
              Generate Prompt
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}