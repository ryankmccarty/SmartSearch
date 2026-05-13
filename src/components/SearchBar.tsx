import React, { useEffect, useState, useRef } from 'react';
import { Search, X, ArrowRight, Mic } from 'lucide-react';
import { getAutocompleteSuggestions } from '../lib/search';
import { motion, AnimatePresence } from 'framer-motion';

const PLACEHOLDERS = [
  'Help me find a primary care physician',
  'Immediate care near me',
  'Where do I find my medical records?',
  'Schedule a video visit for today',
  'Pediatrician with availability this week',
  'Cardiology specialist near me',
  'What are the ER wait times?',
  'How do I pay my bill online?',
];

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  isHero?: boolean;
  isLoading?: boolean;
}
export function SearchBar({
  initialQuery = '',
  onSearch,
  isHero = false,
  isLoading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (query || isFocused) return;
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [query, isFocused]);

  useEffect(() => {
    if (query.length >= 2 && isFocused) {
      setSuggestions(getAutocompleteSuggestions(query));
    } else {
      setSuggestions([]);
    }
  }, [query, isFocused]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setIsFocused(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-2xl mx-auto ${isHero ? 'mt-6' : 'mt-0'}`}>

      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center bg-white border transition-all duration-200 ${
          isFocused
            ? 'border-neutral-300 shadow-[0_4px_24px_rgba(14,36,91,0.18)]'
            : 'border-white/80 shadow-[0_2px_16px_rgba(14,36,91,0.12)]'
        } ${isHero ? 'h-[60px] rounded-full' : 'h-14 rounded-full'}`}>

        <div className="pl-5 pr-3 text-neutral-400 shrink-0">
          <Search className={isHero ? 'w-5 h-5' : 'w-5 h-5'} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={PLACEHOLDERS[placeholderIdx]}
          className="flex-1 bg-transparent border-none outline-none text-primary placeholder:text-neutral-400 text-base min-w-0"
        />

        <div className="pr-2 flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            className="p-2 text-neutral-400 hover:text-endeavor-blue transition-colors rounded-full"
            aria-label="Voice search"
            title="Search by voice">
            <Mic className="w-4 h-4" />
          </button>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors rounded-full"
              aria-label="Clear search">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim()}
            className={`rounded-full transition-all flex items-center justify-center mr-1.5 ${
              query.trim()
                ? 'bg-endeavor-gold text-endeavor-navy hover:opacity-90 shadow-sm'
                : 'bg-neutral-100 text-neutral-400'
            } ${isHero ? 'w-10 h-10' : 'w-10 h-10'}`}>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Sweeping shimmer while loading */}
      <AnimatePresence>
        {isLoading && (
          <div className="absolute -bottom-px left-6 right-6 h-[2px] overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="absolute h-full rounded-full"
              style={{
                width: '45%',
                background: 'linear-gradient(90deg, transparent, #FFCF30, transparent)',
              }}
              animate={{ x: ['-100%', '350%'] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 py-2 bg-white border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-5 py-3 hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors text-sm">
                <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>{suggestion}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
