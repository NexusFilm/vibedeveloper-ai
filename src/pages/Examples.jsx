import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Copy, Check } from 'lucide-react';

export default function Examples() {
  const [examples, setExamples] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadExamples();
  }, []);

  const loadExamples = async () => {
    const data = await base44.entities.ExampleProject.list();
    setExamples(data);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/Dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            Example 5P Projects
          </h1>
          <p className="text-gray-600 text-lg">
            Learn from real-world examples across different niches
          </p>
        </div>

        {examples.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No examples available yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {examples.map(example => (
              <Card key={example.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="mb-2">{example.title}</CardTitle>
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                        {example.niche}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-600 mb-1">👤 PERSON</h4>
                    <p className="text-sm text-gray-700">{example.person}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-orange-600 mb-1">⚠️ PROBLEM</h4>
                    <p className="text-sm text-gray-700">{example.problem}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-purple-600 mb-1">📋 PLAN</h4>
                    <p className="text-sm text-gray-700">{example.plan}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-green-600 mb-1">💡 PIVOT</h4>
                    <p className="text-sm text-gray-700">{example.pivot}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-indigo-600 mb-1">🎯 PAYOFF</h4>
                    <p className="text-sm text-gray-700">{example.payoff}</p>
                  </div>

                  {example.generated_prompt && (
                    <div className="pt-4 border-t">
                      <Button
                        onClick={() => handleCopy(example.generated_prompt, example.id)}
                        variant="outline"
                        className="w-full"
                      >
                        {copiedId === example.id ? (
                          <>
                            <Check className="mr-2 h-4 w-4" /> Copied Build Prompt!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" /> Copy Build Prompt
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}