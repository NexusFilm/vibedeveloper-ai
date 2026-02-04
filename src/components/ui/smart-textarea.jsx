import React, { useRef, useEffect, useState } from 'react';
import { Textarea } from './textarea';

// Simple spell checking with common typos
const COMMON_CORRECTIONS = {
  'teh': 'the',
  'adn': 'and',
  'taht': 'that',
  'woudl': 'would',
  'coudl': 'could',
  'shoudl': 'should',
  'recieve': 'receive',
  'occured': 'occurred',
  'seperate': 'separate',
  'definately': 'definitely',
  'neccessary': 'necessary',
  'accross': 'across',
  'begining': 'beginning',
  'calender': 'calendar',
  'collegue': 'colleague',
  'comming': 'coming',
  'enviroment': 'environment',
  'goverment': 'government',
  'managment': 'management',
  'occassion': 'occasion',
  'untill': 'until',
  'sucessful': 'successful',
  'refered': 'referred'
};

export function SmartTextarea({ value, onChange, onBlur, minRows = 2, ...props }) {
  const [localValue, setLocalValue] = useState(value);
  const [suggestion, setSuggestion] = useState('');
  const [rows, setRows] = useState(minRows);
  const textareaRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
    adjustHeight();
  }, [value]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  };

  const checkSpelling = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const lastWord = words[words.length - 1];
    
    if (COMMON_CORRECTIONS[lastWord]) {
      return COMMON_CORRECTIONS[lastWord];
    }
    return null;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    adjustHeight();
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check for corrections after typing pause
    timeoutRef.current = setTimeout(() => {
      const correction = checkSpelling(newValue);
      if (correction) {
        setSuggestion(correction);
      } else {
        setSuggestion('');
      }
    }, 300);

    onChange(e);
  };

  const handleBlur = (e) => {
    // Auto-correct common typos on blur
    if (suggestion) {
      const words = localValue.split(/\s+/);
      words[words.length - 1] = suggestion;
      const corrected = words.join(' ');
      
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: corrected }
      };
      
      setLocalValue(corrected);
      onChange(syntheticEvent);
      setSuggestion('');
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="relative">
      <Textarea
        {...props}
        ref={textareaRef}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={minRows}
        className="resize-none overflow-hidden"
        style={{ ...props.style, minHeight: `${minRows * 1.5}em` }}
      />
      {suggestion && (
        <div className="absolute bottom-2 right-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          Suggestion: {suggestion}
        </div>
      )}
    </div>
  );
}