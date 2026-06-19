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

// ─── Citrus cross-section — ORIGINS ────────────────────────────────────────
function CitrusContent() {
  const segments = 8;
  return (
    <g>
      {Array.from({ length: segments }).map((_, i) => {
        const a = (i * (360 / segments) * Math.PI) / 180;
        return (
          <motion.line key={i}
            x1={Math.cos(a) * 5} y1={Math.sin(a) * 5}
            x2={Math.cos(a) * 33} y2={Math.sin(a) * 33}
            stroke={LINEN} strokeWidth={0.6} strokeOpacity={0.5}
            {...draw(0.5 + i * 0.07)}
          />
        );
      })}
      {/* Segment arc rings */}
      <motion.circle cx="0" cy="0" r="20"
        fill="none" stroke={LINEN} strokeWidth={0.5} strokeOpacity={0.3}
        {...draw(0.8, 1.2)}
      />
      <motion.circle cx="0" cy="0" r="33"
        fill="none" stroke={LINEN} strokeWidth={0.5} strokeOpacity={0.25}
        {...draw(0.9, 1.2)}
      />
      {/* Center seed cluster */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <motion.ellipse key={i}
            cx={Math.cos(a) * 3.5} cy={Math.sin(a) * 3.5}
            rx="1.8" ry="2.8"
            transform={`rotate(${deg}, ${Math.cos(a) * 3.5}, ${Math.sin(a) * 3.5})`}
            fill={GOLD} fillOpacity={0.6}
            {...draw(1.2 + i * 0.08, 0.4)}
          />
        );
      })}
    </g>
  );
}

// ─── Music staff — EDUCATION ────────────────────────────────────────────────
function MusicContent() {
  const staffLines = [-16, -8, 0, 8, 16];
  // Notehead sits on the 4th line (y=8), stem goes UP from its right edge
  const noteX = 6;   // horizontal centre of notehead
  const noteY = 10;  // vertical centre of notehead (below middle)
  const stemX = noteX + 6;  // right edge of notehead
  const stemTop = noteY - 32; // top of stem (upward in SVG = negative y)
  return (
    <g>
      {staffLines.map((y, i) => (
        <motion.line key={i}
          x1="-30" y1={y} x2="30" y2={y}
          stroke={LINEN} strokeWidth={0.55} strokeOpacity={0.45}
          {...draw(0.4 + i * 0.08)}
        />
      ))}

      {/* Notehead — filled ellipse, standard counter-clockwise tilt */}
      <motion.ellipse
        cx={noteX} cy={noteY}
        rx="7" ry="5"
        transform={`rotate(-20, ${noteX}, ${noteY})`}
        fill={GOLD} fillOpacity={0.85}
        {...draw(0.9, 0.5)}
      />

      {/* Stem — rises from right edge of notehead straight up */}
      <motion.line
        x1={stemX} y1={noteY - 2}
        x2={stemX} y2={stemTop}
        stroke={GOLD} strokeWidth={0.9} strokeLinecap="round"
        {...draw(1.0, 0.6)}
      />

      {/* Flag — curls from top of stem to the right, then sweeps down */}
      <motion.path
        d={`M ${stemX},${stemTop} C ${stemX + 14},${stemTop + 6} ${stemX + 16},${stemTop + 16} ${stemX + 8},${stemTop + 22}`}
        fill="none" stroke={GOLD} strokeWidth={0.9} strokeLinecap="round"
        {...draw(1.3, 0.6)}
      />

      {/* Two dots — left side of the staff, between lines 2 & 3 and 3 & 4 */}
      <motion.circle cx="-22" cy="-4" r="1.6" fill={LINEN} fillOpacity={0.55} {...draw(1.5, 0.3)}/>
      <motion.circle cx="-22" cy="4"  r="1.6" fill={LINEN} fillOpacity={0.55} {...draw(1.55, 0.3)}/>
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
      {/* Pivot cap */}
      <motion.circle cx="0" cy="-20" r="3.5"
        fill="none" stroke={LINEN} strokeWidth={0.8} strokeOpacity={0.7}
        {...draw(0.5, 0.5)}
      />
      <motion.circle cx="0" cy="-20" r="1.5"
        fill={GOLD} fillOpacity={0.7}
        {...draw(0.7, 0.4)}
      />
      {/* Hinge line */}
      <motion.line x1="-6" y1="-16" x2="6" y2="-16"
        stroke={LINEN} strokeWidth={0.6} strokeOpacity={0.5}
        {...draw(0.8, 0.4)}
      />
      {/* Left leg — ruler side */}
      <motion.line x1="-2" y1="-16" x2="-18" y2="26"
        stroke={LINEN} strokeWidth={0.9} strokeLinecap="round" strokeOpacity={0.8}
        {...draw(0.9, 0.7)}
      />
      {/* Right leg — pencil side */}
      <motion.line x1="2" y1="-16" x2="16" y2="22"
        stroke={LINEN} strokeWidth={0.9} strokeLinecap="round" strokeOpacity={0.8}
        {...draw(1.0, 0.7)}
      />
      {/* Pencil tip */}
      <motion.path d="M 13,21 L 16,27 L 19,21"
        fill="none" stroke={GOLD} strokeWidth={0.7} strokeLinecap="round" strokeLinejoin="round"
        {...draw(1.4, 0.4)}
      />
      {/* Arc being drawn */}
      <motion.path d="M -20,27 A 33,33 0 0 1 16,27"
        fill="none" stroke={GOLD} strokeWidth={0.7}
        strokeDasharray="2 2"
        {...draw(1.5, 0.8)}
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
  const rays = Array.from({ length: 16 });
  return (
    <g>
      {rays.map((_, i) => {
        const a = (i * 22.5 * Math.PI) / 180;
        const isLong = i % 2 === 0;
        const r1 = 13;
        const r2 = isLong ? 32 : 22;
        const w = isLong ? 2.5 : 1.2;  // ray base width for trapezoid
        // Tapered ray as a thin quad
        const cos = Math.cos(a), sin = Math.sin(a);
        const perp = { x: -sin, y: cos };
        const x1a = cos * r1 + perp.x * w, y1a = sin * r1 + perp.y * w;
        const x1b = cos * r1 - perp.x * w, y1b = sin * r1 - perp.y * w;
        const x2 = cos * r2, y2 = sin * r2;
        return (
          <motion.polygon key={i}
            points={`${x1a},${y1a} ${x1b},${y1b} ${x2},${y2}`}
            fill={isLong ? GOLD : LINEN}
            fillOpacity={isLong ? 0.55 : 0.25}
            stroke="none"
            {...draw(0.4 + i * 0.04, 0.5)}
          />
        );
      })}
      {/* Outer ring */}
      <motion.circle cx="0" cy="0" r="10"
        fill={GOLD} fillOpacity={0.2} stroke={GOLD} strokeWidth={0.7}
        {...draw(1.3, 0.5)}
      />
      {/* Center fill */}
      <motion.circle cx="0" cy="0" r="6"
        fill={GOLD} fillOpacity={0.7}
        {...draw(1.5, 0.4)}
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
