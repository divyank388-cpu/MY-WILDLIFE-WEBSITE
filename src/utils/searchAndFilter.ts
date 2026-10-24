import { WildlifeSpecies, ProblemInvestigation, CommunityPost, IUCNStatus } from '../types';

export interface GlobalSearchResult {
  id: string;
  type: 'species' | 'problem' | 'community';
  title: string;
  subtitle: string;
  categoryOrStatus: string;
  urlHash: string;
  matchScore: number;
}

export function searchWildlife(
  speciesList: WildlifeSpecies[],
  query: string,
  statusFilter?: string,
  biomeFilter?: string,
  classFilter?: string,
  sortBy: 'name' | 'status' | 'recent' = 'recent'
): WildlifeSpecies[] {
  const q = query.trim().toLowerCase();

  const filtered = speciesList.filter((sp) => {
    // Drafts are filtered out in public listings unless explicitly included
    if (sp.isDraft) return false;

    if (statusFilter && statusFilter !== 'all' && sp.iucnStatus !== statusFilter) {
      return false;
    }
    if (biomeFilter && biomeFilter !== 'all' && !sp.biomes.includes(biomeFilter)) {
      return false;
    }
    if (classFilter && classFilter !== 'all' && sp.taxonomy.class.toLowerCase() !== classFilter.toLowerCase()) {
      return false;
    }

    if (!q) return true;

    const inCommonName = sp.commonName.toLowerCase().includes(q);
    const inScientific = sp.scientificName.toLowerCase().includes(q);
    const inVernacular = sp.vernacularNames.some(v => v.name.toLowerCase().includes(q));
    const inDietOrEco = sp.ecologicalRole.toLowerCase().includes(q) || sp.habitatAndEcosystem.toLowerCase().includes(q);
    const inFacts = sp.scientificallyDefensibleFacts.some(f => f.toLowerCase().includes(q));

    return inCommonName || inScientific || inVernacular || inDietOrEco || inFacts;
  });

  return filtered.sort((a, b) => {
    if (sortBy === 'name') {
      return a.commonName.localeCompare(b.commonName);
    }
    if (sortBy === 'status') {
      const order: Record<IUCNStatus, number> = {
        'Critically Endangered': 1,
        'Endangered': 2,
        'Vulnerable': 3,
        'Near Threatened': 4,
        'Least Concern': 5,
        'Data Deficient': 6,
      };
      return (order[a.iucnStatus] || 99) - (order[b.iucnStatus] || 99);
    }
    // Default 'recent'
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function searchProblems(
  problems: ProblemInvestigation[],
  query: string,
  categoryFilter?: string,
  statusFilter?: string,
  sortBy: 'recent' | 'readingTime' | 'title' = 'recent'
): ProblemInvestigation[] {
  const q = query.trim().toLowerCase();

  const filtered = problems.filter((prob) => {
    if (prob.isDraft) return false;

    if (categoryFilter && categoryFilter !== 'all' && prob.category !== categoryFilter) {
      return false;
    }
    if (statusFilter && statusFilter !== 'all' && prob.status !== statusFilter) {
      return false;
    }

    if (!q) return true;

    const inTitle = prob.title.toLowerCase().includes(q);
    const inSub = prob.subtitle.toLowerCase().includes(q);
    const inSummary = prob.executiveSummary.toLowerCase().includes(q);
    const inStatement = prob.problemStatement.toLowerCase().includes(q);
    const inSolution = prob.proposedSolution.toLowerCase().includes(q);

    return inTitle || inSub || inSummary || inStatement || inSolution;
  });

  return filtered.sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'readingTime') {
      return a.readingTimeMinutes - b.readingTimeMinutes;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function searchCommunityPosts(
  posts: CommunityPost[],
  query: string,
  categoryFilter?: string,
  sortBy: 'recent' | 'popular' | 'replies' = 'recent'
): CommunityPost[] {
  const q = query.trim().toLowerCase();

  const filtered = posts.filter((post) => {
    if (categoryFilter && categoryFilter !== 'all' && post.category !== categoryFilter) {
      return false;
    }

    if (!q) return true;

    const inTitle = post.title.toLowerCase().includes(q);
    const inContent = post.content.toLowerCase().includes(q);
    const inTags = post.tags.some((t) => t.toLowerCase().includes(q));
    const inAuthor = post.author.name.toLowerCase().includes(q);

    return inTitle || inContent || inTags || inAuthor;
  });

  return filtered.sort((a, b) => {
    if (postPinnedWeight(b) !== postPinnedWeight(a)) {
      return postPinnedWeight(b) - postPinnedWeight(a);
    }
    if (sortBy === 'popular') {
      return b.likesCount - a.likesCount;
    }
    if (sortBy === 'replies') {
      return b.replies.length - a.replies.length;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function postPinnedWeight(post: CommunityPost): number {
  return post.isPinned ? 1 : 0;
}

export function performGlobalSearch(
  query: string,
  speciesList: WildlifeSpecies[],
  problems: ProblemInvestigation[],
  communityPosts: CommunityPost[]
): GlobalSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: GlobalSearchResult[] = [];

  // Species
  speciesList.filter(s => !s.isDraft).forEach((sp) => {
    let score = 0;
    if (sp.commonName.toLowerCase() === q) score += 50;
    else if (sp.commonName.toLowerCase().startsWith(q)) score += 30;
    else if (sp.commonName.toLowerCase().includes(q)) score += 20;

    if (sp.scientificName.toLowerCase().includes(q)) score += 25;
    if (sp.vernacularNames.some(v => v.name.toLowerCase().includes(q))) score += 15;
    if (sp.ecologicalRole.toLowerCase().includes(q)) score += 10;
    if (sp.threatsAndConservation.toLowerCase().includes(q)) score += 5;

    if (score > 0) {
      results.push({
        id: sp.id,
        type: 'species',
        title: sp.commonName,
        subtitle: sp.scientificName,
        categoryOrStatus: sp.iucnStatus,
        urlHash: `#species/${sp.slug}`,
        matchScore: score,
      });
    }
  });

  // Problems
  problems.filter(p => !p.isDraft).forEach((prob) => {
    let score = 0;
    if (prob.title.toLowerCase().includes(q)) score += 30;
    if (prob.subtitle.toLowerCase().includes(q)) score += 20;
    if (prob.category.toLowerCase().includes(q)) score += 15;
    if (prob.executiveSummary.toLowerCase().includes(q)) score += 10;

    if (score > 0) {
      results.push({
        id: prob.id,
        type: 'problem',
        title: prob.title,
        subtitle: prob.subtitle,
        categoryOrStatus: prob.category,
        urlHash: `#problem/${prob.slug}`,
        matchScore: score,
      });
    }
  });

  // Community
  communityPosts.forEach((post) => {
    let score = 0;
    if (post.title.toLowerCase().includes(q)) score += 25;
    if (post.tags.some(t => t.toLowerCase().includes(q))) score += 15;
    if (post.content.toLowerCase().includes(q)) score += 10;

    if (score > 0) {
      results.push({
        id: post.id,
        type: 'community',
        title: post.title,
        subtitle: `Discussion in ${post.category} by ${post.author.name}`,
        categoryOrStatus: post.category,
        urlHash: `#discussion/${post.slug}`,
        matchScore: score,
      });
    }
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
