import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AISuggestions } from '@/components/ui/ai-suggestions';
import { Sparkles, HelpCircle, Wand2, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { base44 } from '@/api/base44Client';

export function EnhancedSmartTextarea({
  label,
  fieldName,
  value,
  onChange,
  context = {},
  placeholder,
  helpText,
  aiSuggestions = true,
  aiRefinement = true,
  maxSuggestions = 3,
  minRows = 3,
  className = "",
  ...props
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRefinement, setShowRefinement] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refinedOptions, setRefinedOptions] = useState([]);
  const [hasFocus, setHasFocus] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        minRows * 24
      )}px`;
    }
  }, [value, minRows]);

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleSuggestionAppend = (suggestion) => {
    const newValue = value 
      ? `${value}\n\n${suggestion}` 
      : suggestion;
    onChange(newValue);
  };

  const handleRefineText = async () => {
    if (!value || value.length < 10) return;
    
    setIsRefining(true);
    setShowRefinement(true);
    
    try {
      const contextStr = Object.entries(context)
        .filter(([key, val]) => val && val.toString().trim())
        .map(([key, val]) => `${key}: ${val}`)
        .join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert business consultant. A user has provided this input for "${fieldName}":

"${value}"

Context:
${contextStr}

Provide 3 improved versions that are:
1. More specific and actionable
2. Include relevant details that would help with app development
3. Clear and concise
4. Professional but approachable

Each version should be a complete replacement for the user's input, not just additions.

Return as JSON array of strings.`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: { type: "string" },
              maxItems: 3
            }
          }
        }
      });
      
      setRefinedOptions(response.suggestions || []);
    } catch (error) {
      console.error('Error refining text:', error);
    } finally {
      setIsRefining(false);
    }
  };

  const handleRefinedOptionClick = (refinedText) => {
    onChange(refinedText);
    setShowRefinement(false);
    setRefinedOptions([]);
  };

  const handleFocus = () => {
    setHasFocus(true);
    if (aiSuggestions && !value) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setHasFocus(false);
    setTimeout(() => {
      if (!document.activeElement?.closest('[data-suggestions]')) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor={fieldName} className="text-sm font-medium">
            {label}
          </Label>
          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {aiSuggestions && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs h-6 px-2"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Suggestions
            </Button>
          )}
          {aiRefinement && value && value.length > 10 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRefineText}
              disabled={isRefining}
              className="text-xs h-6 px-2"
            >
              <Wand2 className="w-3 h-3 mr-1" />
              Improve
            </Button>
          )}
        </div>
      </div>

      <Textarea
        ref={textareaRef}
        id={fieldName}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`transition-all resize-none ${hasFocus ? 'ring-2 ring-blue-500/20' : ''}`}
        style={{ minHeight: `${minRows * 24}px` }}
        {...props}
      />

      {/* AI Suggestions */}
      {aiSuggestions && showSuggestions && (
        <div data-suggestions className="mt-2">
          <AISuggestions
            fieldName={fieldName}
            currentValue={value}
            context={context}
            onSuggestionClick={handleSuggestionClick}
            onSuggestionAppend={handleSuggestionAppend}
            suggestionType="list"
            maxSuggestions={maxSuggestions}
            autoGenerate={true}
          />
        </div>
      )}

      {/* AI Refinement Options */}
      {showRefinement && (
        <div data-suggestions className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Improved Versions</span>
          </div>
          
          {isRefining ? (
            <div className="text-sm text-gray-500 italic">Generating improved versions...</div>
          ) : (
            <div className="space-y-2">
              {refinedOptions.map((option, index) => (
                <div
                  key={index}
                  className="p-3 border border-purple-200 rounded-lg bg-purple-50/50 cursor-pointer hover:bg-purple-100/50 transition-colors"
                  onClick={() => handleRefinedOptionClick(option)}
                >
                  <p className="text-sm text-gray-700">{option}</p>
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                      Use This Version
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EnhancedSmartTextarea;