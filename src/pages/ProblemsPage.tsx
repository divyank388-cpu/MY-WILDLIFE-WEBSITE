import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { searchProblems } from '../utils/searchAndFilter';
import {
  Sparkles,
  Search,
  Bookmark,
  Clock,
  ArrowRight
} from 'lucide-react';

export const ProblemsPage: React.FC = () => {
  const { problems, navigateTo, toggleBookmark, isBookmarked, isAdminMode } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'readingTime' | 'title'>('recent');

  const filteredProblems = searchProblems(
    problems,
    query,
    selectedCategory,
    selectedStatus,
    sortBy
  );

  const categories: { label: string; value: string }[] = [
    { label: 'All Domains', value: 'all' },
    { label: 'Infrastructure & Linear Transport', value: 'Infrastructure & Linear Transport' },
    { label: 'Water Quality & Remediation', value: 'Water Quality & Remediation' },
    { label: 'Agritech & Atmospheric Air', value: 'Agritech & Atmospheric Air' },
    { label: 'Public Health & Antivenom', value: 'Public Health & Antivenom' }
  ];

  const statuses = [
    { label: 'All Investigation Stages', value: 'all' },
    { label: 'Proposed Pilot', value: 'Proposed Pilot' },
    { label: 'Field Trial Blueprint', value: 'Field Trial Blueprint' },
    { label: 'Policy Brief', value: 'Policy Brief' },
    { label: 'Under Investigation', value: 'Under Investigation' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#F1EFE8]">
      {/* Masthead Header */}
      <div className="border-b border-[#30322E] pb-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#5A8A6C]">
          <Sparkles className="w-4 h-4" />
          <span>Pillar II · Empirical Systems Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#F1EFE8]">
          Problems of India
        </h1>
        <p className="text-base text-[#A5A59C] max-w-2xl leading-relaxed">
          An empirical problem-solving journal. We do not stop at cataloging crises; each investigation unpacks structural root causes and architects actionable 16-point technical blueprints, transparent budgets, and pilot validation programs.
        </p>

        {/* Owner Workspace Status */}
        {isAdminMode && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#131513] border border-[#5A8A6C]/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#5A8A6C] animate-pulse" />
              <span className="text-[#F1EFE8] font-medium">
                Owner Workspace Active: Logged in as <strong>Divyankar Yadav</strong> (divyankyadav232@gmail.com)
              </span>
            </div>
            <button
              onClick={() => navigateTo('admin')}
              className="px-3.5 py-1.5 bg-[#5A8A6C] hover:bg-[#477057] text-[#0B0C0B] text-xs font-semibold uppercase tracking-wider rounded transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Publish New Investigation Blueprint</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Box */}
      <div className="bg-[#131513] border border-[#30322E] rounded-lg p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A5A59C] absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search investigations by topic, title, or keywords (e.g. 'Arsenic', 'Elephant Corridors', 'Stubble', 'Antivenom')..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#181B18] border border-[#30322E] rounded text-sm focus:outline-none focus:border-[#5A8A6C] text-[#F1EFE8] placeholder-[#A5A59C]/60"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-2.5 text-xs text-[#A5A59C] hover:text-[#F1EFE8] px-2 py-0.5 bg-[#131513] border border-[#30322E] rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A5A59C] mb-1">
              Domain Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#181B18] border border-[#30322E] rounded px-3 py-2 text-[#F1EFE8] focus:outline-none focus:border-[#5A8A6C]"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#131513] text-[#F1EFE8]">{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A5A59C] mb-1">
              Technical Readiness (TRL)
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#181B18] border border-[#30322E] rounded px-3 py-2 text-[#F1EFE8] focus:outline-none focus:border-[#5A8A6C]"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#131513] text-[#F1EFE8]">{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A5A59C] mb-1">
              Sort Sequence
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full bg-[#181B18] border border-[#30322E] rounded px-3 py-2 text-[#F1EFE8] focus:outline-none focus:border-[#5A8A6C]"
            >
              <option value="recent" className="bg-[#131513] text-[#F1EFE8]">Publication Date (Newest)</option>
              <option value="readingTime" className="bg-[#131513] text-[#F1EFE8]">Reading Time (Concise First)</option>
              <option value="title" className="bg-[#131513] text-[#F1EFE8]">Alphabetical Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Investigations List */}
      {filteredProblems.length === 0 ? (
        <div className="bg-[#131513] border border-dashed border-[#30322E] rounded-lg p-12 text-center space-y-4">
          <Sparkles className="w-12 h-12 text-[#5A8A6C] mx-auto opacity-60" />
          <h3 className="font-serif text-2xl font-bold text-[#F1EFE8]">
            {problems.length === 0 ? 'Problems of India Archive is Pristine & Ready' : 'No investigations found'}
          </h3>
          <p className="text-sm text-[#A5A59C] max-w-lg mx-auto leading-relaxed">
            {problems.length === 0
              ? 'All AI-generated filler has been removed. You are logged in as Owner & Lead Researcher (Divyankar Yadav • divyankyadav232@gmail.com). Click below to upload your 16-point technical blueprints and systemic research.'
              : 'No problem investigations matched your query parameters. Try resetting your filter criteria.'}
          </p>
          {isAdminMode && (
            <button
              onClick={() => navigateTo('admin')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5A8A6C] hover:bg-[#477057] text-[#0B0C0B] text-xs font-semibold uppercase tracking-wider rounded transition cursor-pointer"
            >
              <span>+ Upload New Problem Investigation</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProblems.map((prob) => {
            const isSaved = isBookmarked(prob.id);
            return (
              <article
                key={prob.id}
                className="bg-[#131513] border border-[#30322E] hover:border-[#5A8A6C] rounded-lg overflow-hidden transition group p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Narrative */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#A5A59C]">
                      <span className="font-mono text-[#5A8A6C] font-semibold">{prob.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[#B5A16A]">Status: {prob.status}</span>
                      <span className="font-mono ml-auto flex items-center gap-1 text-[#A5A59C]/80">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{prob.readingTimeMinutes} min read</span>
                      </span>
                    </div>

                    <h2
                      onClick={() => navigateTo('problem-detail', prob.slug)}
                      className="text-2xl sm:text-3xl font-serif font-bold text-[#F1EFE8] group-hover:text-[#5A8A6C] transition cursor-pointer leading-tight"
                    >
                      {prob.title}
                    </h2>

                    <p className="text-sm text-[#F1EFE8]/90 font-serif italic">
                      {prob.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-[#A5A59C] line-clamp-3 leading-relaxed">
                      {prob.problemStatement}
                    </p>

                    {/* Stats Snippets */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {prob.evidenceAndContext.statistics.slice(0, 3).map((st, i) => (
                        <div key={i} className="p-3 bg-[#181B18] border border-[#30322E] rounded">
                          <span className="block font-serif font-bold text-base text-[#5A8A6C] tabular-nums">
                            {st.value}
                          </span>
                          <span className="text-[10px] text-[#A5A59C] line-clamp-1 font-mono">{st.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => navigateTo('problem-detail', prob.slug)}
                        className="px-4 py-2.5 bg-[#5A8A6C] hover:bg-[#487258] text-[#0B0C0B] rounded text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5"
                      >
                        <span>Open 16-Point Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleBookmark(prob.id)}
                        className={`px-3 py-2.5 rounded text-xs font-mono transition border ${
                          isSaved
                            ? 'bg-[#B5A16A] text-[#0B0C0B] border-[#B5A16A] font-semibold'
                            : 'bg-[#181B18] border-[#30322E] text-[#A5A59C] hover:text-[#F1EFE8]'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isSaved ? 'Saved' : 'Save Dossier'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="lg:col-span-4">
                    <div className="relative rounded overflow-hidden h-60 lg:h-72 border border-[#30322E] bg-[#181B18]">
                      <img
                        src={prob.coverImageUrl}
                        alt={prob.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0B] via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-xs text-[#A5A59C] font-mono line-clamp-2">
                        {prob.imageCaption || prob.title}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
