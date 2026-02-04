import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, AlertCircle, FileText, Lightbulb, Target } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function CanvasView() {
  const [project, setProject] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    const data = await base44.entities.Project.list();
    const found = data.find(p => p.id === projectId);
    setProject(found);
  };

  const cards = project ? [
    {
      id: 'person',
      title: 'PERSON',
      icon: User,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      content: [
        { label: 'Industry', value: project.person_industry },
        { label: 'Role', value: project.person_role },
        { label: 'Environment', value: project.person_environment },
        { label: 'Tone', value: project.person_tone },
        { label: 'Visual', value: project.person_visual }
      ].filter(item => item.value)
    },
    {
      id: 'problem',
      title: 'PROBLEM',
      icon: AlertCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      content: [
        { label: 'Description', value: project.problem_description },
        { label: 'Frequency', value: project.problem_frequency },
        { label: 'Impact', value: project.problem_impact }
      ].filter(item => item.value)
    },
    {
      id: 'plan',
      title: 'PLAN',
      icon: FileText,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      content: [
        { label: 'Current Tools', value: project.plan_current_tools },
        { label: 'Workflows', value: project.plan_workflows }
      ].filter(item => item.value)
    },
    {
      id: 'pivot',
      title: 'PIVOT',
      icon: Lightbulb,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      content: [
        { label: 'Solution', value: project.pivot_solution }
      ].filter(item => item.value)
    },
    {
      id: 'payoff',
      title: 'PAYOFF',
      icon: Target,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      content: [
        { label: 'Time Saved', value: project.payoff_time_saved },
        { label: 'Scale', value: project.payoff_scale },
        { label: 'Impact', value: project.payoff_summary }
      ].filter(item => item.value)
    }
  ] : [];

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link to={`/ProjectResult?id=${project.id}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Result
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Canvas View: {project.title}
          </h1>
          <p className="text-gray-600">
            Visual mind-map of your 5P framework
          </p>
        </div>

        {/* Canvas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className={`${card.bgColor} ${card.borderColor} border-2 shadow-lg hover:shadow-xl transition-shadow`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`${card.color} h-10 w-10 rounded-lg flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold">{card.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {card.content.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 mb-1">{item.label}</p>
                      <p className="text-sm text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Connection Lines Visualization */}
        <div className="mt-12 bg-white rounded-lg p-6 border-2 border-gray-200">
          <h2 className="text-xl font-bold mb-4">5P Flow</h2>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <React.Fragment key={card.id}>
                  <div className="flex flex-col items-center min-w-[100px]">
                    <div className={`${card.color} h-12 w-12 rounded-full flex items-center justify-center mb-2`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-center">{card.title}</span>
                  </div>
                  {idx < cards.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-300 min-w-[40px]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}