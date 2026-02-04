import React, { useState } from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelpTooltip({ title, content, aiTip }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
      >
        <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 left-0 top-7 w-80 p-4 bg-white rounded-xl shadow-2xl border border-gray-200"
          >
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{content}</p>
              
              {aiTip && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">AI Tip:</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{aiTip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}