import { motion } from 'motion/react';

interface SideNavProps {
  scrollProgress: number;
}

const navItems = [
  {
    label: 'About Me',
    number: '01',
    scrollTarget: 0.025,
    activeRange: [0.02, 0.40] as [number, number],
    absolute: false,
  },
  {
    label: 'Experience',
    number: '02',
    scrollTarget: 0.42,
    activeRange: [0.40, 0.55] as [number, number],
    absolute: false,
  },
  {
    label: 'Portfolio',
    number: '03',
    scrollTarget: 0.56,
    activeRange: [0.55, 1.01] as [number, number],
    absolute: false,
  },
  {
    label: 'Work',
    number: '04',
    // Scrolls to the case-studies section by element ID
    scrollTarget: 0,
    activeRange: [1.01, 2.0] as [number, number],
    absolute: true, // uses element scroll, not progress-based
  },
];

function scrollToProgress(progress: number) {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: progress * scrollHeight, behavior: 'smooth' });
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function SideNav({ scrollProgress }: SideNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.4 }}
      className="fixed right-0 top-0 h-full z-[60] pointer-events-none flex items-center"
      style={{ paddingRight: '1.5rem' }}
    >
      {/* Vertical spine line */}
      <div className="relative flex flex-col items-end gap-8">

        {/* Top cap */}
        <div
          className="absolute top-0 right-0 w-px"
          style={{
            height: '100%',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(254,245,236,0.12) 15%, rgba(254,245,236,0.12) 85%, transparent 100%)',
          }}
        />

        {navItems.map((item) => {
          const isActive = scrollProgress >= item.activeRange[0] && scrollProgress < item.activeRange[1];

          return (
            <button
              key={item.label}
              onClick={() => item.absolute ? scrollToSection('case-studies') : scrollToProgress(item.scrollTarget)}
              className="relative flex items-center gap-2 group pointer-events-auto"
              style={{ cursor: 'none' }}
              aria-label={`Navigate to ${item.label}`}
            >
              {/* Label + number — rotated text block */}
              <div className="flex flex-col items-end gap-0.5 text-right">
                <span
                  className="transition-all duration-300"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '8px',
                    letterSpacing: '0.35em',
                    color: isActive ? 'rgba(249,217,118,0.9)' : 'rgba(254,245,236,0.5)',
                  }}
                >
                  {item.number}
                </span>
                <span
                  className="transition-all duration-300 uppercase"
                  style={{
                    fontFamily: '"Josefin Sans", sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.25em',
                    fontWeight: 200,
                    color: isActive
                      ? '#F9D976'
                      : 'rgba(254,245,236,0.6)',
                  }}
                >
                  {item.label}
                </span>
              </div>

              {/* Horizontal tick connecting label to spine */}
              <motion.div
                animate={{ width: isActive ? 16 : 8 }}
                transition={{ duration: 0.3 }}
                className="h-px flex-shrink-0"
                style={{
                  background: isActive
                    ? '#F9D976'
                    : 'rgba(254,245,236,0.45)',
                }}
              />

              {/* Dot on the spine */}
              <motion.div
                animate={{
                  width: isActive ? 4 : 3,
                  height: isActive ? 4 : 3,
                  backgroundColor: isActive ? '#F9D976' : 'rgba(254,245,236,0.5)',
                }}
                transition={{ duration: 0.3 }}
                className="rounded-full flex-shrink-0"
                style={{ boxShadow: isActive ? '0 0 6px rgba(249,217,118,0.6)' : 'none' }}
              />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
