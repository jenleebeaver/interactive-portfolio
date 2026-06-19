import { motion } from 'motion/react';

export function MadeInCalifornia() {
  const color = "#F9D976";
  const rays = Array.from({ length: 16 });

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none flex items-center justify-center">
      <div className="w-12 h-12 relative flex items-center justify-center">
        {/* Spinning Outer Badge */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full absolute inset-0"
        >
          {/* Outer track */}
          <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="1" opacity="0.6" />
          <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="1.5" strokeDasharray="2 4" />
          
          {/* Curved Text Path */}
          <path
            id="curve"
            d="M 50, 50 m -32, 0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"
            fill="transparent"
          />
          <text fill={color} fontSize="9" letterSpacing="0.1em" style={{ fontFamily: '"Old Standard TT", serif' }}>
            <textPath href="#curve" startOffset="0%" textLength="201" lengthAdjust="spacing">
              MADE IN CALIFORNIA • 
            </textPath>
          </text>

          {/* Inner ring */}
          <circle cx="50" cy="50" r="20" stroke={color} strokeWidth="1" />
          
          {/* Sunburst Rays */}
          <g stroke={color} strokeWidth="1.5" strokeLinecap="round">
            {rays.map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="23"
                x2="50"
                y2="28"
                transform={`rotate(${i * (360 / rays.length)} 50 50)`}
              />
            ))}
          </g>
        </motion.svg>

        {/* Static Literal Orange Center */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full absolute inset-0"
        >
          <defs>
            <radialGradient id="orangeGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFC107" />
              <stop offset="40%" stopColor="#FF9800" />
              <stop offset="100%" stopColor="#E65100" />
            </radialGradient>
          </defs>

          {/* Orange Body */}
          <circle cx="50" cy="50" r="9" fill="url(#orangeGrad)" />
          
          {/* Dimples / Texture */}
          <g fill="#5C1A00" opacity="0.25">
            <circle cx="48" cy="46" r="0.4" />
            <circle cx="53" cy="48" r="0.5" />
            <circle cx="46" cy="51" r="0.5" />
            <circle cx="51" cy="54" r="0.4" />
            <circle cx="55" cy="51" r="0.4" />
            <circle cx="49" cy="50" r="0.4" />
            <circle cx="52" cy="44" r="0.3" />
            <circle cx="45" cy="48" r="0.3" />
          </g>

          {/* Stem */}
          <path
            d="M 50 41.5 Q 49 39 50 37"
            stroke="#4A2F24"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Leaf */}
          <path
            d="M 50 39.5 Q 56 34 58 38 Q 54 42 50 39.5 Z"
            fill="#4CAF50"
          />
          {/* Leaf Vein */}
          <path
            d="M 50 39.5 Q 54 38 56.5 38"
            stroke="#2E7D32"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
