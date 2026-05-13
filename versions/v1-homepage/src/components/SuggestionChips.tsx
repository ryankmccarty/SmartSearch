import React from 'react';
import { motion } from 'framer-motion';
interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  label?: string;
}
export function SuggestionChips({
  suggestions,
  onSelect,
  label = 'Related'
}: SuggestionChipsProps) {
  if (!suggestions.length) return null;
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="w-full max-w-3xl mx-auto py-6">
      
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-500 font-medium mr-2">
          {label}:
        </span>
        {suggestions.map((suggestion, i) =>
        <button
          key={i}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-1.5 text-sm bg-surface border border-border rounded-full hover:border-neutral-400 hover:bg-endeavor-lavender transition-colors text-neutral-700">
          
            {suggestion}
          </button>
        )}
      </div>
    </motion.div>);

}