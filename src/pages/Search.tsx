import React, { useMemo, useState, useRef } from 'react';
import { SearchBar } from '../components/SearchBar';
import { ResultsList } from '../components/ResultsList';
import { AnswerSkeleton, ResultsListSkeleton } from '../components/Skeletons';
import { performSearch, SearchResponse } from '../lib/search';
import { Doctor, Location, searchIndex as allPages } from '../data/searchIndex';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, Clock, CheckCircle2,
  LogIn, Sparkles, FileText, Send, ArrowRight,
} from 'lucide-react';

// ─── Static data ──────────────────────────────────────────────────────────────

const patientSearches = [
  'Urgent care wait times',
  'Find a primary care doctor',
  'Book a same-day appointment',
  'Video visit today',
  'Nearest ER',
  'My medical records',
];

// ─── Mock logged-in user ──────────────────────────────────────────────────────

const MOCK_USER = {
  firstName: 'Ryan',
  initials: 'RM',
  primaryDoctor: { name: 'Dr. Priya Patel', specialty: 'Primary Care' },
  upcomingAppointment: {
    doctor: 'Dr. Priya Patel',
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

function buildContinuations(query: string, suggestions: string[]): string[] {
  const q = query.toLowerCase();
  const extras: string[] = [];
  if (q.includes('urgent') || q.includes('immediate')) extras.push('Urgent care vs. ER', 'Save your spot online', 'What to bring');
  if (q.includes('primary') || q.includes('pcp'))      extras.push('Accepting new patients', 'Same-day openings', 'Telehealth option');
  if (q.includes('video') || q.includes('virtual'))    extras.push('Same-day available', 'Telehealth FAQ', 'Supported conditions');
  if (q.includes('mental') || q.includes('anxiety'))   extras.push('Types of therapy', 'Virtual counseling', 'Crisis resources');
  if (q.includes('lab') || q.includes('imaging'))      extras.push('Order lab work', 'View test results', 'What to expect');
  if (q.includes('bill') || q.includes('pay'))         extras.push('Payment plans', 'Financial assistance', 'Insurance accepted');
  return [...new Set([...suggestions, ...extras])].slice(0, 5);
}

// ─── Cards ───────────────────────────────────────────────────────────────────

function DoctorCard({ doctor, index }: { doctor: Doctor; index: number }) {
  const available = nextAvailable(doctor.id);
  const rating    = starRating(doctor.id);
  const accepting = acceptingNew(doctor.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.05, duration: 0.22 }}
      className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-endeavor-blue/25 hover:shadow-sm transition-all"
    >
      <img src={doctor.photoUrl} alt={doctor.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-900 text-sm leading-tight">{doctor.name}</p>
          {accepting && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-green-700 bg-green-50 rounded-full px-2 py-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" /> Accepting
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{doctor.specialty}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
            <Star className="w-2.5 h-2.5 fill-endeavor-gold text-endeavor-gold" /> {rating}
          </span>
          <span className="text-[11px] text-gray-400">Next: <span className="text-gray-600">{available}</span></span>
        </div>
      </div>
      <button className="shrink-0 px-3.5 py-1.5 bg-endeavor-gold text-endeavor-navy rounded-full text-xs font-bold hover:opacity-90 transition-opacity">
        Schedule
      </button>
    </motion.div>
  );
}

function LocationCard({ location, index }: { location: Location; index: number }) {
  const status = locationStatus(location.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 + index * 0.05, duration: 0.22 }}
      className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-endeavor-blue/25 hover:shadow-sm transition-all"
    >
      <div className="w-9 h-9 rounded-lg bg-[#E1F5FC] flex items-center justify-center shrink-0">
        <MapPin className="w-4 h-4 text-endeavor-blue" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm leading-tight">{location.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{location.address} · {location.distance}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${status.open ? 'text-green-700' : 'text-gray-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.open ? 'bg-green-500' : 'bg-gray-300'}`} />
            {status.label}
          </span>
          {status.wait && (
            <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" /> {status.wait} wait
            </span>
          )}
        </div>
      </div>
      <button className="shrink-0 px-3.5 py-1.5 border border-gray-200 text-gray-500 rounded-full text-xs font-medium hover:border-endeavor-blue/30 hover:text-endeavor-blue transition-colors">
        Directions
      </button>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Search() {
  const [query, setQuery]             = useState('');
  const [followUp, setFollowUp]       = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [response, setResponse]       = useState<SearchResponse | null>(null);
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (newQuery: string) => {
    if (!newQuery.trim()) return;
    setQuery(newQuery);
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

  const continuationChips = useMemo(
    () => (response ? buildContinuations(query, response.suggestions) : []),
    [response, query]
  );

  // Resolve citation IDs to page titles for the AI answer
  const citationDocs = useMemo(() => {
    if (!response?.answer) return [];
    return response.answer.citations
      .map(id => allPages.find(p => p.id === id))
      .filter(Boolean) as typeof allPages;
  }, [response]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">

          {/* Logo */}
          <button onClick={handleClearSearch} className="font-display font-bold text-[15px] shrink-0">
            <span className="text-endeavor-blue">Happy</span>
            <span className="text-endeavor-navy">Health</span>
          </button>

          {/* Search bar appears in header once results are showing */}
          <AnimatePresence>
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex-1"
              >
                <SearchBar
                  initialQuery={query}
                  onSearch={handleSearch}
                  isHero={false}
                  isLoading={isSearching}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!hasSearched && <div className="flex-1" />}

          {/* Sign in / avatar */}
          <button
            onClick={() => setIsLoggedIn(v => !v)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors shrink-0"
          >
            {isLoggedIn ? (
              <span className="w-7 h-7 rounded-full bg-endeavor-gold text-endeavor-navy font-bold text-xs flex items-center justify-center select-none">
                {MOCK_USER.initials}
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign in</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── Page content ── */}
      <AnimatePresence mode="wait">

        {/* ── HOME ── */}
        {!hasSearched && (
          <motion.div
            key="home"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 py-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-xl"
            >
              <h1 className="font-display text-3xl sm:text-[38px] font-semibold text-endeavor-navy text-center mb-2 leading-tight">
                Find the care you need
              </h1>
              <p className="text-gray-400 text-base text-center mb-7">
                Search for doctors, locations, conditions, and more.
              </p>

              <SearchBar onSearch={handleSearch} isHero isLoading={false} />

              {/* Logged-in appointment card */}
              <AnimatePresence>
                {isLoggedIn && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="mt-5 p-4 bg-[#F3F7FF] border border-endeavor-blue/10 rounded-xl flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-endeavor-gold text-endeavor-navy font-bold text-xs flex items-center justify-center shrink-0">
                      {MOCK_USER.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Good {timeOfDay()}, {MOCK_USER.firstName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        Next: <span className="font-medium text-gray-700">{MOCK_USER.upcomingAppointment.type}</span> · {MOCK_USER.upcomingAppointment.date} at {MOCK_USER.upcomingAppointment.time}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Example / recent chips */}
              <div className="mt-5 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2.5">
                  {isLoggedIn ? 'Recent searches' : 'Try searching for'}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {(isLoggedIn ? MOCK_USER.recentSearches : patientSearches).map(q => (
                    <button
                      key={q}
                      onClick={() => handleSearch(q)}
                      className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-endeavor-blue/40 hover:text-endeavor-blue transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
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
            className="max-w-2xl mx-auto px-4 py-8 pb-28"
          >
            {/* Loading */}
            {isSearching && (
              <div>
                <div className="h-5 w-44 bg-gray-100 rounded-full animate-pulse mb-6" />
                <AnswerSkeleton />
                <div className="mt-8"><ResultsListSkeleton /></div>
              </div>
            )}

            {!isSearching && response && (
              <div className="space-y-8">

                {/* Query heading */}
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{query}</h1>
                  {isLoggedIn && (
                    <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                      <Sparkles className="w-3 h-3 text-endeavor-blue" />
                      Personalized based on your care history
                    </p>
                  )}
                </div>

                {/* Did you mean */}
                {response.didYouMean && (
                  <p className="text-sm text-gray-500">
                    Did you mean:{' '}
                    <button onClick={() => handleSearch(response.didYouMean!)} className="text-endeavor-blue hover:underline italic">
                      {response.didYouMean}
                    </button>?
                  </p>
                )}

                {/* AI answer — prose style */}
                {response.answer && response.confidence === 'high' && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-endeavor-blue" />
                      <span className="text-xs font-semibold text-endeavor-blue uppercase tracking-wider">Quick answer</span>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed">{response.answer.answer}</p>
                    {citationDocs.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-xs text-gray-400">Sources:</span>
                        {citationDocs.map(doc => (
                          <span key={doc.id} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">
                            <FileText className="w-3 h-3" />{doc.title}
                          </span>
                        ))}
                      </div>
                    )}
                    {response.answer.cta && (
                      <button className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-endeavor-blue hover:text-endeavor-blueHover transition-colors">
                        {response.answer.cta.label} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <hr className="mt-5 border-gray-100" />
                  </div>
                )}

                {/* Zero results */}
                {response.confidence === 'zero' && (
                  <div className="py-16 text-center">
                    <p className="text-gray-400">No results found for "{query}".</p>
                    <p className="text-sm text-gray-300 mt-1">Try a different search term.</p>
                  </div>
                )}

                {/* Providers */}
                {response.matchedDoctors.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Providers ({response.matchedDoctors.length})
                    </h2>
                    <div className="space-y-2">
                      {response.matchedDoctors.slice(0, 3).map((doc, i) => (
                        <DoctorCard key={doc.id} doctor={doc} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Locations */}
                {response.matchedLocations.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Locations near you ({response.matchedLocations.length})
                    </h2>
                    <div className="space-y-2">
                      {response.matchedLocations.slice(0, 3).map((loc, i) => (
                        <LocationCard key={loc.id} location={loc} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {response.results.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Resources ({response.results.length})
                    </h2>
                    <ResultsList results={response.results} query={query} />
                  </div>
                )}

                {/* Follow-up suggestions — Perplexity-style list */}
                {continuationChips.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Follow-ups</h2>
                    <div className="space-y-1.5">
                      {continuationChips.map(chip => (
                        <button
                          key={chip}
                          onClick={() => handleSearch(chip)}
                          className="w-full flex items-center gap-2.5 px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm text-gray-700 hover:border-endeavor-blue/30 hover:text-endeavor-blue text-left transition-all group"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-endeavor-blue shrink-0 transition-colors" />
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fixed follow-up input (results only) ── */}
      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, delay: 0.25 }}
            className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur border-t border-gray-100 px-4 py-3"
          >
            <form onSubmit={handleFollowUp} className="max-w-2xl mx-auto flex gap-2 items-center">
              <input
                type="text"
                value={followUp}
                onChange={e => setFollowUp(e.target.value)}
                placeholder="Ask a follow-up..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-endeavor-blue focus:bg-white transition-colors placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!followUp.trim()}
                className="w-9 h-9 rounded-full bg-endeavor-blue flex items-center justify-center disabled:opacity-30 hover:bg-endeavor-blueHover transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
