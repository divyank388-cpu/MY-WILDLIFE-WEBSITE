import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { performGlobalSearch, GlobalSearchResult } from '../utils/searchAndFilter';
import { Search, X, Compass, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    species,
    problems,
    communityPosts,
    navigateTo
  } = useApp();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'species' | 'problem' | 'community'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      } else if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  // Auto focus input when opened
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const rawResults = performGlobalSearch(query, species, problems, communityPosts);
  const results = filterType === 'all' ? rawResults : rawResults.filter((r) => r.type === filterType);

  const handleSelect = (result: GlobalSearchResult) => {
    setIsSearchModalOpen(false);
    if (result.type === 'species') {
      const sp = species.find((s) => s.id === result.id);
      if (sp) navigateTo('species-detail', sp.slug);
    } else if (result.type === 'problem') {
      const prob = problems.find((p) => p.id === result.id);
      if (prob) navigateTo('problem-detail', prob.slug);
    } else if (result.type === 'community') {
      const post = communityPosts.find((c) => c.id === result.id);
      if (post) navigateTo('community-thread', post.slug);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 p-4 animate-in fade-in duration-200">
      <div className="bg-[#131513] border border-[#30322E] w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#30322E] flex items-center gap-3 bg-[#181B18]">
          <Search className="w-5 h-5 text-[#B5A16A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wildlife monographs, problem investigations, or discourse..."
            className="w-full text-base sm:text-lg bg-transparent border-none focus:outline-none text-[#F1EFE8] placeholder-[#A5A59C]/60"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#A5A59C] hover:text-[#F1EFE8] px-2 py-1 bg-[#131513] rounded border border-[#30322E]"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 text-[#A5A59C] hover:text-[#F1EFE8] hover:bg-[#131513] rounded transition"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#0B0C0B] border-b border-[#30322E] overflow-x-auto text-xs">
          <span className="text-[#A5A59C]/70 font-mono uppercase text-[10px] tracking-wider">
            Scope:
          </span>
          {[
            { id: 'all', label: 'All Results' },
            { id: 'species', label: 'Wildlife Species' },
            { id: 'problem', label: 'Problems of India' },
            { id: 'community', label: 'Research Discourse' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1 rounded text-xs transition ${
                filterType === tab.id
                  ? 'bg-[#181B18] text-[#B5A16A] border border-[#B5A16A] font-medium'
                  : 'text-[#A5A59C] hover:text-[#F1EFE8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto divide-y divide-[#30322E] p-2 flex-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-[#A5A59C] space-y-2">
              <p className="font-serif text-lg text-[#F1EFE8]">No indexed entries matched your search.</p>
              <p className="text-xs max-w-sm mx-auto">
                Try searching for "Tiger", "Elephant", "Arsenic", "Antivenom", or a specific habitat.
              </p>
            </div>
          ) : (
            results.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelect(result)}
                className="p-3.5 hover:bg-[#181B18] rounded cursor-pointer transition flex items-center justify-between group"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2 text-xs">
                    {result.type === 'species' && (
                      <span className="font-mono text-[11px] text-[#B5A16A] flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5" /> Wildlife Monograph
                      </span>
                    )}
                    {result.type === 'problem' && (
                      <span className="font-mono text-[11px] text-[#5A8A6C] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> National Investigation
                      </span>
                    )}
                    {result.type === 'community' && (
                      <span className="font-mono text-[11px] text-[#C28B38] flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> Research Discourse
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-semibold text-[#F1EFE8] group-hover:text-[#B5A16A] transition text-base">
                    {result.title}
                  </h4>
                  <p className="text-xs text-[#A5A59C] line-clamp-1">{result.subtitle}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A5A59C] group-hover:text-[#B5A16A] group-hover:translate-x-1 transition shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer Shortcut hint */}
        <div className="px-5 py-2.5 bg-[#0B0C0B] border-t border-[#30322E] flex justify-between items-center text-[11px] text-[#A5A59C] font-mono">
          <span>{results.length} archival matches</span>
          <span>ESC to close · ↑↓ to browse</span>
        </div>
      </div>
    </div>
  );
};
