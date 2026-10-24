import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserFieldNote, UserRole, ResearchBadge } from '../types';
import {
  User,
  ShieldCheck,
  Award,
  BookOpen,
  Bookmark,
  Calendar,
  Flame,
  Clock,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Globe,
  UploadCloud,
  FileText,
  Tag,
  Share2
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    addFieldNote,
    deleteFieldNote,
    updateFieldNote,
    setIsAuthModalOpen,
    species,
    problems,
    bookmarks,
    navigateTo
  } = useApp();

  // Active view tab inside account
  const [activeTab, setActiveTab] = useState<'progress' | 'notes' | 'bookmarks' | 'deployment' | 'settings'>('progress');

  // Edit Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileBio, setProfileBio] = useState(currentUser.bio);
  const [profileInstitution, setProfileInstitution] = useState(currentUser.institution);
  const [profileRole, setProfileRole] = useState<UserRole>(currentUser.role);

  // New Note Modal / Form State
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<UserFieldNote['category']>('Taxonomy Observation');
  const [noteTags, setNoteTags] = useState('Western Ghats, Habitat');

  // Copy Public Link Feedback
  const [copiedLink, setCopiedLink] = useState(false);

  const publicAppUrl = 'https://ais-pre-prw3atfqewt37coincgkae-186359104999.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName.trim(),
      bio: profileBio.trim(),
      institution: profileInstitution.trim(),
      role: profileRole
    });
    setIsEditingProfile(false);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const tagsArray = noteTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addFieldNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory,
      tags: tagsArray
    });

    setNoteTitle('');
    setNoteContent('');
    setNoteTags('Western Ghats, Habitat');
    setIsAddingNote(false);
  };

  // Calculate Badges
  const readCount = currentUser.readArticles.length;
  const notesCount = currentUser.fieldNotes.length;
  const badges: ResearchBadge[] = [
    {
      id: 'b-1',
      title: 'Taxonomy Scholar',
      category: 'Reading',
      description: 'Completed reading multiple peer-reviewed botanical or zoological monographs.',
      unlocked: readCount >= 2,
      iconName: 'BookOpen',
      progressPercent: Math.min(100, (readCount / 2) * 100)
    },
    {
      id: 'b-2',
      title: 'Western Biome Observer',
      category: 'Reading',
      description: 'Studied endangered subcontinental ecosystems and conservation priority zones.',
      unlocked: readCount >= 4,
      iconName: 'Globe',
      progressPercent: Math.min(100, (readCount / 4) * 100)
    },
    {
      id: 'b-3',
      title: 'Field Journal Chronicler',
      category: 'Field Notes',
      description: 'Authored personal research hypotheses or empirical field notes in your journal.',
      unlocked: notesCount >= 2,
      iconName: 'FileText',
      progressPercent: Math.min(100, (notesCount / 2) * 100)
    },
    {
      id: 'b-4',
      title: 'Editorial Peer Reviewer',
      category: 'Community',
      description: 'Active contributor to natural history discussions and research dossiers.',
      unlocked: currentUser.isOwner || notesCount >= 3,
      iconName: 'Award',
      progressPercent: currentUser.isOwner ? 100 : Math.min(100, (notesCount / 3) * 100)
    }
  ];

  // Bookmarked items list
  const bookmarkedSpecies = species.filter((s) => bookmarks.includes(s.id));
  const bookmarkedProblems = problems.filter((p) => bookmarks.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Profile Hero Card */}
      <div className="bg-[#131513] border border-[#30322E] rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-2xl">
        {/* Subtle decorative background watermarks */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#B5A16A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#5A8A6C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div
              className={`w-20 h-20 rounded-2xl ${currentUser.avatarBg} text-[#0B0C0B] text-2xl font-serif font-black flex items-center justify-center shrink-0 border-2 border-[#B5A16A]/50 shadow-lg`}
            >
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F1EFE8]">
                  {currentUser.name}
                </h1>
                {currentUser.isOwner && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B5A16A] text-[#0B0C0B] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Site Owner
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-[#1A1D1A] border border-[#30322E] text-[#B5A16A] text-xs font-mono">
                  {currentUser.role}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#A5A59C] mb-2 font-mono flex items-center gap-2">
                <span>{currentUser.email}</span>
                <span>•</span>
                <span>{currentUser.institution}</span>
              </p>

              <p className="text-xs sm:text-sm text-[#C8C8BE] max-w-2xl leading-relaxed">
                {currentUser.bio}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex-1 md:flex-initial px-4 py-2 bg-[#1A1D1A] hover:bg-[#222622] text-[#F1EFE8] border border-[#30322E] rounded-lg text-xs font-mono transition flex items-center justify-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#B5A16A]" /> Edit Profile
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex-1 md:flex-initial px-4 py-2 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] font-serif font-bold text-xs tracking-wide rounded-lg transition flex items-center justify-center gap-2 shadow"
            >
              <User className="w-3.5 h-3.5" /> Switch Account
            </button>
            {currentUser.isOwner && (
              <button
                onClick={() => navigateTo('admin')}
                className="w-full md:w-auto px-4 py-2 bg-[#5A8A6C] hover:bg-[#487358] text-[#F1EFE8] font-mono text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                + Editorial Publishing Suite
              </button>
            )}
          </div>
        </div>

        {/* Inline Profile Editing Drawer */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 pt-6 border-t border-[#30322E] grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn"
          >
            <div>
              <label className="block text-xs font-mono text-[#A5A59C] mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-[#181B18] border border-[#30322E] rounded-lg px-3 py-2 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A5A59C] mb-1">
                Affiliated Academic Institution
              </label>
              <input
                type="text"
                value={profileInstitution}
                onChange={(e) => setProfileInstitution(e.target.value)}
                className="w-full bg-[#181B18] border border-[#30322E] rounded-lg px-3 py-2 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-[#A5A59C] mb-1">
                Research Bio / Methodology Focus
              </label>
              <textarea
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                rows={2}
                className="w-full bg-[#181B18] border border-[#30322E] rounded-lg px-3 py-2 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-1.5 text-xs font-mono text-[#A5A59C] hover:text-[#F1EFE8]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] text-xs font-bold font-mono rounded-lg transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex border-b border-[#30322E] mb-8 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('progress')}
          className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider transition whitespace-nowrap border-b-2 flex items-center gap-2 ${
            activeTab === 'progress'
              ? 'border-[#B5A16A] text-[#B5A16A] font-bold'
              : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
          }`}
        >
          <Award className="w-4 h-4" /> Research Progress & Badges
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider transition whitespace-nowrap border-b-2 flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'border-[#B5A16A] text-[#B5A16A] font-bold'
              : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
          }`}
        >
          <FileText className="w-4 h-4" /> Field Notes & Journal ({currentUser.fieldNotes.length})
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider transition whitespace-nowrap border-b-2 flex items-center gap-2 ${
            activeTab === 'bookmarks'
              ? 'border-[#B5A16A] text-[#B5A16A] font-bold'
              : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
          }`}
        >
          <Bookmark className="w-4 h-4" /> Saved Dossiers ({bookmarks.length})
        </button>

        <button
          onClick={() => setActiveTab('deployment')}
          className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider transition whitespace-nowrap border-b-2 flex items-center gap-2 ${
            activeTab === 'deployment'
              ? 'border-[#B5A16A] text-[#B5A16A] font-bold'
              : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
          }`}
        >
          <UploadCloud className="w-4 h-4" /> Live Deployment & Public Link
        </button>
      </div>

      {/* Tab 1: Research Progress */}
      {activeTab === 'progress' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#131513] border border-[#30322E] rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-[#A5A59C]">
                  Monographs Read
                </span>
                <BookOpen className="w-4 h-4 text-[#B5A16A]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#F1EFE8]">
                {currentUser.readArticles.length}
              </div>
              <p className="text-xs text-[#5A8A6C] font-mono mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active verification
              </p>
            </div>

            <div className="bg-[#131513] border border-[#30322E] rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-[#A5A59C]">
                  Reading Streak
                </span>
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#F1EFE8]">
                {currentUser.readingStreakDays} Days
              </div>
              <p className="text-xs text-[#A5A59C] font-mono mt-1">
                Consecutive academic review
              </p>
            </div>

            <div className="bg-[#131513] border border-[#30322E] rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-[#A5A59C]">
                  Field Notes Filed
                </span>
                <FileText className="w-4 h-4 text-[#5A8A6C]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#F1EFE8]">
                {currentUser.fieldNotes.length}
              </div>
              <p className="text-xs text-[#A5A59C] font-mono mt-1">
                Empirical habitat logs
              </p>
            </div>

            <div className="bg-[#131513] border border-[#30322E] rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-[#A5A59C]">
                  Account Security
                </span>
                <ShieldCheck className="w-4 h-4 text-[#B5A16A]" />
              </div>
              <div className="text-lg font-serif font-bold text-[#F1EFE8] truncate">
                {currentUser.isOwner ? 'Full Editorial' : 'Peer Naturalist'}
              </div>
              <p className="text-xs text-[#B5A16A] font-mono mt-1">
                {currentUser.isOwner ? 'Publisher Authorized' : 'Verified Reviewer'}
              </p>
            </div>
          </div>

          {/* Badges & Research Honors */}
          <div className="bg-[#131513] border border-[#30322E] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#F1EFE8]">
                  Research Badges & Honors
                </h3>
                <p className="text-xs text-[#A5A59C]">
                  Milestones attained through continuous reading, taxonomic study, and field contributions
                </p>
              </div>
              <span className="text-xs font-mono text-[#B5A16A] px-3 py-1 bg-[#1A1D1A] rounded-full border border-[#30322E]">
                {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-5 rounded-xl border transition flex items-start gap-4 ${
                    badge.unlocked
                      ? 'bg-[#181C18] border-[#5A8A6C]/50 text-[#F1EFE8]'
                      : 'bg-[#141614] border-[#2A2D2A] text-[#A5A59C] opacity-70'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      badge.unlocked
                        ? 'bg-[#5A8A6C]/20 border-[#5A8A6C] text-[#5A8A6C]'
                        : 'bg-[#1C201C] border-[#30322E] text-[#A5A59C]'
                    }`}
                  >
                    <Award className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-serif font-bold text-sm text-[#F1EFE8]">
                        {badge.title}
                      </h4>
                      {badge.unlocked ? (
                        <span className="text-[10px] font-mono text-[#5A8A6C] bg-[#5A8A6C]/10 px-2 py-0.5 rounded border border-[#5A8A6C]/30 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Attained
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#A5A59C]">
                          {badge.progressPercent}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A5A59C] mt-1 leading-relaxed">
                      {badge.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#202420] h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          badge.unlocked ? 'bg-[#5A8A6C]' : 'bg-[#B5A16A]/50'
                        }`}
                        style={{ width: `${badge.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Field Notes & Journal */}
      {activeTab === 'notes' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#131513] border border-[#30322E] rounded-xl p-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#F1EFE8]">
                Personal Field Journal & Notes
              </h3>
              <p className="text-xs text-[#A5A59C]">
                Record empirical observations, ecological hypotheses, or reference footnotes
              </p>
            </div>
            <button
              onClick={() => setIsAddingNote(!isAddingNote)}
              className="px-4 py-2 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] font-mono font-bold text-xs rounded-lg transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Field Note
            </button>
          </div>

          {/* New Note Form */}
          {isAddingNote && (
            <form
              onSubmit={handleCreateNote}
              className="bg-[#151815] border border-[#B5A16A]/40 rounded-xl p-6 space-y-4 animate-fadeIn"
            >
              <h4 className="text-sm font-serif font-bold text-[#F1EFE8] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#B5A16A]" /> Draft New Field Note
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#A5A59C] mb-1">
                    Note Title
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Nagarhole Forest Canopy Water Retention"
                    className="w-full bg-[#181B18] border border-[#30322E] rounded-lg px-3 py-2 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#A5A59C] mb-1">
                    Category
                  </label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value as any)}
                    className="w-full bg-[#181B18] border border-[#30322E] rounded-lg px-3 py-2 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none"
                  >
                    <option value="Taxonomy Observation">Taxonomy Observation</option>
                    <option value="Conservation Field Note">Conservation Field Note</option>
                    <option value="Policy Critique">Policy Critique</option>
                    <option value="Methodology Hypothesis">Methodology Hypothesis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A5A59C] mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  placeholder="Western Ghats, Canopy, Hydrology"
                  className="w-full bg-[#181B18] border border-[#30322E] rounded-lg px-3 py-2 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A5A59C] mb-1">
                  Empirical Content / Field Notes
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={4}
                  placeholder="Record your field observations, sensor coordinates, or literature notes here..."
                  className="w-full bg-[#181B18] border border-[#30322E] rounded-lg px-3 py-2 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 text-xs font-mono text-[#A5A59C] hover:text-[#F1EFE8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] text-xs font-bold font-mono rounded-lg transition"
                >
                  Save to Journal
                </button>
              </div>
            </form>
          )}

          {/* Notes List */}
          {currentUser.fieldNotes.length === 0 ? (
            <div className="p-12 text-center bg-[#131513] border border-[#30322E] rounded-xl">
              <FileText className="w-10 h-10 text-[#A5A59C] mx-auto mb-3 opacity-50" />
              <h4 className="text-sm font-serif font-bold text-[#F1EFE8]">
                No field notes recorded yet
              </h4>
              <p className="text-xs text-[#A5A59C] mt-1 max-w-md mx-auto">
                Begin documenting your wildlife tracking, habitat observations, or taxonomic queries.
              </p>
              <button
                onClick={() => setIsAddingNote(true)}
                className="mt-4 px-4 py-2 bg-[#B5A16A] text-[#0B0C0B] text-xs font-mono font-bold rounded-lg hover:bg-[#9E8B56] transition"
              >
                Create First Entry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.fieldNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-[#131513] border border-[#30322E] rounded-xl p-5 hover:border-[#5A8A6C] transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1C201C] text-[#B5A16A] border border-[#30322E]">
                        {note.category}
                      </span>
                      <button
                        onClick={() => deleteFieldNote(note.id)}
                        className="text-[#A5A59C] hover:text-red-400 transition p-1"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#F1EFE8] mb-2">
                      {note.title}
                    </h4>

                    <p className="text-xs text-[#C8C8BE] leading-relaxed line-clamp-4 mb-4">
                      {note.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#252825] flex items-center justify-between text-[11px] text-[#A5A59C] font-mono">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((t, i) => (
                        <span key={i} className="text-[#5A8A6C]">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <span>
                      {new Date(note.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[#131513] border border-[#30322E] rounded-xl p-6">
            <h3 className="text-lg font-serif font-bold text-[#F1EFE8]">
              Saved Research Dossiers
            </h3>
            <p className="text-xs text-[#A5A59C]">
              Quick access to bookmarked taxonomic monographs and policy investigation frameworks
            </p>
          </div>

          {bookmarkedSpecies.length === 0 && bookmarkedProblems.length === 0 ? (
            <div className="p-12 text-center bg-[#131513] border border-[#30322E] rounded-xl">
              <Bookmark className="w-10 h-10 text-[#A5A59C] mx-auto mb-3 opacity-50" />
              <h4 className="text-sm font-serif font-bold text-[#F1EFE8]">
                No bookmarks in archive
              </h4>
              <p className="text-xs text-[#A5A59C] mt-1">
                Click the bookmark icon on any wildlife profile or investigation to save it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarkedSpecies.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigateTo('species-detail', s.slug)}
                  className="bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] p-5 rounded-xl cursor-pointer transition flex gap-4"
                >
                  <img
                    src={s.primaryImageUrl}
                    alt={s.commonName}
                    className="w-16 h-16 rounded-lg object-cover border border-[#30322E]"
                  />
                  <div>
                    <span className="text-[10px] font-mono text-[#5A8A6C] uppercase">
                      Wildlife Monograph
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#F1EFE8]">
                      {s.commonName}
                    </h4>
                    <p className="text-xs italic text-[#A5A59C]">{s.scientificName}</p>
                  </div>
                </div>
              ))}

              {bookmarkedProblems.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigateTo('problem-detail', p.slug)}
                  className="bg-[#131513] border border-[#30322E] hover:border-[#B5A16A] p-5 rounded-xl cursor-pointer transition flex gap-4"
                >
                  <img
                    src={p.coverImageUrl}
                    alt={p.title}
                    className="w-16 h-16 rounded-lg object-cover border border-[#30322E]"
                  />
                  <div>
                    <span className="text-[10px] font-mono text-[#B5A16A] uppercase">
                      Problem Investigation
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#F1EFE8] line-clamp-1">
                      {p.title}
                    </h4>
                    <p className="text-xs text-[#A5A59C] line-clamp-1">{p.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Live Deployment & Public Link */}
      {activeTab === 'deployment' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Active Cloud Run Public Link Card */}
          <div className="bg-[#151A15] border-2 border-[#5A8A6C]/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-3 h-3 rounded-full bg-[#5A8A6C] animate-ping" />
              <span className="text-xs font-mono uppercase text-[#5A8A6C] font-bold tracking-widest">
                Active Public URL
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F1EFE8] mb-2">
              Your Journal is Live & Accessible Worldwide
            </h3>

            <p className="text-xs sm:text-sm text-[#C8C8BE] mb-6 max-w-2xl leading-relaxed">
              Anyone with this link can access the 3D rotating Earth, Indian telemetry indices, research monographs, and the interactive Atlas AI companion.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#0B0C0B] border border-[#30322E] p-3 rounded-xl">
              <div className="flex items-center gap-2 flex-1 min-w-0 px-2 font-mono text-xs sm:text-sm text-[#B5A16A] truncate">
                <Globe className="w-4 h-4 text-[#5A8A6C] shrink-0" />
                <span className="truncate">{publicAppUrl}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] font-mono text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <a
                  href={publicAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1A1D1A] hover:bg-[#252825] text-[#F1EFE8] border border-[#30322E] font-mono text-xs rounded-lg transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </a>
              </div>
            </div>
          </div>

          {/* Deployment Guide */}
          <div className="bg-[#131513] border border-[#30322E] rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-serif font-bold text-[#F1EFE8] flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#B5A16A]" /> Production Deployment Instructions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#181B18] border border-[#2A2E2A] p-5 rounded-xl">
                <span className="text-xs font-mono text-[#B5A16A] font-bold block mb-1">
                  Option 1
                </span>
                <h4 className="font-serif font-bold text-sm text-[#F1EFE8] mb-2">
                  Google Cloud Run
                </h4>
                <p className="text-xs text-[#A5A59C] leading-relaxed mb-3">
                  This app is container-ready. Simply run:
                </p>
                <pre className="bg-[#0B0C0B] p-2.5 rounded text-[11px] font-mono text-[#5A8A6C] overflow-x-auto">
                  gcloud run deploy vana-journal
                </pre>
              </div>

              <div className="bg-[#181B18] border border-[#2A2E2A] p-5 rounded-xl">
                <span className="text-xs font-mono text-[#B5A16A] font-bold block mb-1">
                  Option 2
                </span>
                <h4 className="font-serif font-bold text-sm text-[#F1EFE8] mb-2">
                  Vercel or Netlify
                </h4>
                <p className="text-xs text-[#A5A59C] leading-relaxed mb-3">
                  Connect your GitHub repo. Build command:
                </p>
                <pre className="bg-[#0B0C0B] p-2.5 rounded text-[11px] font-mono text-[#5A8A6C] overflow-x-auto">
                  npm run build
                </pre>
              </div>

              <div className="bg-[#181B18] border border-[#2A2E2A] p-5 rounded-xl">
                <span className="text-xs font-mono text-[#B5A16A] font-bold block mb-1">
                  Option 3
                </span>
                <h4 className="font-serif font-bold text-sm text-[#F1EFE8] mb-2">
                  Custom VPS / Node.js
                </h4>
                <p className="text-xs text-[#A5A59C] leading-relaxed mb-3">
                  Build and start the integrated full-stack server:
                </p>
                <pre className="bg-[#0B0C0B] p-2.5 rounded text-[11px] font-mono text-[#5A8A6C] overflow-x-auto">
                  npm run build && npm start
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
