export type AtlasMode = 'explore' | 'investigate' | 'evaluate';

export interface AtlasContext {
  speciesId?: string;
  speciesName?: string;
  problemId?: string;
  problemTitle?: string;
  currentUrl?: string;
  contextSummary?: string;
}

export interface AtlasCitation {
  documentId: string;
  title: string;
  documentType: 'species' | 'problem' | 'community';
  urlHash: string;
  relevantPassage: string;
  confidence: 'supported by retrieved evidence' | 'partially supported' | 'insufficient evidence';
}

export interface AtlasExternalCitation {
  sourceTitle: string;
  publisher: string;
  yearOrDate?: string;
  link?: string;
}

export interface AtlasEvaluationReport {
  claimOrProposal: string;
  supportingEvidence: string[];
  contradictoryOrLimitingEvidence: string[];
  missingInformation: string[];
  assumptions: string[];
  potentialRisks: string[];
  confidenceAssessment: string;
  suggestedNextSteps: string[];
}

export interface AtlasMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode: AtlasMode;
  summary?: string;
  websiteCitations?: AtlasCitation[];
  externalCitations?: AtlasExternalCitation[];
  suggestedFollowUps?: string[];
  uncertaintyNotes?: string;
  isSupportedByRetrievedContent?: boolean;
  evaluationReport?: AtlasEvaluationReport;
}

export interface AtlasQueryRequest {
  message: string;
  mode: AtlasMode;
  context?: AtlasContext;
  history?: { role: 'user' | 'model'; text: string }[];
  publishedDocuments?: PublicDocPayload[];
}

export interface PublicDocPayload {
  id: string;
  title: string;
  type: 'species' | 'problem';
  slug: string;
  summary: string;
  content: string;
  tags?: string[];
}

export interface AtlasQueryResponse {
  answer: string;
  mode: AtlasMode;
  summary: string;
  websiteCitations: AtlasCitation[];
  externalCitations: AtlasExternalCitation[];
  suggestedFollowUps: string[];
  uncertaintyNotes?: string;
  isSupportedByRetrievedContent: boolean;
  evaluationReport?: AtlasEvaluationReport;
}
