export type IUCNStatus = 
  | 'Critically Endangered'
  | 'Endangered'
  | 'Vulnerable'
  | 'Near Threatened'
  | 'Least Concern'
  | 'Data Deficient';

export interface TaxonomicHierarchy {
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
}

export interface PhotoAsset {
  url: string;
  caption: string;
  photographer: string;
  license: string;
  locationGeneral: string;
  sensitiveSpeciesNotice?: string;
  isFounderPhoto?: boolean;
}

export interface ReferenceCitation {
  title: string;
  authors: string;
  year: number;
  publication: string;
  link?: string;
}

export interface WildlifeSpecies {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string;
  vernacularNames: { language: string; name: string }[];
  taxonomy: TaxonomicHierarchy;
  iucnStatus: IUCNStatus;
  iucnTrend: 'Decreasing' | 'Stable' | 'Increasing' | 'Unknown';
  distributionSummary: string;
  biomes: string[];
  habitatAndEcosystem: string;
  physicalDescription: string;
  dietAndFeeding: string;
  behaviorAndSocialStructure: string;
  reproductionAndLifecycle: string;
  ecologicalRole: string;
  threatsAndConservation: string;
  scientificallyDefensibleFacts: string[];
  primaryImageUrl: string;
  gallery: PhotoAsset[];
  references: ReferenceCitation[];
  relatedProblemIds: string[];
  publishedAt: string;
  updatedAt: string;
  isDraft?: boolean;
  weeklyFeatured?: boolean;
}

export type ProblemCategory =
  | 'Infrastructure & Transport'
  | 'Water & Sanitation'
  | 'Agriculture & Food'
  | 'Environment & Climate'
  | 'Healthcare & Epidemiology'
  | 'Wildlife & Biodiversity'
  | 'Energy & Clean Tech'
  | 'Governance & Digital Systems';

export interface ProblemInvestigation {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ProblemCategory;
  status: 'Under Investigation' | 'Proposed Pilot' | 'Field Trial Blueprint' | 'Policy Brief';
  coverImageUrl: string;
  imageCaption?: string;
  imageCredit?: string;
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    role: string;
    affiliation: string;
  };
  isDraft?: boolean;
  weeklyFeatured?: boolean;
  
  // Structured 16-point scientific framework
  problemStatement: string;
  executiveSummary: string;
  whyItMatters: {
    affectedPopulations: string;
    humanitarianImpact: string;
    ecologicalEconomicCost: string;
  };
  evidenceAndContext: {
    statistics: { label: string; value: string; citation: string }[];
    contextNarrative: string;
    caseStudies: { title: string; location: string; outcome: string }[];
  };
  rootCauseAnalysis: {
    visibleSymptoms: string[];
    structuralUnderlyingDrivers: string[];
    institutionalGaps: string[];
  };
  existingApproaches: {
    initiative: string;
    implementedBy: string;
    shortcomingsAndGaps: string;
  }[];
  proposedSolution: string;
  solutionArchitecture: {
    components: {
      name: string;
      description: string;
      technicalOrOperationalMethod: string;
      leadStakeholders: string;
    }[];
  };
  implementationBlueprint: {
    phase: string;
    timeline: string;
    keyDeliverables: string[];
    milestones: string;
  }[];
  resourcesAndCosts: {
    estimatedCostRange: string;
    costBreakdown: { item: string; costEst: string; rationale: string }[];
    fundingAndSustainability: string;
  };
  risksAndLimitations: {
    risk: string;
    severity: 'Low' | 'Medium' | 'High';
    mitigationStrategy: string;
  }[];
  pilotProgram: {
    proposedLocation: string;
    durationMonths: number;
    targetCohort: string;
    methodology: string;
  };
  evaluationMetrics: {
    indicator: string;
    baseline: string;
    targetSuccessMetric: string;
    verificationMethod: string;
  }[];
  scalingStrategy: string;
  references: ReferenceCitation[];
  relatedSpeciesIds?: string[];
}

export type CommunityCategory =
  | 'Wildlife Biology'
  | 'Indian Problems'
  | 'Solution Critique'
  | 'Field Observations'
  | 'Scientific Methodology'
  | 'General Discussion';

export interface CommunityReply {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    handle: string;
    role: string;
    avatarBg: string;
  };
  content: string;
  createdAt: string;
  likesCount: number;
  likedByUser: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  slug: string;
  category: CommunityCategory;
  author: {
    id: string;
    name: string;
    handle: string;
    role: string;
    avatarBg: string;
    bio?: string;
  };
  content: string;
  tags: string[];
  createdAt: string;
  likesCount: number;
  likedByUser: boolean;
  replies: CommunityReply[];
  linkedArticleId?: string;
  linkedArticleTitle?: string;
  linkedArticleType?: 'species' | 'problem';
  isPinned?: boolean;
  isReported?: boolean;
  reportCount?: number;
}

export interface ModerationReport {
  id: string;
  postId: string;
  postTitle: string;
  reason: string;
  reportedAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface NewsletterSubscriber {
  email: string;
  topics: string[];
  subscribedAt: string;
  frequency: 'Weekly Digest';
}

export type UserRole =
  | 'Owner & Editor-in-Chief'
  | 'Senior Wildlife Biologist'
  | 'Environmental Policy Auditor'
  | 'Field Naturalist'
  | 'Student Researcher';

export interface UserFieldNote {
  id: string;
  title: string;
  content: string;
  category: 'Taxonomy Observation' | 'Conservation Field Note' | 'Policy Critique' | 'Methodology Hypothesis';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  linkedArticleTitle?: string;
  linkedArticleType?: 'species' | 'problem';
}

export interface ResearchBadge {
  id: string;
  title: string;
  category: 'Reading' | 'Field Notes' | 'Community' | 'Atlas AI';
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  iconName: string;
  progressPercent: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string;
  bio: string;
  avatarBg: string;
  joinedDate: string;
  isOwner: boolean;
  readArticles: string[]; // slugs or IDs of monographs read
  fieldNotes: UserFieldNote[];
  readingStreakDays: number;
  lastActiveDate: string;
}
