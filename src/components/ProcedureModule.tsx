import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, ArrowRight, Clock } from 'lucide-react';
import { ProcedureData } from '../data/healthcareData';

interface Props {
  data: ProcedureData;
  onSearch: (q: string) => void;
}

export function ProcedureModule({ data, onSearch }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setChecked(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const total = data.timeline.reduce((n, p) => n + p.steps.length, 0);
  const done  = checked.size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Summary */}
      <p className="text-[17px] leading-relaxed text-gray-700">{data.summary}</p>

      {/* Progress */}
      {total > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-endeavor-blue rounded-full transition-all duration-300"
              style={{ width: `${(done / total) * 100}%` }}
              role="progressbar"
              aria-valuenow={done}
              aria-valuemax={total}
              aria-label="Preparation progress"
            />
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">{done} / {total} complete</span>
        </div>
      )}

      <hr className="border-gray-100" />

      {/* Timeline */}
      <div className="space-y-5">
        {data.timeline.map((phase, pi) => (
          <motion.div
            key={phase.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + pi * 0.07, duration: 0.22 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-endeavor-blue shrink-0" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{phase.label}</h2>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2.5">
              {phase.steps.map((step, si) => {
                const key = `${pi}-${si}`;
                const isDone = checked.has(key);
                return (
                  <button
                    key={si}
                    onClick={() => toggle(key)}
                    className={`w-full flex items-start gap-3 text-left transition-opacity ${isDone ? 'opacity-50' : ''}`}
                    aria-pressed={isDone}
                    aria-label={step.text}
                  >
                    {isDone
                      ? <CheckSquare className="w-4 h-4 text-endeavor-blue shrink-0 mt-0.5" aria-hidden="true" />
                      : <Square className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" aria-hidden="true" />
                    }
                    <span className={`text-[15px] leading-relaxed ${step.important ? 'font-medium text-gray-900' : 'text-gray-600'} ${isDone ? 'line-through' : ''}`}>
                      {step.text}
                      {step.important && (
                        <span className="ml-1.5 inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 rounded px-1.5 py-0.5">Important</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sources */}
      {data.citations.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sources</p>
          <div className="flex flex-wrap gap-2">
            {data.citations.map(c => (
              <span key={c.id} className="inline-flex items-center gap-2 text-xs px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-gray-500 cursor-pointer hover:border-gray-200 transition-colors">
                <span className="w-4 h-4 rounded-full bg-endeavor-navy text-white flex items-center justify-center text-[9px] font-bold shrink-0">{c.id}</span>
                <span className="font-medium text-gray-600">{c.source}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Follow-ups */}
      {data.followUps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Follow-ups</p>
          <div className="space-y-1.5">
            {data.followUps.map(q => (
              <button
                key={q}
                onClick={() => onSearch(q)}
                className="w-full flex items-center gap-2.5 px-4 py-3 bg-white border border-gray-100 rounded-xl text-[15px] text-gray-700 hover:border-endeavor-blue/30 hover:text-endeavor-blue text-left transition-all group"
              >
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-endeavor-blue shrink-0 transition-colors" aria-hidden="true" />
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
