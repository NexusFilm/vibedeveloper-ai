import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AISuggestions } from '@/components/ui/ai-suggestions';
import { Sparkles, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function SmartInput({
  label,
  fieldName,
  value,
  onChange,
  context = {},
  placeholder,
  helpText,
  aiSuggestions = true,
  suggestionType = 'chips',
  maxSuggestions = 4,
  className = "",
  ...props
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleSuggestionAppend = (suggestion) => {
    const newValue = value ? `${value}, ${suggestion}` : suggestion;
    onChange(newValue);
  };

  const handleFocus = () => {
    setHasFocus(true);
    if (aiSuggestions && !value) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setHasFocus(false);
    // Keep suggestions open if user is interacting with them
    setTimeout(() => {
      if (!document.activeElement?.closest('[data-suggestions]')) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  return (
    <div className={`space-y-2 ${className}`}>
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
        {aiSuggestions && (
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            AI Help
          </button>
        )}
      </div>

      <Input
        id={fieldName}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`transition-all ${hasFocus ? 'ring-2 ring-blue-500/20' : ''}`}
        {...props}
      />

      {aiSuggestions && showSuggestions && (
        <div data-suggestions className="mt-2">
          <AISuggestions
            fieldName={fieldName}
            currentValue={value}
            context={context}
            onSuggestionClick={handleSuggestionClick}
            onSuggestionAppend={suggestionType === 'chips' ? handleSuggestionAppend : undefined}
            suggestionType={suggestionType}
            maxSuggestions={maxSuggestions}
            autoGenerate={true}
          />
        </div>
      )}
    </div>
  );
}

export default SmartInput;