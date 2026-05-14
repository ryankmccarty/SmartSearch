import React, { useMemo, useState, useEffect, useRef } from 'react';
import { SearchBar } from '../components/SearchBar';
import { QuickAssistCard } from '../components/QuickAssistCard';
import { ResultsList } from '../components/ResultsList';
import { AnswerSkeleton, ResultsListSkeleton } from '../components/Skeletons';
import { Tabs, Tab } from '../components/Tabs';
import { RightRail } from '../components/RightRail';
import { performSearch, SearchResponse } from '../lib/search';
import { Doctor, Location } from '../data/searchIndex';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, UserRound, Video, Brain, FlaskConical, Stethoscope,
  ChevronRight, Star, MapPin, Clock, CheckCircle2, CalendarDays,
  ArrowUpRight, LogIn, LogOut, Sparkles,
} from 'lucide-react';

// ─── Static data ──────────────────────────────────────────────────────────────

const careCategories = [
  { icon: Activity,     label: 'Urgent Care',      query: 'urgent care near me',                        note: 'Walk-in · No appointment' },
  { icon: UserRound,    label: 'Primary Care',      query: 'primary care doctor accepting new patients', note: 'New patients welcome' },
  { icon: Video,        label: 'Virtual Visit',     query: 'schedule a video visit today',               note: 'Available today' },
  { icon: Brain,        label: 'Mental Health',     query: 'mental health counseling near me',           note: 'Confidential care' },
  { icon: FlaskConical, label: 'Imaging & Labs',    query: 'lab work and imaging services',              note: 'Walk-in available' },
  { icon: Stethoscope,  label: 'Find a Specialist', query: 'find a specialist near me',                  note: 'All specialties' },
];

const patientSearches = [
  'Urgent care wait times',
  'Find a primary care doctor',
  'Book a same-day appointment',
  'Video visit today',
  'My medical records',
  'Nearest ER',
];

const navLinks = ['Care options', 'Patients & visitors', 'Community', 'About'];

// ─── Mock logged-in user ──────────────────────────────────────────────────────

const MOCK_USER = {
  firstName: 'Ryan',
  fullName: 'Ryan McCarty',
  initials: 'RM',
  primaryDoctor: {
    id: 'd3',
    name: 'Dr. Priya Patel',
    specialty: 'Primary Care',
    photoUrl: 'https://images.unsplash.com/photo-1594824436998-d40bb60241a7?auto=format&fit=crop&q=80&w=150&h=150',
  },
  upcomingAppointment: {
    doctor: 'Dr. Priya Patel',
    type: 'Annual wellness visit',
    date: 'Thu, May 15',
    time: '2:45 PM',
  },
  recentSearches: ['pediatrician near me', 'urgent care wait times', 'MyChart login'],
  followedTopics: ['Primary Care', 'Cardiology', 'Mental Health'],
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

const nextAvailable = (id: string) => SLOTS[id.charCodeAt(id.length - 1) % SLOTS.length];
const locationStatus = (id: string) => WAITS[id.charCodeAt(id.length - 1) % WAITS.length];
const starRating = (id: string) => RATINGS[id.charCodeAt(id.length - 1) % RATINGS.length];
const acceptingNew = (id: string) => id.charCodeAt(id.length - 1) % 3 !== 2;

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

// Derive 4-5 contextual continuation chips from a query + suggestions
function buildContinuations(query: string, suggestions: string[]): string[] {
  const q = query.toLowerCase();
  const extras: string[] = [];
  if (q.includes('urgent') || q.includes('immediate')) extras.push('Urgent care vs. ER', 'Save your spot online', 'What to bring');
  if (q.includes('primary') || q.includes('pcp'))      extras.push('Accepting new patients', 'Same-day openings', 'Telehealth option');
  if (q.includes('video') || q.includes('virtual'))    extras.push('Same-day available', 'Telehealth FAQ', 'Supported conditions');
  if (q.includes('mental') || q.includes('anxiety'))   extras.push('Types of therapy', 'Virtual counseling', 'Crisis resources');
  if (q.includes('lab') || q.includes('imaging'))      extras.push('Order lab work', 'View test results', 'What to expect');
  if (q.includes('bill') || q.includes('pay'))         extras.push('Payment plans', 'Financial assistance', 'Insurance accepted');
  const combined = [...new Set([...suggestions, ...extras])];
  return combined.slice(0, 5);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DoctorCard({ doctor, index }: { doctor: Doctor; index: number }) {
  const available = nextAvailable(doctor.id);
  const rating    = starRating(doctor.id);
  const accepting = acceptingNew(doctor.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.06, duration: 0.3 }}
      className="flex items-start gap-4 p-5 bg-white border border-border rounded-2xl hover:shadow-md transition-shadow"
    >
      <img src={doctor.photoUrl} alt={doctor.name} className="w-14 h-14 rounded-full object-cover border border-border shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3 className="font-semibold text-primary text-base leading-tight">{doctor.name}</h3>
            <p className="text-sm text-neutral-500 mt-0.5">{doctor.specialty}</p>
          </div>
          <div className="flex items-center gap-1 text-sm shrink-0">
            <Star className="w-3.5 h-3.5 fill-endeavor-gold text-endeavor-gold" />
            <span className="font-medium text-neutral-700">{rating}</span>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {accepting && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
              <CheckCircle2 className="w-3 h-3" />Accepting new patients
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
            <CalendarDays className="w-3.5 h-3.5 text-endeavor-blue" />
            Next available: <span className="font-medium text-neutral-700 ml-0.5">{available}</span>
          </span>
        </div>
      </div>
      <button className="shrink-0 px-4 py-2 bg-endeavor-gold text-endeavor-navy rounded-full text-sm font-bold hover:opacity-90 transition-opacity self-center">
        Schedule
      </button>
    </motion.div>
  );
}

function LocationCard({ location, index }: { location: Location; index: number }) {
  const status = locationStatus(location.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.06, duration: 0.3 }}
      className="flex items-start gap-4 p-5 bg-white border border-border rounded-2xl hover:shadow-md transition-shadow"
    >
      <div className="w-10 h-10 rounded-full bg-endeavor-ice flex items-center justify-center shrink-0 mt-0.5">
        <MapPin className="w-4 h-4 text-endeavor-blue" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-primary text-base leading-tight">{location.name}</h3>
        <p className="text-sm text-neutral-500 mt-0.5">{location.address} · {location.distance}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${status.open ? 'text-green-700' : 'text-neutral-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.open ? 'bg-green-500' : 'bg-neutral-400'}`} />
            {status.label} · {location.hours}
          </span>
          {status.wait && (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
              <Clock className="w-3 h-3" />
              Est. wait: <span className="font-medium text-neutral-700 ml-0.5">{status.wait}</span>
            </span>
          )}
        </div>
      </div>
      <button className="shrink-0 px-4 py-2 bg-white border border-border text-endeavor-navy rounded-full text-sm font-bold hover:bg-endeavor-lavender transition-colors self-center">
        Directions
      </button>
    </motion.div>
  );
}

function SectionHeading({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs font-bold text-endeavor-navy uppercase tracking-wider">
        {label}{count !== undefined && <span className="ml-1 text-neutral-400">({count})</span>}
      </h2>
      <button className="text-xs text-endeavor-blue hover:underline flex items-center gap-0.5">
        See all <ArrowUpRight className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Search() {
  const [query, setQuery]             = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [response, setResponse]       = useState<SearchResponse | null>(null);
  const [activeTab, setActiveTab]     = useState('all');
  const [scrolled, setScrolled]       = useState(false);
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = async (newQuery: string) => {
    if (!newQuery.trim()) return;
    setQuery(newQuery);
    setIsSearching(true);
    setHasSearched(true);
    setActiveTab('all');
    const res = await performSearch(newQuery);
    setResponse(res);
    setIsSearching(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleClearSearch = () => {
    setHasSearched(false);
    setIsSearching(false);
    setResponse(null);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const continuationChips = useMemo(
    () => (response ? buildContinuations(query, response.suggestions) : []),
    [response, query]
  );

  const resultSummary = useMemo(() => {
    if (!response) return '';
    const parts: string[] = [];
    if (response.matchedDoctors.length)   parts.push(`${response.matchedDoctors.length} provider${response.matchedDoctors.length > 1 ? 's' : ''}`);
    if (response.matchedLocations.length) parts.push(`${response.matchedLocations.length} location${response.matchedLocations.length > 1 ? 's' : ''}`);
    if (response.results.length)          parts.push(`${response.results.length} service${response.results.length > 1 ? 's' : ''}`);
    return parts.join(' · ');
  }, [response]);

  const filteredResults = useMemo(() => {
    if (!response) return [];
    if (activeTab === 'all') return response.results;
    if (activeTab === 'services') return response.results.filter(r => r.doc.category.includes('Services') || r.doc.category.includes('Specialty Care'));
    if (activeTab === 'locations') return response.results.filter(r => r.doc.category === 'Locations');
    return response.results;
  }, [response, activeTab]);

  const tabs: Tab[] = useMemo(() => {
    if (!response) return [];
    return [
      { id: 'all',       label: 'All' },
      { id: 'doctors',   label: 'Doctors',   count: response.matchedDoctors.length },
      { id: 'locations', label: 'Locations', count: response.matchedLocations.length },
      { id: 'services',  label: 'Services',  count: response.results.filter(r => r.doc.category.includes('Services') || r.doc.category.includes('Specialty Care')).length },
      { id: 'articles',  label: 'Articles' },
    ];
  }, [response]);

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-primary font-sans selection:bg-highlight selection:text-primary">

      {/* ── Utility bar ── */}
      <div className="bg-endeavor-navy text-white text-sm py-2.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-6">
          {['Find a doctor', 'Locations', 'Careers', 'Give', 'Patient portal'].map(label => (
            <a key={label} href="#" onClick={e => e.preventDefault()} className="text-white/75 hover:text-endeavor-gold transition-colors">{label}</a>
          ))}
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled || hasSearched ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 h-[60px] flex items-center justify-between gap-6">
          <button onClick={handleClearSearch} className={`font-display text-xl font-bold tracking-tight shrink-0 ${scrolled || hasSearched ? 'text-endeavor-navy' : 'text-white'}`}>
            <span className="text-endeavor-blue">Happy</span> <span>Health</span>
          </button>
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <a key={link} href="#" onClick={e => e.preventDefault()} className={`text-sm font-medium hover:text-endeavor-blue transition-colors ${scrolled || hasSearched ? 'text-neutral-700' : 'text-white'}`}>{link}</a>
            ))}
          </div>
          {/* Sign in / avatar */}
          <button
            onClick={() => setIsLoggedIn(v => !v)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors shrink-0 ${
              isLoggedIn
                ? 'text-endeavor-navy'
                : scrolled || hasSearched ? 'text-neutral-600 hover:text-endeavor-blue' : 'text-white/80 hover:text-white'
            }`}
          >
            {isLoggedIn ? (
              <>
                <span className="w-8 h-8 rounded-full bg-endeavor-gold text-endeavor-navy font-bold text-xs flex items-center justify-center select-none">
                  {MOCK_USER.initials}
                </span>
                <span className="hidden sm:inline text-neutral-700">{MOCK_USER.firstName}</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign in</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <motion.section
        className="bg-endeavor-navy relative overflow-hidden -mt-[60px]"
        animate={hasSearched ? 'compact' : 'expanded'}
        variants={{
          expanded: { paddingTop: '120px', paddingBottom: '56px' },
          compact:  { paddingTop: '80px',  paddingBottom: '24px' },
        }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1e50] via-endeavor-navy to-[#183580] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative max-w-2xl mx-auto px-4 text-center">

          {/* ── Full hero headline ── */}
          <AnimatePresence>
            {!hasSearched && (
              <motion.div key="hero-headline" initial={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.28, ease: 'easeIn' }}>
                <p className="text-endeavor-gold text-xs font-bold uppercase tracking-widest mb-4">Your care, your way</p>
                <h1 className="font-display text-4xl sm:text-[52px] font-normal text-white leading-tight mb-4">
                  Find the{' '}
                  <em className="font-serif" style={{ fontStyle: 'italic', color: '#FFCF30' }}>care you need</em>, today.
                </h1>
                <p className="text-white/65 text-base sm:text-lg mb-8 leading-relaxed">
                  Tell us what's going on. We'll connect you to the right care.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Post-search context strip (above search bar) ── */}
          <AnimatePresence>
            {hasSearched && (
              <motion.div
                key="context-strip"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mb-4 text-center"
              >
                {isLoggedIn ? (
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
                      Good {timeOfDay()}, {MOCK_USER.firstName}
                    </span>
                    {!isSearching && resultSummary && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-white/80">
                        <Sparkles className="w-3.5 h-3.5 text-endeavor-gold" />
                        {resultSummary} found
                        <span className="text-white/40 mx-1">·</span>
                        <span className="text-endeavor-gold font-medium">matched to your care history</span>
                      </span>
                    )}
                    {isSearching && (
                      <span className="text-sm text-white/50">Searching for you…</span>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Showing results</span>
                    {!isSearching && resultSummary && (
                      <span className="text-sm text-white/70">{resultSummary} found near you</span>
                    )}
                    {isSearching && (
                      <span className="text-sm text-white/50">Searching…</span>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search bar */}
          <SearchBar initialQuery={query} onSearch={handleSearch} isHero={!hasSearched} isLoading={isSearching} />

          {/* ── Pre-search common chips ── */}
          <AnimatePresence mode="wait">
            {!hasSearched && (
              <motion.div key="popular" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="mt-5">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3">Common searches</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {patientSearches.map(q => (
                    <button key={q} onClick={() => handleSearch(q)} className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-sm text-white/75 hover:text-white transition-colors">{q}</button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Post-search continuation chips (below search bar) ── */}
            {hasSearched && (
              <motion.div
                key="continuations"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="mt-4"
              >
                {!isSearching && continuationChips.length > 0 && (
                  <>
                    <p className="text-white/35 text-xs font-bold uppercase tracking-wider mb-2.5">Try also</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {continuationChips.map(chip => (
                        <button
                          key={chip}
                          onClick={() => handleSearch(chip)}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-xs text-white/70 hover:text-white transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                      <button onClick={handleClearSearch} className="px-3 py-1 rounded-full text-xs text-white/35 hover:text-white/60 transition-colors">
                        ← Home
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* ── Dynamic content area ── */}
      <AnimatePresence mode="wait">

        {/* ── HOMEPAGE ── */}
        {!hasSearched && (
          <motion.div key="homepage" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>

            {/* Logged-in personal strip */}
            <AnimatePresence>
              {isLoggedIn && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35 }}
                  className="bg-endeavor-periwinkle border-b border-endeavor-blue/10 overflow-hidden"
                >
                  <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-endeavor-gold text-endeavor-navy font-bold text-sm flex items-center justify-center shrink-0 select-none">
                        {MOCK_USER.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-endeavor-navy">Good {timeOfDay()}, {MOCK_USER.firstName}</p>
                        <p className="text-xs text-neutral-500">
                          Next: <span className="font-medium text-endeavor-navy">{MOCK_USER.upcomingAppointment.type}</span> with {MOCK_USER.upcomingAppointment.doctor} · {MOCK_USER.upcomingAppointment.date} at {MOCK_USER.upcomingAppointment.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-neutral-500 mr-1 hidden sm:inline">Recent:</span>
                      {MOCK_USER.recentSearches.map(s => (
                        <button key={s} onClick={() => handleSearch(s)} className="px-3 py-1 bg-white border border-border rounded-full text-xs text-neutral-600 hover:border-endeavor-blue/30 hover:text-endeavor-blue transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Care categories */}
            <section className="bg-white border-b border-border">
              <div className="max-w-5xl mx-auto px-4 py-10">
                <p className="text-xs font-bold text-endeavor-navy uppercase tracking-widest mb-1">What kind of care do you need?</p>
                <div className="flex items-end justify-between mb-6">
                  <h2 className="font-display text-2xl font-normal text-endeavor-navy">Find care that fits your life</h2>
                  <a href="#" onClick={e => e.preventDefault()} className="text-sm text-endeavor-blue hover:underline hidden sm:flex items-center gap-1">All services <ChevronRight className="w-3.5 h-3.5" /></a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {careCategories.map(({ icon: Icon, label, query: q, note }, i) => (
                    <motion.button key={label} onClick={() => handleSearch(q)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="group flex flex-col items-center gap-3 p-4 bg-white border border-border rounded-2xl hover:border-endeavor-blue/30 hover:shadow-md transition-all text-center">
                      <div className="w-12 h-12 rounded-full bg-endeavor-ice group-hover:bg-endeavor-blue/10 flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5 text-endeavor-blue" strokeWidth={1.6} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-endeavor-navy leading-tight">{label}</div>
                        <div className="text-xs text-neutral-400 mt-0.5 leading-tight">{note}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="bg-white border-b border-border">
              <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                  {[{ value: '46', label: 'Immediate Care locations' }, { value: '300+', label: 'Care sites' }, { value: '9', label: 'Hospitals' }, { value: '6k+', label: 'Physicians & APPs' }].map(({ value, label }) => (
                    <div key={label}>
                      <div className="font-display text-4xl sm:text-5xl font-bold text-endeavor-navy mb-1">{value}</div>
                      <div className="text-sm text-neutral-500">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA banner */}
            <section className="bg-endeavor-blue py-14">
              <div className="max-w-2xl mx-auto px-4 text-center">
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-white mb-3">
                  United with one goal: <em className="font-serif" style={{ fontStyle: 'italic' }}>your best health</em>
                </h2>
                <p className="text-white/75 text-base mb-8 leading-relaxed">Pioneering, world-class care combined with a seamless, personal experience — every patient, every time.</p>
                <button onClick={e => e.preventDefault()} className="px-8 py-3 bg-endeavor-gold text-endeavor-navy rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
                  Learn about Endeavor Health
                </button>
              </div>
            </section>
          </motion.div>
        )}

        {/* ── RESULTS ── */}
        {hasSearched && (
          <motion.div key="results" ref={resultsRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.18, ease: [0, 0, 0.2, 1] }}>
            <div className="max-w-7xl mx-auto px-4 py-8">

              {isSearching && (
                <div className="max-w-3xl">
                  <div className="h-7 w-56 bg-neutral-200 rounded-full animate-pulse mb-8" />
                  <AnswerSkeleton />
                  <div className="mt-8"><ResultsListSkeleton /></div>
                </div>
              )}

              {!isSearching && response && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">
                  <div className="min-w-0 space-y-10">

                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Search results</p>
                      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-endeavor-navy">"{query}"</h2>
                    </div>

                    {response.didYouMean && (
                      <div className="text-neutral-600 text-sm">
                        Did you mean: <button onClick={() => handleSearch(response.didYouMean!)} className="text-endeavor-blue font-medium hover:underline italic">{response.didYouMean}</button>?
                      </div>
                    )}

                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    {activeTab === 'all' && (
                      <div className="space-y-10">
                        {response.answer && response.confidence === 'high' && <QuickAssistCard answer={response.answer} />}
                        {response.confidence === 'low' && response.results.length > 0 && (
                          <div className="p-4 bg-white border border-border rounded-xl text-neutral-600 text-sm">No direct answer found — showing the most relevant results below.</div>
                        )}
                        {response.confidence === 'zero' && (
                          <div className="text-center py-14 border border-border rounded-2xl bg-white">
                            <h2 className="font-display text-2xl font-normal mb-2 text-endeavor-navy">No matches found</h2>
                            <p className="text-neutral-500">Try a different search or explore care options above.</p>
                          </div>
                        )}
                        {response.matchedDoctors.length > 0 && (
                          <div>
                            <SectionHeading label="Providers" count={response.matchedDoctors.length} />
                            <div className="space-y-3">{response.matchedDoctors.slice(0, 3).map((doc, i) => <DoctorCard key={doc.id} doctor={doc} index={i} />)}</div>
                          </div>
                        )}
                        {response.matchedLocations.length > 0 && (
                          <div>
                            <SectionHeading label="Locations near you" count={response.matchedLocations.length} />
                            <div className="space-y-3">{response.matchedLocations.slice(0, 3).map((loc, i) => <LocationCard key={loc.id} location={loc} index={i} />)}</div>
                          </div>
                        )}
                        {filteredResults.length > 0 && (
                          <div>
                            <SectionHeading label="Services & resources" count={filteredResults.length} />
                            <ResultsList results={filteredResults} query={query} />
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'doctors' && (
                      <div className="space-y-3">
                        {response.matchedDoctors.length === 0
                          ? <p className="py-8 text-neutral-500">No providers found matching "{query}".</p>
                          : response.matchedDoctors.map((doc, i) => <DoctorCard key={doc.id} doctor={doc} index={i} />)}
                      </div>
                    )}

                    {activeTab === 'locations' && (
                      <div className="space-y-3">
                        {response.matchedLocations.length === 0
                          ? <p className="py-8 text-neutral-500">No locations found matching "{query}".</p>
                          : response.matchedLocations.map((loc, i) => <LocationCard key={loc.id} location={loc} index={i} />)}
                      </div>
                    )}

                    {(activeTab === 'services' || activeTab === 'articles') && (
                      filteredResults.length === 0
                        ? <p className="py-8 text-neutral-500">No {activeTab} found matching "{query}".</p>
                        : <ResultsList results={filteredResults} query={query} />
                    )}
                  </div>

                  {/* Right rail */}
                  <div className="hidden lg:block sticky top-24">
                    <RightRail
                      query={query}
                      topics={response.suggestions}
                      doctors={response.matchedDoctors}
                      locations={response.matchedLocations}
                      conditions={response.matchedConditions}
                      onTopicClick={handleSearch}
                      isLoggedIn={isLoggedIn}
                      user={isLoggedIn ? MOCK_USER : undefined}
                    />
                  </div>

                  <div className="block lg:hidden mt-10 pt-10 border-t border-border">
                    <RightRail
                      query={query}
                      topics={response.suggestions}
                      doctors={response.matchedDoctors}
                      locations={response.matchedLocations}
                      conditions={response.matchedConditions}
                      onTopicClick={handleSearch}
                      isLoggedIn={isLoggedIn}
                      user={isLoggedIn ? MOCK_USER : undefined}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
