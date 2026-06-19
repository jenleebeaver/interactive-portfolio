import { motion } from 'motion/react';
import { VolumeX } from 'lucide-react';

interface AudioToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export function AudioToggle({ isMuted, onToggle }: AudioToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all pointer-events-auto"
      style={{
        cursor: 'none' // Matches custom cursor logic if CustomCursor hides native cursor
      }}
    >
      {isMuted ? (
        <VolumeX size={20} />
      ) : (
        <div className="flex items-end justify-center w-5 h-5 gap-[2px]">
           {[1, 2, 3, 4].map((i) => (
             <motion.div
               key={i}
               className="w-[3px] bg-white rounded-full origin-bottom"
               animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
               transition={{
                 duration: 1.2,
                 repeat: Infinity,
                 ease: 'easeInOut',
                 delay: i * 0.15,
               }}
               style={{ height: '20%' }}
             />
           ))}
        </div>
      )}
    </button>
  );
}