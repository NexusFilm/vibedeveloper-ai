import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Check, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function PromptRefiner({ value, onAccept, context, fieldName }) {
  const [isRefining, setIsRefining] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const refinePrompt = async () => {
    if (!value || value.length < 10) return;
    
    setIsRefining(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert prompt engineer. A user has provided this input for "${fieldName}":

"${value}"

Context: ${context}

Provide 2-3 improved versions that are:
1. More specific and actionable
2. Include relevant details
3. Clear and concise
4. Optimized for AI understanding

Return as JSON array of strings, each being a complete refined version of the user's input.`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      
      setSuggestions(response.suggestions || []);
    } catch (error) {
      console.error('Error refining prompt:', error);
    } finally {
      setIsRefining(false);
    }
  };

  const handleAccept = (suggestion) => {
    onAccept(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="space-y-3">
      {!suggestions.length && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={refinePrompt}
          disabled={isRefining || !value || value.length < 10}
          className="gap-2 text-xs"
        >
          {isRefining ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Refining...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 text-yellow-500" />
              Improve with AI
            </>
          )}
        </Button>
      )}

      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                AI Refined Versions
              </div>
              <button
                type="button"
                onClick={() => setSuggestions([])}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Dismiss
              </button>
            </div>
            
            {suggestions.map((suggestion, idx) => {
              const colors = [
                'from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-emerald-200',
                'from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200',
                'from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border-violet-200'
              ];
              return (
                <div
                  key={idx}
                  className={`relative p-3 bg-gradient-to-r ${colors[idx % colors.length]} border rounded-lg text-sm text-gray-700 transition-all shadow-sm`}
                >
                  <p className="pr-8">{suggestion}</p>
                  <button
                    type="button"
                    onClick={() => handleAccept(suggestion)}
                    className="absolute top-2 right-2 p-1.5 bg-white hover:bg-green-50 rounded-md transition-colors group"
                    title="Use this version"
                  >
                    <Check className="h-3.5 w-3.5 text-gray-600 group-hover:text-green-600" />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}