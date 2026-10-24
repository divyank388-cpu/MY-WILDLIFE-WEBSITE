import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReadingProgressBar } from '../components/ReadingProgressBar';
import {
  Compass,
  ArrowLeft,
  Bookmark,
  Share2,
  ShieldAlert,
  Info,
  Layers,
  Leaf,
  AlertTriangle,
  BookOpen,
  Camera,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Check
} from 'lucide-react';

export const SpeciesDetailPage: React.FC = () => {
  const {
    selectedSlug,
    species,
    problems,
    communityPosts,
    navigateTo,
    toggleBookmark,
    isBookmarked,
    openAtlas,
    markArticleAsRead,
    isArticleRead
  } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);

  const currentSpecies = species.find((s) => s.slug === selectedSlug) || species[0];
  const isSaved = isBookmarked(currentSpecies.id);
  const isRead = isArticleRead(currentSpecies.id);

  // Related problem investigations
  const relatedProblems = problems.filter((p) =>
    currentSpecies.relatedProblemIds.includes(p.id)
  );

  // Related discussions
  const relatedDiscussions = communityPosts.filter(
    (c) => c.linkedArticleId === currentSpecies.id
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      {/* Reading Progress Scroll Indicator Bar */}
      <ReadingProgressBar
        title={currentSpecies.commonName}
        categoryOrStatus={`IUCN: ${currentSpecies.iucnStatus}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-[#F1EFE8]">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 text-xs border-b border-[#30322E] pb-4">
          <button
            onClick={() => navigateTo('wildlife')}
            className="flex items-center gap-1.5 text-[#A5A59C] hover:text-[#B5A16A] transition font-mono uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Archive Index</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Atlas AI Entry Point */}
            <button
              onClick={() =>
                openAtlas(
                  'explore',
                  {
                    speciesId: currentSpecies.id,
                    speciesName: currentSpecies.commonName,
                    currentUrl: window.location.href
                  },
                  `Can you explain the ecological role, key adaptations, and conservation status of the ${currentSpecies.commonName}?`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181B18] hover:bg-[#202420] text-[#B5A16A] border border-[#30322E] hover:border-[#B5A16A] rounded text-xs font-mono uppercase tracking-wider transition"
              title="Inquire Atlas AI"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inquire Atlas</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] rounded text-xs text-[#A5A59C] hover:text-[#F1EFE8] transition font-mono"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => markArticleAsRead(currentSpecies.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition border ${
                isRead
                  ? 'bg-[#5A8A6C]/20 text-[#5A8A6C] border-[#5A8A6C]/50 font-semibold'
                  : 'bg-[#131513] border-[#30322E] text-[#A5A59C] hover:text-[#F1EFE8]'
              }`}
              title="Record reading progress in your Research Account"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isRead ? 'Completed' : 'Mark as Read'}</span>
            </button>

            <button
              onClick={() => toggleBookmark(currentSpecies.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono transition border ${
                isSaved
                  ? 'bg-[#B5A16A] text-[#0B0C0B] border-[#B5A16A] font-semibold'
                  : 'bg-[#131513] border-[#30322E] text-[#A5A59C] hover:text-[#F1EFE8]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved' : 'Save Dossier'}</span>
            </button>
          </div>
        </div>

        {/* Hero Presentation (Museum Archival Double-Column) */}
        <div className="bg-[#131513] border border-[#30322E] rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Main Photography Viewport */}
            <div className="lg:col-span-7 relative h-80 sm:h-96 lg:h-[480px] bg-[#0B0C0B]">
              <img
                src={currentSpecies.primaryImageUrl}
                alt={currentSpecies.commonName}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131513] via-transparent to-black/40" />

              {/* Ethical anti-poaching notice */}
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 bg-[#0B0C0B]/90 backdrop-blur-md text-[#A5A59C] border border-[#30322E] rounded text-[11px] font-mono flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#B5A16A]" />
                  <span>Schedule I · Masked Polygon</span>
                </span>
              </div>

              {/* Photo Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-xs text-[#A5A59C]">
                <p className="font-serif italic text-[#F1EFE8]">
                  {currentSpecies.gallery[0]?.caption || `${currentSpecies.commonName} in native bioregion`}
                </p>
                <p className="text-[11px] text-[#A5A59C]/70 font-mono mt-0.5">
                  Archival record · {currentSpecies.gallery[0]?.locationGeneral || 'Indian Subcontinent'}
                </p>
              </div>
            </div>

            {/* Quick Facts & Taxon Dossier */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#181B18] space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#B5A16A]">
                    Natural History Monograph
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                      currentSpecies.iucnStatus === 'Critically Endangered'
                        ? 'bg-rose-950/90 text-rose-300 border border-rose-800/60'
                        : currentSpecies.iucnStatus === 'Endangered'
                        ? 'bg-amber-950/90 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/60'
                    }`}
                  >
                    IUCN: {currentSpecies.iucnStatus}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F1EFE8] leading-tight">
                  {currentSpecies.commonName}
                </h1>

                <div className="text-lg font-serif italic text-[#B5A16A]">
                  {currentSpecies.scientificName}
                </div>

                {/* Vernacular Names */}
                <div className="p-3.5 bg-[#131513] border border-[#30322E] rounded text-xs space-y-1.5">
                  <span className="font-mono text-[10px] uppercase text-[#A5A59C] block">
                    Subcontinental Vernacular Names
                  </span>
                  <div className="flex flex-wrap gap-2 text-[#F1EFE8]">
                    {currentSpecies.vernacularNames.map((v, i) => (
                      <span key={i} className="bg-[#181B18] px-2 py-0.5 rounded border border-[#30322E] text-xs">
                        <strong className="text-[#B5A16A]">{v.language}:</strong> {v.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Taxonomy & Metric Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-[#30322E]">
                <div className="p-3 bg-[#131513] border border-[#30322E] rounded">
                  <span className="font-mono text-[10px] uppercase text-[#A5A59C] block">Population Trend</span>
                  <span className="font-semibold text-rose-400 font-mono mt-0.5 block">{currentSpecies.iucnTrend}</span>
                </div>
                <div className="p-3 bg-[#131513] border border-[#30322E] rounded">
                  <span className="font-mono text-[10px] uppercase text-[#A5A59C] block">Primary Class</span>
                  <span className="font-semibold text-[#F1EFE8] font-mono mt-0.5 block">{currentSpecies.taxonomy.class}</span>
                </div>
                <div className="p-3 bg-[#131513] border border-[#30322E] rounded col-span-2">
                  <span className="font-mono text-[10px] uppercase text-[#A5A59C] block">Distribution Biomes</span>
                  <span className="text-[#F1EFE8] text-xs mt-0.5 block">{currentSpecies.biomes.join(' · ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Monograph Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Scientific Chapters (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Chapter 1: Identification & Physical Characteristics with Drop Cap */}
            <section className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B5A16A]">
                <Info className="w-4 h-4" />
                <span>Chapter 01 · Diagnostic Morphology</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">
                Physical Characteristics &amp; Diagnostic Traits
              </h2>
              <p className="text-sm text-[#A5A59C] leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#B5A16A]">
                {currentSpecies.physicalDescription}
              </p>
            </section>

            {/* Chapter 2: Habitat & Landscape Distribution */}
            <section className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B5A16A]">
                <Compass className="w-4 h-4" />
                <span>Chapter 02 · Range &amp; Ecological Biomes</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">
                Habitat Requirements &amp; Landscape Range
              </h2>
              <div className="space-y-3 text-sm text-[#A5A59C] leading-relaxed">
                <p><strong className="text-[#F1EFE8]">Landscape Distribution:</strong> {currentSpecies.distributionSummary}</p>
                <p><strong className="text-[#F1EFE8]">Ecosystem Specifics:</strong> {currentSpecies.habitatAndEcosystem}</p>
              </div>
            </section>

            {/* Chapter 3: Trophic Biology & Ethology */}
            <section className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B5A16A]">
                <Leaf className="w-4 h-4" />
                <span>Chapter 03 · Trophic Biology &amp; Social Structure</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">
                Diet, Foraging Ecology &amp; Behavior
              </h2>
              <div className="space-y-4 text-sm text-[#A5A59C] leading-relaxed">
                <div>
                  <h3 className="font-serif font-bold text-[#F1EFE8] text-base mb-1">Feeding Ecology &amp; Prey Profile</h3>
                  <p>{currentSpecies.dietAndFeeding}</p>
                </div>
                <div className="pt-2 border-t border-[#30322E]">
                  <h3 className="font-serif font-bold text-[#F1EFE8] text-base mb-1">Territoriality &amp; Social Hierarchy</h3>
                  <p>{currentSpecies.behaviorAndSocialStructure}</p>
                </div>
                <div className="pt-2 border-t border-[#30322E]">
                  <h3 className="font-serif font-bold text-[#F1EFE8] text-base mb-1">Reproduction &amp; Developmental Life Cycle</h3>
                  <p>{currentSpecies.reproductionAndLifecycle}</p>
                </div>
              </div>
            </section>

            {/* Chapter 4: Ecological Role & Keystone Function */}
            <section className="bg-[#181B18] border border-[#B5A16A]/40 rounded-lg p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B5A16A]">
                <Layers className="w-4 h-4" />
                <span>Chapter 04 · Keystone Status</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">
                Trophic Cascades &amp; Watershed Integrity
              </h2>
              <p className="text-sm text-[#A5A59C] leading-relaxed">
                {currentSpecies.ecologicalRole}
              </p>
            </section>

            {/* Chapter 5: Threats & Conservation Actions */}
            <section className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Chapter 05 · Anthropogenic Pressures</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">
                Conservation Threats &amp; Intervention Needs
              </h2>
              <p className="text-sm text-[#A5A59C] leading-relaxed">
                {currentSpecies.threatsAndConservation}
              </p>
            </section>

            {/* Chapter 6: Scientifically Defensible Facts */}
            <section className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">
                Scientifically Defensible Field Insights
              </h2>
              <ul className="space-y-3 text-sm text-[#A5A59C]">
                {currentSpecies.scientificallyDefensibleFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-[#B5A16A] pt-0.5">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <span className="leading-relaxed">{fact}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Chapter 7: Field Photography Collection */}
            {currentSpecies.gallery.length > 0 && (
              <section className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B5A16A]">
                  <Camera className="w-4 h-4" />
                  <span>Field Photographic Archive</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">
                  Visual Evidence &amp; Habitat Plates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentSpecies.gallery.map((photo, i) => (
                    <div key={i} className="border border-[#30322E] rounded overflow-hidden group bg-[#181B18]">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="p-3 text-xs space-y-1">
                        <p className="font-serif italic text-[#F1EFE8]">{photo.caption}</p>
                        <p className="text-[11px] text-[#A5A59C] font-mono">
                          Photographer: {photo.photographer} · {photo.locationGeneral}
                        </p>
                        {photo.sensitiveSpeciesNotice && (
                          <p className="text-[10px] text-[#B5A16A] font-mono pt-1">
                            {photo.sensitiveSpeciesNotice}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Chapter 8: Verifiable Academic Citations */}
            <section className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B5A16A]">
                <BookOpen className="w-4 h-4" />
                <span>Primary Scholarly Sources</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">
                References &amp; Institutional Documentation
              </h2>
              <div className="space-y-3">
                {currentSpecies.references.map((ref, idx) => (
                  <div key={idx} className="p-3.5 bg-[#181B18] border border-[#30322E] rounded text-xs space-y-1">
                    <div className="font-serif font-semibold text-[#F1EFE8] text-sm">
                      {ref.title} ({ref.year})
                    </div>
                    <div className="text-[#A5A59C]">{ref.authors} — <em>{ref.publication}</em></div>
                    {ref.link && (
                      <a
                        href={ref.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#B5A16A] hover:underline pt-1 font-mono text-[11px]"
                      >
                        <span>Institutional Source Record</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar: Linnaean Definition List & Cross-Pillar Links (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Linnaean Taxonomy Definition List */}
            <div className="bg-[#131513] border border-[#30322E] rounded-lg p-6 space-y-4 sticky top-24">
              <h3 className="font-serif text-xl font-bold text-[#F1EFE8] border-b border-[#30322E] pb-3">
                Linnaean Taxonomy
              </h3>
              <dl className="divide-y divide-[#30322E] text-xs">
                <div className="py-2 flex justify-between">
                  <dt className="text-[#A5A59C] font-mono">Kingdom</dt>
                  <dd className="font-medium text-[#F1EFE8] font-mono">{currentSpecies.taxonomy.kingdom}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-[#A5A59C] font-mono">Phylum</dt>
                  <dd className="font-medium text-[#F1EFE8] font-mono">{currentSpecies.taxonomy.phylum}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-[#A5A59C] font-mono">Class</dt>
                  <dd className="font-medium text-[#F1EFE8] font-mono">{currentSpecies.taxonomy.class}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-[#A5A59C] font-mono">Order</dt>
                  <dd className="font-medium text-[#F1EFE8] font-mono">{currentSpecies.taxonomy.order}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-[#A5A59C] font-mono">Family</dt>
                  <dd className="font-medium text-[#F1EFE8] font-mono">{currentSpecies.taxonomy.family}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-[#A5A59C] font-mono">Genus</dt>
                  <dd className="font-medium text-[#B5A16A] font-serif italic">{currentSpecies.taxonomy.genus}</dd>
                </div>
              </dl>

              {/* Cross-Pillar: Linked Problems of India */}
              {relatedProblems.length > 0 && (
                <div className="pt-4 border-t border-[#30322E] space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#5A8A6C]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Linked Problem Investigations</span>
                  </div>
                  <div className="space-y-2">
                    {relatedProblems.map((prob) => (
                      <div
                        key={prob.id}
                        onClick={() => navigateTo('problem-detail', prob.slug)}
                        className="p-3 bg-[#181B18] border border-[#30322E] rounded hover:border-[#5A8A6C] transition cursor-pointer group"
                      >
                        <h4 className="font-serif font-bold text-xs text-[#F1EFE8] group-hover:text-[#5A8A6C] line-clamp-2">
                          {prob.title}
                        </h4>
                        <p className="text-[11px] text-[#A5A59C] mt-1 font-mono">{prob.category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Community Critiques */}
              <div className="pt-4 border-t border-[#30322E] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#B5A16A]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Research Discourse</span>
                </div>
                {relatedDiscussions.length === 0 ? (
                  <div className="text-xs text-[#A5A59C]">
                    No open peer critiques on this monograph yet.
                    <button
                      onClick={() => navigateTo('community')}
                      className="block text-[#B5A16A] hover:underline font-mono mt-1"
                    >
                      Open peer discourse →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {relatedDiscussions.map((disc) => (
                      <div
                        key={disc.id}
                        onClick={() => navigateTo('community-thread', disc.slug)}
                        className="p-3 bg-[#181B18] border border-[#30322E] rounded hover:border-[#B5A16A] transition cursor-pointer"
                      >
                        <h4 className="font-serif font-bold text-xs text-[#F1EFE8] line-clamp-2">
                          {disc.title}
                        </h4>
                        <div className="flex justify-between items-center text-[10px] text-[#A5A59C] font-mono mt-1">
                          <span>by {disc.author.name}</span>
                          <span>{disc.replies.length} replies</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
