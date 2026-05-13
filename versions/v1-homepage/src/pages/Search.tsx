import React, { useMemo, useState, useEffect, useRef } from 'react';
import { SearchBar } from '../components/SearchBar';
import { QuickAssistCard } from '../components/QuickAssistCard';
import { ResultsList } from '../components/ResultsList';
import { AnswerSkeleton, ResultsListSkeleton } from '../components/Skeletons';
import { Tabs, Tab } from '../components/Tabs';
import { RightRail } from '../components/RightRail';
import { performSearch, SearchResponse } from '../lib/search';
import { popularQueries } from '../data/searchIndex';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Heart,
  Brain,
  Bone,
  Activity,
  Stethoscope,
} from 'lucide-react';

const stats = [
  { value: '46',   label: 'Immediate Care locations' },
  { value: '300+', label: 'Care sites' },
  { value: '9',    label: 'Hospitals' },
  { value: '6k+',  label: 'Physicians & Advanced Practice Providers' },
];

const specialties = [
  { icon: Stethoscope, label: 'Primary Care' },
  { icon: Heart,       label: 'Cardiovascular Care' },
  { icon: Activity,    label: 'Cancer Care' },
  { icon: Brain,       label: 'Neurosciences' },
  { icon: Bone,        label: 'Orthopaedics' },
];

const navLinks = [
  'Care options',
  'Patients & visitors',
  'Community',
  'About',
];

export function Search() {
  const [query, setQuery]             = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [response, setResponse]       = useState<SearchResponse | null>(null);
  const [activeTab, setActiveTab]     = useState('all');
  const [scrolled, setScrolled]       = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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

    // Scroll results into view after a short delay so the panel has rendered
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleClearSearch = () => {
    setHasSearched(false);
    setResponse(null);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredResults = useMemo(() => {
    if (!response) return [];
    if (activeTab === 'all') return response.results;
    if (activeTab === 'services')
      return response.results.filter(
        (r) => r.doc.category.includes('Services') || r.doc.category.includes('Specialty Care')
      );
    if (activeTab === 'locations')
      return response.results.filter((r) => r.doc.category === 'Locations');
    return response.results;
  }, [response, activeTab]);

  const tabs: Tab[] = useMemo(() => {
    if (!response) return [];
    return [
      { id: 'all',       label: 'All' },
      { id: 'services',  label: 'Services',  count: response.results.filter((r) => r.doc.category.includes('Services') || r.doc.category.includes('Specialty Care')).length },
      { id: 'locations', label: 'Locations', count: response.results.filter((r) => r.doc.category === 'Locations').length },
      { id: 'doctors',   label: 'Doctors',   count: response.matchedDoctors.length },
      { id: 'articles',  label: 'Articles' },
    ];
  }, [response]);

  return (
    <div className="min-h-screen bg-white text-primary font-sans selection:bg-highlight selection:text-primary">

      {/* ── Utility bar ── */}
      <div className="bg-endeavor-navy text-white text-sm py-2.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-6">
          {['Find a doctor', 'Locations', 'Careers', 'Give', 'Patient portal'].map((label) => (
            <a key={label} href="#" onClick={(e) => e.preventDefault()} className="hover:text-endeavor-gold transition-colors">
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-sm' : 'bg-white/0'
        }`}
        style={{ backdropFilter: scrolled ? 'blur(8px)' : 'none' }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className={`font-display text-xl font-bold tracking-tight shrink-0 ${scrolled ? 'text-endeavor-navy' : 'text-white'}`}>
            <span className="text-endeavor-blue">Happy</span>{' '}
            <span>Health</span>
          </div>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                onClick={(e) => e.preventDefault()}
                className={`text-sm font-medium hover:text-endeavor-blue transition-colors ${
                  scrolled ? 'text-neutral-700' : 'text-white'
                }`}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-endeavor-navy relative overflow-hidden -mt-16 pt-16">
        {/* subtle diagonal gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1e4f] via-endeavor-navy to-[#1a3a8c] pointer-events-none" />
        {/* decorative dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
          {/* Eyebrow */}
          <p className="text-endeavor-gold text-xs font-bold uppercase tracking-widest mb-5">
            Your care, your way
          </p>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-tight mb-6">
            Your{' '}
            <em className="font-serif italic text-endeavor-gold not-italic" style={{ fontStyle: 'italic' }}>
              best health
            </em>{' '}
            is our endeavor.
          </h1>

          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            When you and your family are here, we treat you like the most important patients we've ever had. Because you are.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar
              initialQuery={query}
              onSearch={handleSearch}
              isHero
            />
          </div>

          {/* Popular search chips */}
          <AnimatePresence>
            {!hasSearched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-6 text-center"
              >
                <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-3">
                  Popular Searches
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularQueries.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSearch(q)}
                      className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pb-10" />
      </section>

      {/* ── Dynamic content area ── */}
      <AnimatePresence mode="wait">

        {/* ── RESULTS ── */}
        {hasSearched && (
          <motion.div
            key="results"
            ref={resultsRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="bg-white"
          >
            <div className="max-w-7xl mx-auto px-4 py-10">
              {/* Results header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-endeavor-navy">
                  Results for{' '}
                  <span className="text-neutral-400 font-normal">"{query}"</span>
                </h2>
                <button
                  onClick={handleClearSearch}
                  className="text-sm text-endeavor-blue hover:underline flex items-center gap-1"
                >
                  ← Back to home
                </button>
              </div>

              {isSearching ? (
                <div className="max-w-3xl">
                  <AnswerSkeleton />
                  <div className="mt-8">
                    <ResultsListSkeleton />
                  </div>
                </div>
              ) : response ? (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 items-start">
                  {/* Left — main results */}
                  <div className="min-w-0">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    <div className="space-y-8">
                      {response.didYouMean && (
                        <div className="text-neutral-600">
                          Did you mean:{' '}
                          <button
                            onClick={() => handleSearch(response.didYouMean!)}
                            className="text-endeavor-blue font-medium hover:underline italic"
                          >
                            {response.didYouMean}
                          </button>
                          ?
                        </div>
                      )}

                      {activeTab === 'all' && response.answer && response.confidence === 'high' && (
                        <QuickAssistCard answer={response.answer} />
                      )}

                      {activeTab === 'all' && response.confidence === 'low' && response.results.length > 0 && (
                        <div className="p-4 bg-neutral-50 border border-border rounded-lg text-neutral-600 text-sm">
                          We couldn't find a direct answer — here are the most relevant pages.
                        </div>
                      )}

                      {response.confidence === 'zero' && (
                        <div className="text-center py-16 border border-border rounded-2xl bg-endeavor-lavender">
                          <h2 className="font-display text-2xl font-normal mb-2 text-endeavor-navy">
                            No direct matches found
                          </h2>
                          <p className="text-neutral-500 mb-6">
                            We couldn't find any pages matching "{query}". Try broadening your search.
                          </p>
                        </div>
                      )}

                      {activeTab === 'doctors' && (
                        <div className="space-y-0">
                          {response.matchedDoctors.map((doctor, index) => (
                            <motion.div
                              key={doctor.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="py-6 border-b border-border last:border-0 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-4">
                                <img
                                  src={doctor.photoUrl}
                                  alt={doctor.name}
                                  className="w-16 h-16 rounded-full object-cover border border-border"
                                />
                                <div>
                                  <h3 className="text-xl font-medium text-primary">{doctor.name}</h3>
                                  <div className="text-sm text-neutral-500 mt-1">{doctor.specialty}</div>
                                </div>
                              </div>
                              <button className="px-5 py-2 bg-endeavor-blue text-white rounded-full text-sm font-bold hover:bg-endeavor-blueHover transition-colors">
                                Schedule
                              </button>
                            </motion.div>
                          ))}
                          {response.matchedDoctors.length === 0 && (
                            <div className="py-8 text-neutral-500">No doctors found matching "{query}".</div>
                          )}
                        </div>
                      )}

                      {activeTab === 'locations' && (
                        <div className="space-y-0">
                          {response.matchedLocations.map((location, index) => (
                            <motion.div
                              key={location.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="py-6 border-b border-border last:border-0 flex items-start justify-between"
                            >
                              <div>
                                <h3 className="text-xl font-medium text-primary">{location.name}</h3>
                                <div className="text-sm text-neutral-500 mt-1">{location.address}</div>
                                <div className="text-sm text-neutral-500 mt-1">Hours: {location.hours}</div>
                              </div>
                              <button className="px-5 py-2 bg-white border border-border rounded-full text-sm font-bold text-endeavor-navy hover:bg-endeavor-lavender transition-colors">
                                Get directions
                              </button>
                            </motion.div>
                          ))}
                          {response.matchedLocations.length === 0 && (
                            <div className="py-8 text-neutral-500">No locations found matching "{query}".</div>
                          )}
                        </div>
                      )}

                      {(activeTab === 'all' || activeTab === 'services' || activeTab === 'articles') &&
                        filteredResults.length > 0 && (
                          <ResultsList results={filteredResults} query={query} />
                        )}

                      {(activeTab === 'services' || activeTab === 'articles') && filteredResults.length === 0 && (
                        <div className="py-8 text-neutral-500">
                          No {activeTab} found matching "{query}".
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right — sidebar */}
                  <div className="hidden lg:block sticky top-24">
                    <RightRail
                      query={query}
                      topics={response.suggestions}
                      doctors={response.matchedDoctors}
                      locations={response.matchedLocations}
                      conditions={response.matchedConditions}
                      onTopicClick={handleSearch}
                    />
                  </div>

                  <div className="block lg:hidden mt-12 pt-12 border-t border-border">
                    <RightRail
                      query={query}
                      topics={response.suggestions}
                      doctors={response.matchedDoctors}
                      locations={response.matchedLocations}
                      conditions={response.matchedConditions}
                      onTopicClick={handleSearch}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}

        {/* ── HOMEPAGE CONTENT (no search) ── */}
        {!hasSearched && (
          <motion.div
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            {/* Stats strip */}
            <section className="border-b border-border">
              <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                  {stats.map(({ value, label }) => (
                    <div key={label}>
                      <div className="font-display text-4xl sm:text-5xl font-bold text-endeavor-navy mb-1">
                        {value}
                      </div>
                      <div className="text-sm text-neutral-500">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* "How can we help" — care section */}
            <section className="py-16 bg-endeavor-lavender">
              <div className="max-w-7xl mx-auto px-4">
                <p className="text-xs font-bold uppercase tracking-widest text-endeavor-navy mb-3">
                  The care you need
                </p>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <h2 className="font-display text-3xl sm:text-4xl font-normal text-endeavor-navy">
                    Explore all specialties
                  </h2>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center gap-1 text-endeavor-blue font-medium text-sm hover:underline"
                  >
                    View all <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {specialties.map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      onClick={(e) => e.preventDefault()}
                      className="group bg-white rounded-xl p-6 flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-shadow text-center border border-border hover:border-endeavor-blue/20"
                    >
                      <div className="w-14 h-14 rounded-full bg-endeavor-ice flex items-center justify-center">
                        <Icon className="w-7 h-7 text-endeavor-blue" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm font-bold text-endeavor-navy">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Blue CTA banner */}
            <section className="bg-endeavor-blue py-16">
              <div className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-white mb-4">
                  United with one goal:{' '}
                  <em className="font-serif italic">your best health</em>
                </h2>
                <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed">
                  Endeavor Health delivers convenient access to pioneering, world-class care combined with a seamless, personal experience — every patient, every time.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="px-8 py-3 bg-white text-endeavor-navy rounded-full font-bold text-sm hover:bg-neutral-100 transition-colors"
                  >
                    Introducing Endeavor Health
                  </button>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="px-8 py-3 bg-endeavor-gold text-endeavor-navy rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Explore all locations
                  </button>
                </div>
              </div>
            </section>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
