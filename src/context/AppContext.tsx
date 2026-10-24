import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  WildlifeSpecies,
  ProblemInvestigation,
  CommunityPost,
  CommunityReply,
  ModerationReport,
  NewsletterSubscriber,
  UserProfile,
  UserRole,
  UserFieldNote
} from '../types';
import { AtlasContext, AtlasMode } from '../types/atlas';
import {
  INITIAL_SPECIES,
  INITIAL_PROBLEMS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_MODERATION_REPORTS
} from '../data/initialData';
import { validateEmail } from '../utils/searchAndFilter';

export type NavTab = 
  | 'home' 
  | 'wildlife' 
  | 'species-detail' 
  | 'problems' 
  | 'problem-detail' 
  | 'community' 
  | 'community-thread' 
  | 'about' 
  | 'admin'
  | 'atlas'
  | 'account';

interface AppContextType {
  // Navigation & Routing
  currentTab: NavTab;
  selectedSlug: string | null;
  navigateTo: (tab: NavTab, slug?: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isBookmarksOpen: boolean;
  setIsBookmarksOpen: (open: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;

  // Authentication & User Profile
  currentUser: UserProfile;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, name?: string, role?: UserRole, institution?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  markArticleAsRead: (articleId: string) => void;
  isArticleRead: (articleId: string) => boolean;
  addFieldNote: (note: Omit<UserFieldNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteFieldNote: (noteId: string) => void;
  updateFieldNote: (noteId: string, updates: Partial<UserFieldNote>) => void;

  // Atlas AI Companion State
  atlasContext: AtlasContext | null;
  setAtlasContext: (ctx: AtlasContext | null) => void;
  atlasMode: AtlasMode;
  setAtlasMode: (mode: AtlasMode) => void;
  atlasInitialPrompt: string;
  setAtlasInitialPrompt: (prompt: string) => void;
  openAtlas: (mode?: AtlasMode, context?: AtlasContext, initialPrompt?: string) => void;

  // Data
  species: WildlifeSpecies[];
  problems: ProblemInvestigation[];
  communityPosts: CommunityPost[];
  moderationReports: ModerationReport[];
  newsletterSubscribers: NewsletterSubscriber[];
  bookmarks: string[];

  // Wildlife CRUD
  addSpecies: (speciesData: Omit<WildlifeSpecies, 'id' | 'publishedAt' | 'updatedAt'>) => WildlifeSpecies;
  updateSpecies: (id: string, updates: Partial<WildlifeSpecies>) => void;
  deleteSpecies: (id: string) => void;

  // Problem Investigations CRUD
  addProblem: (problemData: Omit<ProblemInvestigation, 'id' | 'publishedAt' | 'updatedAt'>) => ProblemInvestigation;
  updateProblem: (id: string, updates: Partial<ProblemInvestigation>) => void;
  deleteProblem: (id: string) => void;

  // Community
  addCommunityPost: (title: string, category: CommunityPost['category'], content: string, tags: string[], linkedArticleId?: string, linkedArticleTitle?: string, linkedArticleType?: 'species' | 'problem') => CommunityPost;
  addCommunityReply: (postId: string, content: string) => void;
  toggleLikePost: (postId: string) => void;
  toggleLikeReply: (postId: string, replyId: string) => void;
  reportPost: (postId: string, postTitle: string, reason: string) => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'remove') => void;

  // Newsletter & Bookmarks
  subscribeNewsletter: (email: string, topics: string[]) => { success: boolean; message: string };
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;

  // Reset
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SPECIES: 'vanya_pristine_owner_canvas_species_v10',
  PROBLEMS: 'vanya_pristine_owner_canvas_problems_v10',
  COMMUNITY: 'vanya_pristine_owner_canvas_community_v10',
  REPORTS: 'vanya_pristine_owner_canvas_reports_v10',
  SUBSCRIBERS: 'vanya_pristine_owner_canvas_subscribers_v10',
  BOOKMARKS: 'vanya_pristine_owner_canvas_bookmarks_v10',
  ADMIN_MODE: 'vanya_pristine_owner_canvas_admin_v10',
  USER_PROFILE: 'vanya_pristine_user_profile_v10',
};

export const DEFAULT_OWNER_PROFILE: UserProfile = {
  id: 'usr-divyankar',
  name: 'Divyankar Yadav',
  email: 'divyankyadav232@gmail.com',
  role: 'Owner & Editor-in-Chief',
  institution: 'VANA Editorial Board & Wildlife Research Fellowship',
  bio: 'Founder, Wildlife Naturalist & Editor-in-Chief. Overseeing rigorous subcontinental field taxonomy and systemic environmental investigations.',
  avatarBg: 'bg-[#B5A16A]',
  joinedDate: '2023-11-15',
  isOwner: true,
  readArticles: ['bengal-tiger', 'gangetic-dolphin', 'himalayan-snow-leopard', 'western-ghats-degradation'],
  fieldNotes: [
    {
      id: 'fn-101',
      title: 'Western Ghats Shola Canopy Moisture Audit',
      content: 'Measured cloud condensation interception in high-elevation montane evergreen patches. Understory moss moisture retained above 82%.',
      category: 'Conservation Field Note',
      createdAt: '2024-03-12T10:30:00Z',
      updatedAt: '2024-03-12T10:30:00Z',
      tags: ['Western Ghats', 'Shola Forests', 'Hydrology']
    },
    {
      id: 'fn-102',
      title: 'Sundarbans Estuarine Salinity Gradients',
      content: 'Sampled water salinity across Gosaba and Matla channels. Pneumatophore aerial lenticel density correlates with seasonal freshwater influx.',
      category: 'Taxonomy Observation',
      createdAt: '2024-04-02T14:15:00Z',
      updatedAt: '2024-04-02T14:15:00Z',
      tags: ['Sundarbans', 'Mangroves', 'Tidal Ecology']
    }
  ],
  readingStreakDays: 14,
  lastActiveDate: new Date().toISOString()
};

export const PRESET_RESEARCHERS: UserProfile[] = [
  DEFAULT_OWNER_PROFILE,
  {
    id: 'usr-sunita-rao',
    name: 'Dr. Sunita Rao',
    email: 'sunita.rao@wii.res.in',
    role: 'Senior Wildlife Biologist',
    institution: 'Wildlife Institute of India (WII), Dehradun',
    bio: 'Specialist in Western Himalayan carnivore telemetry and altitudinal migration shifts.',
    avatarBg: 'bg-[#5A8A6C]',
    joinedDate: '2024-01-10',
    isOwner: false,
    readArticles: ['himalayan-snow-leopard'],
    fieldNotes: [
      {
        id: 'fn-201',
        title: 'Spiti Valley Camera Trap Array Calibration',
        content: 'Deployed 16 passive infrared camera traps along ridgeline passes. Snow leopard scrape markings verified at 4,400m altitude.',
        category: 'Conservation Field Note',
        createdAt: '2024-02-18T09:00:00Z',
        updatedAt: '2024-02-18T09:00:00Z',
        tags: ['Spiti', 'Snow Leopard', 'Telemetry']
      }
    ],
    readingStreakDays: 7,
    lastActiveDate: new Date().toISOString()
  },
  {
    id: 'usr-aarav-sharma',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@iisc.ac.in',
    role: 'Student Researcher',
    institution: 'Centre for Ecological Sciences (CES), IISc Bengaluru',
    bio: 'Postgraduate scholar investigating freshwater ecology and benthic bio-indicators.',
    avatarBg: 'bg-[#4B6B94]',
    joinedDate: '2024-02-22',
    isOwner: false,
    readArticles: ['gangetic-dolphin'],
    fieldNotes: [],
    readingStreakDays: 3,
    lastActiveDate: new Date().toISOString()
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Routing state
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // User Profile & Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.warn('Could not read saved user profile', e);
    }
    return DEFAULT_OWNER_PROFILE;
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_MODE);
      if (stored !== null) return stored === 'true';
      return true; // Default to true: Owner (Divyankar Yadav) is logged in!
    } catch {
      return true;
    }
  });

  // Sync user profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Could not persist user profile', e);
    }
  }, [currentUser]);

  // Atlas AI Companion State
  const [atlasContext, setAtlasContext] = useState<AtlasContext | null>(null);
  const [atlasMode, setAtlasMode] = useState<AtlasMode>('explore');
  const [atlasInitialPrompt, setAtlasInitialPrompt] = useState<string>('');

  const openAtlas = (mode: AtlasMode = 'explore', context?: AtlasContext, initialPrompt?: string) => {
    setAtlasMode(mode);
    if (context) setAtlasContext(context);
    if (initialPrompt) setAtlasInitialPrompt(initialPrompt);
    navigateTo('atlas');
  };

  // Data states
  const [species, setSpecies] = useState<WildlifeSpecies[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPECIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved species', e);
    }
    return INITIAL_SPECIES;
  });

  const [problems, setProblems] = useState<ProblemInvestigation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved problems', e);
    }
    return INITIAL_PROBLEMS;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMUNITY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved community posts', e);
    }
    return INITIAL_COMMUNITY_POSTS;
  });

  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved reports', e);
    }
    return INITIAL_MODERATION_REPORTS;
  });

  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SPECIES, JSON.stringify(species));
    } catch (e) {
      console.error(e);
    }
  }, [species]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problems));
    } catch (e) {
      console.error(e);
    }
  }, [problems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(communityPosts));
    } catch (e) {
      console.error(e);
    }
  }, [communityPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(moderationReports));
    } catch (e) {
      console.error(e);
    }
  }, [moderationReports]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(newsletterSubscribers));
    } catch (e) {
      console.error(e);
    }
  }, [newsletterSubscribers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, String(isAdminMode));
    } catch {
      // ignore
    }
  }, [isAdminMode]);

  // URL hash sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setCurrentTab('home');
        setSelectedSlug(null);
        return;
      }

      if (hash === 'wildlife') {
        setCurrentTab('wildlife');
        setSelectedSlug(null);
      } else if (hash.startsWith('species/')) {
        setCurrentTab('species-detail');
        setSelectedSlug(hash.replace('species/', ''));
      } else if (hash === 'problems') {
        setCurrentTab('problems');
        setSelectedSlug(null);
      } else if (hash.startsWith('problem/')) {
        setCurrentTab('problem-detail');
        setSelectedSlug(hash.replace('problem/', ''));
      } else if (hash === 'community') {
        setCurrentTab('community');
        setSelectedSlug(null);
      } else if (hash.startsWith('discussion/')) {
        setCurrentTab('community-thread');
        setSelectedSlug(hash.replace('discussion/', ''));
      } else if (hash === 'about') {
        setCurrentTab('about');
        setSelectedSlug(null);
      } else if (hash === 'admin') {
        setCurrentTab('admin');
        setSelectedSlug(null);
      } else if (hash === 'atlas') {
        setCurrentTab('atlas');
        setSelectedSlug(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (tab: NavTab, slug?: string) => {
    setCurrentTab(tab);
    setSelectedSlug(slug || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'home') window.location.hash = '';
    else if (tab === 'wildlife') window.location.hash = 'wildlife';
    else if (tab === 'species-detail' && slug) window.location.hash = `species/${slug}`;
    else if (tab === 'problems') window.location.hash = 'problems';
    else if (tab === 'problem-detail' && slug) window.location.hash = `problem/${slug}`;
    else if (tab === 'community') window.location.hash = 'community';
    else if (tab === 'community-thread' && slug) window.location.hash = `discussion/${slug}`;
    else if (tab === 'about') window.location.hash = 'about';
    else if (tab === 'admin') window.location.hash = 'admin';
    else if (tab === 'atlas') window.location.hash = 'atlas';
  };

  // Wildlife CRUD
  const addSpecies = (data: Omit<WildlifeSpecies, 'id' | 'publishedAt' | 'updatedAt'>): WildlifeSpecies => {
    const newEntry: WildlifeSpecies = {
      ...data,
      id: `sp-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSpecies((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const updateSpecies = (id: string, updates: Partial<WildlifeSpecies>) => {
    setSpecies((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  const deleteSpecies = (id: string) => {
    setSpecies((prev) => prev.filter((item) => item.id !== id));
  };

  // Problem Investigations CRUD
  const addProblem = (data: Omit<ProblemInvestigation, 'id' | 'publishedAt' | 'updatedAt'>): ProblemInvestigation => {
    const newEntry: ProblemInvestigation = {
      ...data,
      id: `prob-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProblems((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const updateProblem = (id: string, updates: Partial<ProblemInvestigation>) => {
    setProblems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  const deleteProblem = (id: string) => {
    setProblems((prev) => prev.filter((item) => item.id !== id));
  };

  // Community
  const addCommunityPost = (
    title: string,
    category: CommunityPost['category'],
    content: string,
    tags: string[],
    linkedArticleId?: string,
    linkedArticleTitle?: string,
    linkedArticleType?: 'species' | 'problem'
  ): CommunityPost => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      category,
      author: {
        id: 'usr-owner-divyankar',
        name: 'Divyankar Yadav',
        handle: 'divyankyadav232',
        role: 'Owner & Editor-in-Chief',
        avatarBg: 'bg-[#1A3328]'
      },
      content,
      tags,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      likedByUser: false,
      replies: [],
      linkedArticleId,
      linkedArticleTitle,
      linkedArticleType
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const addCommunityReply = (postId: string, content: string) => {
    const newReply: CommunityReply = {
      id: `rep-${Date.now()}`,
      postId,
      author: {
        id: 'usr-owner-divyankar',
        name: 'Divyankar Yadav',
        handle: 'divyankyadav232',
        role: 'Owner & Editor-in-Chief',
        avatarBg: 'bg-[#1A3328]'
      },
      content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      likedByUser: false
    };

    setCommunityPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, replies: [...post.replies, newReply] }
          : post
      )
    );
  };

  const toggleLikePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const liked = !post.likedByUser;
          return {
            ...post,
            likedByUser: liked,
            likesCount: liked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1)
          };
        }
        return post;
      })
    );
  };

  const toggleLikeReply = (postId: string, replyId: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: post.replies.map((reply) => {
              if (reply.id === replyId) {
                const liked = !reply.likedByUser;
                return {
                  ...reply,
                  likedByUser: liked,
                  likesCount: liked ? reply.likesCount + 1 : Math.max(0, reply.likesCount - 1)
                };
              }
              return reply;
            })
          };
        }
        return post;
      })
    );
  };

  const reportPost = (postId: string, postTitle: string, reason: string) => {
    const newReport: ModerationReport = {
      id: `rep-${Date.now()}`,
      postId,
      postTitle,
      reason,
      reportedAt: new Date().toISOString(),
      status: 'pending'
    };
    setModerationReports((prev) => [newReport, ...prev]);
    setCommunityPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isReported: true, reportCount: (p.reportCount || 0) + 1 } : p))
    );
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'remove') => {
    const report = moderationReports.find((r) => r.id === reportId);
    if (!report) return;

    if (action === 'remove') {
      setCommunityPosts((prev) => prev.filter((p) => p.id !== report.postId));
    } else {
      setCommunityPosts((prev) =>
        prev.map((p) => (p.id === report.postId ? { ...p, isReported: false } : p))
      );
    }

    setModerationReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action === 'remove' ? 'resolved' : 'dismissed' } : r))
    );
  };

  // Newsletter
  const subscribeNewsletter = (email: string, topics: string[]): { success: boolean; message: string } => {
    if (!validateEmail(email)) {
      return { success: false, message: 'Please enter a valid academic or personal email address.' };
    }
    if (newsletterSubscribers.some((s) => s.email.toLowerCase() === email.trim().toLowerCase())) {
      return { success: true, message: 'You are already registered for our weekly dispatch. Thank you for your continued readership!' };
    }

    const subscriber: NewsletterSubscriber = {
      email: email.trim(),
      topics: topics.length > 0 ? topics : ['Wildlife Discoveries', 'Indian Problems & Solutions'],
      subscribedAt: new Date().toISOString(),
      frequency: 'Weekly Digest'
    };
    setNewsletterSubscribers((prev) => [subscriber, ...prev]);
    return { success: true, message: 'Subscription confirmed! You will receive our weekly editorial dispatch every Sunday morning.' };
  };

  // Bookmarks
  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  // Authentication & Profile methods
  const login = (
    email: string,
    name?: string,
    role?: UserRole,
    institution?: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    // Check if preset researcher exists
    const existingPreset = PRESET_RESEARCHERS.find(
      (p) => p.email.toLowerCase() === cleanEmail
    );

    if (existingPreset) {
      setCurrentUser(existingPreset);
      if (existingPreset.isOwner) {
        setIsAdminMode(true);
      }
      return;
    }

    // Is it owner email?
    const isOwnerLogin = cleanEmail === 'divyankyadav232@gmail.com';
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name?.trim() || (isOwnerLogin ? 'Divyankar Yadav' : cleanEmail.split('@')[0]),
      email: cleanEmail,
      role: role || (isOwnerLogin ? 'Owner & Editor-in-Chief' : 'Field Naturalist'),
      institution: institution?.trim() || 'Independent Naturalist Network',
      bio: isOwnerLogin
        ? 'Founder, Naturalist & Editor-in-Chief. Managing publications and field research.'
        : 'Ecological researcher exploring subcontinental biodiversity and systemic problems.',
      avatarBg: isOwnerLogin ? 'bg-[#B5A16A]' : 'bg-[#5A8A6C]',
      joinedDate: new Date().toISOString().split('T')[0],
      isOwner: isOwnerLogin,
      readArticles: [],
      fieldNotes: [],
      readingStreakDays: 1,
      lastActiveDate: new Date().toISOString()
    };

    setCurrentUser(newUser);
    if (isOwnerLogin) {
      setIsAdminMode(true);
    }
  };

  const logout = () => {
    // Switch to Guest / Student default
    const guestUser: UserProfile = {
      id: 'usr-guest',
      name: 'Visiting Naturalist',
      email: 'guest@vana-journal.in',
      role: 'Student Researcher',
      institution: 'Independent Reader',
      bio: 'Exploring research monographs, wildlife distributions, and ecological frameworks.',
      avatarBg: 'bg-[#4B6B94]',
      joinedDate: new Date().toISOString().split('T')[0],
      isOwner: false,
      readArticles: [],
      fieldNotes: [],
      readingStreakDays: 1,
      lastActiveDate: new Date().toISOString()
    };
    setCurrentUser(guestUser);
    setIsAdminMode(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updates,
      lastActiveDate: new Date().toISOString()
    }));
  };

  const markArticleAsRead = (articleId: string) => {
    setCurrentUser((prev) => {
      if (prev.readArticles.includes(articleId)) return prev;
      return {
        ...prev,
        readArticles: [...prev.readArticles, articleId],
        readingStreakDays: Math.max(prev.readingStreakDays, 1),
        lastActiveDate: new Date().toISOString()
      };
    });
  };

  const isArticleRead = (articleId: string) => {
    return currentUser.readArticles.includes(articleId);
  };

  const addFieldNote = (note: Omit<UserFieldNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: UserFieldNote = {
      ...note,
      id: `fn-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setCurrentUser((prev) => ({
      ...prev,
      fieldNotes: [newNote, ...prev.fieldNotes],
      lastActiveDate: now
    }));
  };

  const deleteFieldNote = (noteId: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      fieldNotes: prev.fieldNotes.filter((n) => n.id !== noteId)
    }));
  };

  const updateFieldNote = (noteId: string, updates: Partial<UserFieldNote>) => {
    setCurrentUser((prev) => ({
      ...prev,
      fieldNotes: prev.fieldNotes.map((n) =>
        n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      )
    }));
  };

  const resetToInitialData = () => {
    setSpecies(INITIAL_SPECIES);
    setProblems(INITIAL_PROBLEMS);
    setCommunityPosts(INITIAL_COMMUNITY_POSTS);
    setModerationReports(INITIAL_MODERATION_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.SPECIES);
    localStorage.removeItem(STORAGE_KEYS.PROBLEMS);
    localStorage.removeItem(STORAGE_KEYS.COMMUNITY);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        selectedSlug,
        navigateTo,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isBookmarksOpen,
        setIsBookmarksOpen,
        isAdminMode,
        setIsAdminMode,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        logout,
        updateProfile,
        markArticleAsRead,
        isArticleRead,
        addFieldNote,
        deleteFieldNote,
        updateFieldNote,
        species,
        problems,
        communityPosts,
        moderationReports,
        newsletterSubscribers,
        bookmarks,
        addSpecies,
        updateSpecies,
        deleteSpecies,
        addProblem,
        updateProblem,
        deleteProblem,
        addCommunityPost,
        addCommunityReply,
        toggleLikePost,
        toggleLikeReply,
        reportPost,
        resolveReport,
        subscribeNewsletter,
        toggleBookmark,
        isBookmarked,
        resetToInitialData,
        atlasContext,
        setAtlasContext,
        atlasMode,
        setAtlasMode,
        atlasInitialPrompt,
        setAtlasInitialPrompt,
        openAtlas
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
