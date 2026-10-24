import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Send,
  Share2,
  Check
} from 'lucide-react';

export const DiscussionThreadPage: React.FC = () => {
  const {
    selectedSlug,
    communityPosts,
    navigateTo,
    addCommunityReply,
    toggleLikePost,
    toggleLikeReply
  } = useApp();

  const [replyInput, setReplyInput] = useState('');
  const [copied, setCopied] = useState(false);

  const currentPost = communityPosts.find((p) => p.slug === selectedSlug) || communityPosts[0];

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    addCommunityReply(currentPost.id, replyInput.trim());
    setReplyInput('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#F1EFE8]">
      {/* Top Navigation */}
      <div className="flex justify-between items-center text-xs border-b border-[#30322E] pb-4">
        <button
          onClick={() => navigateTo('community')}
          className="flex items-center gap-1.5 text-[#A5A59C] hover:text-[#B5A16A] transition font-mono uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Discussions Directory</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] rounded text-xs text-[#A5A59C] hover:text-[#F1EFE8] transition font-mono"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Share Thread'}</span>
        </button>
      </div>

      {/* Main Post Dossier */}
      <article className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-[#B5A16A] font-semibold">{currentPost.category}</span>
          {currentPost.isPinned && (
            <>
              <span aria-hidden="true" className="text-[#30322E]">·</span>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.2 rounded bg-[#B5A16A]/10 text-[#B5A16A] border border-[#B5A16A]/40">
                Pinned Topic
              </span>
            </>
          )}
          {currentPost.linkedArticleTitle && (
            <>
              <span aria-hidden="true" className="text-[#30322E]">·</span>
              <span className="text-xs text-[#A5A59C] font-mono">
                Linked: <strong className="text-[#F1EFE8] font-normal">{currentPost.linkedArticleTitle}</strong>
              </span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F1EFE8] leading-tight">
          {currentPost.title}
        </h1>

        {/* Author Bio Card */}
        <div className="flex items-center gap-3 p-3.5 bg-[#181B18] border border-[#30322E] rounded text-xs">
          <div className={`w-9 h-9 rounded ${currentPost.author.avatarBg} text-white flex items-center justify-center font-bold text-sm shrink-0 font-mono`}>
            {currentPost.author.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-[#F1EFE8] text-sm">{currentPost.author.name}</div>
            <div className="text-[#A5A59C]">{currentPost.author.role}</div>
            {currentPost.author.bio && (
              <div className="text-[11px] text-[#A5A59C]/80 mt-0.5">{currentPost.author.bio}</div>
            )}
          </div>
          <div className="ml-auto text-[11px] text-[#A5A59C] font-mono">
            {new Date(currentPost.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        {/* Post Full Content */}
        <div className="text-sm sm:text-base text-[#F1EFE8]/90 leading-relaxed space-y-4">
          <p className="whitespace-pre-line">{currentPost.content}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {currentPost.tags.map((tag, i) => (
            <span key={i} className="px-2.5 py-0.5 bg-[#181B18] border border-[#30322E] rounded text-xs text-[#A5A59C] font-mono">
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-[#30322E] flex justify-between items-center text-xs">
          <button
            onClick={() => toggleLikePost(currentPost.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded border font-mono transition ${
              currentPost.likedByUser
                ? 'bg-[#B5A16A] text-[#0B0C0B] border-[#B5A16A] font-semibold'
                : 'bg-[#181B18] border-[#30322E] text-[#A5A59C] hover:text-[#F1EFE8]'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{currentPost.likesCount} Upvotes</span>
          </button>

          <span className="text-[#A5A59C] font-mono">
            {currentPost.replies.length} responses recorded
          </span>
        </div>
      </article>

      {/* Replies Thread */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#F1EFE8] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#B5A16A]" />
          <span>Responses &amp; Peer Critiques ({currentPost.replies.length})</span>
        </h3>

        {currentPost.replies.length === 0 ? (
          <div className="bg-[#131513] border border-[#30322E] rounded-lg p-8 text-center text-xs text-[#A5A59C]">
            No replies yet. Contribute your technical or field observations below.
          </div>
        ) : (
          <div className="space-y-3">
            {currentPost.replies.map((reply) => (
              <div
                key={reply.id}
                className="bg-[#131513] border border-[#30322E] rounded-lg p-5 space-y-3"
              >
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded ${reply.author.avatarBg} text-white flex items-center justify-center font-bold text-xs font-mono`}>
                      {reply.author.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-[#F1EFE8]">{reply.author.name}</span>
                      <span className="text-[11px] text-[#A5A59C] ml-2 font-mono">({reply.author.role})</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#A5A59C] font-mono">
                    {new Date(reply.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#A5A59C] leading-relaxed whitespace-pre-line pl-9">
                  {reply.content}
                </p>

                <div className="pl-9 pt-2 flex items-center gap-2">
                  <button
                    onClick={() => toggleLikeReply(currentPost.id, reply.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono transition border ${
                      reply.likedByUser
                        ? 'bg-[#B5A16A] text-[#0B0C0B] border-[#B5A16A]'
                        : 'bg-[#181B18] border-[#30322E] text-[#A5A59C] hover:text-[#F1EFE8]'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{reply.likesCount}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply Submission Box */}
        <form onSubmit={handleReplySubmit} className="bg-[#131513] border border-[#30322E] rounded-lg p-6 space-y-3">
          <label className="block text-xs font-mono uppercase text-[#A5A59C]">
            Contribute to this discussion:
          </label>
          <textarea
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            rows={4}
            placeholder="Write your constructive response, question, or field data..."
            className="w-full p-3 bg-[#181B18] border border-[#30322E] rounded text-xs text-[#F1EFE8] placeholder-[#A5A59C]/60 focus:outline-none focus:border-[#B5A16A]"
            required
          />
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#A5A59C] text-[11px]">
              Maintain empirical rigor and cite references where relevant.
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] font-semibold uppercase text-xs tracking-wider rounded transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Response</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
