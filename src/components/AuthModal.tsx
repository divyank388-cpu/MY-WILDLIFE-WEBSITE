import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRESET_RESEARCHERS } from '../context/AppContext';
import { UserRole } from '../types';
import {
  X,
  User,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  LogOut,
  LogIn,
  KeyRound,
  Building,
  Mail,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    login,
    logout,
    navigateTo
  } = useApp();

  const [tab, setTab] = useState<'signin' | 'register' | 'presets'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState<UserRole>('Field Naturalist');
  const [notification, setNotification] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setNotification('Please enter a valid research or institutional email.');
      return;
    }
    login(email.trim());
    setNotification('Successfully authenticated. Welcome back!');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setNotification(null);
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) {
      setNotification('Full name and email are required to register.');
      return;
    }
    login(email.trim(), fullName.trim(), role, institution.trim());
    setNotification('Research profile created and active!');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setNotification(null);
    }, 600);
  };

  const handleSelectPreset = (presetEmail: string) => {
    login(presetEmail);
    setNotification(`Authenticated as ${presetEmail}`);
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setNotification(null);
    }, 500);
  };

  const handleSignOut = () => {
    logout();
    setNotification('Logged out to guest session.');
    setTimeout(() => {
      setNotification(null);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#111311] border border-[#30322E] rounded-xl shadow-2xl overflow-hidden text-[#F1EFE8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#30322E] flex justify-between items-center bg-[#151815]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1C201C] border border-[#B5A16A]/40 flex items-center justify-center text-[#B5A16A]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#F1EFE8]">
                VANA Naturalist Portal
              </h3>
              <p className="text-xs text-[#A5A59C]">
                Secure research credentials & progress tracking
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-[#A5A59C] hover:text-[#F1EFE8] hover:bg-[#202420] rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Session Banner */}
        <div className="px-5 py-3 bg-[#181B18] border-b border-[#282B28] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5A8A6C] animate-pulse" />
            <span className="text-[#A5A59C]">Current Session:</span>
            <span className="font-semibold text-[#F1EFE8]">{currentUser.name}</span>
            {currentUser.isOwner && (
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#B5A16A]/20 text-[#B5A16A] border border-[#B5A16A]/40">
                Owner
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsAuthModalOpen(false);
                navigateTo('account');
              }}
              className="text-[#B5A16A] hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <BookOpen className="w-3 h-3" /> My Account
            </button>
            <button
              onClick={handleSignOut}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 font-mono text-[11px] ml-1"
            >
              <LogOut className="w-3 h-3" /> Log Out
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className="px-5 py-2.5 bg-[#5A8A6C]/20 border-b border-[#5A8A6C]/40 text-[#5A8A6C] text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Tabs */}
        <div className="grid grid-cols-3 border-b border-[#282B28] text-xs font-mono uppercase tracking-wider text-center bg-[#131513]">
          <button
            onClick={() => setTab('signin')}
            className={`py-3 transition border-b-2 ${
              tab === 'signin'
                ? 'border-[#B5A16A] text-[#B5A16A] font-bold bg-[#181B18]'
                : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`py-3 transition border-b-2 ${
              tab === 'register'
                ? 'border-[#B5A16A] text-[#B5A16A] font-bold bg-[#181B18]'
                : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
            }`}
          >
            Create Profile
          </button>
          <button
            onClick={() => setTab('presets')}
            className={`py-3 transition border-b-2 flex items-center justify-center gap-1.5 ${
              tab === 'presets'
                ? 'border-[#B5A16A] text-[#B5A16A] font-bold bg-[#181B18]'
                : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B5A16A]" />
            Quick Login
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A59C] mb-1.5">
                  Institutional / Research Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-[#A5A59C]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., divyankyadav232@gmail.com"
                    required
                    className="w-full bg-[#181B18] border border-[#30322E] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A59C] mb-1.5">
                  Access Key / Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 w-4 h-4 text-[#A5A59C]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#181B18] border border-[#30322E] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] font-serif font-bold text-sm tracking-wide rounded-lg transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Sign In to Research Account
                </button>
              </div>

              <div className="pt-3 border-t border-[#282B28] text-center">
                <p className="text-xs text-[#A5A59C]">
                  Are you the site owner?{' '}
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('divyankyadav232@gmail.com')}
                    className="text-[#B5A16A] hover:underline font-semibold"
                  >
                    1-Click Login as Owner (Divyankar Yadav)
                  </button>
                </p>
              </div>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A59C] mb-1">
                  Full Name & Honors
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Dr. Ananya Sen"
                  required
                  className="w-full bg-[#181B18] border border-[#30322E] rounded-lg px-3 py-2 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A59C] mb-1">
                  Academic / Research Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya.sen@wii.res.in"
                  required
                  className="w-full bg-[#181B18] border border-[#30322E] rounded-lg px-3 py-2 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A59C] mb-1">
                    Research Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-[#181B18] border border-[#30322E] rounded-lg px-3 py-2 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none transition"
                  >
                    <option value="Field Naturalist">Field Naturalist</option>
                    <option value="Senior Wildlife Biologist">Senior Wildlife Biologist</option>
                    <option value="Environmental Policy Auditor">Environmental Policy Auditor</option>
                    <option value="Student Researcher">Student Researcher</option>
                    <option value="Owner & Editor-in-Chief">Owner & Editor-in-Chief</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A59C] mb-1">
                    Affiliation / Institute
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g., WII / IISc / Independent"
                    className="w-full bg-[#181B18] border border-[#30322E] rounded-lg px-3 py-2 text-sm text-[#F1EFE8] focus:border-[#B5A16A] focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#B5A16A] hover:bg-[#9E8B56] text-[#0B0C0B] font-serif font-bold text-sm tracking-wide rounded-lg transition flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> Create Research Profile
                </button>
              </div>
            </form>
          )}

          {tab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-[#A5A59C] mb-2">
                Select an authorized editorial persona to immediately explore personalized research progress and publishing capabilities:
              </p>

              {PRESET_RESEARCHERS.map((preset) => {
                const isSelected = currentUser.email.toLowerCase() === preset.email.toLowerCase();
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.email)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#1E231E] border-[#B5A16A]'
                        : 'bg-[#161816] border-[#30322E] hover:border-[#5A8A6C] hover:bg-[#1A1D1A]'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full ${preset.avatarBg} text-[#0B0C0B] font-bold text-xs flex items-center justify-center shrink-0`}
                    >
                      {preset.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif font-bold text-sm text-[#F1EFE8]">
                          {preset.name}
                        </span>
                        {preset.isOwner && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B5A16A] text-[#0B0C0B] font-bold">
                            Owner / Editor
                          </span>
                        )}
                        {preset.role.includes('Biologist') && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#5A8A6C]/30 text-[#5A8A6C] border border-[#5A8A6C]/40">
                            WII Biologist
                          </span>
                        )}
                        {preset.role.includes('Student') && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4B6B94]/30 text-[#4B6B94] border border-[#4B6B94]/40">
                            IISc Scholar
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#B5A16A] font-mono truncate">{preset.email}</p>
                      <p className="text-xs text-[#A5A59C] mt-0.5 line-clamp-1">
                        {preset.institution}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#141614] border-t border-[#282B28] flex justify-between items-center text-xs text-[#A5A59C]">
          <span>Protected research environment</span>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-[#F1EFE8] hover:text-[#B5A16A] font-mono text-[11px]"
          >
            Continue as Guest →
          </button>
        </div>
      </div>
    </div>
  );
};
