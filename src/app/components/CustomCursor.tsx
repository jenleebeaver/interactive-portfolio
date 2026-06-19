import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    let animationFrameId: number;
    let currentX = -100;
    let currentY = -100;

    const updatePosition = () => {
      if (cursorRef.current) {
        // Update translation instantly without transitions to avoid lag
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      if (scaleRef.current) {
        // Update scale based on hover state
        scaleRef.current.style.transform = `scale(${isHoveringRef.current ? 1.5 : 1})`;
      }
      animationFrameId = 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      currentX = e.clientX;
      currentY = e.clientY;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updatePosition);
      }
    };

    const updateHoverState = (hovering: boolean) => {
      if (isHoveringRef.current !== hovering) {
        isHoveringRef.current = hovering;
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(updatePosition);
        }
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName?.toLowerCase() === 'a' || 
        target.tagName?.toLowerCase() === 'button' ||
        target.tagName?.toLowerCase() === 'input' ||
        target.tagName?.toLowerCase() === 'textarea' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        updateHoverState(true);
      } else {
        updateHoverState(false);
      }
    };

    const handle3DHoverStart = () => updateHoverState(true);
    const handle3DHoverEnd = () => updateHoverState(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('3d-hover-start', handle3DHoverStart);
    window.addEventListener('3d-hover-end', handle3DHoverEnd);

    // Add a global CSS rule to hide the default cursor everywhere, 
    // overriding buttons, links, etc. that might have 'cursor: pointer'
    const style = document.createElement('style');
    style.id = 'hide-default-cursor';
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('3d-hover-start', handle3DHoverStart);
      window.removeEventListener('3d-hover-end', handle3DHoverEnd);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      const styleEl = document.getElementById('hide-default-cursor');
      if (styleEl) styleEl.remove();
    };
  }, []);

  const rays = Array.from({ length: 24 });
  const color = "#F9D976"; // Complementary golden yellow

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
      style={{
        transform: `translate3d(-100px, -100px, 0) translate(-50%, -50%)`,
      }}
    >
      <div 
        ref={scaleRef}
        className="flex items-center justify-center transition-transform duration-200 ease-out will-change-transform"
        style={{ transform: 'scale(1)' }}
      >
        <div className="animate-spin flex items-center justify-center" style={{ animationDuration: '10s' }}>
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer ring */}
          <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="1.5" />
          
          {/* Dashed track */}
          <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="2.5" strokeDasharray="3 4" />
          
          {/* Inner ring */}
          <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="1.5" />
          
          {/* Central sun body - solid circle to match the graphic's center focus */}
          <circle cx="50" cy="50" r="16" fill={color} />
          
          {/* Radiating lines (sunburst) */}
          <g stroke={color} strokeWidth="1.5" strokeLinecap="round">
            {rays.map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="18"
                x2="50"
                y2="38"
                transform={`rotate(${i * (360 / rays.length)} 50 50)`}
              />
            ))}
          </g>
        </svg>
      </div>
      </div>
    </div>
  );
}