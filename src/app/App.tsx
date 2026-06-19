import React, { useState, useEffect } from 'react';
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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    </div>
  );
}