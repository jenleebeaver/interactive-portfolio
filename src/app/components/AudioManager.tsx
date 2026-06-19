import { useEffect, useRef, useState } from 'react';

interface AudioManagerProps {
  activeNode: string | null;
  isMuted: boolean;
}

// Simple ambient note frequencies mapped to each skill area (G Major Pentatonic scale for a happy, harmonious, trustful feel)
const nodeFrequencies: Record<string, number[]> = {
  frontend: [196.00, 246.94], // G3, B3
  product: [220.00, 293.66], // A3, D4
  music: [246.94, 329.63], // B3, E4
  education: [293.66, 392.00], // D4, G4
  media: [329.63, 440.00], // E4, A4
  analytics: [392.00, 493.88], // G4, B4
  api: [440.00, 587.33], // A4, D5
  ai: [493.88, 659.25], // B4, E5
};

export function AudioManager({ activeNode, isMuted }: AudioManagerProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Initialize Web Audio API on first interaction
  useEffect(() => {
    const startAudio = () => {
      if (!audioContextRef.current) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;
        
        // Create master gain for muting
        masterGainRef.current = ctx.createGain();
        masterGainRef.current.connect(ctx.destination);
      }
      
      if (audioContextRef.current.state === 'suspended' && !isMuted) {
        audioContextRef.current.resume();
      }

      if (!hasStarted) {
        setHasStarted(true);
      }
    };

    window.addEventListener('click', startAudio, { once: true });
    window.addEventListener('scroll', startAudio, { once: true });
    window.addEventListener('touchstart', startAudio, { once: true });
    
    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('scroll', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
  }, [hasStarted, isMuted]);

  // Handle Muting
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      // Use smooth transition for muting
      const time = audioContextRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(time);
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, time);
      masterGainRef.current.gain.linearRampToValueAtTime(isMuted ? 0 : 1, time + 0.2);
    }
  }, [isMuted]);

  // Ambient Background Drone Effect
  useEffect(() => {
    if (!hasStarted || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    
    // Dark rich cello sounds (G2 and D3) for an Irish folk drone feel
    const rootFreq = 98.00; // G2 (Cello G string)
    const fifthFreq = 146.83; // D3 (Cello D string)
    
    // Helper to create a bowed string/cello-like drone
    const createStringDrone = (freq: number, isSub: boolean = false) => {
      const mainOsc = ctx.createOscillator();
      const detuneOsc = ctx.createOscillator();
      const bodyOsc = ctx.createOscillator();
      
      // Sawtooth gives the bowed string texture, triangle gives the warm body
      mainOsc.type = 'sawtooth';
      detuneOsc.type = 'sawtooth';
      bodyOsc.type = 'triangle';
      
      mainOsc.frequency.value = freq;
      detuneOsc.frequency.value = freq;
      detuneOsc.detune.value = 10; // Slight detune for chorus/ensemble thickness
      bodyOsc.frequency.value = isSub ? freq / 2 : freq;
      
      // Vibrato (LFO) typical of cello playing
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.type = 'sine';
      vibrato.frequency.value = 4.5; // Slow, rich vibrato rate
      vibratoGain.gain.value = 6; // Pitch variation depth
      
      vibrato.connect(vibratoGain);
      vibratoGain.connect(mainOsc.detune);
      vibratoGain.connect(detuneOsc.detune);
      vibratoGain.connect(bodyOsc.detune);
      
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0;
      
      // Balance the oscillators
      const mainGain = ctx.createGain(); mainGain.gain.value = 0.4;
      const detuneGain = ctx.createGain(); detuneGain.gain.value = 0.3;
      const bodyGain = ctx.createGain(); bodyGain.gain.value = 0.8; // Warmer body
      
      mainOsc.connect(mainGain); mainGain.connect(gainNode);
      detuneOsc.connect(detuneGain); detuneGain.connect(gainNode);
      bodyOsc.connect(bodyGain); bodyGain.connect(gainNode);
      
      mainOsc.start();
      detuneOsc.start();
      bodyOsc.start();
      vibrato.start();
      
      return { 
        stop: () => {
          mainOsc.stop(); detuneOsc.stop(); bodyOsc.stop(); vibrato.stop();
        },
        gainNode 
      };
    };

    const rootDrone = createStringDrone(rootFreq, true); // Root gets a sub-octave for depth
    const fifthDrone = createStringDrone(fifthFreq);
    
    // Filter to make it sound "dark" and "rich" like a wooden body instrument
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300; // Low cutoff removes harsh sawtooth buzz, keeps warm cello tone
    filter.Q.value = 1.5; // Slight resonance for body
    
    rootDrone.gainNode.connect(filter);
    fifthDrone.gainNode.connect(filter);
    if (masterGainRef.current) {
      filter.connect(masterGainRef.current);
    }
    
    // Fade in gently over 5 seconds
    rootDrone.gainNode.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 5);
    fifthDrone.gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 5);
    
    // Create an LFO-like effect manually for slow bowing dynamics
    const lfoInterval = setInterval(() => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
        const time = audioContextRef.current.currentTime;
        
        // Swell in and out mimicking slow bow changes
        rootDrone.gainNode.gain.linearRampToValueAtTime(0.01, time + 4);
        rootDrone.gainNode.gain.linearRampToValueAtTime(0.02, time + 8);
        
        fifthDrone.gainNode.gain.linearRampToValueAtTime(0.005, time + 4);
        fifthDrone.gainNode.gain.linearRampToValueAtTime(0.012, time + 8);
        
        // Sweep filter slightly for timbral breathing
        filter.frequency.linearRampToValueAtTime(220, time + 4);
        filter.frequency.linearRampToValueAtTime(320, time + 8);
    }, 8000);

    return () => {
      clearInterval(lfoInterval);
      if (ctx.state !== 'closed') {
        const time = ctx.currentTime;
        rootDrone.gainNode.gain.linearRampToValueAtTime(0, time + 1);
        fifthDrone.gainNode.gain.linearRampToValueAtTime(0, time + 1);
        setTimeout(() => {
          try {
            rootDrone.stop();
            fifthDrone.stop();
          } catch(e) {}
        }, 1500);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!audioContextRef.current || !activeNode) return;

    const ctx = audioContextRef.current;
    const frequencies = nodeFrequencies[activeNode];

    // Clean up previous oscillators
    oscillatorsRef.current.forEach(osc => osc.stop());
    gainNodesRef.current.forEach(gain => gain.disconnect());
    oscillatorsRef.current = [];
    gainNodesRef.current = [];

    // Create new ambient tones for this node
    frequencies?.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;

      // Gentle fade in
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5);

      oscillator.connect(gainNode);
      if (masterGainRef.current) {
        gainNode.connect(masterGainRef.current);
      }

      oscillator.start();

      oscillatorsRef.current.push(oscillator);
      gainNodesRef.current.push(gainNode);

      // Fade out after 2 seconds
      setTimeout(() => {
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        setTimeout(() => {
          oscillator.stop();
          gainNode.disconnect();
        }, 500);
      }, 2000);
    });

    return () => {
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      gainNodesRef.current.forEach(gain => gain.disconnect());
    };
  }, [activeNode]);

  return null;
}
