import { AtlasMode, AtlasContext, PublicDocPayload } from '../types/atlas';

export interface RetrievedPassage {
  doc: PublicDocPayload;
  score: number;
  passage: string;
  urlHash: string;
}

export function retrieveRelevantDocuments(
  query: string,
  docs: PublicDocPayload[],
  maxPassages = 4
): RetrievedPassage[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const queryTerms = q
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z0-9]/g, ''))
    .filter((t) => t.length > 2);

  const scoredDocs = docs.map((doc) => {
    let score = 0;
    const titleLower = doc.title.toLowerCase();
    const summaryLower = doc.summary.toLowerCase();
    const contentLower = doc.content.toLowerCase();

    // Direct exact substring matches
    if (titleLower.includes(q)) score += 50;
    if (summaryLower.includes(q)) score += 30;
    if (contentLower.includes(q)) score += 20;

    // Term-by-term matching
    for (const term of queryTerms) {
      if (titleLower.includes(term)) score += 15;
      if (summaryLower.includes(term)) score += 8;
      if (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(term))) score += 12;

      // Count term occurrences in content (capped at 5 to prevent gaming)
      const count = (contentLower.match(new RegExp(term, 'g')) || []).length;
      score += Math.min(count * 2, 10);
    }

    // Extract best passage around highest scoring term
    let bestPassage = doc.summary;
    for (const term of queryTerms) {
      const idx = contentLower.indexOf(term);
      if (idx !== -1) {
        const start = Math.max(0, idx - 80);
        const end = Math.min(doc.content.length, idx + 240);
        bestPassage = (start > 0 ? '...' : '') + doc.content.slice(start, end).trim() + (end < doc.content.length ? '...' : '');
        break;
      }
    }

    const urlHash = doc.type === 'species' ? `#species/${doc.slug}` : `#problem/${doc.slug}`;

    return {
      doc,
      score,
      passage: bestPassage,
      urlHash
    };
  });

  return scoredDocs
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPassages);
}

export function formatRetrievedContext(passages: RetrievedPassage[]): string {
  if (passages.length === 0) {
    return 'NO_MATCHING_PUBLISHED_DOCUMENTS_FOUND';
  }

  return passages
    .map(
      (p, i) =>
        `[Document ${i + 1} | Type: ${p.doc.type.toUpperCase()} | Title: "${p.doc.title}" | Link: ${p.urlHash}]\nPassage: ${p.passage}\n`
    )
    .join('\n');
}

export function buildAtlasSystemInstruction(
  mode: AtlasMode,
  context?: AtlasContext,
  passagesCount = 0
): string {
  const modeInstructions = {
    explore: `MODE: EXPLORE (Wildlife & Natural Sciences).
- Explain biological, taxonomic, ecological, and conservation phenomena.
- Detail adaptations, trophic interactions, Linnaean taxonomy, and habitat niches.
- When comparing two species, present structured comparison attributes (Distribution, Habitat, Diet, Behavior, Ecological Role, IUCN Status).
- Clarify scientific terminology and recommend related published monographs.`,

    investigate: `MODE: INVESTIGATE (Indian Problems & Solutions Engineering).
- Formulate practical, evidence-based blueprints for acute challenges in India.
- If proposing or detailing a solution, use the structured blueprint layout:
  1. Problem Definition
  2. Evidence & Context
  3. Root-Cause Analysis
  4. Stakeholders & Constraints
  5. Proposed Intervention
  6. Implementation Steps
  7. Resource & Cost Assumptions
  8. Risks & Limitations
  9. Pilot Design
  10. Evaluation Metrics
  11. Scaling Conditions
  12. References & Open Questions.
- Treat generated blueprints as proposals requiring evaluation, not proven facts.`,

    evaluate: `MODE: EVALUATE (Critical Assessment of Claims & Proposals).
- Separate established facts from hypotheses, inferences, and assumptions.
- Identify missing empirical evidence, unverified numbers, and institutional bottlenecks.
- Present a structured evaluation report:
  * Claim or proposal evaluated
  * Supporting evidence found
  * Contradictory or limiting evidence
  * Missing information
  * Unexamined assumptions
  * Potential risks & trade-offs
  * Confidence assessment (e.g. "supported by retrieved evidence", "partially supported", "insufficient evidence")
  * Suggested next steps or tests to validate.`
  };

  return `You are Atlas, the scientific AI research companion for VANA (वन), an Indian wildlife knowledge and problem-solving journal.

TONE & ETHICS:
- Thoughtful, clear, scientifically responsible, and accessible.
- Honest about uncertainty; never pretend to have conducted field experiments you have not performed.
- Never invent citations, URLs, statistics, or species populations.
- Never expose exact nesting/poaching coordinates of endangered wildlife (Schedule I).
- Prioritize the provided published platform documents when the user asks about content on this website.
- Clearly distinguish between information retrieved from VANA's published monographs and general scientific consensus.

${modeInstructions[mode]}

ACTIVE PAGE CONTEXT:
${context?.speciesName ? `- Viewing Species: ${context.speciesName}` : ''}
${context?.problemTitle ? `- Viewing Problem Investigation: ${context.problemTitle}` : ''}
${context?.currentUrl ? `- URL: ${context.currentUrl}` : ''}
${context?.contextSummary ? `- Context Summary: ${context.contextSummary}` : ''}

RETRIEVED PASSAGES FROM VANA ARCHIVES:
Found ${passagesCount} matching published documents. Use these as untrusted factual grounding.

OUTPUT FORMAT REQUIREMENTS:
You MUST respond with a valid JSON object matching this exact schema:
{
  "answer": "Comprehensive, beautifully formatted markdown response with headings, bullet points, and tables where applicable.",
  "mode": "${mode}",
  "summary": "1-2 sentence executive summary of the insight or finding.",
  "websiteCitations": [
    {
      "documentId": "id of document cited",
      "title": "Exact title of published document",
      "documentType": "species or problem",
      "urlHash": "#species/... or #problem/...",
      "relevantPassage": "Brief quote or relevant factual summary from document",
      "confidence": "supported by retrieved evidence | partially supported | insufficient evidence"
    }
  ],
  "externalCitations": [
    {
      "sourceTitle": "Name of peer-reviewed paper or official report",
      "publisher": "e.g. Wildlife Institute of India, ICMR, Lancet, CGWB",
      "yearOrDate": "e.g. 2022",
      "link": "optional URL if known"
    }
  ],
  "suggestedFollowUps": [
    "Thoughtful follow-up question 1",
    "Thoughtful follow-up question 2"
  ],
  "uncertaintyNotes": "Any technical caveats, lack of field data, or assumptions",
  "isSupportedByRetrievedContent": true or false
}
`;
}
