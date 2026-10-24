import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReadingProgressBar } from '../components/ReadingProgressBar';
import {
  Sparkles,
  ArrowLeft,
  Bookmark,
  Share2,
  Clock,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Compass,
  MessageSquare,
  BookOpen,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Send,
  Check,
  ShieldCheck
} from 'lucide-react';

export const ProblemDetailPage: React.FC = () => {
  const {
    selectedSlug,
    problems,
    species,
    communityPosts,
    navigateTo,
    toggleBookmark,
    isBookmarked,
    addCommunityReply,
    openAtlas,
    markArticleAsRead,
    isArticleRead
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentSent, setCommentSent] = useState(false);

  const currentProblem = problems.find((p) => p.slug === selectedSlug) || problems[0];
  const isSaved = isBookmarked(currentProblem.id);
  const isRead = isArticleRead(currentProblem.id);

  // Cross-pillar linked species
  const linkedSpecies = species.filter((s) =>
    (currentProblem.relatedSpeciesIds || []).includes(s.id)
  );

  // Linked community discussions
  const linkedDiscussions = communityPosts.filter(
    (c) => c.linkedArticleId === currentProblem.id
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    if (linkedDiscussions.length > 0) {
      addCommunityReply(linkedDiscussions[0].id, commentInput);
    }
    setCommentSent(true);
    setCommentInput('');
    setTimeout(() => setCommentSent(false), 3000);
  };

  const sections = [
    { id: 'sec-statement', title: '01. Problem Statement' },
    { id: 'sec-exec', title: '02. Executive Summary' },
    { id: 'sec-why', title: '03. Why It Matters' },
    { id: 'sec-evidence', title: '04. Evidence & Case Studies' },
    { id: 'sec-root', title: '05. Root-Cause Drivers' },
    { id: 'sec-existing', title: '06. Existing Approaches' },
    { id: 'sec-solution', title: '07. Proposed Solution' },
    { id: 'sec-arch', title: '08. Solution Architecture' },
    { id: 'sec-blueprint', title: '09. Implementation Blueprint' },
    { id: 'sec-costs', title: '10. Resources & Cost Model' },
    { id: 'sec-risks', title: '11. Risks & Failure Modes' },
    { id: 'sec-pilot', title: '12. Pilot Programme' },
    { id: 'sec-metrics', title: '13. Evaluation Metrics' },
    { id: 'sec-scale', title: '14. Scaling Strategy' },
    { id: 'sec-refs', title: '15. Sources & Citations' },
    { id: 'sec-discussion', title: '16. Peer Dialogue' }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Reading Progress Scroll Indicator Bar */}
      <ReadingProgressBar
        title={currentProblem.title}
        categoryOrStatus={`Dossier · ${currentProblem.category}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-[#F1EFE8]">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 text-xs border-b border-[#30322E] pb-4">
          <button
            onClick={() => navigateTo('problems')}
            className="flex items-center gap-1.5 text-[#A5A59C] hover:text-[#5A8A6C] transition font-mono uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Investigations Index</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Atlas AI Actions */}
            <button
              onClick={() =>
                openAtlas(
                  'investigate',
                  {
                    problemId: currentProblem.id,
                    problemTitle: currentProblem.title,
                    currentUrl: window.location.href
                  },
                  `Can you break down the root causes, solution architecture, and key implementation dependencies for "${currentProblem.title}"?`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181B18] hover:bg-[#202420] text-[#5A8A6C] border border-[#30322E] hover:border-[#5A8A6C] rounded text-xs font-mono uppercase tracking-wider transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Investigate with Atlas</span>
            </button>

            <button
              onClick={() =>
                openAtlas(
                  'evaluate',
                  {
                    problemId: currentProblem.id,
                    problemTitle: currentProblem.title,
                    currentUrl: window.location.href
                  },
                  `Conduct a critical evaluation of "${currentProblem.title}". What are the unaddressed assumptions and failure modes?`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181B18] hover:bg-[#202420] text-[#B5A16A] border border-[#30322E] hover:border-[#B5A16A] rounded text-xs font-mono uppercase tracking-wider transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit Assumptions</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] rounded text-xs text-[#A5A59C] hover:text-[#F1EFE8] transition font-mono"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => markArticleAsRead(currentProblem.id)}
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
              onClick={() => toggleBookmark(currentProblem.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono transition border ${
                isSaved
                  ? 'bg-[#5A8A6C] text-[#0B0C0B] border-[#5A8A6C] font-semibold'
                  : 'bg-[#131513] border-[#30322E] text-[#A5A59C] hover:text-[#F1EFE8]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved' : 'Save Dossier'}</span>
            </button>
          </div>
        </div>

        {/* Hero Header Dossier */}
        <div className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-10 lg:p-12 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-mono text-[#5A8A6C] uppercase tracking-wider font-semibold">
              16-Point Scientific Framework
            </span>
            <span aria-hidden="true" className="text-[#A5A59C]">·</span>
            <span className="font-mono text-[#B5A16A]">{currentProblem.category}</span>
            <span aria-hidden="true" className="text-[#A5A59C]">·</span>
            <span className="font-mono text-[#A5A59C]">Status: {currentProblem.status}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#F1EFE8] leading-tight">
            {currentProblem.title}
          </h1>

          <p className="text-base sm:text-xl font-serif italic text-[#A5A59C] leading-relaxed">
            {currentProblem.subtitle}
          </p>

          {/* Author & Publication Record */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#30322E] text-xs text-[#A5A59C]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border border-[#30322E] bg-[#181B18] text-[#B5A16A] flex items-center justify-center font-mono font-bold text-xs">
                DY
              </div>
              <div>
                <span className="font-medium text-[#F1EFE8] block">{currentProblem.author.name}</span>
                <span className="text-[11px] text-[#A5A59C]">{currentProblem.author.role} · {currentProblem.author.affiliation}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#B5A16A]" />
                <span>Published {new Date(currentProblem.publishedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#5A8A6C]" />
                <span>{currentProblem.readingTimeMinutes} min deep read</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid: Sticky 16-Point Rail + Investigation Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sticky Table of Contents Sidebar (3 Cols) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 bg-[#131513] border border-[#30322E] rounded-lg p-5 space-y-3 max-h-[82vh] overflow-y-auto text-xs">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#B5A16A] pb-2 border-b border-[#30322E]">
                Framework Index
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className="w-full text-left px-2 py-1.5 rounded text-[#A5A59C] hover:text-[#F1EFE8] hover:bg-[#181B18] transition text-[11px] font-mono"
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>

              {/* Atlas Companion Box in Sidebar */}
              <div className="pt-3 border-t border-[#30322E] space-y-2">
                <div className="p-3 bg-[#181B18] border border-[#30322E] rounded text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#B5A16A]">
                    <Sparkles className="w-3 h-3" />
                    <span>Atlas AI Companion</span>
                  </div>
                  <p className="text-[11px] text-[#A5A59C] leading-snug">
                    Explore root causes or stress-test assumptions with empirical data.
                  </p>
                  <button
                    onClick={() =>
                      openAtlas(
                        'investigate',
                        {
                          problemId: currentProblem.id,
                          problemTitle: currentProblem.title,
                          currentUrl: window.location.href
                        },
                        `What are the critical dependencies and pilot milestones for "${currentProblem.title}"?`
                      )
                    }
                    className="w-full py-1 px-2 bg-[#131513] hover:bg-[#202420] text-[#5A8A6C] border border-[#30322E] rounded text-[11px] font-mono transition text-left flex items-center justify-between"
                  >
                    <span>Investigate Root Causes</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 16-Point Investigation Dossier Body (9 Cols) */}
          <div className="lg:col-span-9 space-y-10">
            {/* Cover photo */}
            <div className="rounded-lg overflow-hidden border border-[#30322E] bg-[#181B18]">
              <img
                src={currentProblem.coverImageUrl}
                alt={currentProblem.title}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="p-3 bg-[#131513] text-xs text-[#A5A59C] font-mono flex justify-between items-center">
                <span>{currentProblem.imageCaption}</span>
                <span className="text-[11px]">Record: {currentProblem.imageCredit}</span>
              </div>
            </div>

            {/* Section 1: Problem Statement */}
            <section id="sec-statement" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                01. Problem Statement
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">The Core Dilemma</h2>
              <blockquote className="text-base text-[#F1EFE8] leading-relaxed font-serif italic py-2">
                "{currentProblem.problemStatement}"
              </blockquote>
            </section>

            {/* Section 2: Executive Summary with Drop Cap */}
            <section id="sec-exec" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                02. Executive Summary
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Synthesis &amp; Direction</h2>
              <p className="text-sm text-[#A5A59C] leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#5A8A6C]">
                {currentProblem.executiveSummary}
              </p>
            </section>

            {/* Section 3: Why It Matters */}
            <section id="sec-why" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                03. Why It Matters
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Humanitarian, Economic &amp; Ecological Impact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#181B18] border border-[#30322E] rounded space-y-1">
                  <span className="font-mono text-[#F1EFE8] block uppercase text-[11px]">Affected Demographics</span>
                  <p className="text-[#A5A59C]">{currentProblem.whyItMatters.affectedPopulations}</p>
                </div>
                <div className="p-4 bg-[#181B18] border border-[#30322E] rounded space-y-1">
                  <span className="font-mono text-[#F1EFE8] block uppercase text-[11px]">Humanitarian Impact</span>
                  <p className="text-[#A5A59C]">{currentProblem.whyItMatters.humanitarianImpact}</p>
                </div>
                <div className="p-4 bg-[#181B18] border border-[#30322E] rounded space-y-1">
                  <span className="font-mono text-[#F1EFE8] block uppercase text-[11px]">Ecological/Economic Toll</span>
                  <p className="text-[#A5A59C]">{currentProblem.whyItMatters.ecologicalEconomicCost}</p>
                </div>
              </div>
            </section>

            {/* Section 4: Evidence & Statistics */}
            <section id="sec-evidence" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                04. Evidence &amp; Context
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Credible Statistics &amp; Field Precedents</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentProblem.evidenceAndContext.statistics.map((stat, i) => (
                  <div key={i} className="p-4 bg-[#181B18] border border-[#30322E] rounded space-y-1">
                    <span className="text-2xl font-serif font-bold text-[#5A8A6C] block tabular-nums">
                      {stat.value}
                    </span>
                    <div className="text-xs font-semibold text-[#F1EFE8]">{stat.label}</div>
                    <div className="text-[11px] text-[#A5A59C] font-mono">Source: {stat.citation}</div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-[#A5A59C] leading-relaxed">
                {currentProblem.evidenceAndContext.contextNarrative}
              </p>

              {currentProblem.evidenceAndContext.caseStudies.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-serif font-bold text-lg text-[#F1EFE8]">Historical Precedents &amp; Case Studies</h3>
                  <div className="space-y-3">
                    {currentProblem.evidenceAndContext.caseStudies.map((cs, idx) => (
                      <div key={idx} className="p-4 bg-[#181B18] border border-[#30322E] rounded text-xs space-y-1">
                        <div className="font-semibold text-sm text-[#F1EFE8]">{cs.title} ({cs.location})</div>
                        <p className="text-[#A5A59C] leading-relaxed">{cs.outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Section 5: Root-Cause Drivers */}
            <section id="sec-root" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                05. Root-Cause Drivers
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Symptoms vs. Underlying Structural Drivers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#181B18] border border-rose-950/60 rounded space-y-2">
                  <span className="font-mono text-rose-400 block uppercase text-[11px] font-semibold">Visible Symptoms</span>
                  <ul className="space-y-1 text-[#A5A59C]">
                    {currentProblem.rootCauseAnalysis.visibleSymptoms.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400">·</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#181B18] border border-amber-950/60 rounded space-y-2">
                  <span className="font-mono text-amber-400 block uppercase text-[11px] font-semibold">Structural Drivers</span>
                  <ul className="space-y-1 text-[#A5A59C]">
                    {currentProblem.rootCauseAnalysis.structuralUnderlyingDrivers.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">·</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#181B18] border border-sky-950/60 rounded space-y-2">
                  <span className="font-mono text-sky-400 block uppercase text-[11px] font-semibold">Institutional Gaps</span>
                  <ul className="space-y-1 text-[#A5A59C]">
                    {currentProblem.rootCauseAnalysis.institutionalGaps.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-sky-400">·</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6: Existing Approaches */}
            <section id="sec-existing" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                06. Existing Approaches
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">What Has Been Attempted &amp; Why Gaps Persist</h2>
              <div className="space-y-3">
                {currentProblem.existingApproaches.map((appr, idx) => (
                  <div key={idx} className="p-4 bg-[#181B18] border border-[#30322E] rounded text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-bold text-sm text-[#F1EFE8]">{appr.initiative}</span>
                      <span className="text-[#A5A59C] font-mono text-[11px]">Agency: {appr.implementedBy}</span>
                    </div>
                    <p className="text-[#A5A59C] leading-relaxed">
                      <strong className="text-[#F1EFE8]">Gaps &amp; Shortcomings:</strong> {appr.shortcomingsAndGaps}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 7: Proposed Solution */}
            <section id="sec-solution" className="bg-[#181B18] border border-[#5A8A6C]/40 rounded-lg p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#5A8A6C] block">
                07. Proposed Solution
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">The Technical &amp; Operational Approach</h2>
              <p className="text-sm sm:text-base text-[#F1EFE8] leading-relaxed">
                {currentProblem.proposedSolution}
              </p>
            </section>

            {/* Section 8: Solution Architecture */}
            <section id="sec-arch" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                08. Solution Architecture
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Components, Protocols &amp; Stakeholders</h2>
              <div className="space-y-3">
                {currentProblem.solutionArchitecture.components.map((comp, idx) => (
                  <div key={idx} className="p-4 bg-[#181B18] border border-[#30322E] rounded text-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="font-serif font-bold text-sm text-[#F1EFE8]">{comp.name}</span>
                      <span className="text-[11px] font-mono text-[#5A8A6C]">Lead: {comp.leadStakeholders}</span>
                    </div>
                    <p className="text-[#A5A59C]">{comp.description}</p>
                    <div className="p-2.5 bg-[#131513] border border-[#30322E] rounded text-[#A5A59C]">
                      <strong className="text-[#F1EFE8]">Operational Method:</strong> {comp.technicalOrOperationalMethod}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 9: Implementation Blueprint */}
            <section id="sec-blueprint" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                09. Implementation Blueprint
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Phased Execution Roadmap</h2>
              <div className="space-y-4">
                {currentProblem.implementationBlueprint.map((phase, idx) => (
                  <div key={idx} className="p-4 bg-[#181B18] border border-[#30322E] rounded text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-bold text-sm text-[#F1EFE8]">{phase.phase}</span>
                      <span className="font-mono bg-[#131513] px-2 py-0.5 rounded border border-[#30322E] text-[#B5A16A]">
                        {phase.timeline}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono uppercase text-[#A5A59C]">Key Deliverables:</span>
                      <ul className="space-y-0.5 text-[#A5A59C]">
                        {phase.keyDeliverables.map((d, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#5A8A6C]">✓</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-[11px] text-[#5A8A6C] font-mono pt-1">
                      Milestone: {phase.milestones}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 10: Resources & Cost Model */}
            <section id="sec-costs" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                10. Resources &amp; Costs
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Transparent Assumptions &amp; Budget Range</h2>
              <div className="p-3.5 bg-[#181B18] border border-[#30322E] rounded text-xs text-[#B5A16A] font-mono">
                Estimated Capital Outlay: {currentProblem.resourcesAndCosts.estimatedCostRange}
              </div>
              <div className="space-y-2">
                {currentProblem.resourcesAndCosts.costBreakdown.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#181B18] border border-[#30322E] rounded text-xs flex justify-between items-center">
                    <div>
                      <span className="font-medium text-[#F1EFE8] block">{item.item}</span>
                      <span className="text-[11px] text-[#A5A59C]">{item.rationale}</span>
                    </div>
                    <span className="font-mono font-bold text-[#5A8A6C] text-sm shrink-0 ml-4 tabular-nums">
                      {item.costEst}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-3.5 bg-[#181B18] border border-[#30322E] rounded text-xs text-[#A5A59C]">
                <strong className="text-[#F1EFE8]">Funding Mechanism:</strong> {currentProblem.resourcesAndCosts.fundingAndSustainability}
              </div>
            </section>

            {/* Section 11: Risks & Limitations */}
            <section id="sec-risks" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-rose-400 block">
                11. Risks &amp; Limitations
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Failure Modes &amp; Mitigation Strategies</h2>
              <div className="space-y-3">
                {currentProblem.risksAndLimitations.map((risk, idx) => (
                  <div key={idx} className="p-4 bg-[#181B18] border border-[#30322E] rounded text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-bold text-[#F1EFE8]">{risk.risk}</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${risk.severity === 'High' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'bg-amber-950/80 text-amber-300 border border-amber-800'}`}>
                        {risk.severity} Risk
                      </span>
                    </div>
                    <p className="text-[#A5A59C] leading-relaxed">
                      <strong className="text-[#F1EFE8]">Mitigation:</strong> {risk.mitigationStrategy}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 12: Pilot Programme */}
            <section id="sec-pilot" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                12. Pilot Programme
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Controlled Field Verification</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#181B18] border border-[#30322E] rounded">
                  <span className="text-[#A5A59C] block text-[10px] uppercase font-mono">Location</span>
                  <span className="font-semibold text-[#F1EFE8]">{currentProblem.pilotProgram.proposedLocation}</span>
                </div>
                <div className="p-3 bg-[#181B18] border border-[#30322E] rounded">
                  <span className="text-[#A5A59C] block text-[10px] uppercase font-mono">Duration</span>
                  <span className="font-semibold text-[#F1EFE8] font-mono">{currentProblem.pilotProgram.durationMonths} Months</span>
                </div>
                <div className="p-3 bg-[#181B18] border border-[#30322E] rounded">
                  <span className="text-[#A5A59C] block text-[10px] uppercase font-mono">Cohort</span>
                  <span className="font-semibold text-[#F1EFE8]">{currentProblem.pilotProgram.targetCohort}</span>
                </div>
              </div>
              <p className="text-xs text-[#A5A59C] leading-relaxed">
                <strong className="text-[#F1EFE8]">Testing Protocol:</strong> {currentProblem.pilotProgram.methodology}
              </p>
            </section>

            {/* Section 13: Evaluation Metrics */}
            <section id="sec-metrics" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                13. Evaluation Metrics
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Measurable Indicators of Success</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#30322E] rounded overflow-hidden">
                  <thead className="bg-[#181B18] text-[#F1EFE8] border-b border-[#30322E]">
                    <tr>
                      <th className="p-3 font-semibold font-mono">Indicator</th>
                      <th className="p-3 font-semibold font-mono">Baseline</th>
                      <th className="p-3 font-semibold font-mono">Target Success</th>
                      <th className="p-3 font-semibold font-mono">Verification Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30322E]">
                    {currentProblem.evaluationMetrics.map((met, idx) => (
                      <tr key={idx} className="hover:bg-[#181B18]">
                        <td className="p-3 font-medium text-[#F1EFE8]">{met.indicator}</td>
                        <td className="p-3 text-rose-400 font-mono tabular-nums">{met.baseline}</td>
                        <td className="p-3 font-bold text-[#5A8A6C] font-mono tabular-nums">{met.targetSuccessMetric}</td>
                        <td className="p-3 text-[#A5A59C]">{met.verificationMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 14: Scaling Strategy */}
            <section id="sec-scale" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                14. Scaling Strategy
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Expansion Beyond Pilot Phase</h2>
              <p className="text-sm text-[#A5A59C] leading-relaxed">
                {currentProblem.scalingStrategy}
              </p>
            </section>

            {/* Section 15: Sources & Citations */}
            <section id="sec-refs" className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                15. Sources &amp; Citations
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Peer-Reviewed Citations &amp; Institutional Evidence</h2>
              <div className="space-y-3">
                {currentProblem.references.map((ref, idx) => (
                  <div key={idx} className="p-3.5 bg-[#181B18] border border-[#30322E] rounded text-xs space-y-1">
                    <div className="font-serif font-semibold text-[#F1EFE8] text-sm">{ref.title} ({ref.year})</div>
                    <div className="text-[#A5A59C]">{ref.authors} — <em>{ref.publication}</em></div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 16: Peer Critique Dialogue */}
            <section id="sec-discussion" className="bg-[#181B18] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] block">
                    16. Peer Critique
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">Challenge This Solution Architecture</h2>
                </div>
                <button
                  onClick={() => navigateTo('community')}
                  className="text-xs font-mono text-[#B5A16A] hover:underline"
                >
                  Forum Index →
                </button>
              </div>

              <p className="text-xs text-[#A5A59C]">
                Have insights into telemetry, hydrology, soil carbon, or logistics? Submit technical feedback below or join the ongoing discourse.
              </p>

              {/* Linked discussions list */}
              <div className="space-y-3">
                {linkedDiscussions.length === 0 ? (
                  <div className="p-4 bg-[#131513] border border-[#30322E] rounded text-xs text-[#A5A59C] text-center">
                    No active student or researcher critique on this proposal yet. Be the first to audit assumptions!
                  </div>
                ) : (
                  linkedDiscussions.map((disc) => (
                    <div key={disc.id} className="p-4 bg-[#131513] border border-[#30322E] rounded space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-serif font-semibold text-[#F1EFE8]">{disc.title}</span>
                        <span className="text-[#A5A59C] font-mono text-[11px]">by {disc.author.name}</span>
                      </div>
                      <p className="text-xs text-[#A5A59C] line-clamp-2">{disc.content}</p>
                      <button
                        onClick={() => navigateTo('community-thread', disc.slug)}
                        className="text-xs text-[#5A8A6C] font-mono hover:underline block"
                      >
                        Inspect Thread ({disc.replies.length} responses) →
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Comment box */}
              <form onSubmit={handleCommentSubmit} className="space-y-3 pt-2">
                <label className="block text-xs font-mono uppercase text-[#A5A59C]">
                  Contribute Technical Audit / Field Critique:
                </label>
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  rows={3}
                  placeholder="Critique sensor attenuation, evaluate chemical binding models, or report regional ground data..."
                  className="w-full p-3 bg-[#131513] border border-[#30322E] rounded text-xs text-[#F1EFE8] placeholder-[#A5A59C]/60 focus:outline-none focus:border-[#5A8A6C]"
                  required
                />
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#A5A59C] font-mono">Peer review guidelines apply</span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#5A8A6C] hover:bg-[#487258] text-[#0B0C0B] text-xs font-semibold uppercase tracking-wider rounded transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
                {commentSent && (
                  <div className="p-3 bg-emerald-950/60 text-emerald-300 text-xs rounded border border-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Your technical feedback has been added to the ongoing peer discourse thread.</span>
                  </div>
                )}
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
