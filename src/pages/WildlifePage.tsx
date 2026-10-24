import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { searchWildlife } from '../utils/searchAndFilter';
import {
  Compass,
  Search,
  Bookmark,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const WildlifePage: React.FC = () => {
  const { species, navigateTo, toggleBookmark, isBookmarked, isAdminMode } = useApp();

  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBiome, setSelectedBiome] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'status'>('recent');

  const filteredSpecies = searchWildlife(
    species,
    query,
    selectedStatus,
    selectedBiome,
    selectedClass,
    sortBy
  );

  const biomes = [
    'All Biomes',
    'Western Ghats',
    'Central Indian Forests',
    'Indo-Gangetic Plain',
    'Thar Desert',
    'Northeast Hills',
    'Sundarbans'
  ];

  const statuses: { label: string; value: string }[] = [
    { label: 'All IUCN Statuses', value: 'all' },
    { label: 'Critically Endangered', value: 'Critically Endangered' },
    { label: 'Endangered', value: 'Endangered' },
    { label: 'Vulnerable', value: 'Vulnerable' },
    { label: 'Least Concern', value: 'Least Concern' }
  ];

  const classes = [
    { label: 'All Classes', value: 'all' },
    { label: 'Mammalia (Mammals)', value: 'Mammalia' },
    { label: 'Reptilia (Reptiles)', value: 'Reptilia' },
    { label: 'Aves (Birds)', value: 'Aves' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#F1EFE8]">
      {/* Editorial Header Banner */}
      <div className="border-b border-[#30322E] pb-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B5A16A]">
          <Compass className="w-4 h-4" />
          <span>Pillar I · Subcontinental Biodiversity &amp; Taxonomy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#F1EFE8]">
          Wildlife Dictionary
        </h1>
        <p className="text-base text-[#A5A59C] max-w-2xl leading-relaxed">
          An authoritative natural-history archive. Documenting evolutionary morphology, ethology, trophic interactions, and verifiable field status across India's imperiled ecological biomes.
        </p>

        {/* Ethical disclaimer */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#131513] border border-[#30322E] rounded text-xs text-[#A5A59C]">
          <ShieldAlert className="w-4 h-4 text-[#B5A16A] shrink-0" />
          <span>Anti-poaching security: Precise coordinates are generalized to prevent illegal targeting of vulnerable wildlife.</span>
        </div>

        {/* Owner Workspace Status */}
        {isAdminMode && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#131513] border border-[#B5A16A]/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#5A8A6C] animate-pulse" />
              <span className="text-[#F1EFE8] font-medium">
                Owner Workspace Active: Logged in as <strong>Divyankar Yadav</strong> (divyankyadav232@gmail.com)
              </span>
            </div>
            <button
              onClick={() => navigateTo('admin')}
              className="px-3.5 py-1.5 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] text-xs font-semibold uppercase tracking-wider rounded transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Publish New Species Monograph</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131513] border border-[#30322E] rounded-lg p-5 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#A5A59C] absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by common name, scientific binomial, Hindi name, or diet (e.g. 'Tiger', 'Gavialis', 'बाघ')..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#181B18] border border-[#30322E] rounded text-sm focus:outline-none focus:border-[#B5A16A] text-[#F1EFE8] placeholder-[#A5A59C]/60"
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

        {/* Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A5A59C] mb-1">Taxonomic Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-[#181B18] border border-[#30322E] rounded px-3 py-2 text-[#F1EFE8] focus:outline-none focus:border-[#B5A16A]"
            >
              {classes.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#131513] text-[#F1EFE8]">{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A5A59C] mb-1">IUCN Red List Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#181B18] border border-[#30322E] rounded px-3 py-2 text-[#F1EFE8] focus:outline-none focus:border-[#B5A16A]"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#131513] text-[#F1EFE8]">{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A5A59C] mb-1">Geographic Biome</label>
            <select
              value={selectedBiome}
              onChange={(e) => setSelectedBiome(e.target.value === 'All Biomes' ? 'all' : e.target.value)}
              className="w-full bg-[#181B18] border border-[#30322E] rounded px-3 py-2 text-[#F1EFE8] focus:outline-none focus:border-[#B5A16A]"
            >
              {biomes.map((b) => (
                <option key={b} value={b === 'All Biomes' ? 'all' : b} className="bg-[#131513] text-[#F1EFE8]">{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A5A59C] mb-1">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full bg-[#181B18] border border-[#30322E] rounded px-3 py-2 text-[#F1EFE8] focus:outline-none focus:border-[#B5A16A]"
            >
              <option value="recent" className="bg-[#131513] text-[#F1EFE8]">Recently Added / Updated</option>
              <option value="name" className="bg-[#131513] text-[#F1EFE8]">Alphabetical (Common Name)</option>
              <option value="status" className="bg-[#131513] text-[#F1EFE8]">Conservation Urgency (IUCN)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        {(query || selectedStatus !== 'all' || selectedBiome !== 'all' || selectedClass !== 'all') && (
          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-[#30322E] text-xs">
            <span className="text-[#A5A59C]">Active criteria:</span>
            {query && <span className="text-[#B5A16A]">Query: "{query}"</span>}
            {selectedClass !== 'all' && <span className="text-[#B5A16A]">· Class: {selectedClass}</span>}
            {selectedStatus !== 'all' && <span className="text-[#B5A16A]">· Status: {selectedStatus}</span>}
            {selectedBiome !== 'all' && <span className="text-[#B5A16A]">· Biome: {selectedBiome}</span>}
            <button
              onClick={() => {
                setQuery('');
                setSelectedClass('all');
                setSelectedStatus('all');
                setSelectedBiome('all');
              }}
              className="text-xs text-[#A5A59C] hover:text-[#F1EFE8] underline ml-2"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Museum Species Grid */}
      {filteredSpecies.length === 0 ? (
        <div className="bg-[#131513] border border-dashed border-[#30322E] rounded-lg p-12 text-center space-y-4">
          <Compass className="w-12 h-12 text-[#B5A16A] mx-auto opacity-60" />
          <h3 className="font-serif text-2xl font-bold text-[#F1EFE8]">
            {species.length === 0 ? 'Wildlife Dictionary is Pristine & Ready' : 'No species found in catalog'}
          </h3>
          <p className="text-sm text-[#A5A59C] max-w-lg mx-auto leading-relaxed">
            {species.length === 0
              ? 'All AI-generated filler has been removed. You are logged in as Owner & Lead Researcher (Divyankar Yadav • divyankyadav232@gmail.com). Click below to publish your first authentic species monograph.'
              : 'No wildlife entries matched your query parameters. Try resetting your search filters.'}
          </p>
          {isAdminMode && (
            <button
              onClick={() => navigateTo('admin')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] text-xs font-semibold uppercase tracking-wider rounded transition cursor-pointer"
            >
              <span>+ Publish New Species Monograph</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpecies.map((sp) => {
            const isSaved = isBookmarked(sp.id);
            return (
              <div
                key={sp.id}
                className="bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] rounded-lg overflow-hidden transition group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-[#181B18]">
                    <img
                      src={sp.primaryImageUrl}
                      alt={sp.commonName}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131513] via-transparent to-black/30" />

                    <div className="absolute top-3 left-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0B0C0B]/90 border border-[#30322E] text-[#B5A16A]">
                        {sp.taxonomy.class}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(sp.id);
                        }}
                        className={`p-2 rounded border border-[#30322E] transition ${
                          isSaved
                            ? 'bg-[#B5A16A] text-[#0B0C0B]'
                            : 'bg-[#0B0C0B]/80 text-[#F1EFE8] hover:text-[#B5A16A]'
                        }`}
                        title="Bookmark species"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                          sp.iucnStatus === 'Critically Endangered'
                            ? 'bg-rose-950/90 text-rose-300 border border-rose-800/60'
                            : sp.iucnStatus === 'Endangered'
                            ? 'bg-amber-950/90 text-amber-300 border border-amber-800/60'
                            : 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/60'
                        }`}
                      >
                        IUCN: {sp.iucnStatus}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div>
                      <div className="text-xs font-serif italic text-[#B5A16A]">
                        {sp.scientificName}
                      </div>
                      <h3
                        onClick={() => navigateTo('species-detail', sp.slug)}
                        className="font-serif text-2xl font-bold text-[#F1EFE8] group-hover:text-[#B5A16A] transition cursor-pointer mt-0.5"
                      >
                        {sp.commonName}
                      </h3>
                      {sp.vernacularNames.length > 0 && (
                        <div className="text-[11px] text-[#A5A59C] mt-1 font-sans">
                          {sp.vernacularNames.map((v) => `${v.name}`).join(' · ')}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-[#A5A59C] line-clamp-3 leading-relaxed">
                      {sp.physicalDescription}
                    </p>

                    <div className="text-[11px] text-[#A5A59C]/80 pt-1">
                      <span>Biomes: {sp.biomes.join(' · ')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#30322E] mt-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A5A59C]">
                    Order: {sp.taxonomy.order}
                  </span>
                  <button
                    onClick={() => navigateTo('species-detail', sp.slug)}
                    className="text-[#B5A16A] group-hover:underline flex items-center gap-1 transition"
                  >
                    <span>Read Monograph</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
