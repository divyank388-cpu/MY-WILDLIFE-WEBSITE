import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Database, Search } from 'lucide-react';

export const HeroAiConsole: React.FC = () => {
  const { openAtlas, navigateTo } = useApp();
  const [query, setQuery] = useState('');

  const samplePrompts = [
    'How do railway underpasses protect Asian Elephants in West Bengal?',
    'What are the hydrological nesting requirements for Gharials?',
    'Explain root causes of crop residue burning in Punjab & Haryana',
    'Calculate Western Ghats biodiversity endemism corridors'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    openAtlas('explore', undefined, query.trim());
  };

  const handleChipClick = (prompt: string) => {
    openAtlas('explore', undefined, prompt);
  };

  return (
    <div className="w-full bg-[#131513]/80 border border-[#30322E] rounded-xl p-5 sm:p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition hover:border-[#5A8A6C]/60">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-[#30322E]">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5A8A6C] animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#5A8A6C] relative" />
          </div>
          <span className="font-serif font-bold text-[#F1EFE8] text-sm tracking-wide">
            Atlas AI Research Intelligence
          </span>
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#0B0C0B] border border-[#30322E] text-[#B5A16A]">
            Active
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#A5A59C]">
          <Database className="w-3.5 h-3.5 text-[#5A8A6C]" />
          <span>Grounded in VANA Scientific Archives</span>
        </div>
      </div>

      {/* Interactive Command Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="w-4 h-4 text-[#B5A16A] absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Atlas: e.g. 'How can underpasses prevent train-elephant collisions in Dooars?'"
          className="w-full pl-11 pr-32 py-3.5 bg-[#0B0C0B] border border-[#30322E] focus:border-[#B5A16A] rounded-lg text-xs sm:text-sm text-[#F1EFE8] placeholder-[#A5A59C]/60 outline-none transition font-sans shadow-inner"
        />
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] font-semibold rounded text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <span>Ask Atlas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* One-Tap Suggested Empirical Inquiry Chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#A5A59C] mr-1">
          Inquiries:
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(prompt)}
            className="text-left px-2.5 py-1 rounded bg-[#0B0C0B] hover:bg-[#181B18] border border-[#30322E] hover:border-[#B5A16A] text-[11px] text-[#A5A59C] hover:text-[#F1EFE8] transition cursor-pointer"
          >
            ✦ {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
