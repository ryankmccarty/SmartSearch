import React from 'react';
import { motion } from 'framer-motion';
import { CannedAnswer, searchIndex } from '../data/searchIndex';
import { Sparkles, ArrowRight, FileText } from 'lucide-react';
interface QuickAssistCardProps {
  answer: CannedAnswer;
}
export function QuickAssistCard({ answer }: QuickAssistCardProps) {
  // Resolve citations to actual page docs
  const citationDocs = answer.citations.
  map((id) => searchIndex.find((p) => p.id === id)).
  filter(Boolean) as typeof searchIndex;
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="w-full max-w-3xl mx-auto border border-border rounded-2xl bg-surface overflow-hidden shadow-sm">
      
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4 text-neutral-500">
          <Sparkles className="w-5 h-5 text-neutral-700" />
          <span className="text-sm font-medium">Quick Assist</span>
        </div>

        <p className="text-lg text-neutral-800 leading-relaxed mb-6">
          {answer.answer}
        </p>

        {citationDocs.length > 0 &&
        <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mr-1">
              Sources
            </span>
            {citationDocs.map((doc) =>
          <a
            key={doc.id}
            href={doc.url}
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-full text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
            
                <FileText className="w-3 h-3" />
                {doc.title}
              </a>
          )}
          </div>
        }
      </div>

      {answer.cta &&
      <div className="bg-surface-dark p-4 sm:px-8 sm:py-5 flex justify-end">
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black rounded-full font-medium hover:bg-neutral-100 transition-colors">
            {answer.cta.label}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      }
    </motion.div>);

}