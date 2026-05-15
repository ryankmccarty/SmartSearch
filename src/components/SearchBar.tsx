import React, { useEffect, useState, useRef } from 'react';
import { X, ArrowUp, ArrowUpRight, Image, Mic, Telescope, Search } from 'lucide-react';
import { getAutocompleteSuggestions } from '../lib/search';
import { motion, AnimatePresence } from 'framer-motion';

const PLACEHOLDERS = [
  'Find a primary care physician',
  'Urgent care near me',
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

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  useEffect(() => {
    if (query || isFocused) return;
    const id = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [query, isFocused]);

  useEffect(() => {
    setSuggestions(query.length >= 2 && isFocused ? getAutocompleteSuggestions(query) : []);
  }, [query, isFocused]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
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

  // ── Hero card-style input ─────────────────────────────────────────────────
  if (isHero) {
    return (
      <div ref={containerRef} className="relative w-full">
        <form
          onSubmit={handleSubmit}
          className={`bg-white border rounded-2xl transition-all duration-200 ${
            isFocused
              ? 'border-gray-300 shadow-[0_4px_24px_rgba(0,0,0,0.10)]'
              : 'border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
          }`}
        >
          {/* Text input row */}
          <div className="px-5 pt-4 pb-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              aria-label="Search"
              className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 text-[17px] outline-none"
            />
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 pb-3">
            {/* Left: attachment icons */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
                aria-label="Attach image"
              >
                <Image className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
                aria-label="Explore"
              >
                <Telescope className="w-5 h-5" />
              </button>
            </div>

            {/* Right: clear + mic + submit */}
            <div className="flex items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full"
                  aria-label="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
                aria-label="Voice search"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={!query.trim()}
                aria-label="Search"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  query.trim()
                    ? 'bg-endeavor-blue text-white hover:bg-endeavor-blueHover'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Loading shimmer */}
          <AnimatePresence>
            {isLoading && (
              <div className="absolute bottom-0 left-6 right-6 h-[2px] overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  className="absolute h-full rounded-full bg-endeavor-blue/40"
                  style={{ width: '40%' }}
                  animate={{ x: ['-100%', '350%'] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                />
              </div>
            )}
          </AnimatePresence>
        </form>

        {/* Autocomplete dropdown */}
        <AnimatePresence>
          {isFocused && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14 }}
              className="absolute top-full left-0 right-0 mt-2 py-1 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 overflow-hidden"
            >
              {suggestions.map((s, i) => {
                const lq = query.toLowerCase();
                const typed = s.toLowerCase().startsWith(lq) ? query.length : 0;
                return (
                  <button
                    key={i}
                    onClick={() => { setQuery(s); onSearch(s); setIsFocused(false); }}
                    className="w-full flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[15px] text-gray-800 text-left">
                      {typed > 0 ? (
                        <>
                          <span className="font-normal">{s.slice(0, typed)}</span>
                          <span className="font-semibold">{s.slice(typed)}</span>
                        </>
                      ) : s}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Compact pill (header / results state) ─────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center h-[42px] rounded-full transition-all duration-200 ${
          isFocused
            ? 'bg-white border border-gray-300 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
            : 'bg-gray-100 border border-gray-100 hover:border-gray-200 hover:bg-gray-50'
        }`}
      >
        <div className="pl-4 pr-2.5 text-gray-400 shrink-0">
          <Search className="w-4 h-4" aria-hidden="true" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search..."
          aria-label="Search"
          className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 text-[14px] min-w-0"
        />

        <div className="pr-2 flex items-center gap-1 shrink-0">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full"
              aria-label="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim()}
            aria-label="Search"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all mr-0.5 ${
              query.trim()
                ? 'bg-endeavor-blue text-white hover:bg-endeavor-blueHover'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Loading shimmer */}
      <AnimatePresence>
        {isLoading && (
          <div className="absolute -bottom-px left-6 right-6 h-[2px] overflow-hidden rounded-full bg-gray-100">
            <motion.div
              className="absolute h-full rounded-full bg-endeavor-blue/40"
              style={{ width: '40%' }}
              animate={{ x: ['-100%', '350%'] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Autocomplete dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            className="absolute top-full left-0 right-0 mt-2 py-1 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 overflow-hidden"
          >
            {suggestions.map((s, i) => {
              const lq = query.toLowerCase();
              const typed = s.toLowerCase().startsWith(lq) ? query.length : 0;
              return (
                <button
                  key={i}
                  onClick={() => { setQuery(s); onSearch(s); setIsFocused(false); }}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-800 text-left">
                    {typed > 0 ? (
                      <>
                        <span className="font-normal">{s.slice(0, typed)}</span>
                        <span className="font-semibold">{s.slice(typed)}</span>
                      </>
                    ) : s}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden="true" />
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
