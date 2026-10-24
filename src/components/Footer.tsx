import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, CheckCircle2, AlertCircle, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, subscribeNewsletter } = useApp();
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Wildlife Discoveries',
    'Indian Problems & Solutions'
  ]);
  const [subscribeStatus, setSubscribeStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const [activeModal, setActiveModal] = useState<'standards' | 'privacy' | 'guidelines' | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const res = subscribeNewsletter(email, selectedTopics);
    if (res.success) {
      setSubscribeStatus({ type: 'success', message: res.message });
      setEmail('');
    } else {
      setSubscribeStatus({ type: 'error', message: res.message });
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <footer className="bg-[#0B0C0B] text-[#F1EFE8] mt-24 border-t border-[#30322E]">
      {/* Newsletter & Editorial Dispatch Section */}
      <div className="border-b border-[#30322E] py-14 px-4 sm:px-6 lg:px-8 bg-[#131513]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#B5A16A]">
              <Mail className="w-3.5 h-3.5" />
              <span>Weekly Sunday Dispatch</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F1EFE8]">
              Stay grounded in Indian biodiversity &amp; empirical solutions.
            </h3>
            <p className="text-sm text-[#A5A59C] max-w-xl leading-relaxed">
              Every Sunday morning, we publish one in-depth wildlife monograph and one actionable problem-solving investigation. No marketing hype—only peer-reviewed natural science and ground data.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter institutional email (e.g. naturalist@wii.gov.in)"
                  className="flex-1 bg-[#181B18] border border-[#30322E] rounded-md px-4 py-3 text-sm text-[#F1EFE8] placeholder-[#A5A59C]/60 focus:outline-none focus:border-[#B5A16A] transition"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] font-semibold text-sm rounded-md transition shadow-xs flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Subscribe</span>
                </button>
              </div>

              {/* Topics tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#A5A59C]">
                <span className="text-[11px] uppercase tracking-wider text-[#A5A59C]/70">Stream focus:</span>
                {['Wildlife Discoveries', 'Indian Problems & Solutions', 'Field Methodology'].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`px-2.5 py-1 rounded text-xs transition border ${
                      selectedTopics.includes(topic)
                        ? 'bg-[#181B18] border-[#B5A16A] text-[#B5A16A]'
                        : 'bg-[#0B0C0B] border-[#30322E] text-[#A5A59C] hover:text-[#F1EFE8]'
                    }`}
                  >
                    {selectedTopics.includes(topic) ? '✓ ' : '+ '}
                    {topic}
                  </button>
                ))}
              </div>

              {/* Status messages */}
              {subscribeStatus.type === 'success' && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-3 rounded border border-emerald-800/50">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{subscribeStatus.message}</span>
                </div>
              )}
              {subscribeStatus.type === 'error' && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 p-3 rounded border border-rose-800/50">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{subscribeStatus.message}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-serif font-bold text-[#F1EFE8]">VANA</span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 rounded border border-[#30322E] text-[#B5A16A] bg-[#131513]">
                वन • KNOWLEDGE PLATFORM
              </span>
            </div>
            <p className="text-sm text-[#A5A59C] leading-relaxed">
              An independent, student-founded open knowledge repository. We document India's extraordinary natural heritage and investigate the nation's most pressing ecological, infrastructural, and public health dilemmas with empirical rigor and actionable solution blueprints.
            </p>
            <div className="p-3.5 bg-[#131513] border border-[#30322E] rounded-md text-xs text-[#A5A59C] space-y-1.5">
              <div className="flex items-center gap-2 text-[#B5A16A] font-medium">
                <ShieldAlert className="w-4 h-4" />
                <span>Wildlife Protection &amp; Anti-Poaching Ethics</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#A5A59C]/80">
                In strict compliance with the Wildlife Protection Act (1972) Schedule I provisions, high-precision GPS coordinates for vulnerable species and nesting grounds are permanently sanitized.
              </p>
            </div>
          </div>

          {/* Pillars Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] font-semibold">
              The Three Pillars
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A5A59C]">
              <li>
                <button
                  onClick={() => navigateTo('wildlife')}
                  className="hover:text-[#F1EFE8] transition text-left"
                >
                  Wildlife Dictionary
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('problems')}
                  className="hover:text-[#F1EFE8] transition text-left"
                >
                  Problems of India
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('atlas')}
                  className="hover:text-[#F1EFE8] transition text-left text-[#B5A16A] font-medium"
                >
                  Research Atlas
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('community')}
                  className="hover:text-[#F1EFE8] transition text-left"
                >
                  Research Community
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-[#F1EFE8] transition text-left text-[#B5A16A]"
                >
                  My Research Account &amp; Progress
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-[#F1EFE8] transition text-left"
                >
                  Founder’s Mission
                </button>
              </li>
            </ul>
          </div>

          {/* Core Investigations Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] font-semibold">
              Selected Investigations
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A5A59C]">
              <li>
                <button
                  onClick={() => navigateTo('problem-detail', 'mitigating-linear-infrastructure-elephant-corridors')}
                  className="hover:text-[#F1EFE8] transition text-left"
                >
                  Elephant Corridor Safety
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('problem-detail', 'groundwater-arsenic-and-depletion-gangetic-plain')}
                  className="hover:text-[#F1EFE8] transition text-left"
                >
                  Gangetic Arsenic Remediation
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('problem-detail', 'human-snake-conflict-and-antivenom-cold-chain')}
                  className="hover:text-[#F1EFE8] transition text-left"
                >
                  Antivenom Cold Chain
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('problem-detail', 'stubble-burning-and-particulate-pollution')}
                  className="hover:text-[#F1EFE8] transition text-left"
                >
                  Paddy Bio-Pellet Pyrolysis
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & Transparency Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#B5A16A] font-semibold">
              Institutional Standards
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A5A59C]">
              <li>
                <button
                  onClick={() => setActiveModal('standards')}
                  className="hover:text-[#F1EFE8] transition text-left"
                >
                  Editorial &amp; Citation Standards
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('guidelines')}
                  className="hover:text-[#F1EFE8] transition text-left"
                >
                  Community Debate Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-[#F1EFE8] transition text-left"
                >
                  Privacy &amp; Data Ethics
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-[#F1EFE8] transition text-left flex items-center gap-1"
                >
                  <span>Student Research Statement</span>
                  <ExternalLink className="w-3 h-3 text-[#B5A16A]" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Micro Footer */}
        <div className="pt-10 mt-12 border-t border-[#30322E] flex flex-col sm:flex-row justify-between items-center text-xs text-[#A5A59C] gap-4">
          <p>© {new Date().getFullYear()} VANA (वन • Wildlife &amp; Innovation Knowledge Platform). Founded by an Indian student naturalist.</p>
          <div className="flex items-center gap-2">
            <span>Rigorous natural history &amp; verifiable evidence</span>
            <span>·</span>
            <span className="text-[#B5A16A]">Open Academic Research</span>
          </div>
        </div>
      </div>

      {/* Editorial Standards Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131513] border border-[#30322E] text-[#F1EFE8] max-w-2xl w-full rounded-lg p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-[#30322E] pb-4">
              <h3 className="font-serif text-2xl font-bold text-[#F1EFE8]">
                {activeModal === 'standards' && 'Editorial & Empirical Verification Standards'}
                {activeModal === 'guidelines' && 'Community Discussion & Peer Review Guidelines'}
                {activeModal === 'privacy' && 'Privacy, Anonymity & Wildlife Safety Policy'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#A5A59C] hover:text-[#F1EFE8] p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="text-sm space-y-3 leading-relaxed text-[#A5A59C]">
              {activeModal === 'standards' && (
                <>
                  <p><strong className="text-[#F1EFE8]">1. Primary Citations Only:</strong> Every claim, statistic, or population estimate must reference peer-reviewed scientific journals (e.g. Biological Conservation, Current Science, Lancet), institutional reports (WII, NTCA, ICMR, CGWB), or verifiable field datasets.</p>
                  <p><strong className="text-[#F1EFE8]">2. Distinguishing Fact from Hypothesis:</strong> Solutions presented on this platform are categorized honestly by technical readiness level (TRL): Under Investigation, Proposed Pilot, Field Trial Blueprint, or Policy Brief.</p>
                  <p><strong className="text-[#F1EFE8]">3. Transparent Costing:</strong> All engineering and deployment budgets are grounded in prevailing Indian Schedule of Rates (CPWD/PWD) and verifiable component markets.</p>
                </>
              )}
              {activeModal === 'guidelines' && (
                <>
                  <p><strong className="text-[#F1EFE8]">1. Evidence-Based Disagreement:</strong> We welcome technical challenges, skepticism, and failure-mode discoveries. When critiquing a proposal, provide hydrological, biological, or engineering rationale.</p>
                  <p><strong className="text-[#F1EFE8]">2. Zero Toxicity or Commercial Spam:</strong> Personal attacks, commercial spam, partisan political rhetoric, or harassment of researchers will result in prompt removal.</p>
                  <p><strong className="text-[#F1EFE8]">3. Zero Simulated AI Bots:</strong> All community discourse reflects genuine student researchers, field naturalists, and domain specialists.</p>
                </>
              )}
              {activeModal === 'privacy' && (
                <>
                  <p><strong className="text-[#F1EFE8]">1. Wildlife Protection Compliance:</strong> Under the Indian Wildlife Protection Act (1972), displaying accurate geographic coordinates of endangered raptor nests, tiger den sites, or gharial nesting banks is dangerous. All images published on this platform have EXIF coordinates permanently sanitized.</p>
                  <p><strong className="text-[#F1EFE8]">2. Minimal Data Collection:</strong> We do not sell user data, track cross-site cookies, or monetize newsletter subscriptions.</p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-[#30322E] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] rounded-md text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
