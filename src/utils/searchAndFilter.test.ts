import test from 'node:test';
import assert from 'node:assert/strict';
import {
  searchWildlife,
  searchProblems,
  searchCommunityPosts,
  performGlobalSearch,
  validateEmail
} from './searchAndFilter.ts';
import { WildlifeSpecies, ProblemInvestigation, CommunityPost } from '../types';

const mockSpecies: WildlifeSpecies[] = [
  {
    id: 'sp-1',
    slug: 'bengal-tiger',
    commonName: 'Royal Bengal Tiger',
    scientificName: 'Panthera tigris tigris',
    vernacularNames: [{ language: 'Hindi', name: 'Bagh' }],
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class: 'Mammalia',
      order: 'Carnivora',
      family: 'Felidae',
      genus: 'Panthera'
    },
    iucnStatus: 'Endangered',
    iucnTrend: 'Decreasing',
    distributionSummary: 'Terai arc, Central India, Western Ghats',
    biomes: ['Central Indian Forests', 'Western Ghats'],
    habitatAndEcosystem: 'Dry deciduous and moist evergreen forests',
    physicalDescription: 'Apex felid with rufous coat and black stripes',
    dietAndFeeding: 'Obligate carnivore preying on chital, sambar, gaur',
    behaviorAndSocialStructure: 'Solitary, territorial',
    reproductionAndLifecycle: 'Gestation 104-106 days',
    ecologicalRole: 'Apex predator regulating ungulate density and trophic cascades',
    threatsAndConservation: 'Habitat fragmentation, poaching, linear infrastructure',
    scientificallyDefensibleFacts: ['Can consume up to 40kg of meat in a single feeding event.'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    references: [],
    relatedProblemIds: ['prob-1'],
    publishedAt: '2026-10-14T00:00:00Z',
    updatedAt: '2026-10-14T00:00:00Z',
    isDraft: false
  },
  {
    id: 'sp-2',
    slug: 'gharial',
    commonName: 'Gharial',
    scientificName: 'Gavialis gangeticus',
    vernacularNames: [{ language: 'Hindi', name: 'Ghariyal' }],
    taxonomy: {
      kingdom: 'Animalia',
      phylum: 'Chordata',
      class: 'Reptilia',
      order: 'Crocodilia',
      family: 'Gavialidae',
      genus: 'Gavialis'
    },
    iucnStatus: 'Critically Endangered',
    iucnTrend: 'Decreasing',
    distributionSummary: 'Chambal, Girwa, and Son river sanctuaries',
    biomes: ['Indo-Gangetic Plain'],
    habitatAndEcosystem: 'Deep fast-flowing freshwater rivers with high sand banks',
    physicalDescription: 'Specialized piscivorous crocodilian with elongated snout',
    dietAndFeeding: 'Specialized fish feeder using interlocking needle teeth',
    behaviorAndSocialStructure: 'Basking aggregations on mid-river sandbars',
    reproductionAndLifecycle: 'Mound nesting on sandy riverbanks',
    ecologicalRole: 'Top riverine predator maintaining freshwater river health',
    threatsAndConservation: 'Sand mining, gillnets, dam-induced water fluctuations',
    scientificallyDefensibleFacts: ['Adult males develop a bulbous nasal cartilage termed a ghara.'],
    primaryImageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    references: [],
    relatedProblemIds: [],
    publishedAt: '2026-10-07T00:00:00Z',
    updatedAt: '2026-10-07T00:00:00Z',
    isDraft: false
  },
  {
    id: 'sp-3',
    slug: 'draft-species',
    commonName: 'Draft Species Test',
    scientificName: 'Testus draftus',
    vernacularNames: [],
    taxonomy: { kingdom: 'Animalia', phylum: 'Chordata', class: 'Aves', order: 'Passeriformes', family: 'Fringillidae', genus: 'Testus' },
    iucnStatus: 'Least Concern',
    iucnTrend: 'Stable',
    distributionSummary: 'Nowhere',
    biomes: [],
    habitatAndEcosystem: 'None',
    physicalDescription: 'Draft',
    dietAndFeeding: 'Draft',
    behaviorAndSocialStructure: 'Draft',
    reproductionAndLifecycle: 'Draft',
    ecologicalRole: 'Draft',
    threatsAndConservation: 'None',
    scientificallyDefensibleFacts: [],
    primaryImageUrl: '',
    gallery: [],
    references: [],
    relatedProblemIds: [],
    publishedAt: '2026-10-20T00:00:00Z',
    updatedAt: '2026-10-20T00:00:00Z',
    isDraft: true
  }
];

const mockProblems: ProblemInvestigation[] = [
  {
    id: 'prob-1',
    slug: 'elephant-corridors',
    title: 'Linear Infrastructure Fragmentation in Asian Elephant Corridors',
    subtitle: 'Mitigating Rail Collisions and Genetic Isolation in Eastern India',
    category: 'Infrastructure & Transport',
    status: 'Proposed Pilot',
    coverImageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80',
    readingTimeMinutes: 12,
    publishedAt: '2026-10-12T00:00:00Z',
    updatedAt: '2026-10-12T00:00:00Z',
    author: { name: 'Divyankar Y.', role: 'Founder & Student Researcher', affiliation: 'Vanya & Prayas' },
    isDraft: false,
    problemStatement: 'Unmitigated railway lines through notified elephant corridors cause fatal train hits.',
    executiveSummary: 'A multi-sensor optical and seismic detection system paired with automated loco-pilot alerts.',
    whyItMatters: { affectedPopulations: 'Elephant herds and rural trackside settlements', humanitarianImpact: 'Loss of life', ecologicalEconomicCost: 'Severe' },
    evidenceAndContext: { statistics: [{ label: 'Fatalities', value: '186 in 10 yrs', citation: 'MoEFCC' }], contextNarrative: 'Context', caseStudies: [] },
    rootCauseAnalysis: { visibleSymptoms: ['Collisions'], structuralUnderlyingDrivers: ['Unchecked rail speed'], institutionalGaps: ['Lack of sensor coordination'] },
    existingApproaches: [{ initiative: 'Honeybee acoustic deterrent', implementedBy: 'Railways', shortcomingsAndGaps: 'Habituation' }],
    proposedSolution: 'Integrated geophone seismic array + thermal optical cameras',
    solutionArchitecture: { components: [] },
    implementationBlueprint: [],
    resourcesAndCosts: { estimatedCostRange: 'INR 45-60 Lakhs / 10km', costBreakdown: [], fundingAndSustainability: 'CSR + MoEFCC' },
    risksAndLimitations: [],
    pilotProgram: { proposedLocation: 'Chilapatta Corridor, West Bengal', durationMonths: 6, targetCohort: 'Pilot section', methodology: 'Controlled testing' },
    evaluationMetrics: [],
    scalingStrategy: 'Expand across 101 notified corridors',
    references: []
  }
];

const mockCommunity: CommunityPost[] = [
  {
    id: 'comm-1',
    title: 'Geophone array latency under monsoon soil saturation',
    slug: 'geophone-latency',
    category: 'Solution Critique',
    author: { id: 'u1', name: 'Arjun Sen', handle: 'arjun_sen', role: 'Acoustics Researcher', avatarBg: 'bg-emerald-700' },
    content: 'How does damp clay in Bengal affect false positive detection rates in seismic sensors?',
    tags: ['Elephants', 'Sensors', 'Electronics'],
    createdAt: '2026-10-15T10:00:00Z',
    likesCount: 14,
    likedByUser: false,
    replies: []
  }
];

test('searchWildlife excludes drafts from public listings', () => {
  const results = searchWildlife(mockSpecies, '');
  assert.equal(results.length, 2);
  assert.equal(results.some(s => s.isDraft), false);
});

test('searchWildlife filters by query and class', () => {
  const results = searchWildlife(mockSpecies, 'Gharial', 'all', 'all', 'Reptilia');
  assert.equal(results.length, 1);
  assert.equal(results[0].commonName, 'Gharial');
});

test('searchWildlife filters by IUCN status', () => {
  const results = searchWildlife(mockSpecies, '', 'Critically Endangered');
  assert.equal(results.length, 1);
  assert.equal(results[0].slug, 'gharial');
});

test('searchProblems filters by category and search term', () => {
  const results = searchProblems(mockProblems, 'elephant', 'Infrastructure & Transport');
  assert.equal(results.length, 1);
  assert.equal(results[0].slug, 'elephant-corridors');

  const emptyResults = searchProblems(mockProblems, 'nonexistent');
  assert.equal(emptyResults.length, 0);
});

test('searchCommunityPosts filters by search query and tags', () => {
  const results = searchCommunityPosts(mockCommunity, 'sensors');
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'comm-1');
});

test('performGlobalSearch aggregates cross-category results', () => {
  const tigerSearch = performGlobalSearch('tiger', mockSpecies, mockProblems, mockCommunity);
  assert.ok(tigerSearch.length >= 1);
  assert.equal(tigerSearch[0].type, 'species');
  assert.equal(tigerSearch[0].title, 'Royal Bengal Tiger');

  const elephantSearch = performGlobalSearch('elephant', mockSpecies, mockProblems, mockCommunity);
  assert.ok(elephantSearch.length >= 1);
  assert.ok(elephantSearch.some(r => r.type === 'problem'));
  assert.ok(elephantSearch.some(r => r.type === 'community'));
});

test('validateEmail validates format strictly', () => {
  assert.equal(validateEmail('student@institute.ac.in'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail(''), false);
  assert.equal(validateEmail('missing@domain'), false);
});
