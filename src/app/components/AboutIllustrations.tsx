import { motion } from 'motion/react';

const LINEN = '#FEF5EC';
const GOLD  = '#F9D976';
const HANG  = 72;   // length of hanging thread
const RO    = 44;   // outer ring radius
const RI    = 39;   // inner ring radius

// Shared draw-on transition factory
const draw = (delay = 0, duration = 1.4) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration, delay, ease: 'easeOut' }, opacity: { duration: 0.3, delay } },
});

// ─── Compass rose — MY STORY ────────────────────────────────────────────────
function CompassContent() {
  const ticks = Array.from({ length: 8 });
  return (
    <g>
      {ticks.map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        const isDiag = i % 2 === 1;
        const r1 = isDiag ? 12 : 8;
        const r2 = isDiag ? 24 : RI - 6;
        return (
          <motion.line
            key={i}
            x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
            x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
            stroke={isDiag ? LINEN : GOLD}
            strokeWidth={isDiag ? 0.5 : 0.7}
            strokeOpacity={isDiag ? 0.4 : 0.8}
            {...draw(0.6 + i * 0.06)}
          />
        );
      })}
      {/* Compass diamond needle */}
      <motion.path
        d="M 0,-28 L 5,0 L 0,6 L -5,0 Z"
        fill={GOLD} fillOpacity={0.7}
        stroke={GOLD} strokeWidth={0.4}
        {...draw(1.2, 0.6)}
      />
      <motion.path
        d="M 0,28 L 5,0 L 0,-6 L -5,0 Z"
        fill={LINEN} fillOpacity={0.3}
        stroke={LINEN} strokeWidth={0.4}
        {...draw(1.3, 0.6)}
      />
      {/* Center pivot */}
      <motion.circle cx="0" cy="0" r="2.5"
        fill={GOLD} stroke={LINEN} strokeWidth={0.4}
        {...draw(1.5, 0.4)}
      />
      {/* N label */}
      <motion.text x="0" y="-33" textAnchor="middle"
        fill={LINEN} fontSize="6" fontFamily="Josefin Sans, sans-serif"
        opacity={0} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.4 }}
      >N</motion.text>
    </g>
  );
}

// ─── Ojai valley + California poppies — ORIGINS ────────────────────────────
function CitrusContent() {
  return (
    <g>
      {/* Sun over Ojai ridge */}
      <motion.circle
        cx="0"
        cy="-24"
        r="6"
        fill={GOLD}
        fillOpacity={0.18}
        stroke={GOLD}
        strokeWidth={0.45}
        {...draw(0.35, 0.7)}
      />

      {/* Valley layers */}
      <motion.path
        d="M -34,5 C -25,-4 -16,-7 -8,-4 C -1,-1 7,-2 15,-7 C 22,-11 28,-10 34,-5"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.75}
        strokeOpacity={0.65}
        strokeLinecap="round"
        {...draw(0.45, 1.2)}
      />
      <motion.path
        d="M -34,14 C -27,9 -19,7 -12,10 C -4,13 3,12 11,8 C 20,4 27,6 34,11"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.65}
        strokeOpacity={0.45}
        strokeLinecap="round"
        {...draw(0.6, 1.2)}
      />

      {/* Ground line */}
      <motion.path
        d="M -36,23 C -22,21 -8,22 6,22 C 18,22 28,22 36,23"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.6}
        strokeOpacity={0.35}
        strokeLinecap="round"
        {...draw(0.85, 1.1)}
      />

      {/* Poppy cluster with subtle breeze sway */}
      <motion.g
        animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        style={{ transformOrigin: '0px 24px' }}
      >
        <motion.path
          d="M -12,23 C -11,16 -11,12 -8,8"
          fill="none"
          stroke={LINEN}
          strokeWidth={0.7}
          strokeOpacity={0.7}
          strokeLinecap="round"
          {...draw(1.0, 0.9)}
        />
        <motion.path
          d="M -2,23 C -1,17 1,13 3,10"
          fill="none"
          stroke={LINEN}
          strokeWidth={0.7}
          strokeOpacity={0.7}
          strokeLinecap="round"
          {...draw(1.08, 0.9)}
        />
        <motion.path
          d="M 9,23 C 10,17 12,14 15,12"
          fill="none"
          stroke={LINEN}
          strokeWidth={0.7}
          strokeOpacity={0.7}
          strokeLinecap="round"
          {...draw(1.16, 0.9)}
        />

        {/* blossoms */}
        <motion.path
          d="M -10,7 C -13,6 -14,2 -11,0 C -8,-2 -4,-1 -4,3 C -4,6 -7,8 -10,7 Z"
          fill="none"
          stroke={LINEN}
          strokeWidth={0.62}
          strokeOpacity={0.72}
          strokeLinejoin="round"
          {...draw(1.28, 0.75)}
        />
        <motion.path
          d="M 2,9 C -1,8 -2,4 1,2 C 4,0 8,1 8,5 C 8,8 5,10 2,9 Z"
          fill="none"
          stroke={LINEN}
          strokeWidth={0.62}
          strokeOpacity={0.72}
          strokeLinejoin="round"
          {...draw(1.36, 0.75)}
        />
        <motion.path
          d="M 14,11 C 11,10 10,7 12,4 C 15,2 18,3 19,6 C 19,9 17,12 14,11 Z"
          fill="none"
          stroke={LINEN}
          strokeWidth={0.62}
          strokeOpacity={0.72}
          strokeLinejoin="round"
          {...draw(1.44, 0.75)}
        />
      </motion.g>
    </g>
  );
}

// ─── Music staff — EDUCATION ────────────────────────────────────────────────
function MusicContent() {
  const staffLines = [-14, -8, -2, 4, 10];
  return (
    <g>
      {/* music foundation */}
      {staffLines.map((y, i) => (
        <motion.line key={i}
          x1="-30" y1={y} x2="30" y2={y}
          stroke={LINEN} strokeWidth={0.55} strokeOpacity={0.4}
          {...draw(0.4 + i * 0.08)}
        />
      ))}

      {/* quarter note */}
      <motion.ellipse
        cx="5" cy="8"
        rx="6.8" ry="4.8"
        transform="rotate(-20 5 8)"
        fill={GOLD} fillOpacity={0.8}
        {...draw(0.9, 0.5)}
      />
      <motion.line
        x1="11" y1="6"
        x2="11" y2="-23"
        stroke={GOLD} strokeWidth={0.9} strokeLinecap="round"
        {...draw(1.0, 0.6)}
      />
      <motion.path
        d="M 11,-23 C 24,-19 25,-10 17,-5"
        fill="none" stroke={GOLD} strokeWidth={0.9} strokeLinecap="round"
        {...draw(1.3, 0.6)}
      />

      {/* bridge into software path */}
      <motion.path
        d="M -8,18 C -1,15 4,15 10,18 C 14,20 18,20 23,18"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.65}
        strokeOpacity={0.55}
        strokeLinecap="round"
        {...draw(1.55, 0.9)}
      />

      {/* code bracket motif: philosophy/music -> engineering */}
      <motion.path
        d="M -24,-21 C -20,-21 -19,-19 -19,-16 L -19,14 C -19,17 -20,19 -24,19"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.7}
        strokeOpacity={0.6}
        strokeLinecap="round"
        {...draw(1.35, 0.8)}
      />
      <motion.path
        d="M 24,-21 C 20,-21 19,-19 19,-16 L 19,14 C 19,17 20,19 24,19"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.7}
        strokeOpacity={0.6}
        strokeLinecap="round"
        {...draw(1.42, 0.8)}
      />

      {/* subtle cursor pulse */}
      <motion.line
        x1="-2" y1="19" x2="-2" y2="25"
        stroke={GOLD}
        strokeWidth={0.9}
        strokeLinecap="round"
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </g>
  );
}

// ─── Sound waves — PAST LIFE ────────────────────────────────────────────────
function SoundWaveContent() {
  const arcs = [10, 18, 26, 34];
  return (
    <g>
      {/* Left waves */}
      {arcs.map((r, i) => (
        <motion.path key={`l${i}`}
          d={`M ${-r * 0.6},-${r * 0.8} A ${r},${r} 0 0,0 ${-r * 0.6},${r * 0.8}`}
          fill="none" stroke={LINEN}
          strokeWidth={0.6} strokeOpacity={0.5 - i * 0.08}
          {...draw(0.4 + i * 0.1)}
        />
      ))}
      {/* Right waves */}
      {arcs.map((r, i) => (
        <motion.path key={`r${i}`}
          d={`M ${r * 0.6},-${r * 0.8} A ${r},${r} 0 0,1 ${r * 0.6},${r * 0.8}`}
          fill="none" stroke={LINEN}
          strokeWidth={0.6} strokeOpacity={0.5 - i * 0.08}
          {...draw(0.4 + i * 0.1)}
        />
      ))}
      {/* Center source bar */}
      <motion.line x1="0" y1="-8" x2="0" y2="8"
        stroke={GOLD} strokeWidth={1.2} strokeLinecap="round"
        {...draw(0.3, 0.4)}
      />
      {/* Guitar string suggestion — 3 short horizontal lines */}
      {[-5, 0, 5].map((y, i) => (
        <motion.line key={i}
          x1="-3" y1={y} x2="3" y2={y}
          stroke={GOLD} strokeWidth={0.5} strokeOpacity={0.6}
          {...draw(1.0 + i * 0.06, 0.3)}
        />
      ))}
    </g>
  );
}

// ─── Drafting compass — PIVOT ───────────────────────────────────────────────
function CompassToolContent() {
  return (
    <g>
      {/* old path: education/music */}
      <motion.path
        d="M -30,10 C -21,6 -15,2 -10,-5 C -6,-10 -3,-13 0,-15"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.72}
        strokeOpacity={0.55}
        strokeLinecap="round"
        {...draw(0.45, 1.0)}
      />

      {/* pivot node */}
      <motion.circle cx="0" cy="-15" r="3.5"
        fill="none" stroke={GOLD} strokeWidth={0.85} strokeOpacity={0.75}
        {...draw(1.0, 0.45)}
      />
      <motion.circle cx="0" cy="-15" r="1.4"
        fill={GOLD} fillOpacity={0.85}
        {...draw(1.12, 0.3)}
      />

      {/* new path: product/design + engineering */}
      <motion.path
        d="M 0,-15 C 6,-12 11,-8 16,-1 C 20,5 25,9 30,11"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.72}
        strokeOpacity={0.72}
        strokeLinecap="round"
        {...draw(1.2, 1.0)}
      />

      {/* ui grid to represent product work */}
      <motion.rect
        x="8" y="-28" width="18" height="12" rx="2"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.6}
        strokeOpacity={0.5}
        {...draw(1.45, 0.7)}
      />
      <motion.line x1="8" y1="-24" x2="26" y2="-24" stroke={LINEN} strokeWidth={0.5} strokeOpacity={0.45} {...draw(1.55, 0.45)} />
      <motion.line x1="14" y1="-16" x2="14" y2="-28" stroke={LINEN} strokeWidth={0.5} strokeOpacity={0.45} {...draw(1.62, 0.45)} />

      {/* code branch on right */}
      <motion.path
        d="M 13,18 C 18,18 20,16 20,12 C 20,8 18,6 13,6"
        fill="none"
        stroke={GOLD}
        strokeWidth={0.75}
        strokeOpacity={0.85}
        {...draw(1.55, 0.65)}
      />
      <motion.path
        d="M 27,18 C 22,18 20,16 20,12 C 20,8 22,6 27,6"
        fill="none"
        stroke={GOLD}
        strokeWidth={0.75}
        strokeOpacity={0.85}
        {...draw(1.65, 0.65)}
      />

      {/* gentle progress pulse on pivot */}
      <motion.circle
        cx="0"
        cy="-15"
        r="6"
        fill="none"
        stroke={GOLD}
        strokeWidth={0.45}
        strokeOpacity={0.35}
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </g>
  );
}

// ─── Network nodes — EXPERIENCE ─────────────────────────────────────────────
function NetworkContent() {
  const outerNodes = Array.from({ length: 6 }).map((_, i) => {
    const a = (i * 60 * Math.PI) / 180;
    return { x: Math.cos(a) * 24, y: Math.sin(a) * 24 };
  });
  return (
    <g>
      {/* Concentric data ring */}
      <motion.circle cx="0" cy="0" r="15"
        fill="none" stroke={LINEN} strokeWidth={0.4} strokeOpacity={0.2}
        {...draw(0.4, 1.0)}
      />
      {/* Spokes from center to outer nodes */}
      {outerNodes.map((n, i) => (
        <motion.line key={i}
          x1="0" y1="0" x2={n.x} y2={n.y}
          stroke={LINEN} strokeWidth={0.5} strokeOpacity={0.35}
          {...draw(0.5 + i * 0.07)}
        />
      ))}
      {/* Cross connections */}
      {outerNodes.map((n, i) => {
        const next = outerNodes[(i + 1) % outerNodes.length];
        return (
          <motion.line key={i}
            x1={n.x} y1={n.y} x2={next.x} y2={next.y}
            stroke={LINEN} strokeWidth={0.4} strokeOpacity={0.25}
            {...draw(0.9 + i * 0.06)}
          />
        );
      })}
      {/* Outer node circles */}
      {outerNodes.map((n, i) => (
        <motion.circle key={i}
          cx={n.x} cy={n.y} r="3"
          fill="none" stroke={LINEN} strokeWidth={0.7} strokeOpacity={0.6}
          {...draw(1.1 + i * 0.05, 0.4)}
        />
      ))}
      {/* Center hub */}
      <motion.circle cx="0" cy="0" r="5"
        fill={GOLD} fillOpacity={0.6} stroke={GOLD} strokeWidth={0.5}
        {...draw(1.5, 0.4)}
      />
    </g>
  );
}

// ─── Atom orbitals — CURRENT FOCUS ──────────────────────────────────────────
function AtomContent() {
  const orbits = [0, 60, 120];
  return (
    <g>
      {orbits.map((angle, i) => (
        <motion.ellipse key={i}
          cx="0" cy="0" rx="32" ry="11"
          fill="none" stroke={LINEN} strokeWidth={0.65} strokeOpacity={0.55}
          transform={`rotate(${angle})`}
          {...draw(0.5 + i * 0.2, 1.2)}
        />
      ))}
      {/* Electrons on each orbit */}
      {orbits.map((angle, i) => {
        const a = (angle * Math.PI) / 180;
        return (
          <motion.circle key={i}
            cx={Math.cos(a) * 32} cy={Math.sin(a) * 32} r="2.5"
            fill={GOLD} fillOpacity={0.8}
            {...draw(1.4 + i * 0.1, 0.4)}
          />
        );
      })}
      {/* Nucleus cluster */}
      <motion.circle cx="0" cy="0" r="6"
        fill={GOLD} fillOpacity={0.25} stroke={GOLD} strokeWidth={0.6}
        {...draw(0.4, 0.5)}
      />
      <motion.circle cx="-1.5" cy="-1" r="2.2" fill={GOLD} fillOpacity={0.7} {...draw(0.6, 0.3)}/>
      <motion.circle cx="2" cy="1" r="2" fill={LINEN} fillOpacity={0.5} {...draw(0.7, 0.3)}/>
      <motion.circle cx="-0.5" cy="2.5" r="1.8" fill={LINEN} fillOpacity={0.4} {...draw(0.75, 0.3)}/>
    </g>
  );
}

// ─── Art Deco sun — LIFE NOW ─────────────────────────────────────────────────
function SunContent() {
  return (
    <g>
      {/* ocean horizon (San Diego) */}
      <motion.path
        d="M -34,7 C -22,5 -10,6 2,7 C 12,8 23,8 34,7"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.75}
        strokeOpacity={0.45}
        strokeLinecap="round"
        {...draw(0.35, 1.0)}
      />
      <motion.path
        d="M -34,14 C -20,12 -8,13 4,14 C 15,15 24,15 34,14"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.55}
        strokeOpacity={0.3}
        strokeLinecap="round"
        {...draw(0.5, 1.0)}
      />

      {/* sunset */}
      <motion.path
        d="M -10,7 A 10,10 0 0 1 10,7"
        fill="none"
        stroke={GOLD}
        strokeWidth={0.8}
        strokeOpacity={0.8}
        strokeLinecap="round"
        {...draw(0.75, 0.9)}
      />
      <motion.circle
        cx="0"
        cy="4"
        r="2.8"
        fill={GOLD}
        fillOpacity={0.65}
        {...draw(1.0, 0.45)}
      />

      {/* dog-ear + profile hint (Miel) */}
      <motion.path
        d="M -19,-3 C -22,-9 -16,-13 -11,-9 C -8,-7 -8,-3 -9,1"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.72}
        strokeOpacity={0.72}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(1.05, 0.8)}
      />
      <motion.path
        d="M -9,1 C -5,6 -2,11 2,14 C 5,16 8,16 11,13"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.72}
        strokeOpacity={0.72}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(1.18, 0.85)}
      />
      <motion.circle cx="-11" cy="-1" r="0.8" fill={GOLD} fillOpacity={0.8} {...draw(1.55, 0.3)} />

      {/* breathing pulse to keep it alive */}
      <motion.path
        d="M 14,-6 C 18,-5 20,-1 20,3 C 20,7 18,10 14,11"
        fill="none"
        stroke={GOLD}
        strokeWidth={0.65}
        strokeOpacity={0.55}
        animate={{ pathLength: [0.3, 1, 0.3], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </g>
  );
}

// ─── Content map ─────────────────────────────────────────────────────────────
const illustrationMap: Record<string, React.ReactNode> = {
  intro:         <CompassContent />,
  origins:       <CitrusContent />,
  education:     <MusicContent />,
  'past-life':   <SoundWaveContent />,
  pivot:         <CompassToolContent />,
  experience:    <NetworkContent />,
  'curr-focus':  <AtomContent />,
  'life-now':    <SunContent />,
};

// ─── Public component ─────────────────────────────────────────────────────────
interface Props {
  stepKey: string;
  isActive: boolean;
  flipUp?: boolean; // when true the circle floats above the anchor instead of hanging below
}

export function AboutIllustration({ stepKey, isActive, flipUp = false }: Props) {
  const content = illustrationMap[stepKey];
  if (!content) return null;

  const totalH = HANG + RO * 2 + 6;
  const vbX = -(RO + 6);
  const vbW = (RO + 6) * 2;

  return (
    <motion.svg
      width={vbW}
      height={totalH}
      viewBox={`${vbX} 0 ${vbW} ${totalH}`}
      style={{ transform: flipUp ? 'scaleY(-1)' : 'none', overflow: 'visible' }}
    >
      {/* Hanging thread */}
      <motion.line
        x1="0" y1="0" x2="0" y2={HANG}
        stroke={LINEN} strokeWidth={0.5} strokeOpacity={0.3}
        initial={{ pathLength: 0 }}
        animate={isActive ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      />

      {/* Circle group — pendulum sway */}
      <motion.g
        transform={`translate(0, ${HANG + RO})`}
        animate={isActive
          ? { x: [0, 5, 0, -5, 0], y: [0, 0.5, 0, 0.5, 0] }
          : { x: 0, y: 0 }
        }
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        {/* Outer ring */}
        <motion.circle cx="0" cy="0" r={RO}
          fill="none" stroke={LINEN} strokeWidth={0.9} strokeOpacity={0.45}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isActive ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, delay: 0.3 }}
        />
        {/* Inner ring */}
        <motion.circle cx="0" cy="0" r={RI}
          fill="none" stroke={LINEN} strokeWidth={0.45} strokeOpacity={0.28}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isActive ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, delay: 0.5 }}
        />

        {/* Illustration content — only render when active for perf */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {content}
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}

interface OjaiOriginsSceneWideProps {
  isActive: boolean;
}

export function OjaiOriginsSceneWide({ isActive }: OjaiOriginsSceneWideProps) {
  const poppies = [
    { x: 118, y: 210, s: 1.05 },
    { x: 178, y: 218, s: 0.95 },
    { x: 248, y: 212, s: 1.15 },
    { x: 324, y: 220, s: 0.9 },
    { x: 398, y: 214, s: 1.08 },
    { x: 472, y: 222, s: 0.96 },
    { x: 548, y: 216, s: 1.02 },
    { x: 628, y: 224, s: 0.92 },
    { x: 706, y: 219, s: 1.0 },
    { x: 782, y: 213, s: 1.07 },
  ];

  return (
    <motion.svg
      width="min(86vw, 1000px)"
      height="clamp(180px, 30vh, 290px)"
      viewBox="0 0 900 290"
      style={{ overflow: 'visible' }}
      initial={{ opacity: 0, y: 8 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 4 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* golden hour sun */}
      <motion.circle
        cx="455"
        cy="112"
        r="44"
        fill={GOLD}
        fillOpacity={0.14}
        stroke={GOLD}
        strokeWidth={0.7}
        {...draw(0.18, 0.9)}
      />

      {/* valley layers */}
      <motion.path
        d="M 20,128 C 84,102 160,96 230,112 C 286,124 346,118 418,92 C 500,62 580,66 648,92 C 720,119 784,122 880,96"
        fill="none"
        stroke={LINEN}
        strokeWidth={1.15}
        strokeOpacity={0.66}
        strokeLinecap="round"
        {...draw(0.25, 1.4)}
      />
      <motion.path
        d="M 16,154 C 108,136 198,138 278,152 C 348,164 430,160 506,138 C 596,112 682,112 754,134 C 806,150 846,152 884,146"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.95}
        strokeOpacity={0.48}
        strokeLinecap="round"
        {...draw(0.45, 1.45)}
      />
      <motion.path
        d="M 10,182 C 120,170 226,174 324,186 C 410,196 498,197 596,186 C 690,174 786,172 890,182"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.72}
        strokeOpacity={0.33}
        strokeLinecap="round"
        {...draw(0.7, 1.5)}
      />

      {/* subtle river/path sweep through valley */}
      <motion.path
        d="M 302,191 C 350,184 402,181 446,188 C 490,196 530,210 574,228 C 606,240 636,248 680,254"
        fill="none"
        stroke={GOLD}
        strokeWidth={1.0}
        strokeOpacity={0.5}
        strokeLinecap="round"
        strokeDasharray="3 4"
        {...draw(1.0, 1.2)}
      />

      {/* field line */}
      <motion.path
        d="M 0,230 C 150,220 284,222 430,232 C 556,240 706,238 900,228"
        fill="none"
        stroke={LINEN}
        strokeWidth={0.85}
        strokeOpacity={0.34}
        strokeLinecap="round"
        {...draw(1.15, 1.2)}
      />

      {/* poppy field */}
      {poppies.map((p, i) => (
        <motion.g
          key={i}
          transform={`translate(${p.x}, ${p.y}) scale(${p.s})`}
          animate={isActive ? { rotate: [0, 1.6, 0, -1.4, 0] } : { rotate: 0 }}
          transition={{ duration: 7.8 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: 0.5 + i * 0.05 }}
          style={{ transformOrigin: '0px 10px' }}
        >
          <motion.path
            d="M 0,0 C 1,-16 4,-27 8,-36"
            fill="none"
            stroke={LINEN}
            strokeWidth={0.95}
            strokeOpacity={0.68}
            strokeLinecap="round"
            {...draw(1.25 + i * 0.04, 0.85)}
          />
          <motion.path
            d="M 8,-36 C 3,-39 2,-45 7,-48 C 11,-51 17,-50 18,-44 C 18,-39 13,-35 8,-36 Z"
            fill="none"
            stroke={LINEN}
            strokeWidth={0.82}
            strokeOpacity={0.78}
            strokeLinejoin="round"
            {...draw(1.45 + i * 0.04, 0.62)}
          />
          <motion.circle
            cx="9"
            cy="-43"
            r="1.7"
            fill={GOLD}
            fillOpacity={0.62}
            {...draw(1.6 + i * 0.04, 0.32)}
          />
          <motion.path
            d="M 3,-23 C -1,-26 -2,-30 1,-33"
            fill="none"
            stroke={LINEN}
            strokeWidth={0.62}
            strokeOpacity={0.42}
            strokeLinecap="round"
            {...draw(1.5 + i * 0.04, 0.55)}
          />
        </motion.g>
      ))}
    </motion.svg>
  );
}
