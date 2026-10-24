import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { askAtlas, extractPublicDocuments } from '../services/atlasService';
import { AtlasMode, AtlasMessage } from '../types/atlas';
import {
  Sparkles,
  X,
  Send,
  Compass,
  FileText,
  RotateCcw,
  ArrowRight,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const AtlasFloatingWidget: React.FC = () => {
  const { species, problems, navigateTo, openAtlas } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<AtlasMode>('explore');
  const [messages, setMessages] = useState<AtlasMessage[]>([
    {
      id: 'welcome-floating',
      role: 'assistant',
      content: 'I am Atlas — VANA\'s empirical research intelligence engine. Ask me about Indian wildlife taxonomy, habitat fragmentation, or systemic environmental policy solutions.',
      timestamp: new Date().toISOString(),
      mode: 'explore',
      suggestedFollowUps: [
        'How do railway underpasses protect Asian Elephants in West Bengal?',
        'What are the critical river basin threats for the Gharial?',
        'Explain root causes of crop residue burning in Punjab and Haryana.'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');
    const userMessage: AtlasMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      mode: activeMode
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
        activeMode,
        undefined,
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
        suggestedFollowUps: response.suggestedFollowUps
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: AtlasMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `Atlas intelligence query encountered an error: ${err.message || 'Please try again.'}`,
        timestamp: new Date().toISOString(),
        mode: activeMode
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Capsule Docked at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 bg-[#131513]/95 hover:bg-[#181B18] text-[#F1EFE8] border border-[#5A8A6C]/50 hover:border-[#B5A16A] rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:scale-[1.03] cursor-pointer"
            title="Open Atlas AI Research Assistant"
            aria-label="Open Atlas AI Research Assistant"
          >
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5A8A6C] animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#5A8A6C] relative" />
            </div>
            <Sparkles className="w-4 h-4 text-[#B5A16A]" />
            <span className="text-xs font-semibold tracking-wide">
              ✦ Ask Atlas AI
            </span>
            <span className="hidden sm:inline text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#0B0C0B] border border-[#30322E] text-[#A5A59C]">
              ONLINE
            </span>
          </button>
        )}
      </div>

      {/* Slide-out Interactive Research Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] max-h-[85vh] bg-[#0B0C0B]/98 border border-[#30322E] rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header Bar */}
          <div className="px-4 py-3 bg-[#131513] border-b border-[#30322E] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#5A8A6C] animate-pulse" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-sm text-[#F1EFE8]">Atlas AI</span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#0B0C0B] border border-[#30322E] text-[#B5A16A]">
                    Intelligence Engine
                  </span>
                </div>
                <div className="text-[10px] text-[#A5A59C] font-mono">
                  Grounded in VANA Scientific Archives
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigateTo('atlas');
                }}
                className="p-1.5 text-[#A5A59C] hover:text-[#F1EFE8] hover:bg-[#181B18] rounded transition"
                title="Expand to Fullscreen Atlas Page"
                aria-label="Expand to Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#A5A59C] hover:text-[#F1EFE8] hover:bg-[#181B18] rounded transition"
                title="Close"
                aria-label="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Research Mode Chips */}
          <div className="px-3 py-2 bg-[#0B0C0B] border-b border-[#30322E] flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
            {[
              { id: 'explore', label: 'General Explore' },
              { id: 'species', label: 'Taxonomy & Biology' },
              { id: 'policy', label: 'Policy Blueprint' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id as AtlasMode)}
                className={`px-2.5 py-1 rounded transition whitespace-nowrap ${
                  activeMode === m.id
                    ? 'bg-[#B5A16A]/15 text-[#B5A16A] border border-[#B5A16A]/40'
                    : 'text-[#A5A59C] hover:text-[#F1EFE8] border border-transparent hover:border-[#30322E]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-lg p-3 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#181B18] border border-[#30322E] text-[#F1EFE8]'
                      : 'bg-[#131513] border border-[#30322E]/80 text-[#F1EFE8]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {/* Grounded Citation links if present */}
                  {m.websiteCitations && m.websiteCitations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-[#30322E] space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[#B5A16A] block">
                        CITED PLATFORM DOSSIERS:
                      </span>
                      {m.websiteCitations.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setIsOpen(false);
                            if (c.urlHash) {
                              window.location.hash = c.urlHash;
                            }
                          }}
                          className="flex items-center gap-1 text-[11px] text-[#A5A59C] hover:text-[#B5A16A] transition underline underline-offset-2 text-left"
                        >
                          <FileText className="w-3 h-3 shrink-0" />
                          <span className="truncate">{c.title}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggested follow-up prompt chips */}
                  {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#30322E] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-[#A5A59C] block">
                        EXPLORE FURTHER:
                      </span>
                      <div className="flex flex-col gap-1">
                        {m.suggestedFollowUps.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(prompt)}
                            className="text-left px-2 py-1 rounded bg-[#0B0C0B] hover:bg-[#181B18] border border-[#30322E] hover:border-[#B5A16A] text-[11px] text-[#A5A59C] hover:text-[#F1EFE8] transition truncate"
                          >
                            ↳ {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-[#131513] border border-[#30322E] rounded-lg max-w-[80%]">
                <span className="w-2 h-2 rounded-full bg-[#B5A16A] animate-ping" />
                <span className="text-xs text-[#A5A59C] font-mono animate-pulse">
                  Querying Atlas Intelligence...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#131513] border-t border-[#30322E] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Atlas about wildlife, corridors, solutions..."
              className="flex-1 bg-[#0B0C0B] border border-[#30322E] focus:border-[#B5A16A] rounded-md px-3 py-2 text-xs text-[#F1EFE8] placeholder-[#A5A59C]/60 outline-none transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-3 py-2 bg-[#B5A16A] hover:bg-[#9E8B56] disabled:opacity-40 text-[#0B0C0B] font-semibold rounded-md text-xs transition cursor-pointer shrink-0"
              aria-label="Send query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
