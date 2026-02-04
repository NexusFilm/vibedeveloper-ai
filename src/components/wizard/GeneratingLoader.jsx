import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Lightbulb, Zap, CheckCircle2 } from 'lucide-react';

const GENERATION_PHASES = [
  { icon: Brain, text: "Analyzing your 5P framework...", color: "from-purple-500 to-blue-500", duration: 2000 },
  { icon: Lightbulb, text: "Crafting your app blueprint...", color: "from-yellow-500 to-orange-500", duration: 2500 },
  { icon: Sparkles, text: "Optimizing features & data structure...", color: "from-pink-500 to-purple-500", duration: 2000 },
  { icon: Zap, text: "Finalizing your build prompt...", color: "from-blue-500 to-cyan-500", duration: 1500 }
];

export default function GeneratingLoader() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentPhase >= GENERATION_PHASES.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentPhase(prev => prev + 1);
    }, GENERATION_PHASES[currentPhase].duration);

    return () => clearTimeout(timer);
  }, [currentPhase]);

  const phase = GENERATION_PHASES[currentPhase] || GENERATION_PHASES[GENERATION_PHASES.length - 1];
  const Icon = phase.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        className="bg-white rounded-2xl p-12 max-w-lg w-full mx-4 shadow-2xl"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <motion.div
              className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${phase.color} mb-6 relative`}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon className="h-12 w-12 text-white" />
              
              {/* Orbital particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3
                  }}
                >
                  <div 
                    className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full"
                    style={{ transform: 'translateX(-50%)' }}
                  />
                </motion.div>
              ))}
            </motion.div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {phase.text}
            </h3>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${phase.color}`}
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentPhase + 1) / GENERATION_PHASES.length) * 100}%` 
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <p className="text-sm text-gray-500">
              Phase {currentPhase + 1} of {GENERATION_PHASES.length}
            </p>

            {/* Floating dots */}
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}