import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { AboutIllustration, OjaiOriginsSceneWide } from './AboutIllustrations';
import soundcloudJenniferBeaver from '../../imports/soundcloud_jennifer_beaver.png';
import cubicleBlob from '../../imports/cubicle_blob.png';
import futurecorpBlob from '../../imports/futurecorp_blob.png';
import aufiBlob from '../../imports/aufi_blob.png';
import carolklineBlob from '../../imports/carolkline_blob.png';
import stylebeeBlob from '../../imports/stylebee_blob.png';

interface AboutMeProps {
  isVisible: boolean;
  scrollProgress: number;
}

function ExperienceTimeline({ roles }: { roles: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % roles.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [roles.length, paused]);

  return (
    <div className="w-full flex flex-col items-start gap-5 mt-6 pointer-events-auto max-w-2xl">
      {/* Role selector — editorial typographic list */}
      <div className="w-full">
        {roles.map((role, idx) => (
          <button
            key={idx}
            onClick={() => { setActiveIndex(idx); setPaused(true); }}
            className="w-full flex items-center gap-4 py-2.5 text-left transition-colors duration-200 border-b border-white/8 last:border-b-0"
            style={{ cursor: 'none' }}
          >
            <span
              className="text-[10px] tracking-widest shrink-0 transition-colors duration-200"
              style={{
                fontFamily: '"Inter", sans-serif',
                color: idx === activeIndex ? 'rgba(249,217,118,0.6)' : 'rgba(254,245,236,0.2)',
              }}
            >
              {String(idx + 1).padStart(2, '0')}
            </span>
            <span
              className="flex-1 text-sm transition-colors duration-200"
              style={{
                fontFamily: '"Inter", sans-serif',
                letterSpacing: '0.04em',
                color: idx === activeIndex ? '#F9D976' : 'rgba(254,245,236,0.45)',
              }}
            >
              {role.company}
            </span>
            {idx === activeIndex && (
              <span className="text-[#F9D976]/50 text-xs" style={{ fontFamily: '"Inter", sans-serif' }}>
                →
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="w-full border-t border-[#F9D976]/25 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <p
              className="text-[#F9D976] mb-2"
              style={{
                fontFamily: '"Poiret One", sans-serif',
                fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)',
                lineHeight: 1.2,
              }}
            >
              {roles[activeIndex].title}
            </p>
            {roles[activeIndex].desc && (
              <p
                className="text-[#FEF5EC]/40 text-xs leading-relaxed"
                style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.03em' }}
              >
                {roles[activeIndex].desc}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const steps = [
  {
    isIntro: true,
    number: '00',
    overline: 'MY STORY',
    illustrationKey: 'intro',
    heading: (
      <>
        Every journey has<br />
        a beginning.
      </>
    ),
    body: 'Learn more about my personal story and continue to scroll for insights.',
  },
  {
    number: '01',
    overline: 'ORIGINS',
    illustrationKey: 'origins',
    emoji: '🍊',
    heading: (
      <>
        Ventura born.<br />
        Ojai raised.
      </>
    ),
    body: 'Grew up in the Ojai valley, establishing my foundation before stepping out to explore.',
  },
  {
    number: '02',
    overline: 'EDUCATION',
    illustrationKey: 'education',
    emoji: '🎵',
    heading: (
      <>
        Studied music.
      </>
    ),
    body: 'B.A. in Music Performance from UC Santa Cruz (2016). Later completed a Full Stack Software Engineering Certification at Flatiron School (2021).',
  },
  {
    number: '03',
    overline: 'PAST LIFE',
    illustrationKey: 'past-life',
    emoji: '🎸',
    heading: (
      <>
        Musician &<br />
        Educator.
      </>
    ),
    body: 'Worked privately and in public high school level education before pivoting into design and development.',
    musicArchiveUrl: 'https://soundcloud.com/jennifer-beaver-1',
    musicArchivePreview: soundcloudJenniferBeaver,
    musicArchiveTitle: 'Explore my older music work on SoundCloud',
    musicArchiveNote: 'This is archival work from an earlier chapter of my career.',
  },
  {
    number: '04',
    overline: 'PIVOT',
    illustrationKey: 'pivot',
    emoji: '💻',
    heading: (
      <>
        Design & Software<br />
        Development.
      </>
    ),
    body: 'Pivoting from Bay Area education to tech, I designed for Stylebee, completed dev internships at Cubicle, Future Corp London, and Aufi, and delivered design and development for author Carol Kline. I later earned a Flatiron School full-stack certification.',
    websiteBlobs: [
      {
        label: 'Cubicle Journal',
        url: 'https://cubiclejournal.com/category/fashion-style/',
        image: cubicleBlob,
      },
      {
        label: 'Future Corp London',
        url: 'https://futurecorp.london',
        image: futurecorpBlob,
      },
      {
        label: 'AUFI',
        url: 'https://aufi.com',
        image: aufiBlob,
      },
      {
        label: 'Carol Kline',
        url: 'https://carolkline.com',
        image: carolklineBlob,
      },
      {
        label: 'Stylebee',
        url: 'https://www.stylebee.in',
        image: stylebeeBlob,
      },
    ],
  },
  {
    number: '05',
    overline: 'EXPERIENCE',
    illustrationKey: 'experience',
    emoji: '🚀',
    heading: (
      <>
        Professional<br />
        Journey.
      </>
    ),
    isExperience: true,
    roles: [
      {
        company: 'NextGen Web Consulting',
        title: 'Senior Web Developer — Contract',
        desc: 'May 2026 – Present · Remote. React, TypeScript, WordPress, Marketo. Reusable component frameworks across Upcraft Media and ExpediaParts; Salesforce, GA4, and marketing automation integrations.',
      },
      {
        company: 'Drum Channel',
        title: 'Front-End / Design Technologist',
        desc: 'Aug 2023 – Present · LA, CA. React platform serving 130K+ users. Improved engagement 2x via UX and performance work. Integrated LearnDash, GravityForms, REST APIs. Built GA4 + Looker Studio reporting.',
      },
      {
        company: 'Apple · Agavos Group · Visual Studio Eng.',
        title: 'Front-End Developer — React / Design Systems',
        desc: "Feb 2023 – Oct 2023 · LA, CA. React and Next.js components aligned with Apple's enterprise design system. CI/CD workflows, Retool, Airtable, internal tooling.",
      },
      {
        company: 'First Republic Bank · ImForza',
        title: 'Front-End Developer — Angular / Internal Tools',
        desc: 'May 2022 – Oct 2022 · San Francisco, CA. Angular-based internal applications for financial operations. API integrations, accessible enterprise interfaces.',
      },
      {
        company: 'Antares Audio Technologies',
        title: 'UI Developer — Vue / E-Commerce',
        desc: 'Aug 2021 – Apr 2022 · San Francisco, CA. Vue.js components for Auto-Tune global product launches. High-performance marketing and e-commerce front-end builds.',
      },
    ],
  },
  {
    number: '06',
    overline: 'CURRENT FOCUS',
    illustrationKey: 'curr-focus',
    emoji: '🤖',
    heading: (
      <>
        Machine<br />
        Learning.
      </>
    ),
    body: 'Pursuing a Machine Learning Certification at UC San Diego (2025–2026). Hands-on Python and TensorFlow projects alongside daily AI-assisted engineering with Claude, Cursor, and ChatGPT.',
  },
  {
    number: '07',
    overline: 'LIFE NOW',
    illustrationKey: 'life-now',
    emoji: '🐶',
    heading: (
      <>
        San Diego<br />
        & Miel.
      </>
    ),
    body: 'Living in San Diego with my adopted pit mix. Finding inspiration in nature, travel, reading, and personal growth.',
  },
];

export function AboutMeSection({ isVisible, scrollProgress }: AboutMeProps) {
  const [dim, setDim] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1000,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => setDim({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sectionStart = 0.02;
  const sectionEnd = 0.55;
  const sectionProgress = Math.max(0, Math.min(1, (scrollProgress - sectionStart) / (sectionEnd - sectionStart)));

  const stickyPortion = 0.15;
  const horizontalProgress = Math.max(0, (sectionProgress - stickyPortion) / (1 - stickyPortion));

  const activeIndex = Math.min(steps.length - 1, Math.floor(horizontalProgress * steps.length));

  const totalWidth = dim.w * steps.length;
  const ruleY = dim.h * 0.5;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-40 overflow-hidden"
        >
          {/* Match intro/portfolio background treatment */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.025 }}
          >
            <defs>
              <pattern id="aboutEditorialGrid" width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M 72 0 L 0 0 0 72" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#aboutEditorialGrid)" />
          </svg>

          {/* Scrolling horizontal container */}
          <div
            className="absolute top-0 left-0 h-full flex pointer-events-auto will-change-transform"
            style={{
              width: `${steps.length * 100}vw`,
              transform: `translate3d(-${horizontalProgress * (steps.length - 1) * 100}vw, 0, 0)`,
            }}
          >
            {/* Editorial horizontal rule SVG */}
            <svg
              className="absolute top-0 left-0 pointer-events-none z-0"
              width={totalWidth}
              height={dim.h}
              viewBox={`0 0 ${totalWidth} ${dim.h}`}
            >
              {/* Faint base rule */}
              <line
                x1={0} y1={ruleY}
                x2={totalWidth} y2={ruleY}
                stroke="rgba(254,245,236,0.06)"
                strokeWidth="1"
              />

              {/* Revealed rule — yellow, grows with scroll */}
              <line
                x1={0} y1={ruleY}
                x2={totalWidth} y2={ruleY}
                stroke="rgba(249,217,118,0.3)"
                strokeWidth="1"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - horizontalProgress}
              />

              {/* Tick marks + nodes at each screen center */}
              {steps.map((_, idx) => {
                const cx = dim.w * (idx + 0.5);
                const isLit = horizontalProgress >= (idx / Math.max(steps.length - 1, 1)) - 0.01;
                return (
                  <g key={idx}>
                    <line
                      x1={cx} y1={ruleY - 8}
                      x2={cx} y2={ruleY + 8}
                      stroke={isLit ? 'rgba(249,217,118,0.4)' : 'rgba(254,245,236,0.07)'}
                      strokeWidth="1"
                    />
                    <circle
                      cx={cx}
                      cy={ruleY}
                      r={isLit ? 3.5 : 2.5}
                      fill={isLit ? '#F9D976' : 'transparent'}
                      stroke={isLit ? '#F9D976' : 'rgba(254,245,236,0.12)'}
                      strokeWidth="1"
                      style={isLit ? { filter: 'drop-shadow(0 0 5px #F9D976)' } : {}}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Screens */}
            {steps.map((step, idx) => {
              const continuousIndex = horizontalProgress * (steps.length - 1);
              const distanceFromCenter = Math.abs(continuousIndex - idx);
              const itemOpacity = Math.max(0, 1 - distanceFromCenter * 1.5);
              const textTransformX = (continuousIndex - idx) * 40;
              const isOdd = idx % 2 === 1;
              const isPastLifeStep = step.number === '03';
              const placeAboveRule = isOdd && !isPastLifeStep;

              if (step.isIntro) {
                return (
                  <div key={idx} className="w-screen h-screen flex-shrink-0 relative z-10">
                    <div style={{ opacity: itemOpacity }}>
                      {/* Above rule */}
                      <div
                        className="absolute left-1/2 w-full max-w-4xl px-10 md:px-16"
                        style={{
                          bottom: 'calc(50vh + 3.5rem)',
                          transform: `translate(calc(-50% + ${textTransformX}px), 0)`,
                        }}
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <span
                            className="text-[#FEF5EC]/50 text-[10px] tracking-[0.4em]"
                            style={{ fontFamily: '"Inter", sans-serif' }}
                          >
                            {step.number}
                          </span>
                          <div className="h-px flex-1 bg-white/10" />
                          <div className="flex items-center gap-2">
                            <motion.span
                              animate={{ opacity: [1, 0.15, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full bg-[#F9D976] inline-block"
                            />
                            <span
                              className="text-[#FEF5EC]/35 text-[10px] tracking-[0.35em] uppercase"
                              style={{ fontFamily: '"Inter", sans-serif' }}
                            >
                              {step.overline}
                            </span>
                          </div>
                        </div>
                        <h2
                          className="text-[#FEF5EC] uppercase"
                          style={{
                            fontFamily: '"Poiret One", sans-serif',
                            fontSize: 'clamp(2.2rem, 5.5vw, 4.8rem)',
                            lineHeight: 1.08,
                            letterSpacing: '0.08em',
                            WebkitTextStroke: '0.6px #FEF5EC',
                          }}
                        >
                          {step.heading}
                        </h2>
                      </div>

                      {/* Below rule — body text + illustration */}
                      <div
                        className="absolute left-1/2 w-full max-w-xl px-10 md:px-16"
                        style={{
                          top: 'calc(50vh + 3.5rem)',
                          transform: `translate(calc(-50% + ${textTransformX}px), 0)`,
                        }}
                      >
                        <p
                          className="text-[#FEF5EC]/45 leading-relaxed"
                          style={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
                          }}
                        >
                          {step.body}
                        </p>
                      </div>

                      {/* Illustration — hangs from the rule on the right side */}
                      {step.illustrationKey && (
                        <div
                          className="absolute hidden md:block"
                          style={{
                            top: 'calc(50vh - 2px)',
                            right: `calc(10% - ${textTransformX}px)`,
                          }}
                        >
                          <AboutIllustration
                            stepKey={step.illustrationKey}
                            isActive={distanceFromCenter < 0.6}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Alternate: odd steps place content above the rule, even below
              return (
                <div key={idx} className="w-screen h-screen flex-shrink-0 relative z-10">
                  <div style={{ opacity: itemOpacity }}>

                    {step.isExperience ? (
                      // ── Experience: heading above rule, list below rule ──
                      <>
                        {/* Above rule — overline + heading only */}
                        <div
                          className="absolute left-1/2 w-full max-w-3xl px-10 md:px-16 flex flex-col"
                          style={{
                            bottom: 'calc(50vh + 2rem)',
                            transform: `translate(calc(-50% + ${textTransformX}px), 0)`,
                          }}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <span
                              className="text-[#FEF5EC]/50 text-[10px] tracking-[0.4em]"
                              style={{ fontFamily: '"Inter", sans-serif' }}
                            >
                              {step.number}
                            </span>
                            <div className="h-px flex-1 bg-white/10" />
                            <div className="flex items-center gap-2">
                              <motion.span
                                animate={{ opacity: [1, 0.15, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-[#F9D976] inline-block"
                              />
                              <span
                                className="text-[#FEF5EC]/35 text-[10px] uppercase"
                                style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.35em', fontWeight: 200 }}
                              >
                                {step.overline}
                              </span>
                            </div>
                          </div>
                          <h2
                            className="text-[#FEF5EC] uppercase"
                            style={{
                              fontFamily: '"Poiret One", sans-serif',
                              fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)',
                              lineHeight: 1.08,
                              letterSpacing: '0.08em',
                              WebkitTextStroke: '0.6px #FEF5EC',
                            }}
                          >
                            {step.heading}
                          </h2>
                        </div>

                        {/* Below rule — role list only */}
                        <div
                          className="absolute left-1/2 w-full max-w-3xl px-10 md:px-16 flex flex-col pointer-events-auto"
                          style={{
                            top: 'calc(50vh + 1.5rem)',
                            transform: `translate(calc(-50% + ${textTransformX}px), 0)`,
                          }}
                        >
                          <ExperienceTimeline roles={step.roles!} />
                        </div>
                      </>
                    ) : (
                      // ── All other steps ──
                      <>
                        {isPastLifeStep && step.musicArchiveUrl && step.musicArchivePreview ? (
                          <a
                            href={step.musicArchiveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute left-1/2 inline-flex flex-col gap-2 border border-[#FEF5EC]/14 p-2 max-w-md transition-colors duration-200 hover:border-[#F9D976]/35 pointer-events-auto"
                            style={{
                              cursor: 'none',
                              background: 'rgba(254,245,236,0.02)',
                              bottom: 'calc(50vh + 2.2rem)',
                              transform: `translate(calc(-50% + ${textTransformX}px), 0)`,
                            }}
                          >
                            <img
                              src={step.musicArchivePreview}
                              alt="Jennifer Beaver SoundCloud preview"
                              className="w-full h-auto block"
                              style={{ border: '1px solid rgba(254,245,236,0.12)' }}
                            />
                            <span
                              className="text-[#F9D976]/88 uppercase"
                              style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '9px', letterSpacing: '0.2em', fontWeight: 300 }}
                            >
                              {step.musicArchiveTitle ?? 'Explore SoundCloud'}
                            </span>
                            <span
                              className="text-[#FEF5EC]/45"
                              style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', lineHeight: 1.45 }}
                            >
                              {step.musicArchiveNote}
                            </span>
                          </a>
                        ) : null}

                        {step.websiteBlobs?.length ? (
                          <div
                            className="absolute left-1/2 flex flex-wrap items-start justify-center gap-4 md:gap-6 pointer-events-auto"
                            style={{
                              bottom: 'calc(50vh + 2.2rem)',
                              transform: `translate(calc(-50% + ${textTransformX}px), 0)`,
                              maxWidth: 'min(90vw, 900px)',
                            }}
                          >
                            {step.websiteBlobs.map((blob, blobIdx) => (
                              <motion.a
                                key={blob.url}
                                href={blob.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2"
                                style={{ cursor: 'none' }}
                                animate={{ y: [0, -6, 0] }}
                                transition={{
                                  duration: 3.2 + blobIdx * 0.35,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: blobIdx * 0.22,
                                }}
                              >
                                <div
                                  className="w-[92px] h-[92px] md:w-[108px] md:h-[108px] rounded-full overflow-hidden border border-[#F9D976]/35 shadow-[0_0_16px_rgba(249,217,118,0.18)] transition-colors duration-200 hover:border-[#F9D976]/75"
                                  style={{ background: 'rgba(254,245,236,0.04)' }}
                                >
                                  <img
                                    src={blob.image}
                                    alt={`${blob.label} landing page preview`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span
                                  className="text-[#FEF5EC]/65 uppercase text-center"
                                  style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '8px', letterSpacing: '0.14em', maxWidth: '120px' }}
                                >
                                  {blob.label}
                                </span>
                              </motion.a>
                            ))}
                          </div>
                        ) : null}

                        <div
                          className="absolute left-1/2 w-full max-w-3xl px-10 md:px-16 flex flex-col pointer-events-auto"
                          style={{
                            ...(placeAboveRule
                              ? { bottom: 'calc(50vh + 3.5rem)' }
                              : { top: 'calc(50vh + 2rem)' }),
                            transform: `translate(calc(-50% + ${textTransformX}px), 0)`,
                          }}
                        >
                          {/* Number + overline */}
                          <div className="flex items-center gap-4 mb-5">
                            <span
                              className="text-[#FEF5EC]/50 text-[10px] tracking-[0.4em]"
                              style={{ fontFamily: '"Inter", sans-serif' }}
                            >
                              {step.number}
                            </span>
                            <div className="h-px flex-1 bg-white/10" />
                            <div className="flex items-center gap-2">
                              <motion.span
                                animate={{ opacity: [1, 0.15, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-[#F9D976] inline-block"
                              />
                              <span
                                className="text-[#FEF5EC]/35 text-[10px] uppercase"
                                style={{ fontFamily: '"Josefin Sans", sans-serif', letterSpacing: '0.35em', fontWeight: 200 }}
                              >
                                {step.overline}
                              </span>
                            </div>
                          </div>

                          {/* Heading */}
                          <h2
                            className="text-[#FEF5EC] uppercase"
                            style={{
                              fontFamily: '"Poiret One", sans-serif',
                              fontSize: 'clamp(2rem, 4.8vw, 4.2rem)',
                              lineHeight: 1.08,
                              letterSpacing: '0.08em',
                              WebkitTextStroke: '0.6px #FEF5EC',
                            }}
                          >
                            {step.heading}
                          </h2>

                          <p
                            className="mt-4 text-[#FEF5EC]/45 leading-relaxed"
                            style={{
                              fontFamily: '"Inter", sans-serif',
                              fontSize: 'clamp(0.8rem, 1.3vw, 0.95rem)',
                            }}
                          >
                            {step.body}
                          </p>

                          {!isPastLifeStep && step.musicArchiveUrl && step.musicArchivePreview ? (
                            <a
                              href={step.musicArchiveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex flex-col gap-2 border border-[#FEF5EC]/14 p-2 max-w-md transition-colors duration-200 hover:border-[#F9D976]/35"
                              style={{ cursor: 'none', background: 'rgba(254,245,236,0.02)' }}
                            >
                              <img
                                src={step.musicArchivePreview}
                                alt="Jennifer Beaver SoundCloud preview"
                                className="w-full h-auto block"
                                style={{ border: '1px solid rgba(254,245,236,0.12)' }}
                              />
                              <span
                                className="text-[#F9D976]/88 uppercase"
                                style={{ fontFamily: '"Josefin Sans", sans-serif', fontSize: '9px', letterSpacing: '0.2em', fontWeight: 300 }}
                              >
                                {step.musicArchiveTitle ?? 'Explore SoundCloud'}
                              </span>
                              <span
                                className="text-[#FEF5EC]/45"
                                style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', lineHeight: 1.45 }}
                              >
                                {step.musicArchiveNote}
                              </span>
                            </a>
                          ) : null}
                        </div>
                      </>
                    )}

                    {/* Origins uses a full-width Ojai scene below the timeline rule */}
                    {step.illustrationKey === 'origins' && (
                      <div
                        className="absolute hidden md:flex justify-center pointer-events-none"
                        style={{
                          top: 'calc(50vh + 1.3rem)',
                          left: '50%',
                          transform: `translate(calc(-50% + ${textTransformX * 0.45}px), 0)`,
                          width: '100%',
                        }}
                      >
                        <OjaiOriginsSceneWide isActive={distanceFromCenter < 0.72} />
                      </div>
                    )}

                    {/* Illustration — opposite side of rule from text */}
                    {step.illustrationKey && step.illustrationKey !== 'origins' && (
                      <div
                        className="absolute hidden md:block"
                        style={{
                          ...(placeAboveRule
                            ? { top: 'calc(50vh - 2px)', left: `calc(10% + ${textTransformX}px)` }
                            : { bottom: 'calc(50vh - 2px)', left: `calc(10% + ${textTransformX}px)` }
                          ),
                        }}
                      >
                        <AboutIllustration
                          stepKey={step.illustrationKey}
                          isActive={distanceFromCenter < 0.6}
                          flipUp={!placeAboveRule}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div
            className="absolute bottom-10 left-0 right-0 flex justify-center gap-2.5 pointer-events-none z-50 transition-opacity duration-300"
            style={{ opacity: horizontalProgress > 0.95 ? 0 : 1 }}
          >
            {steps.map((_, idx) => (
              <div
                key={idx}
                className="rounded-full transition-all duration-500"
                style={{
                  height: '4px',
                  width: idx === activeIndex ? '24px' : '4px',
                  backgroundColor: idx === activeIndex ? '#F9D976' : 'rgba(249,217,118,0.18)',
                }}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <div
            className="absolute top-8 right-8 pointer-events-none transition-opacity duration-300"
            style={{ opacity: horizontalProgress > 0.95 ? 0 : 0.35 }}
          >
            <span
              className="text-[#FEF5EC]/50 text-[10px] tracking-widest uppercase"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Scroll to read
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
