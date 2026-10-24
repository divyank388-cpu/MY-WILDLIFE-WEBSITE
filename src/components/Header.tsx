import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bookmark, Shield, Menu, X, User } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentTab,
    navigateTo,
    setIsSearchModalOpen,
    setIsBookmarksOpen,
    bookmarks,
    isAdminMode,
    setIsAdminMode,
    currentUser,
    setIsAuthModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Journal' },
    { id: 'wildlife', label: 'Wildlife Dictionary' },
    { id: 'problems', label: 'Problems of India' },
    { id: 'community', label: 'Research Community' },
    { id: 'atlas', label: 'Research Atlas' }
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0C0B]/95 backdrop-blur-md border-b border-[#30322E] transition-all">
      {/* Editorial Masthead Bar: Strict 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-8">
          {/* Zone 1: Single Brand Wordmark */}
          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer group flex items-center gap-3 whitespace-nowrap shrink-0"
          >
            <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#F1EFE8] group-hover:text-[#B5A16A] transition">
              VANA
            </span>
            <span className="font-mono text-xs uppercase px-2 py-0.5 rounded border border-[#30322E] text-[#B5A16A] tracking-widest font-semibold bg-[#131513]">
              वन
            </span>
          </div>

          {/* Zone 2: 4–5 Concise Single-Line Text Nav Links */}
          {/* Zone 2: Concise Editorial Nav Links */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-7">
            {navLinks.map((link) => {
              const isActive =
                currentTab === link.id ||
                (link.id === 'wildlife' && currentTab === 'species-detail') ||
                (link.id === 'problems' && currentTab === 'problem-detail') ||
                (link.id === 'community' && currentTab === 'community-thread');

              const isAtlas = link.id === 'atlas';

              return (
                <button
                  key={link.id}
                  onClick={() => navigateTo(link.id)}
                  className={`relative text-sm tracking-wide transition whitespace-nowrap shrink-0 py-1 font-medium flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#F1EFE8] font-semibold'
                      : isAtlas
                      ? 'text-[#B5A16A] hover:text-[#F1EFE8]'
                      : 'text-[#A5A59C] hover:text-[#F1EFE8]'
                  }`}
                >
                  {isAtlas && <span className="w-1.5 h-1.5 rounded-full bg-[#5A8A6C] animate-ping" />}
                  <span>{link.label}</span>
                  {isAtlas && (
                    <span className="text-[10px] font-mono uppercase px-1 py-0.2 rounded bg-[#131513] border border-[#5A8A6C]/40 text-[#5A8A6C]">
                      AI
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B5A16A]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action Area (User Account, Owner Status, Search, Bookmarks) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* User Profile / Account Quick Access Chip */}
            <div
              onClick={() => navigateTo('account')}
              className={`cursor-pointer flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition ${
                currentTab === 'account'
                  ? 'bg-[#1E231E] border-[#B5A16A]'
                  : 'bg-[#131513] border-[#30322E] hover:border-[#5A8A6C] hover:bg-[#181B18]'
              }`}
              title="Open Research Account & Progress Tracker"
            >
              <div
                className={`w-6 h-6 rounded-full ${currentUser.avatarBg} text-[#0B0C0B] text-[10px] font-bold flex items-center justify-center shrink-0`}
              >
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[11px] font-serif font-bold text-[#F1EFE8] leading-tight max-w-[110px] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-mono text-[#B5A16A] leading-tight">
                  {currentUser.isOwner ? 'Owner' : currentUser.role.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* If Owner: Quick Publishing Button */}
            {currentUser.isOwner && (
              <button
                onClick={() => navigateTo('admin')}
                className="hidden sm:inline-block px-2.5 py-1 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] text-[10px] font-semibold uppercase tracking-wider rounded transition font-mono"
                title="Open Editorial & Publishing Suite"
              >
                + Publish
              </button>
            )}

            {/* Switch Account / Auth Trigger */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-1.5 text-[#A5A59C] hover:text-[#F1EFE8] hover:bg-[#181B18] rounded-md border border-[#30322E] transition"
              title="Sign In / Switch Persona"
              aria-label="Account Settings"
            >
              <User className="w-3.5 h-3.5 text-[#B5A16A]" />
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-[#A5A59C] bg-[#131513] hover:bg-[#181B18] hover:text-[#F1EFE8] rounded-md border border-[#30322E] transition"
              title="Search archive (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#B5A16A]" />
              <span className="hidden sm:inline font-sans">Search</span>
              <kbd className="hidden lg:inline text-[10px] bg-[#0B0C0B] border border-[#30322E] px-1 py-0.2 rounded text-[#A5A59C] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Bookmarks Drawer Trigger */}
            <button
              onClick={() => setIsBookmarksOpen(true)}
              className="relative p-2 text-[#A5A59C] hover:text-[#F1EFE8] hover:bg-[#131513] rounded-md border border-transparent hover:border-[#30322E] transition"
              title="Saved Research Dossiers"
              aria-label="Bookmarks"
            >
              <Bookmark className="w-4 h-4 text-[#B5A16A]" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B5A16A] text-[#0B0C0B] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {bookmarks.length}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#F1EFE8] hover:bg-[#131513] rounded-md transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#131513] border-b border-[#30322E] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive =
              currentTab === link.id ||
              (link.id === 'wildlife' && currentTab === 'species-detail') ||
              (link.id === 'problems' && currentTab === 'problem-detail') ||
              (link.id === 'community' && currentTab === 'community-thread');

            return (
              <button
                key={link.id}
                onClick={() => {
                  navigateTo(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#181B18] text-[#B5A16A] font-semibold border-l-2 border-[#B5A16A]'
                    : 'text-[#A5A59C] hover:text-[#F1EFE8]'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#30322E] flex justify-between items-center text-xs text-[#A5A59C] px-3">
            <span>VANA Natural History Journal</span>
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setMobileMenuOpen(false);
              }}
              className="text-[#B5A16A] hover:underline"
            >
              {isAdminMode ? 'Exit Admin' : 'Admin Mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
