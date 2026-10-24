import {
  AtlasMode,
  AtlasContext,
  AtlasQueryRequest,
  AtlasQueryResponse,
  PublicDocPayload
} from '../types/atlas';
import { WildlifeSpecies, ProblemInvestigation } from '../types';

export function extractPublicDocuments(
  speciesList: WildlifeSpecies[],
  problemsList: ProblemInvestigation[]
): PublicDocPayload[] {
  const publicDocs: PublicDocPayload[] = [];

  // Species - strictly exclude drafts
  speciesList
    .filter((s) => !s.isDraft)
    .forEach((s) => {
      publicDocs.push({
        id: s.id,
        title: s.commonName,
        type: 'species',
        slug: s.slug,
        summary: s.physicalDescription.slice(0, 200),
        content: `Common Name: ${s.commonName}. Scientific Name: ${s.scientificName}. Class: ${s.taxonomy.class}. Order: ${s.taxonomy.order}. Family: ${s.taxonomy.family}. IUCN Status: ${s.iucnStatus}. Population Trend: ${s.iucnTrend}. Biomes: ${s.biomes.join(', ')}. Distribution: ${s.distributionSummary}. Habitat: ${s.habitatAndEcosystem}. Diet & Trophic Ecology: ${s.dietAndFeeding}. Behavior: ${s.behaviorAndSocialStructure}. Ecological Role: ${s.ecologicalRole}. Threats & Conservation: ${s.threatsAndConservation}. Field Facts: ${s.scientificallyDefensibleFacts.join(' ')}`,
        tags: [s.taxonomy.class, s.iucnStatus, ...s.biomes]
      });
    });

  // Problem Investigations - strictly exclude drafts
  problemsList
    .filter((p) => !p.isDraft)
    .forEach((p) => {
      publicDocs.push({
        id: p.id,
        title: p.title,
        type: 'problem',
        slug: p.slug,
        summary: p.subtitle || p.executiveSummary.slice(0, 200),
        content: `Problem Title: ${p.title}. Subtitle: ${p.subtitle}. Category: ${p.category}. Status: ${p.status}. Problem Statement: ${p.problemStatement}. Executive Summary: ${p.executiveSummary}. Why it matters: ${p.whyItMatters.humanitarianImpact}. Ecological cost: ${p.whyItMatters.ecologicalEconomicCost}. Root causes: ${p.rootCauseAnalysis.structuralUnderlyingDrivers.join(', ')}. Existing approaches & gaps: ${p.existingApproaches.map((e) => `${e.initiative}: ${e.shortcomingsAndGaps}`).join('; ')}. Proposed Solution: ${p.proposedSolution}. Components: ${p.solutionArchitecture.components.map((c) => `${c.name}: ${c.description} (${c.technicalOrOperationalMethod})`).join('; ')}. Resources & Cost: ${p.resourcesAndCosts.estimatedCostRange}. Pilot: ${p.pilotProgram.proposedLocation} (${p.pilotProgram.durationMonths} months, ${p.pilotProgram.methodology}). Evaluation metrics: ${p.evaluationMetrics.map((m) => `${m.indicator} (target: ${m.targetSuccessMetric})`).join('; ')}. Scaling strategy: ${p.scalingStrategy}.`,
        tags: [p.category, p.status]
      });
    });

  return publicDocs;
}

export async function askAtlas(
  message: string,
  mode: AtlasMode,
  context?: AtlasContext,
  history?: { role: 'user' | 'model'; text: string }[],
  publishedDocs?: PublicDocPayload[]
): Promise<AtlasQueryResponse> {
  const payload: AtlasQueryRequest = {
    message,
    mode,
    context,
    history,
    publishedDocuments: publishedDocs
  };

  const response = await fetch('/api/atlas/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Atlas service request failed with HTTP ${response.status}`);
  }

  const data: AtlasQueryResponse = await response.json();
  return data;
}
