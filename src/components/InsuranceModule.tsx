import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Phone, ArrowRight } from 'lucide-react';
import { InsuranceData } from '../data/healthcareData';

interface Props {
  data: InsuranceData;
  onSearch: (q: string) => void;
}

export function InsuranceModule({ data, onSearch }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <p className="text-[17px] leading-relaxed text-gray-700">{data.summary}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="tel:+1-800-555-0100"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          Patient Financial Services
        </a>
        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-50 border border-gray-100 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          Online cost estimator →
        </button>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Common Questions
        </h2>
        <div className="space-y-2" role="list">
          {data.faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 + i * 0.06, duration: 0.2 }}
              className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden"
              role="listitem"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                aria-expanded={open === i}
                aria-controls={`faq-${i}`}
              >
                <span className="text-[15px] font-medium text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <motion.div
                id={`faq-${i}`}
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-[15px] text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {data.followUps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Related questions
          </p>
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
