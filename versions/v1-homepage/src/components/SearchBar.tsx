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
}
export function SearchBar({
  initialQuery = '',
  onSearch,
  isHero = false
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

  // Rotate placeholder every 3 seconds when the field is empty and unfocused
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
      className={`relative w-full max-w-3xl mx-auto ${isHero ? 'mt-8' : 'mt-0'}`}>

      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center bg-surface border transition-colors duration-200 ${
          isFocused
            ? 'border-neutral-400 ring-4 ring-neutral-100'
            : 'border-border hover:border-neutral-300'
        } ${isHero ? 'h-16 rounded-full' : 'h-14 rounded-full'}`}>

        <div className="pl-6 pr-3 text-neutral-400">
          <Search className={isHero ? 'w-6 h-6' : 'w-5 h-5'} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={PLACEHOLDERS[placeholderIdx]}
          className={`flex-1 bg-transparent border-none outline-none text-primary placeholder:text-neutral-400 ${isHero ? 'text-lg' : 'text-base'}`}
        />

        <div className="pr-2 flex items-center gap-1">
          <button
            type="button"
            className="p-2 text-neutral-400 hover:text-endeavor-blue transition-colors rounded-full"
            aria-label="Voice search"
            title="Search by voice">
            <Mic className={isHero ? 'w-5 h-5' : 'w-4 h-4'} />
          </button>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-neutral-400 hover:text-neutral-700 transition-colors rounded-full"
              aria-label="Clear search">
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim()}
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${
              query.trim()
                ? 'bg-endeavor-gold text-endeavor-navy hover:opacity-90'
                : 'bg-neutral-100 text-neutral-400'
            } ${isHero ? 'w-12 h-12 mr-1' : 'w-10 h-10 mr-1'}`}>
            <ArrowRight className={isHero ? 'w-5 h-5' : 'w-4 h-4'} />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 py-2 bg-surface border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-6 py-3 hover:bg-neutral-50 flex items-center gap-3 text-neutral-700 transition-colors">
                <Search className="w-4 h-4 text-neutral-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
