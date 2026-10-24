import React from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, X, Trash2, ArrowRight, Compass, Sparkles } from 'lucide-react';

export const BookmarksDrawer: React.FC = () => {
  const {
    isBookmarksOpen,
    setIsBookmarksOpen,
    bookmarks,
    toggleBookmark,
    species,
    problems,
    navigateTo
  } = useApp();

  if (!isBookmarksOpen) return null;

  const savedSpecies = species.filter((s) => bookmarks.includes(s.id));
  const savedProblems = problems.filter((p) => bookmarks.includes(p.id));
  const totalCount = savedSpecies.length + savedProblems.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#131513] border-l border-[#30322E] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 text-[#F1EFE8]">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#30322E] flex justify-between items-center bg-[#181B18]">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-4 h-4 text-[#B5A16A]" />
            <h3 className="font-serif text-xl font-bold text-[#F1EFE8]">Saved Research Dossiers</h3>
            <span className="text-xs bg-[#0B0C0B] border border-[#30322E] text-[#B5A16A] px-2 py-0.5 rounded font-mono">
              {totalCount}
            </span>
          </div>
          <button
            onClick={() => setIsBookmarksOpen(false)}
            className="p-1 text-[#A5A59C] hover:text-[#F1EFE8] hover:bg-[#131513] rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {totalCount === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Bookmark className="w-12 h-12 text-[#30322E] mx-auto" />
              <p className="font-serif text-lg text-[#F1EFE8]">Your reading list is empty</p>
              <p className="text-xs text-[#A5A59C] max-w-xs mx-auto leading-relaxed">
                Click the bookmark button on any species monograph or problem investigation to save it here for offline reference.
              </p>
            </div>
          ) : (
            <>
              {savedSpecies.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#B5A16A]">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Wildlife Monographs ({savedSpecies.length})</span>
                  </div>
                  <div className="space-y-2">
                    {savedSpecies.map((sp) => (
                      <div
                        key={sp.id}
                        className="p-3 bg-[#181B18] border border-[#30322E] rounded hover:border-[#B5A16A] transition flex items-center justify-between group"
                      >
                        <div
                          onClick={() => {
                            navigateTo('species-detail', sp.slug);
                            setIsBookmarksOpen(false);
                          }}
                          className="cursor-pointer flex-1 pr-2"
                        >
                          <div className="font-serif font-semibold text-sm text-[#F1EFE8] group-hover:text-[#B5A16A]">
                            {sp.commonName}
                          </div>
                          <div className="text-xs italic text-[#A5A59C]">{sp.scientificName}</div>
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.2 bg-[#0B0C0B] border border-[#30322E] text-[#A5A59C] rounded font-mono">
                            {sp.iucnStatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleBookmark(sp.id)}
                            className="p-1.5 text-[#A5A59C] hover:text-rose-400 transition"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              navigateTo('species-detail', sp.slug);
                              setIsBookmarksOpen(false);
                            }}
                            className="p-1.5 text-[#A5A59C] group-hover:text-[#B5A16A] transition"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {savedProblems.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#5A8A6C]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Problem Investigations ({savedProblems.length})</span>
                  </div>
                  <div className="space-y-2">
                    {savedProblems.map((prob) => (
                      <div
                        key={prob.id}
                        className="p-3 bg-[#181B18] border border-[#30322E] rounded hover:border-[#5A8A6C] transition flex items-center justify-between group"
                      >
                        <div
                          onClick={() => {
                            navigateTo('problem-detail', prob.slug);
                            setIsBookmarksOpen(false);
                          }}
                          className="cursor-pointer flex-1 pr-2"
                        >
                          <div className="font-serif font-semibold text-sm text-[#F1EFE8] group-hover:text-[#5A8A6C] line-clamp-1">
                            {prob.title}
                          </div>
                          <div className="text-xs text-[#A5A59C] mt-0.5">{prob.category}</div>
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.2 bg-[#0B0C0B] border border-[#30322E] text-[#A5A59C] rounded font-mono">
                            {prob.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleBookmark(prob.id)}
                            className="p-1.5 text-[#A5A59C] hover:text-rose-400 transition"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              navigateTo('problem-detail', prob.slug);
                              setIsBookmarksOpen(false);
                            }}
                            className="p-1.5 text-[#A5A59C] group-hover:text-[#5A8A6C] transition"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
