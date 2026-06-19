import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

interface IntroSectionProps {
  isVisible: boolean;
}

// Registration crosshair — like a print-shop alignment mark
function RegistrationMark({ opacity = 0.12 }: { opacity?: number }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="11" x2="8.5" y2="11" stroke="#FEF5EC" strokeWidth="0.7" strokeOpacity={opacity} />
      <line x1="13.5" y1="11" x2="22" y2="11" stroke="#FEF5EC" strokeWidth="0.7" strokeOpacity={opacity} />
      <line x1="11" y1="0" x2="11" y2="8.5" stroke="#FEF5EC" strokeWidth="0.7" strokeOpacity={opacity} />
      <line x1="11" y1="13.5" x2="11" y2="22" stroke="#FEF5EC" strokeWidth="0.7" strokeOpacity={opacity} />
      {/* Outer circle — slightly imperfect hand-drawn feel via ellipse */}
      <ellipse cx="11" cy="11.2" rx="4.2" ry="4" stroke="#FEF5EC" strokeWidth="0.6" strokeOpacity={opacity * 0.85} fill="none" />
    </svg>
  );
}

// Left-margin bracket — ink-stroke, flanks the name block
function LeftBracket({ height }: { height: number }) {
  const h = height;
  // Slightly wobbly bezier paths give hand-drawn feel
  return (
    <svg
      width="18"
      height={h}
      viewBox={`0 0 18 ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Top serif */}
      <path
        d={`M 4,2 C 6,1.5 10,1 14,2`}
        stroke="#FEF5EC"
        strokeWidth="0.75"
        strokeOpacity="0.12"
        strokeLinecap="round"
      />
      {/* Vertical stem — very slight waver */}
      <path
        d={`M 5,2 C 4.5,${h * 0.25} 4.8,${h * 0.5} 5,${h * 0.75} C 5.1,${h * 0.88} 4.9,${h - 4} 5,${h - 2}`}
        stroke="#FEF5EC"
        strokeWidth="0.75"
        strokeOpacity="0.12"
        strokeLinecap="round"
      />
      {/* Bottom serif */}
      <path
        d={`M 4,${h - 2} C 6,${h - 1} 10,${h - 1.5} 14,${h - 2}`}
        stroke="#FEF5EC"
        strokeWidth="0.75"
        strokeOpacity="0.12"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Ornamental divider — 1940s Spanish broadsheet style
// Fine ruled arms, center diamond, terminal serifs
function OrnamentalDivider({ width = 180 }: { width?: number }) {
  const cx = width / 2;
  const gap = 7; // gap around center diamond

  return (
    <svg
      width={width}
      height="16"
      viewBox={`0 0 ${width} 16`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left arm — slight bezier waver */}
      <path
        d={`M 4,8 C ${cx * 0.35},7.6 ${cx * 0.65},8.3 ${cx - gap},8`}
        stroke="#FEF5EC"
        strokeWidth="0.65"
        strokeOpacity="0.18"
        strokeLinecap="round"
      />
      {/* Right arm */}
      <path
        d={`M ${cx + gap},8 C ${cx + cx * 0.35},7.7 ${cx + cx * 0.65},8.2 ${width - 4},8`}
        stroke="#FEF5EC"
        strokeWidth="0.65"
        strokeOpacity="0.18"
        strokeLinecap="round"
      />
      {/* Center diamond — gold accent, the jewel of the ornament */}
      <path
        d={`M ${cx},4 L ${cx + 5},8 L ${cx},12 L ${cx - 5},8 Z`}
        fill="none"
        stroke="#F9D976"
        strokeWidth="0.7"
        strokeOpacity="0.45"
      />
      {/* Diamond inner fill — very subtle */}
      <path
        d={`M ${cx},5.5 L ${cx + 3.5},8 L ${cx},10.5 L ${cx - 3.5},8 Z`}
        fill="#F9D976"
        fillOpacity="0.08"
      />
      {/* Left terminal serif */}
      <line x1="4" y1="5.5" x2="4" y2="10.5" stroke="#FEF5EC" strokeWidth="0.65" strokeOpacity="0.18" strokeLinecap="round" />
      {/* Right terminal serif */}
      <line x1={width - 4} y1="5.5" x2={width - 4} y2="10.5" stroke="#FEF5EC" strokeWidth="0.65" strokeOpacity="0.18" strokeLinecap="round" />
      {/* Small secondary tick — 1/3 along each arm */}
      <line x1={cx * 0.38} y1="6.5" x2={cx * 0.38} y2="9.5" stroke="#FEF5EC" strokeWidth="0.5" strokeOpacity="0.1" strokeLinecap="round" />
      <line x1={cx + cx * 0.62} y1="6.5" x2={cx + cx * 0.62} y2="9.5" stroke="#FEF5EC" strokeWidth="0.5" strokeOpacity="0.1" strokeLinecap="round" />
    </svg>
  );
}

export function IntroSection({ isVisible }: IntroSectionProps) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 120], [1, 0]);
  const y = useTransform(scrollY, [0, 120], [0, -24]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{ opacity, y }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-10 pointer-events-none flex flex-col"
        >
          {/* Corner registration marks — print-shop aesthetic */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="absolute top-6 left-6"
          >
            <RegistrationMark />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="absolute bottom-6 right-6"
          >
            <RegistrationMark />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.05 }}
            className="absolute top-6 right-6"
          >
            <RegistrationMark opacity={0.07} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.95 }}
            className="absolute bottom-6 left-6"
          >
            <RegistrationMark opacity={0.07} />
          </motion.div>

          {/* Top meta bar */}
          <div className="flex items-center justify-between px-8 md:px-16 pt-10 md:pt-12">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-[#FEF5EC]/25 text-[10px] uppercase"
              style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.45em', fontWeight: 200 }}
            >
              No. 001
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-[#FEF5EC]/25 text-[10px] uppercase"
              style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.3em', fontWeight: 200 }}
            >
              UX · Design Engineering · Full-Stack
            </motion.span>
          </div>

          {/* Top rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-8 md:mx-16 mt-5 h-px bg-white/15 origin-left"
          />

          {/* San Diego / year — sits just under the top rule, right-aligned */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="flex flex-col items-end gap-1 px-8 md:px-16 mt-3"
          >
            <span
              className="text-[#FEF5EC]/50 text-[9px] md:text-[10px] uppercase"
              style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.35em', fontWeight: 200 }}
            >
              San Diego, CA · 2026
            </span>
          </motion.div>

          {/* Main display name */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-16 relative">

            {/* Left bracket — flanks the entire name block */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute hidden md:block"
              style={{ left: '2.5rem', top: '50%', transform: 'translateY(-50%)' }}
            >
              <LeftBracket height={200} />
            </motion.div>

            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className="text-[13vw] md:text-[11vw] text-[#FEF5EC] uppercase"
                  style={{ fontFamily: '"Poiret One", sans-serif', lineHeight: 0.9, letterSpacing: '0.12em' }}
                >
                  Jennifer
                </h1>
              </motion.div>
            </div>

            {/* Ornamental divider between name lines */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="my-2 md:my-3 origin-left hidden md:block"
            >
              <OrnamentalDivider width={220} />
            </motion.div>
            {/* Mobile: thin rule fallback */}
            <div className="md:hidden h-px w-24 bg-white/10 my-2" />

            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className="text-[13vw] md:text-[11vw] text-[#FEF5EC] uppercase"
                  style={{ fontFamily: '"Poiret One", sans-serif', lineHeight: 0.9, letterSpacing: '0.12em' }}
                >
                  Beaver
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Bottom rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-8 md:mx-16 mb-5 h-px bg-white/15 origin-left"
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-8 md:px-16 pb-10 md:pb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="flex items-center gap-3"
            >
              <motion.span
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-[#F9D976] inline-block"
              />
              <span
                className="text-[#FEF5EC]/30 text-[10px] uppercase"
                style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.4em', fontWeight: 200 }}
              >
                Scroll to explore
              </span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.3 }}
              className="text-[#FEF5EC]/50 text-[10px] uppercase"
              style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.35em', fontWeight: 200 }}
            >
              Portfolio
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
