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
import { ContextualAIAssistant } from '@/components/ui/contextual-ai-assistant';

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
    <div className="min-h-screen bg-background py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <Link to="/Dashboard">
            <Button variant="ghost" className="gap-2 hover:bg-accent/10 rounded-xl text-muted-foreground text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-10"
        >
          <div className="relative inline-block mb-3 sm:mb-4">
            <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-1 tracking-tight">
              AI Prompt Planner
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 font-normal px-2">
            Create professional app prompts with the 5P framework
          </p>
          
          <div className="inline-flex gap-1.5 sm:gap-2 p-1.5 bg-card rounded-xl shadow-sm border border-border">
            <Button
              variant={!quickMode ? "default" : "ghost"}
              onClick={() => setQuickMode(false)}
              className={`gap-1 sm:gap-2 rounded-lg transition-all text-sm sm:text-base px-3 sm:px-4 ${!quickMode ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'hover:bg-accent/10 text-muted-foreground'}`}
            >
              <span className="hidden sm:inline">Guided Mode</span>
              <span className="sm:hidden">Guided</span>
            </Button>
            <Button
              variant={quickMode ? "default" : "ghost"}
              onClick={() => setQuickMode(true)}
              className={`gap-1 sm:gap-2 rounded-lg transition-all text-sm sm:text-base px-3 sm:px-4 ${quickMode ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'hover:bg-accent/10 text-muted-foreground'}`}
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Quick Mode</span>
              <span className="sm:hidden">Quick</span>
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
        
        {/* Contextual AI Assistant */}
        <ContextualAIAssistant
          currentStep={currentStep}
          projectData={projectData}
          onSuggestionApply={(suggestion) => {
            // Handle suggestion application based on current step
            console.log('AI Suggestion:', suggestion);
          }}
        />
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
      className="bg-card rounded-2xl border border-border shadow-lg p-4 sm:p-6 md:p-10 transition-all duration-300"
    >
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex p-3 sm:p-4 bg-primary/10 rounded-xl mb-3 sm:mb-4">
          <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2 sm:mb-3">Quick Prompt Mode</h2>
        <p className="text-muted-foreground text-sm sm:text-base px-2">
          Describe your app idea and get a structured development prompt
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Project Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Real Estate CRM"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Describe your app idea *
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: I need an app to manage real estate listings, track client interactions, schedule property viewings, and generate reports. It should work for a team of 5 agents and handle about 50 properties at a time."
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            rows={6}
            required
          />
          <div className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-xs sm:text-sm text-foreground">
              💡 Tip: Include who will use it, what problem it solves, and key features you need
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isGenerating || !prompt.trim() || !title.trim()}
          className="w-full py-3 sm:py-4 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-sm font-medium transition-all"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
              <span className="hidden sm:inline">Creating your development prompt...</span>
              <span className="sm:hidden">Creating prompt...</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Generate Prompt
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}