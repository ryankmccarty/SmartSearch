import React, { useMemo, useState, useRef } from 'react';
import { SearchBar } from '../components/SearchBar';
import { ResultsList } from '../components/ResultsList';
import { AnswerSkeleton, ResultsListSkeleton } from '../components/Skeletons';
import { ConditionModule } from '../components/ConditionModule';
import { ProcedureModule } from '../components/ProcedureModule';
import { InsuranceModule } from '../components/InsuranceModule';
import { HeroIllustration } from '../components/HeroIllustration';
import { performSearch, SearchResponse } from '../lib/search';
import { detectIntent, detectConditionKey, detectProcedureKey } from '../lib/intent';
import { QueryIntent, conditionData, genericCondition, procedureData, genericProcedure, insuranceData } from '../data/healthcareData';
import { Doctor, Location, searchIndex as allPages } from '../data/searchIndex';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, Clock, CheckCircle2, CalendarDays,
  LogIn, Sparkles, FileText, Send, ArrowRight, Filter,
  Phone, MessageCircle, ArrowUpRight,
} from 'lucide-react';

// ─── Example queries (monospace pill style) ───────────────────────────────────

const exampleQueries = [
  'find a primary care doctor near me',
  'what causes lower back pain?',
  'urgent care open right now',
  'prepare for my MRI',
  'is this covered by my insurance?',
];

// ─── Doctor filter options ────────────────────────────────────────────────────

const filterOptions = {
  specialty:    ['All Specialties', 'Primary Care', 'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology', 'OB-GYN'],
  availability: ['Any Availability', 'Today', 'This Week', 'Accepting New Patients'],
  language:     ['All Languages', 'English', 'Spanish', 'Mandarin', 'Polish', 'Hindi'],
  gender:       ['Any Gender', 'Female', 'Male'],
};

// ─── Mock logged-in user ──────────────────────────────────────────────────────

const MOCK_USER = {
  firstName: 'Ryan',
  initials: 'RM',
  upcomingAppointment: {
    type: 'Annual wellness visit',
    date: 'Thu, May 15',
    time: '2:45 PM',
  },
  recentSearches: ['pediatrician near me', 'urgent care wait times', 'MyChart login'],
};

// ─── Deterministic helpers ────────────────────────────────────────────────────

const SLOTS   = ['Today · 3:15 PM', 'Tomorrow · 9:30 AM', 'Wed · 11:00 AM', 'Thu · 2:45 PM', 'Fri · 10:15 AM', 'Today · 5:00 PM'];
const WAITS   = [
  { open: true,  label: 'Open now', wait: '~10 min' },
  { open: true,  label: 'Open now', wait: '~25 min' },
  { open: false, label: 'Closed',   wait: null },
  { open: true,  label: 'Open now', wait: '~5 min' },
  { open: true,  label: 'Open now', wait: '~40 min' },
];
const RATINGS = [4.9, 4.8, 4.7, 4.6, 4.8];

const nextAvailable  = (id: string) => SLOTS[id.charCodeAt(id.length - 1) % SLOTS.length];
const locationStatus = (id: string) => WAITS[id.charCodeAt(id.length - 1) % WAITS.length];
const starRating     = (id: string) => RATINGS[id.charCodeAt(id.length - 1) % RATINGS.length];
const acceptingNew   = (id: string) => id.charCodeAt(id.length - 1) % 3 !== 2;

function timeOfDay() {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
}

// ─── Doctor card ──────────────────────────────────────────────────────────────

function DoctorCard({ doctor, index }: { doctor: Doctor; index: number }) {
  const available = nextAvailable(doctor.id);
  const rating    = starRating(doctor.id);
  const accepting = acceptingNew(doctor.id);
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.06, duration: 0.22 }}
      className="flex items-start gap-4 p-5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100/70 transition-colors"
      aria-label={`${doctor.name}, ${doctor.specialty}`}
    >
      <img src={doctor.photoUrl} alt={doctor.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-semibold text-gray-900 text-[15px] leading-tight">{doctor.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{doctor.specialty}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="text-sm text-gray-600" aria-label={`${rating} stars`}>{rating}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          {accepting ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-1">
              <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Accepting new patients
            </span>
          ) : (
            <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-1">
              Not accepting new patients
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <CalendarDays className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            Next: <span className="font-medium text-gray-700 ml-1">{available}</span>
          </span>
        </div>
      </div>
      <button
        className="shrink-0 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors self-center"
        aria-label={`Book appointment with ${doctor.name}`}
      >
        Book
      </button>
    </motion.article>
  );
}

// ─── Location card ────────────────────────────────────────────────────────────

function LocationCard({ location, index }: { location: Location; index: number }) {
  const status = locationStatus(location.id);
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 + index * 0.06, duration: 0.22 }}
      className="flex items-start gap-4 p-5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100/70 transition-colors"
      aria-label={location.name}
    >
      <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
        <MapPin className="w-4 h-4 text-gray-600" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-[15px] leading-tight">{location.name}</p>
        <p className="text-sm text-gray-500 mt-0.5">{location.address} · {location.distance}</p>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${status.open ? 'text-green-700' : 'text-gray-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.open ? 'bg-green-500' : 'bg-gray-300'}`} aria-hidden="true" />
            {status.label} · {location.hours}
          </span>
          {status.wait && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              Est. wait: <span className="font-medium text-gray-700 ml-1">{status.wait}</span>
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 shrink-0 self-center">
        <button className="px-3.5 py-1.5 bg-gray-900 text-white rounded-full text-xs font-semibold hover:bg-gray-700 transition-colors">
          Check in
        </button>
        <button className="px-3.5 py-1.5 border border-gray-200 text-gray-600 rounded-full text-xs font-medium hover:border-gray-400 transition-colors">
          Directions
        </button>
      </div>
    </motion.article>
  );
}

// ─── Doctor filter bar ────────────────────────────────────────────────────────

function DoctorFilterBar() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    specialty:    'All Specialties',
    availability: 'Any Availability',
    language:     'All Languages',
    gender:       'Any Gender',
  });

  return (
    <div className="flex flex-wrap gap-2 mb-4" role="toolbar" aria-label="Filter doctors">
      {Object.entries(filterOptions).map(([key, options]) => (
        <div key={key} className="relative">
          <select
            value={activeFilters[key]}
            onChange={e => setActiveFilters(prev => ({ ...prev, [key]: e.target.value }))}
            className="appearance-none pl-3 pr-7 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none transition-colors"
            aria-label={`Filter by ${key}`}
          >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <Filter className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

// ─── No results ───────────────────────────────────────────────────────────────

function NoResults({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-14 text-center space-y-6"
    >
      <div>
        <p className="text-lg font-semibold text-gray-800">No results found</p>
        <p className="text-sm text-gray-400 mt-1">Try rephrasing, or reach out directly.</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="tel:+1-800-555-0100"
          className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          <Phone className="w-4 h-4" aria-hidden="true" /> Nurse advice line
        </a>
        <button
          onClick={() => onSearch('urgent care near me')}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" /> Urgent care locations
        </button>
      </div>
      <p className="text-xs text-gray-400 font-mono">
        Try: "chest pain" · "find a cardiologist" · "prepare for MRI"
      </p>
    </motion.div>
  );
}

// ─── General AI answer ────────────────────────────────────────────────────────

function GeneralAnswer({ text, citations, cta, onSearch, suggestions }: {
  text: string;
  citations: typeof allPages;
  cta?: { label: string; url: string };
  onSearch: (q: string) => void;
  suggestions: string[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Answer</span>
      </div>
      <p className="text-[17px] text-gray-700 leading-relaxed">{text}</p>
      {citations.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">Sources:</span>
          {citations.map(doc => (
            <span
              key={doc.id}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
            >
              <FileText className="w-3 h-3" aria-hidden="true" />{doc.title}
            </span>
          ))}
        </div>
      )}
      {cta && (
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors">
          {cta.label} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
      {children}
    </h2>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Search() {
  const [query, setQuery]           = useState('');
  const [followUp, setFollowUp]     = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [response, setResponse]     = useState<SearchResponse | null>(null);
  const [intent, setIntent]         = useState<QueryIntent>('general');
  const [condKey, setCondKey]       = useState('generic');
  const [procKey, setProcKey]       = useState('generic');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (newQuery: string) => {
    if (!newQuery.trim()) return;
    const detected = detectIntent(newQuery);
    setQuery(newQuery);
    setIntent(detected);
    setCondKey(detectConditionKey(newQuery));
    setProcKey(detectProcedureKey(newQuery));
    setIsSearching(true);
    setHasSearched(true);
    setFollowUp('');
    window.scrollTo({ top: 0 });
    const res = await performSearch(newQuery);
    setResponse(res);
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setHasSearched(false);
    setIsSearching(false);
    setResponse(null);
    setQuery('');
  };

  const handleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (followUp.trim()) handleSearch(followUp.trim());
  };

  const citationDocs = useMemo(() => {
    if (!response?.answer) return [];
    return response.answer.citations
      .map(id => allPages.find(p => p.id === id))
      .filter(Boolean) as typeof allPages;
  }, [response]);

  const generalFollowUps = useMemo(() => response?.suggestions.slice(0, 5) ?? [], [response]);

  const condData = conditionData[condKey] ?? genericCondition;
  const procData = procedureData[procKey] ?? genericProcedure;

  const showDoctors   = (intent === 'find-doctor' || intent === 'general') && (response?.matchedDoctors.length ?? 0) > 0;
  const showLocations = (intent === 'find-location' || intent === 'general') && (response?.matchedLocations.length ?? 0) > 0;
  const showResources = intent === 'general' && (response?.results.length ?? 0) > 0;
  const showNoResults = !isSearching && response && response.confidence === 'zero';

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100" role="banner">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center gap-4">
          <button
            onClick={handleClearSearch}
            className="font-display font-bold text-[15px] text-gray-900 shrink-0 hover:text-gray-600 transition-colors"
            aria-label="Go to home"
          >
            Ask [System]
          </button>

          <div className="flex-1" />

          <button
            onClick={() => setIsLoggedIn(v => !v)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors shrink-0"
            aria-label={isLoggedIn ? 'Signed in as Ryan' : 'Sign in'}
          >
            {isLoggedIn ? (
              <span
                className="w-7 h-7 rounded-full bg-gray-900 text-white font-bold text-xs flex items-center justify-center select-none"
                aria-hidden="true"
              >
                {MOCK_USER.initials}
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sign in</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── Page content ── */}
      <main>
        <AnimatePresence mode="wait">

          {/* ── HOME ── */}
          {!hasSearched && (
            <motion.div
              key="home"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-5 py-20"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full max-w-[480px]"
              >
                {/* Illustration */}
                <div className="flex justify-center mb-8">
                  <HeroIllustration className="text-gray-200" />
                </div>

                {/* Caption */}
                <p className="text-xs text-gray-400 text-center tracking-widest uppercase mb-5">
                  Powered by Guided Search
                </p>

                {/* Headline */}
                <h1 className="font-display text-[44px] sm:text-[56px] font-bold text-gray-950 text-center leading-[1.08] tracking-tight mb-10">
                  The easiest way<br />to find care.
                </h1>

                {/* Search input */}
                <SearchBar onSearch={handleSearch} isHero isLoading={false} />

                {/* Logged-in greeting */}
                <AnimatePresence>
                  {isLoggedIn && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-gray-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {MOCK_USER.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Good {timeOfDay()}, {MOCK_USER.firstName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          Next: <span className="font-medium text-gray-700">{MOCK_USER.upcomingAppointment.type}</span>
                          {' '}· {MOCK_USER.upcomingAppointment.date} at {MOCK_USER.upcomingAppointment.time}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Example query pills (monospace style) */}
                <div className="mt-6 space-y-2">
                  {(isLoggedIn ? MOCK_USER.recentSearches : exampleQueries).map((q, i) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.2 }}
                      onClick={() => handleSearch(q)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                    >
                      <span className="font-mono text-sm text-gray-500 truncate">{q}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" aria-hidden="true" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {hasSearched && (
            <motion.div
              key="results"
              ref={contentRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="max-w-2xl mx-auto px-5 py-10 pb-36"
            >

              {/* Loading skeleton */}
              {isSearching && (
                <div aria-live="polite" aria-label="Loading results">
                  <div className="h-8 w-56 bg-gray-100 rounded-full animate-pulse mb-8" />
                  <AnswerSkeleton />
                  <div className="mt-10"><ResultsListSkeleton /></div>
                </div>
              )}

              {!isSearching && response && (
                <div className="space-y-10" aria-live="polite">

                  {/* User query bubble */}
                  <div className="flex justify-end">
                    <div className="bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] text-gray-900 text-[15px] leading-relaxed">
                      {query}
                    </div>
                  </div>

                  {/* Did you mean */}
                  {response.didYouMean && (
                    <p className="text-sm text-gray-500">
                      Did you mean:{' '}
                      <button onClick={() => handleSearch(response.didYouMean!)} className="underline underline-offset-2 italic hover:text-gray-800 transition-colors">
                        {response.didYouMean}
                      </button>?
                    </p>
                  )}

                  {/* ── Condition module ── */}
                  {intent === 'condition' && (
                    <ConditionModule data={condData} onSearch={handleSearch} />
                  )}

                  {/* ── Procedure module ── */}
                  {intent === 'procedure' && (
                    <ProcedureModule data={procData} onSearch={handleSearch} />
                  )}

                  {/* ── Insurance module ── */}
                  {intent === 'insurance' && (
                    <InsuranceModule data={insuranceData} onSearch={handleSearch} />
                  )}

                  {/* ── General: AI answer ── */}
                  {(intent === 'find-doctor' || intent === 'find-location' || intent === 'general') && response.answer && response.confidence === 'high' && (
                    <GeneralAnswer
                      text={response.answer.answer}
                      citations={citationDocs}
                      cta={response.answer.cta}
                      onSearch={handleSearch}
                      suggestions={response.suggestions}
                    />
                  )}

                  {/* ── Doctors ── */}
                  {showDoctors && (
                    <div>
                      <SectionLabel>Providers ({response!.matchedDoctors.length})</SectionLabel>
                      {intent === 'find-doctor' && <DoctorFilterBar />}
                      <div className="space-y-2.5">
                        {response!.matchedDoctors.map((doc, i) => (
                          <DoctorCard key={doc.id} doctor={doc} index={i} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Locations ── */}
                  {showLocations && (
                    <div>
                      <SectionLabel>Locations near you ({response!.matchedLocations.length})</SectionLabel>
                      <div className="space-y-2.5">
                        {response!.matchedLocations.map((loc, i) => (
                          <LocationCard key={loc.id} location={loc} index={i} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Resources ── */}
                  {showResources && (
                    <div>
                      <SectionLabel>Resources ({response!.results.length})</SectionLabel>
                      <ResultsList results={response!.results} query={query} />
                    </div>
                  )}

                  {/* ── General follow-ups ── */}
                  {intent === 'general' && generalFollowUps.length > 0 && (
                    <div>
                      <SectionLabel>Related questions</SectionLabel>
                      <div className="space-y-1.5">
                        {generalFollowUps.map(chip => (
                          <button
                            key={chip}
                            onClick={() => handleSearch(chip)}
                            className="w-full flex items-center gap-2.5 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[15px] text-gray-700 hover:bg-gray-100 text-left transition-all group"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-600 shrink-0 transition-colors" aria-hidden="true" />
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── No results ── */}
                  {showNoResults && <NoResults onSearch={handleSearch} />}

                  {/* ── Disclaimer ── */}
                  <footer className="pt-6 border-t border-gray-100" role="contentinfo">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      AI-generated answer. Not medical advice — consult a clinician. Verify critical facts with a qualified healthcare provider. In an emergency, call 911.
                    </p>
                  </footer>

                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Fixed follow-up bar ── */}
      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, delay: 0.2 }}
            className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-5 py-3"
            role="complementary"
            aria-label="Ask a follow-up question"
          >
            <form onSubmit={handleFollowUp} className="max-w-2xl mx-auto flex gap-2 items-center">
              <input
                type="text"
                value={followUp}
                onChange={e => setFollowUp(e.target.value)}
                placeholder="Ask a follow-up..."
                aria-label="Follow-up question"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!followUp.trim()}
                aria-label="Submit follow-up"
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center disabled:opacity-30 hover:bg-gray-700 transition-colors"
              >
                <Send className="w-4 h-4 text-white" aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
