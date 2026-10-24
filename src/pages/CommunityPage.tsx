import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { searchCommunityPosts } from '../utils/searchAndFilter';
import {
  Users,
  MessageSquare,
  Search,
  PlusCircle,
  ThumbsUp,
  Flag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CommunityCategory } from '../types';

export const CommunityPage: React.FC = () => {
  const {
    communityPosts,
    navigateTo,
    addCommunityPost,
    toggleLikePost,
    reportPost,
    species,
    problems
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'replies'>('recent');

  // New Post Modal State
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState<CommunityCategory>('Wildlife Biology');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('');
  const [linkedArticleId, setLinkedArticleId] = useState('');

  // Report Modal State
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [reportingPostTitle, setReportingPostTitle] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const filteredPosts = searchCommunityPosts(
    communityPosts,
    query,
    selectedCategory,
    sortBy
  );

  const categories: { label: string; value: string }[] = [
    { label: 'All Discussion Streams', value: 'all' },
    { label: 'Wildlife Biology', value: 'Wildlife Biology' },
    { label: 'Indian Problems', value: 'Indian Problems' },
    { label: 'Solution Critique', value: 'Solution Critique' },
    { label: 'Field Observations', value: 'Field Observations' },
    { label: 'Scientific Methodology', value: 'Scientific Methodology' },
    { label: 'General Discussion', value: 'General Discussion' }
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const tagsArray = postTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    let linkedTitle = '';
    let linkedType: 'species' | 'problem' | undefined = undefined;

    if (linkedArticleId) {
      const sp = species.find((s) => s.id === linkedArticleId);
      if (sp) {
        linkedTitle = sp.commonName;
        linkedType = 'species';
      } else {
        const prob = problems.find((p) => p.id === linkedArticleId);
        if (prob) {
          linkedTitle = prob.title;
          linkedType = 'problem';
        }
      }
    }

    const created = addCommunityPost(
      postTitle.trim(),
      postCategory,
      postContent.trim(),
      tagsArray.length > 0 ? tagsArray : ['General'],
      linkedArticleId || undefined,
      linkedTitle || undefined,
      linkedType
    );

    setIsNewPostModalOpen(false);
    setPostTitle('');
    setPostContent('');
    setPostTags('');
    setLinkedArticleId('');
    navigateTo('community-thread', created.slug);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPostId || !reportReason.trim()) return;

    reportPost(reportingPostId, reportingPostTitle, reportReason.trim());
    setReportSuccess(true);
    setTimeout(() => {
      setReportingPostId(null);
      setReportReason('');
      setReportSuccess(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#F1EFE8]">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#30322E] pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B5A16A]">
            <Users className="w-4 h-4" />
            <span>Pillar III · Peer Review &amp; Discourse</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#F1EFE8]">
            Research Community
          </h1>
          <p className="text-base text-[#A5A59C] max-w-2xl leading-relaxed">
            Where naturalists, engineering students, and public health researchers audit assumptions, debate field evidence, and publish observations without commercial spam or simulated AI filler.
          </p>
        </div>

        <button
          onClick={() => setIsNewPostModalOpen(true)}
          className="px-5 py-3 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] rounded text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Start a Discourse</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131513] border border-[#30322E] rounded-lg p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A5A59C] absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search discussions by topic, technical question, author, or tags..."
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

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A5A59C] mb-1">
              Discussion Stream
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#181B18] border border-[#30322E] rounded px-3 py-2 text-[#F1EFE8] focus:outline-none focus:border-[#B5A16A]"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#131513] text-[#F1EFE8]">{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#A5A59C] mb-1">
              Sort Sequence
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full bg-[#181B18] border border-[#30322E] rounded px-3 py-2 text-[#F1EFE8] focus:outline-none focus:border-[#B5A16A]"
            >
              <option value="recent" className="bg-[#131513] text-[#F1EFE8]">Most Recent Activity</option>
              <option value="popular" className="bg-[#131513] text-[#F1EFE8]">Most Upvoted Topics</option>
              <option value="replies" className="bg-[#131513] text-[#F1EFE8]">Most Active (Response Count)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-[#131513] border border-dashed border-[#30322E] rounded-lg p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-[#B5A16A] mx-auto opacity-70" />
            <h3 className="font-serif text-xl font-bold text-[#F1EFE8]">Research Forum is Pristine &amp; Open</h3>
            <p className="text-xs text-[#A5A59C] max-w-md mx-auto leading-relaxed">
              All simulated chats have been removed. Logged in as Owner (Divyankar Yadav • divyankyadav232@gmail.com). Start the first research discussion or publish a field finding below.
            </p>
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="px-5 py-2.5 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] text-xs font-semibold rounded uppercase tracking-wider transition cursor-pointer"
            >
              Start First Discourse
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] rounded-lg p-6 transition space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#B5A16A] font-medium">{post.category}</span>
                  {post.isPinned && (
                    <>
                      <span aria-hidden="true" className="text-[#30322E]">·</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#B5A16A]/10 text-[#B5A16A] border border-[#B5A16A]/40">
                        Pinned Dossier
                      </span>
                    </>
                  )}
                  {post.linkedArticleTitle && (
                    <>
                      <span aria-hidden="true" className="text-[#30322E]">·</span>
                      <span className="text-xs text-[#A5A59C] font-mono">
                        Linked: <strong className="text-[#F1EFE8] font-normal">{post.linkedArticleTitle}</strong>
                      </span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => {
                    setReportingPostId(post.id);
                    setReportingPostTitle(post.title);
                  }}
                  className="text-[#A5A59C] hover:text-rose-400 transition p-1"
                  title="Report inappropriate content"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Content preview */}
              <div>
                <h2
                  onClick={() => navigateTo('community-thread', post.slug)}
                  className="font-serif text-xl sm:text-2xl font-bold text-[#F1EFE8] hover:text-[#B5A16A] transition cursor-pointer leading-snug"
                >
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#A5A59C] line-clamp-2 mt-2 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Tags row */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-[#181B18] border border-[#30322E] rounded text-[10px] text-[#A5A59C] font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Post Footer with Author & Actions */}
              <div className="pt-3 border-t border-[#30322E] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded ${post.author.avatarBg} text-white flex items-center justify-center font-bold text-xs font-mono`}>
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-medium text-[#F1EFE8]">{post.author.name}</span>
                    <span className="text-[#A5A59C] text-[11px] block">{post.author.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleLikePost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition ${
                      post.likedByUser
                        ? 'bg-[#B5A16A] text-[#0B0C0B] border-[#B5A16A] font-semibold'
                        : 'bg-[#181B18] border-[#30322E] text-[#A5A59C] hover:text-[#F1EFE8]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('community-thread', post.slug)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181B18] hover:bg-[#202420] text-[#F1EFE8] border border-[#30322E] rounded text-xs font-mono transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#B5A16A]" />
                    <span>{post.replies.length} replies</span>
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* New Post Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131513] border border-[#30322E] rounded-lg p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-[#30322E] pb-4">
              <h3 className="font-serif text-2xl font-bold text-[#F1EFE8]">
                Initiate a Peer Discourse
              </h3>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="text-[#A5A59C] hover:text-[#F1EFE8] p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-[#A5A59C] mb-1">
                  Discourse Title (State technical premise or inquiry)
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Ground Rayleigh wave attenuation in Dooars monsoon clay"
                  className="w-full p-3 bg-[#181B18] border border-[#30322E] rounded text-sm text-[#F1EFE8] placeholder-[#A5A59C]/60 focus:outline-none focus:border-[#B5A16A]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-[#A5A59C] mb-1">Stream Category</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as CommunityCategory)}
                    className="w-full p-2.5 bg-[#181B18] border border-[#30322E] rounded text-xs text-[#F1EFE8] focus:outline-none focus:border-[#B5A16A]"
                  >
                    <option value="Wildlife Biology" className="bg-[#131513]">Wildlife Biology</option>
                    <option value="Indian Problems" className="bg-[#131513]">Indian Problems</option>
                    <option value="Solution Critique" className="bg-[#131513]">Solution Critique</option>
                    <option value="Field Observations" className="bg-[#131513]">Field Observations</option>
                    <option value="Scientific Methodology" className="bg-[#131513]">Scientific Methodology</option>
                    <option value="General Discussion" className="bg-[#131513]">General Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase text-[#A5A59C] mb-1">Optional Dossier Link</label>
                  <select
                    value={linkedArticleId}
                    onChange={(e) => setLinkedArticleId(e.target.value)}
                    className="w-full p-2.5 bg-[#181B18] border border-[#30322E] rounded text-xs text-[#F1EFE8] focus:outline-none focus:border-[#B5A16A]"
                  >
                    <option value="" className="bg-[#131513]">None (Independent Question)</option>
                    <optgroup label="Species Monographs">
                      {species.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#131513]">{s.commonName}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Problem Investigations">
                      {problems.map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#131513]">{p.title}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-[#A5A59C] mb-1">
                  Technical Argument or Inquiry
                </label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={5}
                  placeholder="Detail your scientific inquiry, observation methodology, or critique with relevant calculations or references..."
                  className="w-full p-3 bg-[#181B18] border border-[#30322E] rounded text-sm text-[#F1EFE8] placeholder-[#A5A59C]/60 focus:outline-none focus:border-[#B5A16A]"
                  required
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#A5A59C] mb-1">
                  Tags (comma-separated, e.g. Geophysics, Sensors, Bengal)
                </label>
                <input
                  type="text"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  placeholder="e.g. Infrasound, RailCorridors, Attenuation"
                  className="w-full p-2.5 bg-[#181B18] border border-[#30322E] rounded text-xs text-[#F1EFE8] placeholder-[#A5A59C]/60 focus:outline-none focus:border-[#B5A16A]"
                />
              </div>

              <div className="pt-4 border-t border-[#30322E] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 bg-[#181B18] border border-[#30322E] text-[#A5A59C] hover:text-[#F1EFE8] rounded text-xs font-mono uppercase transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] rounded text-xs font-semibold uppercase tracking-wider transition"
                >
                  Publish Discourse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Post Modal */}
      {reportingPostId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131513] border border-[#30322E] rounded-lg p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#F1EFE8]">
              Flag Content for Editorial Review
            </h3>
            <p className="text-xs text-[#A5A59C]">
              Reporting topic: <strong className="text-[#F1EFE8]">{reportingPostTitle}</strong>
            </p>

            {reportSuccess ? (
              <div className="p-3 bg-emerald-950/60 text-emerald-300 text-xs rounded border border-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Flag submitted. Our editorial moderators will audit this post.</span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#A5A59C] font-mono uppercase mb-1">
                    Reason for flag:
                  </label>
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    rows={3}
                    placeholder="e.g., Unverified medical claims, commercial advertising, or harassment..."
                    className="w-full p-2.5 bg-[#181B18] border border-[#30322E] rounded text-xs text-[#F1EFE8] placeholder-[#A5A59C]/60 focus:outline-none focus:border-[#B5A16A]"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingPostId(null)}
                    className="px-3 py-1.5 bg-[#181B18] border border-[#30322E] text-[#A5A59C] rounded text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded text-xs font-mono"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
