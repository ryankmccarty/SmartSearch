import {
  searchIndex,
  cannedAnswers,
  typoMap,
  PageDoc,
  CannedAnswer,
  doctors,
  locations,
  conditions,
  Doctor,
  Location,
  Condition } from
'../data/searchIndex';

export interface SearchResult {
  doc: PageDoc;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  answer: CannedAnswer | null;
  suggestions: string[];
  didYouMean: string | null;
  confidence: 'high' | 'low' | 'zero';
  matchedDoctors: Doctor[];
  matchedLocations: Location[];
  matchedConditions: Condition[];
}

function tokenize(text: string): string[] {
  return text.
  toLowerCase().
  replace(/[^\w\s]/g, '').
  split(/\s+/).
  filter((t) => t.length > 2);
}

function calculateScore(queryTokens: string[], doc: PageDoc): number {
  let score = 0;
  const titleTokens = tokenize(doc.title);
  const excerptTokens = tokenize(doc.excerpt);

  for (const q of queryTokens) {
    // Exact title match gets highest weight
    if (doc.title.toLowerCase().includes(q)) score += 10;
    // Token title match
    if (titleTokens.includes(q)) score += 5;
    // Tag match
    if (doc.tags.some((t) => t.includes(q))) score += 8;
    // Excerpt match
    if (doc.excerpt.toLowerCase().includes(q)) score += 2;
  }
  return score;
}

function searchDoctors(queryTokens: string[]): Doctor[] {
  if (queryTokens.length === 0) return doctors.slice(0, 3); // Return some defaults if empty

  return doctors.
  map((doc) => {
    let score = 0;
    const nameTokens = tokenize(doc.name);
    const specialtyTokens = tokenize(doc.specialty);

    for (const q of queryTokens) {
      if (doc.name.toLowerCase().includes(q)) score += 10;
      if (doc.specialty.toLowerCase().includes(q)) score += 8;
      if (doc.tags.some((t) => t.includes(q))) score += 5;
    }
    return { doc, score };
  }).
  filter((res) => res.score > 0).
  sort((a, b) => b.score - a.score).
  map((res) => res.doc);
}

function searchLocations(queryTokens: string[]): Location[] {
  if (queryTokens.length === 0) return locations.slice(0, 3);

  return locations.
  map((loc) => {
    let score = 0;
    const nameTokens = tokenize(loc.name);

    for (const q of queryTokens) {
      if (loc.name.toLowerCase().includes(q)) score += 10;
      if (loc.tags.some((t) => t.includes(q))) score += 5;
    }
    return { loc, score };
  }).
  filter((res) => res.score > 0).
  sort((a, b) => b.score - a.score).
  map((res) => res.loc);
}

function searchConditions(
queryTokens: string[],
rawQuery: string)
: Condition[] {
  if (queryTokens.length === 0 && !rawQuery) return [];

  return conditions.
  map((cond) => {
    let score = 0;
    // Match the raw query against tags (so multi-word tags like "chest pain" match)
    if (cond.tags.some((t) => rawQuery.includes(t))) score += 10;
    for (const q of queryTokens) {
      if (cond.name.toLowerCase().includes(q)) score += 8;
      if (cond.tags.some((t) => t.includes(q))) score += 5;
    }
    return { cond, score };
  }).
  filter((res) => res.score > 0).
  sort((a, b) => b.score - a.score).
  map((res) => res.cond);
}

export async function performSearch(query: string): Promise<SearchResponse> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 300));

  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return {
      results: [],
      answer: null,
      suggestions: [],
      didYouMean: null,
      confidence: 'zero',
      matchedDoctors: [],
      matchedLocations: [],
      matchedConditions: []
    };
  }

  // Check for "Did you mean?"
  let didYouMean = null;
  for (const [typo, correction] of Object.entries(typoMap)) {
    if (normalizedQuery.includes(typo) && typo !== correction) {
      didYouMean = normalizedQuery.replace(typo, correction);
      break;
    }
  }

  const searchTerms = tokenize(normalizedQuery);

  // Score and sort results
  const scoredResults = searchIndex.
  map((doc) => ({ doc, score: calculateScore(searchTerms, doc) })).
  filter((res) => res.score > 0).
  sort((a, b) => b.score - a.score);

  // Search Doctors, Locations, and Conditions
  const matchedDoctors = searchDoctors(searchTerms);
  const matchedLocations = searchLocations(searchTerms);
  const matchedConditions = searchConditions(searchTerms, normalizedQuery);

  // Find AI Answer
  let answer: CannedAnswer | null = null;
  for (const canned of cannedAnswers) {
    if (canned.queryMatch.some((match) => normalizedQuery.includes(match))) {
      answer = canned;
      break;
    }
  }

  // Generate suggestions based on top results' tags
  const suggestionSet = new Set<string>();
  scoredResults.slice(0, 3).forEach((res) => {
    res.doc.tags.forEach((tag) => {
      if (!searchTerms.includes(tag)) {
        suggestionSet.add(tag);
      }
    });
  });

  // Add some action suggestions if applicable
  if (
  normalizedQuery.includes('mri') ||
  normalizedQuery.includes('doctor') ||
  normalizedQuery.includes('heart'))
  {
    suggestionSet.add('Schedule an appointment');
  }
  if (normalizedQuery.includes('bill')) {
    suggestionSet.add('Financial assistance');
  }

  const suggestions = Array.from(suggestionSet).slice(0, 5);

  // Determine confidence
  let confidence: 'high' | 'low' | 'zero' = 'zero';
  if (
  scoredResults.length > 0 ||
  matchedDoctors.length > 0 ||
  matchedLocations.length > 0 ||
  matchedConditions.length > 0)
  {
    if (answer || scoredResults.length > 0 && scoredResults[0].score > 10) {
      confidence = 'high';
    } else {
      confidence = 'low';
    }
  }

  // If low confidence, suppress answer
  if (confidence === 'low') {
    answer = null;
  }

  // If zero results, still provide some fallback suggestions based on general topics
  if (confidence === 'zero') {
    suggestions.push('Primary Care', 'Urgent Care', 'Schedule an appointment');
  }

  return {
    results: scoredResults,
    answer,
    suggestions: suggestions.slice(0, 5),
    didYouMean,
    confidence,
    matchedDoctors,
    matchedLocations,
    matchedConditions
  };
}

export function getAutocompleteSuggestions(query: string): string[] {
  if (query.length < 2) return [];
  const normalized = query.toLowerCase();

  const suggestions = new Set<string>();

  // Match titles
  searchIndex.forEach((doc) => {
    if (doc.title.toLowerCase().includes(normalized)) {
      suggestions.add(doc.title);
    }
  });

  // Match tags
  searchIndex.forEach((doc) => {
    doc.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(normalized)) {
        suggestions.add(tag);
      }
    });
  });

  return Array.from(suggestions).slice(0, 5);
}