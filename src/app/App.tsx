import React, { useState, useEffect, useRef } from 'react';
import { track } from '@vercel/analytics';
import { Analytics } from '@vercel/analytics/react';
import { ThreeScene } from './components/ThreeScene';
import { InfoPanel } from './components/InfoPanel';
import { IntroSection } from './components/IntroSection';
import { AudioManager } from './components/AudioManager';
import { ContactForm } from './components/ContactForm';
import { CustomCursor } from './components/CustomCursor';
import { AudioToggle } from './components/AudioToggle';
import { MadeInCalifornia } from './components/MadeInCalifornia';
import { AboutMeSection } from './components/AboutMeSection';
import { PaperTexture } from './components/PaperTexture';
import { SideNav } from './components/SideNav';
import { CaseStudies } from './components/CaseStudies';

const SCENE_SECTION_VH = 800;

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const trackedScrollMilestonesRef = useRef<Set<number>>(new Set());
  const engagementMsRef = useRef(0);
  const engagementStartedAtRef = useRef<number | null>(null);
  const engagementFlushedRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // Progress should be tied to the top "scene" section only (800vh),
      // not the full document including Case Studies.
      const sceneSectionPx = (SCENE_SECTION_VH / 100) * window.innerHeight;
      const sceneScrollable = Math.max(sceneSectionPx - window.innerHeight, 1);
      const scrolled = Math.min(Math.max(window.scrollY / sceneScrollable, 0), 1);
      setScrollProgress(Math.min(scrolled, 1));

      if (scrolled > 0.02) {
        setShowIntro(false);
      } else {
        setShowIntro(true);
      }

      const doc = document.documentElement;
      const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const depth = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
      const milestones = [0.25, 0.5, 0.75, 1];

      milestones.forEach((milestone) => {
        if (depth >= milestone && !trackedScrollMilestonesRef.current.has(milestone)) {
          trackedScrollMilestonesRef.current.add(milestone);
          track('scroll_depth', {
            percent: Math.round(milestone * 100),
            page: 'portfolio_home',
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const flushEngagement = (reason: 'hidden' | 'pagehide' | 'beforeunload' | 'unmount') => {
      if (engagementFlushedRef.current) return;

      if (engagementStartedAtRef.current !== null) {
        engagementMsRef.current += Date.now() - engagementStartedAtRef.current;
        engagementStartedAtRef.current = null;
      }

      const seconds = Math.floor(engagementMsRef.current / 1000);
      if (seconds < 10) return;

      engagementFlushedRef.current = true;
      track('engagement_time', {
        seconds,
        reason,
        page: 'portfolio_home',
      });
    };

    const startEngagement = () => {
      if (engagementStartedAtRef.current !== null) return;
      engagementStartedAtRef.current = Date.now();
    };

    const pauseEngagement = () => {
      if (engagementStartedAtRef.current === null) return;
      engagementMsRef.current += Date.now() - engagementStartedAtRef.current;
      engagementStartedAtRef.current = null;
    };

    if (document.visibilityState === 'visible') startEngagement();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        startEngagement();
      } else {
        pauseEngagement();
        flushEngagement('hidden');
      }
    };

    const handlePageHide = () => flushEngagement('pagehide');
    const handleBeforeUnload = () => flushEngagement('beforeunload');

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      pauseEngagement();
      flushEngagement('unmount');
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Show the About Me section right after the intro
  const showAbout = scrollProgress > 0.02 && scrollProgress < 0.55;
  
  // The 3D scene only starts moving forward after the About Me section is done
  const threeProgress = scrollProgress < 0.55 ? 0 : (scrollProgress - 0.55) / 0.45;

  return (
    <div className="relative font-sans" style={{ backgroundColor: '#050e60' }}>
      <CustomCursor />
      <MadeInCalifornia />
      <PaperTexture />
      {/* Edge vignette — darkens corners like old newsprint */}
      <div
        className="fixed inset-0 pointer-events-none z-[7]"
        style={{
          background: 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 45%, rgba(2,4,12,0.7) 100%)',
        }}
      />
      <div style={{ height: `${SCENE_SECTION_VH}vh` }}>
        <ThreeScene
          scrollProgress={threeProgress}
          onNodeClick={setSelectedNode}
          selectedNode={selectedNode}
        />

        <AudioManager activeNode={selectedNode} isMuted={isMuted} />

        <IntroSection isVisible={showIntro && !showAbout} />

        <AudioToggle isMuted={isMuted} onToggle={() => setIsMuted(!isMuted)} />
        <SideNav scrollProgress={scrollProgress} />

        {selectedNode === 'contact' ? (
          <ContactForm 
            isOpen={true} 
            onClose={() => setSelectedNode(null)} 
          />
        ) : (
          <InfoPanel
            nodeId={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
        
        <AboutMeSection isVisible={showAbout} scrollProgress={scrollProgress} />
      </div>

      {/* Case studies — normal document flow below the scroll-driven section */}
      <CaseStudies />
      <Analytics />
    </div>
  );
}