import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchResult } from '../lib/search';
import { Sparkles, Bookmark, MoreHorizontal } from 'lucide-react';
interface ResultsListProps {
  results: SearchResult[];
  query: string;
}
function HighlightText({ text, query }: {text: string;query: string;}) {
  if (!query.trim()) return <span>{text}</span>;
  const terms = query.
  toLowerCase().
  split(/\s+/).
  filter((t) => t.length > 2);
  if (terms.length === 0) return <span>{text}</span>;
  // Create a regex that matches any of the terms
  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => {
        const isMatch = terms.some((term) => part.toLowerCase() === term);
        return isMatch ?
        <span key={i} className="bg-highlight rounded-sm px-0.5">
            {part}
          </span> :

        <span key={i}>{part}</span>;

      })}
    </span>);

}
export function ResultsList({ results, query }: ResultsListProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  if (results.length === 0) return null;
  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;
  return (
    <div className="w-full">
      <div className="space-y-0">
        {visibleResults.map((result, index) =>
        <motion.div
          key={result.doc.id}
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: index * 0.05
          }}
          className="py-8 border-b border-border last:border-0 group">
          
            <div className="flex flex-col-reverse sm:flex-row gap-6 sm:gap-8 items-start">
              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 text-sm text-neutral-500">
                  <div className="w-5 h-5 rounded bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-400">
                    GH
                  </div>
                  <span>{result.doc.byline}</span>
                </div>

                <a
                href={result.doc.url}
                className="block mb-2"
                onClick={(e) => e.preventDefault()}>
                
                  <h3 className="text-[22px] leading-tight font-normal text-primary group-hover:text-endeavor-blue group-hover:underline decoration-2 underline-offset-2 mb-2 transition-colors">
                    <HighlightText text={result.doc.title} query={query} />
                  </h3>
                  <p className="text-neutral-600 leading-relaxed line-clamp-2">
                    <HighlightText text={result.doc.excerpt} query={query} />
                  </p>
                </a>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Sparkles className="w-3.5 h-3.5 text-highlight fill-highlight stroke-yellow-500" />
                    <span>{result.doc.updatedAt}</span>
                    <span>·</span>
                    <span>{result.doc.readTime}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline bg-neutral-100 px-2 py-0.5 rounded-full text-xs">
                      {result.doc.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-400">
                    <button className="hover:text-primary transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="hover:text-primary transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Thumbnail */}
              <a
              href={result.doc.url}
              onClick={(e) => e.preventDefault()}
              className="shrink-0 w-full sm:w-[140px] h-[180px] sm:h-[140px] block">
              
                <img
                src={result.doc.thumbnail}
                alt={result.doc.title}
                className="w-full h-full object-cover rounded-lg border border-border" />
              
              </a>
            </div>
          </motion.div>
        )}
      </div>

      {hasMore &&
      <div className="pt-8 pb-4 flex justify-center">
          <button
          onClick={() => setVisibleCount((prev) => prev + 5)}
          className="px-6 py-2 bg-surface border border-border rounded-full text-sm font-bold text-endeavor-navy hover:bg-endeavor-lavender transition-colors">
          
            Show more
          </button>
        </div>
      }
    </div>);

}