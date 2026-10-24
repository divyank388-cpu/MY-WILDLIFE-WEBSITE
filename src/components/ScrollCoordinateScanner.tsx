import React, { useEffect, useState, useRef } from 'react';

/**
 * Scroll-Only Diagonal Falling Coordinate Line:
 * 1. Moves ONLY when the user scrolls.
 * 2. STOPS immediately at its current position when scrolling stops.
 * 3. Falls from Top-Left corner (0,0) to Bottom-Right corner (width, height),
 *    then next cycle falls from Top-Right corner (width,0) to Bottom-Left corner (0, height),
 *    and alternates cleanly.
 * 4. Placed completely in the background (behind main content cards, z-0) so it never interrupts reading.
 */
export const ScrollCoordinateScanner: React.FC = () => {
  const [progress, setProgress] = useState(0.15);
  const [direction, setDirection] = useState<'left-to-right' | 'right-to-left'>('left-to-right');
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });
  const [isScrolling, setIsScrolling] = useState(false);

  const stateRef = useRef({
    cumulativeScroll: 0,
    lastScrollY: 0,
    cycleLength: 900 // pixels of scroll to complete one full corner-to-corner fall
  });

  useEffect(() => {
    const updateDimensions = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
      // Adjust cycle length based on viewport diagonal
      const diag = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
      stateRef.current.cycleLength = Math.max(diag * 0.8, 800);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    stateRef.current.lastScrollY = window.scrollY;
    stateRef.current.cumulativeScroll = Math.max(window.scrollY, 0);

    let scrollStopTimer = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - stateRef.current.lastScrollY;
      stateRef.current.lastScrollY = currentScrollY;

      // Update cumulative scroll strictly on scroll
      stateRef.current.cumulativeScroll = Math.max(0, stateRef.current.cumulativeScroll + deltaY);

      const cycleLength = stateRef.current.cycleLength;
      const totalCycles = stateRef.current.cumulativeScroll / cycleLength;
      const currentCycleIndex = Math.floor(totalCycles);
      const currentCycleProgress = totalCycles - currentCycleIndex;

      // Alternate directions per cycle: even cycles NW->SE, odd cycles NE->SW
      const isEvenCycle = currentCycleIndex % 2 === 0;
      const newDirection = isEvenCycle ? 'left-to-right' : 'right-to-left';

      setProgress(Math.min(Math.max(currentCycleProgress, 0), 1));
      setDirection(newDirection);
      setIsScrolling(true);

      // Stop indicator after scroll pauses
      window.clearTimeout(scrollStopTimer);
      scrollStopTimer = window.setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(scrollStopTimer);
    };
  }, []);

  const { width, height } = viewport;

  // Calculate coordinates of the falling beam based on scroll progress
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let tipX = 0;
  let tipY = 0;

  if (direction === 'left-to-right') {
    // Falls from top-left (0, 0) to bottom-right (width, height)
    startX = 0;
    startY = 0;
    endX = width;
    endY = height;
    tipX = progress * width;
    tipY = progress * height;
  } else {
    // Falls from top-right (width, 0) to bottom-left (0, height)
    startX = width;
    startY = 0;
    endX = 0;
    endY = height;
    tipX = width - progress * width;
    tipY = progress * height;
  }

  // Trailing line tail (from slightly behind tip up to tip)
  const tailProgress = Math.max(0, progress - 0.28);
  let tailX = 0;
  let tailY = 0;
  if (direction === 'left-to-right') {
    tailX = tailProgress * width;
    tailY = tailProgress * height;
  } else {
    tailX = width - tailProgress * width;
    tailY = tailProgress * height;
  }

  // Geographic coordinates along the sweep
  const lat = (28.61 - progress * 19.5).toFixed(1);
  const lon = (direction === 'left-to-right' ? 72.0 + progress * 20.0 : 92.0 - progress * 20.0).toFixed(1);
  const pct = Math.round(progress * 100);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-300 ${
        isScrolling ? 'opacity-40' : 'opacity-20'
      }`}
      aria-hidden="true"
    >
      <svg className="w-full h-full absolute inset-0">
        <defs>
          <linearGradient
            id="beamGradLeftToRight"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#5A8A6C" stopOpacity="0.0" />
            <stop offset="60%" stopColor="#5A8A6C" stopOpacity="0.25" />
            <stop offset="90%" stopColor="#B5A16A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#F1EFE8" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient
            id="beamGradRightToLeft"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#5A8A6C" stopOpacity="0.0" />
            <stop offset="60%" stopColor="#5A8A6C" stopOpacity="0.25" />
            <stop offset="90%" stopColor="#B5A16A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#F1EFE8" stopOpacity="0.9" />
          </linearGradient>

          <filter id="laserGlowSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Faint Trajectory Guideline */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#30322E"
          strokeWidth="1"
          strokeDasharray="4 12"
          opacity="0.18"
        />

        {/* The Falling Active Beam Segment */}
        <line
          x1={tailX}
          y1={tailY}
          x2={tipX}
          y2={tipY}
          stroke={direction === 'left-to-right' ? 'url(#beamGradLeftToRight)' : 'url(#beamGradRightToLeft)'}
          strokeWidth={1.8}
          strokeLinecap="round"
          filter="url(#laserGlowSoft)"
        />

        {/* Core highlight hairline */}
        <line
          x1={tailX + (tipX - tailX) * 0.65}
          y1={tailY + (tipY - tailY) * 0.65}
          x2={tipX}
          y2={tipY}
          stroke="#F1EFE8"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Leading Tip Indicator */}
        <circle
          cx={tipX}
          cy={tipY}
          r={2.5}
          fill="#F1EFE8"
        />
        <circle
          cx={tipX}
          cy={tipY}
          r={5}
          fill="none"
          stroke="#B5A16A"
          strokeWidth="0.8"
          opacity="0.6"
        />
      </svg>

      {/* Subtle Coordinate Marker following the tip in the background */}
      <div
        className="absolute hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0B0C0B]/80 border border-[#30322E]/60 text-[9px] font-mono text-[#A5A59C] select-none"
        style={{
          transform: `translate3d(${Math.min(Math.max(tipX + (direction === 'left-to-right' ? 8 : -140), 10), width - 150)}px, ${Math.min(Math.max(tipY - 10, 16), height - 36)}px, 0)`,
        }}
      >
        <span className="w-1 h-1 rounded-full bg-[#5A8A6C]" />
        <span>{direction === 'left-to-right' ? 'NW→SE' : 'NE→SW'}</span>
        <span className="text-[#30322E]">·</span>
        <span>{pct}%</span>
        <span className="text-[#30322E]">·</span>
        <span className="text-[#B5A16A]">{lat}°N {lon}°E</span>
      </div>
    </div>
  );
};
