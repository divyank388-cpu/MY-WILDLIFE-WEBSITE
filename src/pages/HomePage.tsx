import React from 'react';
import { useApp } from '../context/AppContext';
import { Hero3DVisual } from '../components/Hero3DVisual';
import { HeroAiConsole } from '../components/HeroAiConsole';
import { RealEarth3D } from '../components/RealEarth3D';
import {
  Compass,
  ArrowRight,
  BookOpen,
  ChevronDown,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Plus,
  Globe
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { species, problems, communityPosts, navigateTo, isAdminMode } = useApp();

  const featuredWildlife = species.find((s) => s.weeklyFeatured) || species[0] || null;
  const featuredProblem = problems.find((p) => p.weeklyFeatured) || problems[0] || null;
  const recentSpecies = species.filter((s) => !s.isDraft).slice(0, 3);
  const recentDiscussions = communityPosts.slice(0, 3);

  const scrollToPillars = () => {
    document.getElementById('pillars-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-24 text-[#F1EFE8]">
      {/* SECTION 1: Cinematic Homepage Opening with 3D Spatial Visual */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden border-b border-[#30322E] bg-[#0B0C0B]">
        {/* Subtle background ambient gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#18231c_0%,transparent_60%)] pointer-events-none opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:py-20 relative z-10 w-full flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
            {/* Left Copy: Editorial Headline & Brand Statement */}
            <div className="lg:col-span-7 space-y-6 lg:pr-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#131513] border border-[#30322E] rounded text-xs font-mono tracking-widest text-[#B5A16A] uppercase">
                <span>VANA (वन) • Volume XIV · Peer-Reviewed Journal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-[#F1EFE8] leading-[1.12] text-balance">
                Natural history of India. <br />
                <span className="italic font-normal text-[#B5A16A]">Empirical engineering</span> <br />
                for our hardest dilemmas.
              </h1>

              <p className="text-base sm:text-lg text-[#A5A59C] max-w-xl font-sans leading-relaxed">
                Founded by an Indian student naturalist, <strong className="text-[#F1EFE8] font-semibold">VANA</strong> bridges taxonomic biology with field-tested solutions — archiving endangered species, architecting actionable blueprints for national systemic challenges, and cultivating peer review without commercial hype.
              </p>

              {/* Clear Entry Points to Wildlife, Problems, and Community */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => navigateTo('wildlife')}
                  className="px-5 py-3 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] font-semibold rounded text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2 group"
                >
                  <Compass className="w-4 h-4" />
                  <span>Wildlife Dictionary</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => navigateTo('problems')}
                  className="px-5 py-3 bg-[#131513] hover:bg-[#181B18] text-[#F1EFE8] border border-[#30322E] hover:border-[#B5A16A] font-medium rounded text-xs uppercase tracking-wider transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#B5A16A]" />
                  <span>Problems of India</span>
                </button>

                <button
                  onClick={() => navigateTo('community')}
                  className="px-4 py-3 text-[#A5A59C] hover:text-[#F1EFE8] text-xs font-mono uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#B5A16A]" />
                  <span>Discourse</span>
                </button>
              </div>

              {/* Quantitative Archival Standards */}
              <div className="pt-8 border-t border-[#30322E] grid grid-cols-3 gap-6 text-xs text-[#A5A59C]">
                <div>
                  <span className="block font-serif text-2xl font-bold text-[#F1EFE8] tabular-nums">100%</span>
                  <span className="text-[11px] uppercase tracking-wider text-[#A5A59C]">Primary Citations</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-[#B5A16A] tabular-nums">16-Pt</span>
                  <span className="text-[11px] uppercase tracking-wider text-[#A5A59C]">Scientific Framework</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-[#F1EFE8] tabular-nums">Zero</span>
                  <span className="text-[11px] uppercase tracking-wider text-[#A5A59C]">Commercial Fluff</span>
                </div>
              </div>
            </div>

            {/* Right: Subtle Animated 3D Topographic Spatial Experience */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="w-full relative bg-[#131513]/60 border border-[#30322E] rounded-lg p-2 backdrop-blur-xs">
                <Hero3DVisual />
              </div>
            </div>
          </div>
        </div>

        {/* Restrained Scroll Indicator */}
        <div className="pb-6 flex justify-center">
          <button
            onClick={scrollToPillars}
            className="flex flex-col items-center gap-1.5 text-xs text-[#A5A59C] hover:text-[#B5A16A] transition font-mono tracking-widest uppercase cursor-pointer"
            aria-label="Scroll to exploration pillars"
          >
            <span>Explore Pillars</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </section>

      {/* SECTION 1.5: Front-and-Center AI Research Terminal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <HeroAiConsole />
      </section>

      {/* SECTION 1.75: Planetary Biosphere Observatory & India Wildlife/Environmental Index */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-2xl mb-6 space-y-2">
          <div className="font-mono text-xs uppercase tracking-widest text-[#B5A16A] flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Planetary Biosphere &amp; Empirical Data Observatory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F1EFE8]">
            3D Terrestrial Globe &amp; India Environmental Benchmarks
          </h2>
          <p className="text-xs sm:text-sm text-[#A5A59C] leading-relaxed">
            Real rotating Earth highlighting India's wildlife censuses (Tigers, Asian Elephants, Rhinos, Lions), global climate rankings (CCPI, RECAI), and protected Ramsar wetland ecosystems.
          </p>
        </div>

        <RealEarth3D />
      </section>

      {/* SECTION 2: The Three Interlocking Pillars */}
      <section id="pillars-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="max-w-2xl mb-12 space-y-2">
          <div className="font-mono text-xs uppercase tracking-widest text-[#B5A16A]">
            Architectural Structure
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F1EFE8]">
            Three Interlocking Pillars of Truth
          </h2>
          <p className="text-sm text-[#A5A59C] leading-relaxed">
            Natural history without empirical problem-solving remains detached; solutions without biological grounding fail. We bind them together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Wildlife Dictionary */}
          <div
            onClick={() => navigateTo('wildlife')}
            className="bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] rounded-lg p-8 transition duration-200 group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded border border-[#30322E] bg-[#181B18] flex items-center justify-center text-[#B5A16A] group-hover:border-[#B5A16A] transition">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#B5A16A]">
                  Pillar I · Natural History
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#F1EFE8] group-hover:text-[#B5A16A] transition mt-1">
                  Wildlife Dictionary
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#A5A59C] leading-relaxed">
                Detailed species monographs starting with the Indian subcontinent. Taxonomy, IUCN Red List threat dynamics, biomes, ethology, and high-fidelity photography with masked nesting coordinates.
              </p>
            </div>

            <div className="pt-6 border-t border-[#30322E] flex justify-between items-center text-xs font-mono text-[#A5A59C] group-hover:text-[#F1EFE8]">
              <span>Explore Taxonomy Archive</span>
              <ArrowRight className="w-4 h-4 text-[#B5A16A] group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Pillar 2: Problems of India */}
          <div
            onClick={() => navigateTo('problems')}
            className="bg-[#131513] border border-[#30322E] hover:border-[#5A8A6C] rounded-lg p-8 transition duration-200 group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded border border-[#30322E] bg-[#181B18] flex items-center justify-center text-[#5A8A6C] group-hover:border-[#5A8A6C] transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#5A8A6C]">
                  Pillar II · Research Journal
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#F1EFE8] group-hover:text-[#5A8A6C] transition mt-1">
                  Problems of India
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#A5A59C] leading-relaxed">
                Exhaustive, 16-point scientific investigations into national challenges: linear corridor fragmentation, groundwater heavy metal leaching, antivenom cold chains, and crop burning pyrolysis.
              </p>
            </div>

            <div className="pt-6 border-t border-[#30322E] flex justify-between items-center text-xs font-mono text-[#A5A59C] group-hover:text-[#F1EFE8]">
              <span>Read Solution Blueprints</span>
              <ArrowRight className="w-4 h-4 text-[#5A8A6C] group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Pillar 3: Research Community */}
          <div
            onClick={() => navigateTo('community')}
            className="bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] rounded-lg p-8 transition duration-200 group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded border border-[#30322E] bg-[#181B18] flex items-center justify-center text-[#B5A16A] group-hover:border-[#B5A16A] transition">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#B5A16A]">
                  Pillar III · Peer Review
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#F1EFE8] group-hover:text-[#B5A16A] transition mt-1">
                  Research Community
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#A5A59C] leading-relaxed">
                Authentic academic discourse for student researchers and naturalists. Technical critiques on acoustic sensor latency, geopolymer binding of arsenic sludge, and ethical field photography.
              </p>
            </div>

            <div className="pt-6 border-t border-[#30322E] flex justify-between items-center text-xs font-mono text-[#A5A59C] group-hover:text-[#F1EFE8]">
              <span>Join Scientific Discourse</span>
              <ArrowRight className="w-4 h-4 text-[#B5A16A] group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Featured Species & Investigation Spotlight (Asymmetric Editorial Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-[#30322E] pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Featured Wildlife Monograph */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-[#30322E] pb-3">
              <div className="font-mono text-xs uppercase tracking-widest text-[#B5A16A]">
                Weekly Monograph Spotlight
              </div>
              {featuredWildlife && (
                <span className="font-mono text-xs text-[#A5A59C]">
                  IUCN: <strong className="text-rose-400">{featuredWildlife.iucnStatus}</strong>
                </span>
              )}
            </div>

            {featuredWildlife ? (
              <div
                onClick={() => navigateTo('species-detail', featuredWildlife.slug)}
                className="bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] rounded-lg overflow-hidden group cursor-pointer transition"
              >
                <div className="relative h-72 sm:h-96 overflow-hidden">
                  <img
                    src={featuredWildlife.primaryImageUrl}
                    alt={featuredWildlife.commonName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131513] via-[#131513]/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-xs italic text-[#B5A16A] font-serif">{featuredWildlife.scientificName}</div>
                    <h3 className="text-3xl font-serif font-bold text-[#F1EFE8] mt-1">{featuredWildlife.commonName}</h3>
                    <p className="text-xs text-[#A5A59C] mt-2 line-clamp-2 leading-relaxed">
                      {featuredWildlife.distributionSummary}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-xs text-[#A5A59C] flex flex-wrap items-center gap-3">
                    <span>Biomes: <strong className="text-[#F1EFE8]">{featuredWildlife.biomes.join(' · ')}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Order: <strong className="text-[#F1EFE8]">{featuredWildlife.taxonomy.order}</strong></span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#30322E] text-xs font-mono">
                    <span className="text-[#A5A59C]">Masked GPS Coordinates · NTCA Compliance</span>
                    <span className="text-[#B5A16A] flex items-center gap-1 group-hover:underline">
                      Read Monograph <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#131513] border border-dashed border-[#30322E] rounded-lg p-10 text-center space-y-3">
                <Compass className="w-8 h-8 text-[#B5A16A] mx-auto opacity-70" />
                <h4 className="font-serif text-lg text-[#F1EFE8]">Wildlife Archive Awaiting Publication</h4>
                <p className="text-xs text-[#A5A59C] max-w-md mx-auto">
                  Owner publishing session active. Upload original monographs directly via the Editorial Suite.
                </p>
                {isAdminMode && (
                  <button
                    onClick={() => navigateTo('admin')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#B5A16A] text-[#0B0C0B] text-xs font-semibold uppercase tracking-wider rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publish Monograph</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Featured Problem Investigation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-[#30322E] pb-3">
              <div className="font-mono text-xs uppercase tracking-widest text-[#5A8A6C]">
                Empirical Investigation
              </div>
              {featuredProblem && (
                <span className="font-mono text-xs text-[#A5A59C]">
                  {featuredProblem.status}
                </span>
              )}
            </div>

            {featuredProblem ? (
              <div
                onClick={() => navigateTo('problem-detail', featuredProblem.slug)}
                className="bg-[#131513] border border-[#30322E] hover:border-[#5A8A6C] rounded-lg p-6 space-y-5 group cursor-pointer transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#5A8A6C]">
                    <span>{featuredProblem.category}</span>
                    <span>·</span>
                    <span>{featuredProblem.readingTimeMinutes} min deep read</span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-[#F1EFE8] group-hover:text-[#5A8A6C] transition leading-snug">
                    {featuredProblem.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#A5A59C] leading-relaxed line-clamp-4">
                    {featuredProblem.executiveSummary}
                  </p>

                  <div className="p-4 bg-[#181B18] border border-[#30322E] rounded text-xs space-y-2">
                    <span className="font-mono text-[10px] uppercase text-[#B5A16A] tracking-wider block">
                      Core Actionable Intervention
                    </span>
                    <p className="text-[#F1EFE8] text-xs font-sans leading-relaxed line-clamp-3">
                      {featuredProblem.proposedSolution}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#30322E] flex justify-between items-center text-xs font-mono text-[#A5A59C]">
                  <span>16-Point Framework Blueprint</span>
                  <span className="text-[#5A8A6C] flex items-center gap-1 group-hover:underline">
                    Full Dossier <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-[#131513] border border-dashed border-[#30322E] rounded-lg p-10 text-center space-y-3">
                <BookOpen className="w-8 h-8 text-[#5A8A6C] mx-auto opacity-70" />
                <h4 className="font-serif text-lg text-[#F1EFE8]">Problem Dossiers Ready for Upload</h4>
                <p className="text-xs text-[#A5A59C] max-w-md mx-auto">
                  Owner publishing session active. Upload your systemic solutions and research blueprints.
                </p>
                {isAdminMode && (
                  <button
                    onClick={() => navigateTo('admin')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#5A8A6C] text-[#0B0C0B] text-xs font-semibold uppercase tracking-wider rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Investigation</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: Recent Research & Peer Discourses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-[#30322E] pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#B5A16A]">
                Recent Department Dispatches
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F1EFE8] mt-1">
                Field Monographs &amp; Research Critique
              </h2>
            </div>
            <button
              onClick={() => navigateTo('wildlife')}
              className="text-xs font-mono text-[#A5A59C] hover:text-[#B5A16A] flex items-center gap-1"
            >
              <span>View complete library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentSpecies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentSpecies.map((sp) => (
                <div
                  key={sp.id}
                  onClick={() => navigateTo('species-detail', sp.slug)}
                  className="bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] rounded-lg overflow-hidden group cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={sp.primaryImageUrl}
                        alt={sp.commonName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#0B0C0B]/90 border border-[#30322E] text-[10px] font-mono text-[#B5A16A] rounded">
                        {sp.iucnStatus}
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="text-[11px] font-serif italic text-[#A5A59C]">{sp.scientificName}</div>
                      <h4 className="text-xl font-serif font-bold text-[#F1EFE8] group-hover:text-[#B5A16A] transition">
                        {sp.commonName}
                      </h4>
                      <p className="text-xs text-[#A5A59C] line-clamp-2 leading-relaxed">
                        {sp.distributionSummary}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-[#30322E] flex justify-between items-center text-xs font-mono text-[#A5A59C]">
                      <span>Biomes: {sp.biomes[0]}</span>
                      <span className="text-[#B5A16A]">Monograph →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#131513] border border-dashed border-[#30322E] rounded-lg p-10 text-center space-y-3">
              <Compass className="w-8 h-8 text-[#B5A16A] mx-auto opacity-70" />
              <h4 className="font-serif text-lg text-[#F1EFE8]">Archive Pristine &amp; Ready for Owner Publications</h4>
              <p className="text-xs text-[#A5A59C] max-w-md mx-auto">
                All AI-generated filler has been removed. Logged in as Owner (Divyankar Yadav • divyankyadav232@gmail.com). You can publish original wildlife monographs or research blueprints anytime.
              </p>
              {isAdminMode && (
                <button
                  onClick={() => navigateTo('admin')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#B5A16A] text-[#0B0C0B] text-xs font-semibold uppercase tracking-wider rounded"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Your First Monograph</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: Institutional Ethics & Platform Manifesto */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#131513] border border-[#30322E] rounded-lg p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="font-mono text-xs uppercase tracking-widest text-[#B5A16A]">
              Founder’s Institutional Charter
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F1EFE8]">
              "Science is not a museum piece. It is a defense against ecological negligence."
            </h2>
            <p className="text-sm text-[#A5A59C] leading-relaxed">
              India houses 7–8% of all recorded species while supporting 18% of global human population on 2.4% of land area. VANA documents both the splendor of our wild ecosystems and the engineering failures that endanger them. We stand against sensationalized content, unverified claims, and commercial advertising.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#B5A16A]">
              <span>Divyankar Yadav · Founder &amp; Student Naturalist</span>
              <span>·</span>
              <button
                onClick={() => navigateTo('about')}
                className="hover:underline flex items-center gap-1"
              >
                Read Institutional Charter <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
