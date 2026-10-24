import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Feather,
  Compass,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle2,
  Award,
  Globe
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16 text-[#F1EFE8]">
      {/* Editorial Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B5A16A]">
          <Feather className="w-3.5 h-3.5" />
          <span>Founder's Declaration &amp; Institutional Ethics</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#F1EFE8] leading-tight">
          A Platform for Indian Natural Heritage &amp; Empirical Problem-Solving
        </h1>
        <p className="text-base sm:text-lg text-[#A5A59C] font-sans leading-relaxed">
          Founded by an Indian student driven by deep reverence for the subcontinent’s wild ecosystems and an unyielding commitment to the scientific method.
        </p>
      </div>

      {/* The Founder's Journey Narrative */}
      <section className="bg-[#131513] border border-[#30322E] rounded-lg p-8 sm:p-12 space-y-6 leading-relaxed">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F1EFE8]">
          Why VANA Exists
        </h2>
        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#A5A59C]">
          <p>
            Growing up across India, I was gripped by an apparent paradox: India possesses one of the world's most breathtaking biological spectacles — from the snow leopard ridges of Spiti to the wet evergreen rainforests of the Western Ghats and the alluvial riverbeds of the Chambal. Yet public discourse around nature is often trapped between sentimental romanticism and bureaucratic apathy.
          </p>
          <p>
            Simultaneously, our nation faces monumental development, environmental, and public health dilemmas: millions drinking arsenic-laden groundwater in the Gangetic basin, hundreds dying from preventable snakebite envenomation due to broken rural cold chains, endangered elephants colliding with passenger locomotives, and seasonal post-harvest crop fires choking millions of urban lungs.
          </p>
          <p>
            Natural history without empirical engineering remains a spectator sport, while engineering without biological nuance creates ecological devastation. <strong className="text-[#F1EFE8]">VANA (वन)</strong> was conceived to bridge this divide: an open-access knowledge platform where wildlife species are documented with scientific taxonomy, and national dilemmas are investigated with 16-point actionable blueprints.
          </p>
        </div>
      </section>

      {/* The Three Pillars Detailed */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] font-semibold">
            Platform Architecture
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#F1EFE8]">
            The Three Interlocking Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#131513] border border-[#30322E] rounded-lg p-6 space-y-3">
            <div className="w-9 h-9 rounded border border-[#30322E] bg-[#181B18] text-[#B5A16A] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F1EFE8]">1. Wildlife Dictionary</h3>
            <p className="text-xs text-[#A5A59C] leading-relaxed">
              Systematic Linnaean taxonomy, trophic dynamics, IUCN status, and verifiable field behaviors. We avoid stock photos and permanently mask coordinates of vulnerable nesting sites.
            </p>
          </div>

          <div className="bg-[#131513] border border-[#30322E] rounded-lg p-6 space-y-3">
            <div className="w-9 h-9 rounded border border-[#30322E] bg-[#181B18] text-[#5A8A6C] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F1EFE8]">2. Problems of India</h3>
            <p className="text-xs text-[#A5A59C] leading-relaxed">
              Every investigation is laid out across 16 rigorous points: root causes, institutional gaps, technical solution architectures, transparent cost models, and pilot protocols.
            </p>
          </div>

          <div className="bg-[#131513] border border-[#30322E] rounded-lg p-6 space-y-3">
            <div className="w-9 h-9 rounded border border-[#30322E] bg-[#181B18] text-[#B5A16A] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F1EFE8]">3. Research Community</h3>
            <p className="text-xs text-[#A5A59C] leading-relaxed">
              A peer-review forum where students, field researchers, and naturalists challenge our hypotheses, identify regional failure modes, and submit verified field observations.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Commitments */}
      <section className="bg-[#131513] border border-[#30322E] rounded-lg p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F1EFE8]">
          Our Uncompromising Commitments
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#A5A59C]">
          <div className="p-4 bg-[#181B18] border border-[#30322E] rounded space-y-2">
            <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#F1EFE8]">
              <ShieldCheck className="w-4 h-4 text-[#B5A16A]" />
              <span>Anti-Poaching Data Masking</span>
            </div>
            <p className="leading-relaxed">
              All field photographs and observations published on this platform have high-precision GPS EXIF data stripped. Coordinates for Schedule I species (Tigers, Gharials, Bustards, King Cobras) are generalized to minimum 30-km landscape polygons.
            </p>
          </div>

          <div className="p-4 bg-[#181B18] border border-[#30322E] rounded space-y-2">
            <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#F1EFE8]">
              <CheckCircle2 className="w-4 h-4 text-[#5A8A6C]" />
              <span>No Fabricated Data or Marketing Hype</span>
            </div>
            <p className="leading-relaxed">
              Every statistic cites primary verifiable sources: the Wildlife Institute of India (WII), Central Ground Water Board (CGWB), Indian Council of Medical Research (ICMR), or peer-reviewed journals.
            </p>
          </div>

          <div className="p-4 bg-[#181B18] border border-[#30322E] rounded space-y-2">
            <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#F1EFE8]">
              <Award className="w-4 h-4 text-[#B5A16A]" />
              <span>Honest Technical Readiness Levels (TRL)</span>
            </div>
            <p className="leading-relaxed">
              We clearly distinguish theoretical hypotheses from laboratory testing, pilot prototypes, and policy briefs. Readers are always informed of the exact maturity stage of any proposal.
            </p>
          </div>

          <div className="p-4 bg-[#181B18] border border-[#30322E] rounded space-y-2">
            <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#F1EFE8]">
              <Globe className="w-4 h-4 text-[#5A8A6C]" />
              <span>Open Academic Research &amp; Peer Critique</span>
            </div>
            <p className="leading-relaxed">
              We actively invite critiques of our costing, sensor choices, and environmental assumptions. Solutions become stronger when tested against rigorous peer skepticism.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Action */}
      <section className="bg-[#181B18] border border-[#30322E] rounded-lg p-8 text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#F1EFE8]">
          Participate in Subcontinental Research
        </h3>
        <p className="text-xs sm:text-sm text-[#A5A59C] max-w-xl mx-auto leading-relaxed">
          Are you a student researcher, field biologist, or engineer working on solutions in India? We welcome guest monographs, field data, and methodological audits.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button
            onClick={() => navigateTo('community')}
            className="px-5 py-2.5 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] rounded text-xs font-semibold uppercase tracking-wider transition"
          >
            Enter Community Forum
          </button>
          <button
            onClick={() => navigateTo('wildlife')}
            className="px-5 py-2.5 bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] text-[#F1EFE8] rounded text-xs font-mono uppercase tracking-wider transition"
          >
            Explore Wildlife Library
          </button>
        </div>
      </section>
    </div>
  );
};
