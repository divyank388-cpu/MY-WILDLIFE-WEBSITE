import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  AtlasMode,
  AtlasMessage
} from '../types/atlas';
import { askAtlas, extractPublicDocuments } from '../services/atlasService';
import {
  Sparkles,
  Compass,
  Search,
  Send,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  X,
  FileText,
  ArrowRight
} from 'lucide-react';

export const AtlasPage: React.FC = () => {
  const {
    species,
    problems,
    atlasContext,
    setAtlasContext,
    atlasMode,
    setAtlasMode,
    atlasInitialPrompt,
    setAtlasInitialPrompt,
    navigateTo
  } = useApp();

  const [messages, setMessages] = useState<AtlasMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle initial prompt passed from contextual button
  useEffect(() => {
    if (atlasInitialPrompt) {
      setInputMessage(atlasInitialPrompt);
      setAtlasInitialPrompt('');
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [atlasInitialPrompt, setAtlasInitialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setError(null);
    setInputMessage('');

    const userMessage: AtlasMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      mode: atlasMode
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const publicDocs = extractPublicDocuments(species, problems);
      const conversationHistory = messages.slice(-4).map((m) => ({
        role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.content
      }));

      const response = await askAtlas(
        text,
        atlasMode,
        atlasContext || undefined,
        conversationHistory,
        publicDocs
      );

      const assistantMessage: AtlasMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
        mode: response.mode,
        summary: response.summary,
        websiteCitations: response.websiteCitations,
        externalCitations: response.externalCitations,
        suggestedFollowUps: response.suggestedFollowUps,
        uncertaintyNotes: response.uncertaintyNotes,
        isSupportedByRetrievedContent: response.isSupportedByRetrievedContent,
        evaluationReport: response.evaluationReport
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Atlas communication error:', err);
      setError(err.message || 'Unable to consult Atlas. Please check your network connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearSession = () => {
    setMessages([]);
    setError(null);
    setInputMessage('');
  };

  const modeDescriptions = {
    explore: 'Explore wildlife taxonomy, anatomical adaptations, trophic niches, and comparative biology.',
    investigate: 'Analyze root causes, architect 16-point solutions, pilot roadmaps, and stakeholder dependencies.',
    evaluate: 'Critically assess claims, separate assumptions from evidence, identify gaps, and calculate confidence.'
  };

  const suggestedQuestions: Record<AtlasMode, string[]> = {
    explore: atlasContext?.speciesName
      ? [
          `Summarize the trophic role of ${atlasContext.speciesName}.`,
          `What are the verified biological adaptations of ${atlasContext.speciesName}?`,
          `Compare ${atlasContext.speciesName} with another Indian apex predator.`
        ]
      : [
          'Compare the ecological roles of the Bengal Tiger and King Cobra.',
          'Why are Gharials vulnerable to river sand mining in the Chambal?',
          'Explain the anatomical flight constraints of the Great Indian Bustard.'
        ],
    investigate: atlasContext?.problemTitle
      ? [
          `What are the primary implementation bottlenecks for "${atlasContext.problemTitle}"?`,
          `Design a 6-month pilot test protocol for this intervention.`,
          `Identify potential stakeholder friction points and cost sensitivities.`
        ]
      : [
          'How can distributed fiber-optic acoustic sensing prevent elephant train collisions?',
          'What are the failure modes of community electro-chemical arsenic remediation in Bengal?',
          'Propose a decentralized bio-pellet logistics model for Punjab paddy straw.'
        ],
    evaluate: [
      'Evaluate whether seismic geophones alone can prevent elephant strikes during heavy monsoons.',
      'Assess the claim that fly-ash stabilization completely traps arsenic sludge.',
      'What critical field evidence is missing from current rural antivenom cold-chain policies?'
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-[#F1EFE8]">
      {/* Top Banner / Masthead */}
      <div className="bg-[#131513] border border-[#30322E] p-6 sm:p-8 rounded-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B5A16A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Atlas · Evidence-Grounded Scientific Inquiry</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#F1EFE8] tracking-tight">
              Research Atlas
            </h1>
            <p className="text-xs sm:text-sm text-[#A5A59C] max-w-2xl leading-relaxed">
              Grounded exclusively in VANA's published monographs, peer-reviewed natural history, and government engineering reports. Separates documented empirical data from hypotheses and cites sources directly.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {messages.length > 0 && (
              <button
                onClick={clearSession}
                className="px-3.5 py-2 bg-[#181B18] hover:bg-[#202420] text-[#A5A59C] hover:text-[#F1EFE8] rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition border border-[#30322E]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Context Banner */}
        {atlasContext && (atlasContext.speciesName || atlasContext.problemTitle) && (
          <div className="mt-4 pt-4 border-t border-[#30322E] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#A5A59C]">
              <span>Active Scope:</span>
              <strong className="text-[#B5A16A]">
                {atlasContext.speciesName ? `Species: ${atlasContext.speciesName}` : `Problem: ${atlasContext.problemTitle}`}
              </strong>
            </div>
            <button
              onClick={() => setAtlasContext(null)}
              className="text-xs text-[#A5A59C] hover:text-[#F1EFE8] underline flex items-center gap-1"
            >
              <span>Clear scope</span>
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-[#131513] border border-[#30322E] rounded-lg p-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => setAtlasMode('explore')}
            className={`p-3.5 rounded text-left transition flex items-start gap-3 ${
              atlasMode === 'explore'
                ? 'bg-[#181B18] text-[#F1EFE8] border border-[#B5A16A]'
                : 'hover:bg-[#181B18]/60 text-[#A5A59C] border border-transparent'
            }`}
          >
            <div className={`p-2 rounded shrink-0 ${atlasMode === 'explore' ? 'bg-[#0B0C0B] text-[#B5A16A]' : 'bg-[#181B18] text-[#A5A59C]'}`}>
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-[#F1EFE8]">Mode A: Explore</div>
              <div className="text-[11px] line-clamp-1 mt-0.5 text-[#A5A59C]">
                Natural history &amp; comparative biology
              </div>
            </div>
          </button>

          <button
            onClick={() => setAtlasMode('investigate')}
            className={`p-3.5 rounded text-left transition flex items-start gap-3 ${
              atlasMode === 'investigate'
                ? 'bg-[#181B18] text-[#F1EFE8] border border-[#5A8A6C]'
                : 'hover:bg-[#181B18]/60 text-[#A5A59C] border border-transparent'
            }`}
          >
            <div className={`p-2 rounded shrink-0 ${atlasMode === 'investigate' ? 'bg-[#0B0C0B] text-[#5A8A6C]' : 'bg-[#181B18] text-[#A5A59C]'}`}>
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-[#F1EFE8]">Mode B: Investigate</div>
              <div className="text-[11px] line-clamp-1 mt-0.5 text-[#A5A59C]">
                Root causes &amp; 16-point architectures
              </div>
            </div>
          </button>

          <button
            onClick={() => setAtlasMode('evaluate')}
            className={`p-3.5 rounded text-left transition flex items-start gap-3 ${
              atlasMode === 'evaluate'
                ? 'bg-[#181B18] text-[#F1EFE8] border border-[#B5A16A]'
                : 'hover:bg-[#181B18]/60 text-[#A5A59C] border border-transparent'
            }`}
          >
            <div className={`p-2 rounded shrink-0 ${atlasMode === 'evaluate' ? 'bg-[#0B0C0B] text-[#B5A16A]' : 'bg-[#181B18] text-[#A5A59C]'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-[#F1EFE8]">Mode C: Evaluate</div>
              <div className="text-[11px] line-clamp-1 mt-0.5 text-[#A5A59C]">
                Critical evidence audit &amp; trade-offs
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Conversation Feed */}
      <div className="space-y-6 min-h-[340px]">
        {messages.length === 0 ? (
          <div className="bg-[#131513] border border-[#30322E] rounded-lg p-8 sm:p-12 text-center space-y-6">
            <div className="w-14 h-14 rounded border border-[#30322E] bg-[#181B18] text-[#B5A16A] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-serif font-bold text-[#F1EFE8]">
                How may Atlas assist your research inquiry?
              </h2>
              <p className="text-xs sm:text-sm text-[#A5A59C] leading-relaxed">
                {modeDescriptions[atlasMode]}
              </p>
            </div>

            <div className="space-y-2 max-w-2xl mx-auto pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A5A59C] block">
                Suggested research prompts for {atlasMode.toUpperCase()} mode:
              </span>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2">
                {suggestedQuestions[atlasMode].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="p-3 bg-[#181B18] hover:bg-[#202420] border border-[#30322E] hover:border-[#B5A16A] rounded text-xs text-[#F1EFE8] text-left transition flex items-center justify-between gap-2 group"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A5A59C] group-hover:text-[#B5A16A] group-hover:translate-x-0.5 transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`space-y-4 ${
                msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-2xl bg-[#181B18] border border-[#30322E] text-[#F1EFE8] p-4 sm:p-5 rounded-lg space-y-1">
                  <div className="text-[10px] font-mono text-[#B5A16A] uppercase tracking-wider">
                    Your Research Question · {msg.mode}
                  </div>
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              ) : (
                <article className="max-w-3xl w-full bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 space-y-6">
                  {/* Assistant Message Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#30322E] pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-[#F1EFE8]">Atlas Research Synthesis</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181B18] text-[#B5A16A] border border-[#30322E] uppercase">
                        {msg.mode} Mode
                      </span>
                    </div>

                    <div className="text-[#A5A59C] text-[11px] font-mono">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Executive Summary Banner */}
                  {msg.summary && (
                    <div className="p-3.5 bg-[#181B18] border-l-2 border-[#B5A16A] rounded-r text-xs text-[#F1EFE8] leading-relaxed">
                      <strong className="text-[#B5A16A]">Executive Finding:</strong> {msg.summary}
                    </div>
                  )}

                  {/* Structured Answer Body */}
                  <div className="text-xs sm:text-sm text-[#F1EFE8]/90 leading-relaxed space-y-3 font-sans">
                    <div
                      className="whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: formatMarkdownAnswer(msg.content)
                      }}
                    />
                  </div>

                  {/* Evaluation Report */}
                  {msg.evaluationReport && (
                    <div className="bg-[#181B18] border border-[#30322E] rounded p-5 space-y-4 text-xs">
                      <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#F1EFE8]">
                        <ShieldCheck className="w-4 h-4 text-[#B5A16A]" />
                        <span>Evidence &amp; Uncertainty Audit</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-[#131513] rounded border border-[#30322E] space-y-1">
                          <span className="font-mono text-emerald-400 block text-[11px] uppercase">
                            Supporting Ground Evidence
                          </span>
                          <ul className="space-y-1 text-[#A5A59C]">
                            {msg.evaluationReport.supportingEvidence.map((s, idx) => (
                              <li key={idx}>· {s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 bg-[#131513] rounded border border-[#30322E] space-y-1">
                          <span className="font-mono text-rose-400 block text-[11px] uppercase">
                            Contradictory / Limiting Factors
                          </span>
                          <ul className="space-y-1 text-[#A5A59C]">
                            {msg.evaluationReport.contradictoryOrLimitingEvidence.map((c, idx) => (
                              <li key={idx}>· {c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="p-3 bg-[#131513] rounded border border-[#30322E] text-xs flex justify-between items-center font-mono">
                        <span className="text-[#A5A59C]">Confidence Assessment:</span>
                        <span className="font-semibold text-[#B5A16A]">
                          {msg.evaluationReport.confidenceAssessment}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Website Citations Tray */}
                  {msg.websiteCitations && msg.websiteCitations.length > 0 && (
                    <div className="pt-3 border-t border-[#30322E] space-y-2">
                      <span className="text-[11px] font-mono uppercase text-[#A5A59C] block">
                        Citations from VANA Published Archives ({msg.websiteCitations.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.websiteCitations.map((cit, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (cit.urlHash.startsWith('#species/')) {
                                navigateTo('species-detail', cit.urlHash.replace('#species/', ''));
                              } else if (cit.urlHash.startsWith('#problem/')) {
                                navigateTo('problem-detail', cit.urlHash.replace('#problem/', ''));
                              }
                            }}
                            className="p-2.5 bg-[#181B18] hover:bg-[#202420] border border-[#30322E] hover:border-[#B5A16A] rounded text-xs text-[#F1EFE8] transition cursor-pointer flex items-center gap-2 group"
                            title={cit.relevantPassage}
                          >
                            <FileText className="w-3.5 h-3.5 text-[#B5A16A]" />
                            <div className="text-left">
                              <span className="font-medium group-hover:text-[#B5A16A] block">
                                {cit.title}
                              </span>
                              <span className="text-[10px] text-[#A5A59C] uppercase font-mono">
                                {cit.documentType} · {cit.confidence}
                              </span>
                            </div>
                            <ExternalLink className="w-3 h-3 text-[#A5A59C] ml-1 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Literature Citations */}
                  {msg.externalCitations && msg.externalCitations.length > 0 && (
                    <div className="pt-1 text-[11px] text-[#A5A59C] space-y-1">
                      <span className="font-mono uppercase text-[10px]">External Verified Literature:</span>
                      <div className="flex flex-wrap gap-2">
                        {msg.externalCitations.map((ext, idx) => (
                          <span key={idx} className="bg-[#181B18] px-2 py-0.5 rounded border border-[#30322E] text-[#A5A59C] font-mono">
                            {ext.sourceTitle} ({ext.publisher}{ext.yearOrDate ? `, ${ext.yearOrDate}` : ''})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Uncertainty notes */}
                  {msg.uncertaintyNotes && (
                    <div className="text-[11px] text-[#A5A59C] italic flex items-center gap-1.5 pt-1">
                      <HelpCircle className="w-3.5 h-3.5 text-[#B5A16A] shrink-0" />
                      <span>{msg.uncertaintyNotes}</span>
                    </div>
                  )}

                  {/* Suggested Follow-Ups */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-4 border-t border-[#30322E] space-y-2">
                      <span className="text-[11px] font-mono uppercase text-[#A5A59C] block">
                        Suggested Follow-Up Questions:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedFollowUps.map((fol, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(fol)}
                            className="px-3 py-1.5 bg-[#181B18] hover:bg-[#202420] text-[#F1EFE8] border border-[#30322E] hover:border-[#B5A16A] rounded text-xs text-left transition"
                          >
                            + {fol}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#131513] border border-[#30322E] rounded-lg p-5 flex items-center gap-3 text-xs text-[#A5A59C]">
              <div className="w-4 h-4 border-2 border-[#B5A16A] border-t-transparent rounded-full animate-spin"></div>
              <span className="font-mono">Synthesizing findings from published monographs...</span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-lg text-xs space-y-2 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong>Atlas Inquiry Notice:</strong>
              <p className="mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => handleSend()}
              className="px-3 py-1 bg-rose-900 text-white rounded text-xs font-semibold hover:bg-rose-800 transition"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="sticky bottom-4 z-30 bg-[#131513]/95 backdrop-blur-md border border-[#30322E] rounded-lg p-3 sm:p-4 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder={`Ask Atlas in ${atlasMode.toUpperCase()} mode (e.g. "${suggestedQuestions[atlasMode][0]}")...`}
              className="w-full p-3 pr-14 bg-[#181B18] border border-[#30322E] rounded text-xs sm:text-sm text-[#F1EFE8] placeholder-[#A5A59C]/60 focus:outline-none focus:border-[#B5A16A] resize-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="absolute right-3 bottom-3.5 p-2 bg-[#B5A16A] hover:bg-[#9E8B56] disabled:bg-[#30322E] text-[#0B0C0B] rounded transition shadow-xs"
              title="Send inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-[#A5A59C] px-1 gap-2 font-mono">
            <div className="flex items-center gap-2">
              <span>Mode:</span>
              <span className="font-semibold text-[#B5A16A] uppercase">{atlasMode}</span>
              <span>· Shift+Enter for newline</span>
            </div>
            <span>Grounding: VANA Published Archives</span>
          </div>
        </form>
      </div>
    </div>
  );
};

function formatMarkdownAnswer(text: string): string {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h3 class="font-serif font-bold text-base text-[#F1EFE8] mt-3 mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-serif font-bold text-lg text-[#F1EFE8] mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="font-serif font-bold text-xl text-[#F1EFE8] mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#F1EFE8]">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-[#A5A59C]">$1</em>')
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-2 border-[#B5A16A] pl-3 py-1 my-2 italic text-[#A5A59C] bg-[#181B18]">$1</blockquote>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-[#A5A59C]">$1</li>');
}
