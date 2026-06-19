import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface LightboxAnnotation {
  x: number;
  y: number;
  label: string;
  dir?: 'left' | 'right';
}

interface Props {
  src: string;
  alt: string;
  annotations?: LightboxAnnotation[];
  onClose: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 8;
const ZOOM_STEP = 0.25;

function LightboxAnnotationDot({
  x, y, label, dir = 'right', index,
}: LightboxAnnotation & { index: number }) {
  const isRight = dir === 'right';
  const LINE_W = 110;

  return (
    <div className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y}%` }}>
      <motion.div
        className="absolute rounded-full border border-[#F9D976]/40"
        style={{ width: 16, height: 16, transform: 'translate(-50%, -50%)' }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
      />
      <div
        className="absolute rounded-full bg-[#F9D976]"
        style={{
          width: 7, height: 7,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px rgba(249,217,118,0.8)',
        }}
      />
      <div
        className="absolute"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          width: LINE_W,
          height: 1,
          background: '#F9D976',
          opacity: 0.75,
          ...(isRight ? { left: 10 } : { right: 10 }),
        }}
      />
      <div
        className="absolute uppercase"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          ...(isRight ? { left: LINE_W + 20 } : { right: LINE_W + 20 }),
          fontFamily: '"Josefin Sans", sans-serif',
          fontSize: '9px',
          letterSpacing: '0.18em',
          fontWeight: 200,
          color: 'rgba(254,245,236,0.92)',
          background: 'rgba(5,14,96,0.92)',
          border: '1px solid rgba(254,245,236,0.2)',
          padding: '6px 8px',
          maxWidth: '190px',
          lineHeight: 1.35,
          whiteSpace: 'normal',
          textWrap: 'balance',
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function ImageLightbox({ src, alt, annotations, onClose }: Props) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [maxNativeScale, setMaxNativeScale] = useState(MAX_SCALE);

  // Use refs for values needed inside event handlers to avoid stale closures
  const scaleRef = useRef(scale);
  const offsetRef = useRef(offset);
  scaleRef.current = scale;
  offsetRef.current = offset;

  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Recompute max zoom for each image so we don't upscale beyond native detail.
  useEffect(() => {
    setMaxNativeScale(MAX_SCALE);
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [src]);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── Wheel zoom — MUST be non-passive to call preventDefault ──────────────
  // React's synthetic onWheel is passive in React 17+, so we attach directly.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - rect.left - rect.width / 2;
      const cursorY = e.clientY - rect.top - rect.height / 2;

      setScale(prev => {
        const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
        const next = Math.min(maxNativeScale, Math.max(MIN_SCALE,
          Math.round((prev + delta) * 100) / 100
        ));
        const ratio = next / prev;
        setOffset(o => ({
          x: o.x * ratio + cursorX * (1 - ratio),
          y: o.y * ratio + cursorY * (1 - ratio),
        }));
        return next;
      });
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [maxNativeScale]);

  // ── Drag to pan ────────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX, y: e.clientY,
      ox: offsetRef.current.x, oy: offsetRef.current.y,
    };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStart.current) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.x),
      y: dragStart.current.oy + (e.clientY - dragStart.current.y),
    });
  }, []);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  const resetZoom = () => { setScale(1); setOffset({ x: 0, y: 0 }); };
  const zoomIn    = () => setScale(s => Math.min(maxNativeScale, Math.round((s + ZOOM_STEP) * 100) / 100));
  const zoomOut   = () => setScale(s => Math.max(MIN_SCALE, Math.round((s - ZOOM_STEP) * 100) / 100));
  const zoomPct   = Math.round(scale * 100);
  const hasAnnotations = !!annotations?.length;

  const handleImageLoad = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;

    // rendered size at scale=1 (already constrained by maxWidth/maxHeight)
    const renderedW = img.clientWidth || 1;
    const renderedH = img.clientHeight || 1;
    const nativeW = img.naturalWidth || renderedW;
    const nativeH = img.naturalHeight || renderedH;

    const nativeScaleW = nativeW / renderedW;
    const nativeScaleH = nativeH / renderedH;
    const computedMax = Math.max(1, Math.min(MAX_SCALE, Math.min(nativeScaleW, nativeScaleH)));

    setMaxNativeScale(computedMax);
    setScale(s => Math.min(s, computedMax));
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: 'rgba(3,6,40,0.96)' }}
      >
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Zoom/pan area — receives the imperative wheel listener */}
        <div
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'zoom-in' }}
        >
          {/*
            Entry animation wrapper — motion.div ONLY for fade/scale-in.
            Never set `transform` on this element; Motion owns it.
          */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/*
              Zoom/pan wrapper — plain div so React's style updates
              are never overridden by Motion's animation engine.
            */}
            <div
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                position: 'relative',
                display: 'inline-block',
                lineHeight: 0,
                willChange: 'transform',
              }}
            >
              <img
                ref={imageRef}
                src={src}
                alt={alt}
                draggable={false}
                onLoad={handleImageLoad}
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  width: 'auto',
                  height: 'auto',
                  display: 'block',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />

              {/* Annotations move with the image */}
              {hasAnnotations && showAnnotations && (
                <div className="absolute inset-0 pointer-events-none">
                  {annotations!.map((a, i) => (
                    <LightboxAnnotationDot key={i} {...a} index={i} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Controls bar */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-2 rounded-sm"
          style={{
            background: 'rgba(5,14,96,0.85)',
            border: '1px solid rgba(254,245,236,0.12)',
            backdropFilter: 'blur(8px)',
            zIndex: 10,
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={zoomOut} disabled={scale <= MIN_SCALE}
            className="w-7 h-7 flex items-center justify-center"
            style={{ cursor: 'none', color: '#FEF5EC', opacity: scale <= MIN_SCALE ? 0.25 : 0.7 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>

          <button
            onClick={resetZoom}
            className="px-2.5 h-7 flex items-center justify-center"
            style={{
              cursor: 'none',
              fontFamily: '"Josefin Sans", sans-serif',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: scale === 1 ? 'rgba(254,245,236,0.35)' : '#F9D976',
              fontWeight: 200,
              minWidth: '3rem',
            }}
          >
            {zoomPct}%
          </button>

          <button
            onClick={zoomIn} disabled={scale >= maxNativeScale}
            className="w-7 h-7 flex items-center justify-center"
            style={{ cursor: 'none', color: '#FEF5EC', opacity: scale >= maxNativeScale ? 0.25 : 0.7 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>

          {hasAnnotations && (
            <>
              <div className="w-px h-4 mx-1" style={{ background: 'rgba(254,245,236,0.15)' }} />
              <button
                onClick={() => setShowAnnotations(v => !v)}
                className="flex items-center gap-1.5 px-2 h-7"
                style={{ cursor: 'none' }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full border transition-colors duration-200"
                  style={{
                    borderColor: showAnnotations ? '#F9D976' : 'rgba(254,245,236,0.35)',
                    backgroundColor: showAnnotations ? '#F9D976' : 'transparent',
                  }}
                />
                <span style={{
                  fontFamily: '"Josefin Sans", sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  color: showAnnotations ? '#F9D976' : 'rgba(254,245,236,0.35)',
                  fontWeight: 200,
                }}>
                  LABELS
                </span>
              </button>
            </>
          )}

          <div className="w-px h-4 mx-1" style={{ background: 'rgba(254,245,236,0.15)' }} />

          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center"
            style={{ cursor: 'none', color: '#FEF5EC', opacity: 0.6 }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Usage hint */}
        {scale === 1 && (
          <motion.div
            className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontFamily: '"Josefin Sans", sans-serif',
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: 'rgba(254,245,236,0.35)',
              fontWeight: 200,
            }}
          >
            SCROLL TO ZOOM · DRAG TO PAN · ESC TO CLOSE
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
