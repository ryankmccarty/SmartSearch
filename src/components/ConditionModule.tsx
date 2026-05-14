import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { ConditionData } from '../data/healthcareData';
import { EmergencyBanner } from './EmergencyBanner';

function CitationPill({ id }: { id: number }) {
  return (
    <sup>
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 text-white text-[9px] font-bold ml-0.5 leading-none align-middle cursor-pointer hover:bg-gray-600 transition-colors">
        {id}
      </span>
    </sup>
  );
}

interface Props {
  data: ConditionData;
  onSearch: (q: string) => void;
}

export function ConditionModule({ data, onSearch }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {data.emergency && <EmergencyBanner />}

      <p className="text-[17px] leading-relaxed text-gray-700">{data.summary}</p>

      <hr className="border-gray-100" />

      {data.sections.map((section, si) => (
        <motion.section
          key={section.title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + si * 0.06, duration: 0.22 }}
          aria-labelledby={`section-${si}`}
        >
          <div className={`rounded-xl p-5 ${
            section.urgent
              ? 'bg-amber-50/60 border border-amber-100'
              : 'bg-gray-50 border border-gray-100'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              {section.urgent && (
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
              )}
              <h2
                id={`section-${si}`}
                className={`text-xs font-semibold uppercase tracking-widest ${
                  section.urgent ? 'text-amber-700' : 'text-gray-400'
                }`}
              >
                {section.title}
              </h2>
            </div>

            {section.content && (
              <p className="text-[16px] leading-relaxed text-gray-700">{section.content}</p>
            )}

            {section.items && (
              <ul className="space-y-2" role="list">
                {section.items.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-2.5">
                    <span
                      className={`w-1 h-1 rounded-full mt-[10px] shrink-0 ${
                        section.urgent ? 'bg-amber-400' : 'bg-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-[15px] text-gray-700 leading-relaxed">
                      {item.text}
                      {item.citation && <CitationPill id={item.citation} />}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.section>
      ))}

      {data.citations.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Sources</p>
          <div className="flex flex-wrap gap-2">
            {data.citations.map(c => (
              <span
                key={c.id}
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-gray-500 hover:border-gray-200 cursor-pointer transition-colors"
              >
                <span className="w-4 h-4 rounded-full bg-gray-800 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                  {c.id}
                </span>
                <span className="font-medium text-gray-600">{c.source}</span>
                <span className="text-gray-400 truncate max-w-[160px]">{c.title}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {data.relatedSpecialties.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Related specialties</p>
          <div className="flex flex-wrap gap-2">
            {data.relatedSpecialties.map(s => (
              <button
                key={s}
                onClick={() => onSearch(`find a ${s.toLowerCase()} specialist`)}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {data.followUps.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Related questions</p>
          <div className="space-y-1.5">
            {data.followUps.map(q => (
              <button
                key={q}
                onClick={() => onSearch(q)}
                className="w-full flex items-center gap-2.5 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[15px] text-gray-700 hover:bg-gray-100 text-left transition-all group"
              >
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-600 shrink-0 transition-colors" aria-hidden="true" />
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
