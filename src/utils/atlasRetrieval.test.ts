import test from 'node:test';
import assert from 'node:assert/strict';
import {
  retrieveRelevantDocuments,
  formatRetrievedContext,
  buildAtlasSystemInstruction
} from './atlasRetrieval';
import { PublicDocPayload } from '../types/atlas';

const sampleDocs: PublicDocPayload[] = [
  {
    id: 'sp-tiger',
    title: 'Royal Bengal Tiger',
    type: 'species',
    slug: 'royal-bengal-tiger',
    summary: 'Apex felid of the Indian subcontinent with distinct stripe patterns.',
    content: 'The Royal Bengal Tiger (Panthera tigris tigris) occupies dense sal forests, alluvial grasslands, and mangroves of Sundarbans.',
    tags: ['Carnivore', 'Apex', 'Endangered', 'Sundarbans']
  },
  {
    id: 'prob-elephant',
    title: 'Mitigating Linear Infrastructure in Asian Elephant Corridors',
    type: 'problem',
    slug: 'mitigating-linear-infrastructure-elephant-corridors',
    summary: 'Deploying geophones and fiber-optic acoustic sensing along railway lines in Assam and Bengal.',
    content: 'Between 2010 and 2023 over 190 elephants were struck by trains. Seismic infrasound waves at 10-25 Hz can trigger automated brake alerts.',
    tags: ['Infrastructure', 'Elephants', 'Railways', 'Acoustics']
  },
  {
    id: 'prob-arsenic',
    title: 'Groundwater Arsenic Contamination in the Lower Gangetic Basin',
    type: 'problem',
    slug: 'groundwater-arsenic-and-depletion-gangetic-plain',
    summary: 'Decentralized Solar Electro-Chemical Arsenic Remediation in rural Bengal and Bihar.',
    content: 'Over 50 million people consume groundwater exceeding 10 ppb arsenic limit, leading to hyperkeratosis and blackfoot disease.',
    tags: ['Water', 'Public Health', 'Arsenic', 'Solar']
  }
];

test('retrieveRelevantDocuments matches exact keywords with high score', () => {
  const results = retrieveRelevantDocuments('tiger', sampleDocs);
  assert.equal(results.length, 1);
  assert.equal(results[0].doc.id, 'sp-tiger');
  assert.equal(results[0].urlHash, '#species/royal-bengal-tiger');
});

test('retrieveRelevantDocuments matches multi-term queries and ranks correctly', () => {
  const results = retrieveRelevantDocuments('elephant railway acoustic sensors', sampleDocs);
  assert.ok(results.length >= 1);
  assert.equal(results[0].doc.id, 'prob-elephant');
  assert.equal(results[0].urlHash, '#problem/mitigating-linear-infrastructure-elephant-corridors');
});

test('retrieveRelevantDocuments returns empty array for non-matching query', () => {
  const results = retrieveRelevantDocuments('quantum computing satellites', sampleDocs);
  assert.equal(results.length, 0);
});

test('formatRetrievedContext produces formatted text for model input', () => {
  const results = retrieveRelevantDocuments('arsenic', sampleDocs);
  const formatted = formatRetrievedContext(results);
  assert.ok(formatted.includes('Groundwater Arsenic Contamination'));
  assert.ok(formatted.includes('#problem/groundwater-arsenic-and-depletion-gangetic-plain'));
});

test('buildAtlasSystemInstruction includes mode-specific prompts', () => {
  const explorePrompt = buildAtlasSystemInstruction('explore');
  assert.ok(explorePrompt.includes('MODE: EXPLORE'));
  assert.ok(explorePrompt.includes('Linnaean taxonomy'));

  const investPrompt = buildAtlasSystemInstruction('investigate');
  assert.ok(investPrompt.includes('MODE: INVESTIGATE'));
  assert.ok(investPrompt.includes('1. Problem Definition'));

  const evalPrompt = buildAtlasSystemInstruction('evaluate');
  assert.ok(evalPrompt.includes('MODE: EVALUATE'));
  assert.ok(evalPrompt.includes('Critical Assessment'));
});
