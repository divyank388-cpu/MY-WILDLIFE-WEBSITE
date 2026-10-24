import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { ScrollCoordinateScanner } from './components/ScrollCoordinateScanner';
import { AtlasFloatingWidget } from './components/AtlasFloatingWidget';
import { HomePage } from './pages/HomePage';
import { WildlifePage } from './pages/WildlifePage';
import { SpeciesDetailPage } from './pages/SpeciesDetailPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { ProblemDetailPage } from './pages/ProblemDetailPage';
import { CommunityPage } from './pages/CommunityPage';
import { DiscussionThreadPage } from './pages/DiscussionThreadPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { AtlasPage } from './pages/AtlasPage';
import { AccountPage } from './pages/AccountPage';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { currentTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C0B] text-[#F1EFE8] selection:bg-[#B5A16A] selection:text-[#0B0C0B]">
      {/* Dynamic Scroll-Coupled Laser Scanning Coordinate Line */}
      <ScrollCoordinateScanner />

      <Header />

      <main className="flex-1 relative z-10">
        {currentTab === 'home' && <HomePage />}
        {currentTab === 'wildlife' && <WildlifePage />}
        {currentTab === 'species-detail' && <SpeciesDetailPage />}
        {currentTab === 'problems' && <ProblemsPage />}
        {currentTab === 'problem-detail' && <ProblemDetailPage />}
        {currentTab === 'atlas' && <AtlasPage />}
        {currentTab === 'community' && <CommunityPage />}
        {currentTab === 'community-thread' && <DiscussionThreadPage />}
        {currentTab === 'about' && <AboutPage />}
        {currentTab === 'admin' && <AdminPage />}
        {currentTab === 'account' && <AccountPage />}
      </main>

      <Footer />

      {/* Global Modals, Floating Research AI Drawer & Saved Archive */}
      <AtlasFloatingWidget />
      <GlobalSearchModal />
      <BookmarksDrawer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
