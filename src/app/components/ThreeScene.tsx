import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ThreeSceneProps {
  scrollProgress: number;
  onNodeClick: (nodeId: string) => void;
  selectedNode: string | null;
}

const portfolioEntries = [
  { id: 'react-stack',    number: '01', label: 'React · Next.js · TypeScript',    sub: 'Core Frontend Stack' },
  { id: 'design-systems', number: '02', label: 'Design Systems',                  sub: 'Component Libraries · Figma · Tailwind' },
  { id: 'learning',       number: '03', label: 'Digital Learning Platforms',       sub: '130K+ Users · LMS · Engagement' },
  { id: 'ecommerce',      number: '04', label: 'E-Commerce & Marketing',           sub: 'Vue · Launch Campaigns · Performance' },
  { id: 'enterprise',     number: '05', label: 'Enterprise & Internal Tools',      sub: 'Apple · First Republic · Retool' },
  { id: 'analytics',      number: '06', label: 'Machine Learning Data Analysis',   sub: 'K-Means · Jupyter · Demand Segmentation' },
  { id: 'cms-platforms',  number: '07', label: 'CMS & Platforms',                  sub: 'WordPress · Sanity · HubSpot · Marketo' },
  { id: 'ai-dev',         number: '08', label: 'AI-Assisted Engineering',          sub: 'Claude · Cursor · ML Certification' },
  { id: 'contact',        number: '09', label: 'Get in Touch',                     sub: 'Open to opportunities · San Diego' },
];

export function ThreeScene({ scrollProgress, onNodeClick, selectedNode }: ThreeSceneProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Stagger entry reveals across the scroll range
  const visibleCount = Math.floor(scrollProgress * (portfolioEntries.length + 3));
  const headerVisible = scrollProgress > 0.04;
  const bottomRuleVisible = visibleCount > portfolioEntries.length;

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col justify-center">

      {/* Subtle background grid — editorial graph-paper texture */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.025 }}
      >
        <defs>
          <pattern id="editorialGrid" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M 72 0 L 0 0 0 72" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#editorialGrid)" />
      </svg>

      <div className="relative px-8 md:px-16 lg:px-24 w-full max-w-5xl mx-auto pointer-events-auto">

        {/* Section header */}
        <AnimatePresence>
          {headerVisible && (
            <motion.div
              key="header"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between mb-5"
            >
              <span
                className="text-[#FEF5EC]/25 text-[10px] tracking-[0.45em] uppercase"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                Portfolio Index
              </span>
              <span
                className="text-[#FEF5EC]/25 text-[10px] tracking-[0.4em] uppercase"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                {portfolioEntries.length} entries
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top rule */}
        <AnimatePresence>
          {headerVisible && (
            <motion.div
              key="top-rule"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-white/20 origin-left"
            />
          )}
        </AnimatePresence>

        {/* Entry list */}
        <div>
          {portfolioEntries.map((entry, idx) => {
            const isVisible = idx < visibleCount;
            const isHovered = hoveredId === entry.id;
            const isSelected = selectedNode === entry.id;
            const isContact = entry.id === 'contact';
            const isLast = idx === portfolioEntries.length - 1;

            return (
              <AnimatePresence key={entry.id}>
                {isVisible && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <motion.button
                      onClick={() => onNodeClick(entry.id)}
                      onMouseEnter={() => setHoveredId(entry.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="w-full flex items-center gap-5 md:gap-8 py-3.5 md:py-4 text-left group"
                      style={{ cursor: 'none' }}
                    >
                      {/* Number */}
                      <span
                        className="shrink-0 transition-colors duration-200"
                        style={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '10px',
                          letterSpacing: '0.3em',
                          color: isHovered || isSelected ? 'rgba(249,217,118,0.5)' : 'rgba(254,245,236,0.2)',
                          minWidth: '2.2rem',
                        }}
                      >
                        {entry.number}
                      </span>

                      {/* Label */}
                      <span
                        className="flex-1 transition-colors duration-300 uppercase"
                        style={{
                          fontFamily: '"Poiret One", sans-serif',
                          fontSize: 'clamp(1rem, 2.2vw, 1.75rem)',
                          lineHeight: 1,
                          letterSpacing: '0.08em',
                          color: isContact
                            ? '#F9D976'
                            : isHovered || isSelected
                              ? '#F9D976'
                              : 'rgba(254,245,236,0.88)',
                        }}
                      >
                        {entry.label}
                      </span>

                      {/* Sub-label — hidden on small screens */}
                      <span
                        className="hidden md:block text-right shrink-0 transition-colors duration-300"
                        style={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '10px',
                          letterSpacing: '0.2em',
                          maxWidth: '190px',
                          color: isHovered || isSelected ? 'rgba(254,245,236,0.5)' : 'rgba(254,245,236,0.2)',
                        }}
                      >
                        {entry.sub}
                      </span>

                      {/* Arrow */}
                      <motion.span
                        animate={{ x: isHovered || isSelected ? 4 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 text-sm transition-colors duration-300"
                        style={{
                          fontFamily: '"Inter", sans-serif',
                          color: isHovered || isSelected ? 'rgba(249,217,118,0.7)' : 'rgba(254,245,236,0.15)',
                        }}
                      >
                        →
                      </motion.span>
                    </motion.button>

                    {/* Divider between entries */}
                    {!isLast && (
                      <div className="h-px bg-white/8" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* Bottom rule */}
        <AnimatePresence>
          {bottomRuleVisible && (
            <motion.div
              key="bottom-rule"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-white/20 origin-left"
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
