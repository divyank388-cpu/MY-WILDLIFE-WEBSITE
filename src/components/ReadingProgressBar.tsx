import React, { useState, useEffect } from 'react';

interface ReadingProgressBarProps {
  title?: string;
  categoryOrStatus?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ title, categoryOrStatus }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (totalHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setScrollProgress(percent);
      }

      // Show floating micro-header once scrolled past top 140px
      setIsVisible(scrollY > 140);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top 2px Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[2.5px] bg-[#30322E]/80 pointer-events-none"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Article reading progress"
      >
        <div
          className="h-full bg-[#B5A16A] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Micro-Header with Title & Progress percentage when scrolled */}
      {isVisible && title && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#0B0C0B]/95 backdrop-blur-md border-b border-[#30322E] px-4 py-2 transition-all duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#F1EFE8]">
            <div className="flex items-center gap-3 truncate pr-4">
              {categoryOrStatus && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[#30322E] text-[#B5A16A] bg-[#131513] uppercase tracking-wider shrink-0">
                  {categoryOrStatus}
                </span>
              )}
              <span className="font-serif font-medium truncate text-[#F1EFE8]">{title}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-[#A5A59C] font-mono text-[11px]">
              <span>{Math.round(scrollProgress)}% read</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
