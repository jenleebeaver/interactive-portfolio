import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { ConstellationNodes } from './ConstellationNodes';

interface ConstellationProps {
  scrollProgress: number;
  onNodeClick: (nodeId: string) => void;
  selectedNode: string | null;
}

export function Constellation({ scrollProgress, onNodeClick, selectedNode }: ConstellationProps) {
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        <ConstellationNodes
          scrollProgress={scrollProgress}
          onNodeClick={onNodeClick}
          selectedNode={selectedNode}
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          rotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}
