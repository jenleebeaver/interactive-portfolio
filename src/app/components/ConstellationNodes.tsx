import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface NodeData {
  id: string;
  position: [number, number, number];
  color: string;
  label: string;
  scale: number;
}

interface ConstellationNodesProps {
  scrollProgress: number;
  onNodeClick: (nodeId: string) => void;
  selectedNode: string | null;
}

const nodes: NodeData[] = [
  { id: 'frontend', position: [-4, 2, -2], color: '#7c3aed', label: 'Frontend\nEngineering', scale: 1.2 },
  { id: 'product', position: [3, 3, -1], color: '#ec4899', label: 'Product\nStrategy', scale: 1.0 },
  { id: 'music', position: [-2, -2, 1], color: '#06b6d4', label: 'Music\nPlatforms', scale: 0.9 },
  { id: 'education', position: [4, -1, 0], color: '#10b981', label: 'Education\nSystems', scale: 1.0 },
  { id: 'media', position: [0, 1, 2], color: '#f59e0b', label: 'Media &\nCreators', scale: 1.1 },
  { id: 'analytics', position: [-3, 0, -1], color: '#8b5cf6', label: 'Analytics &\nOptimization', scale: 0.8 },
  { id: 'api', position: [2, -3, -2], color: '#3b82f6', label: 'API\nIntegration', scale: 0.85 },
  { id: 'ai', position: [1, 2, 3], color: '#ef4444', label: 'AI &\nEmerging Tech', scale: 1.0 },
];

function ConstellationNode({
  node,
  scrollProgress,
  onClick,
  isSelected
}: {
  node: NodeData;
  scrollProgress: number;
  onClick: () => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const time = state.clock.getElapsedTime();

      // Gentle floating animation
      const baseY = node.position[1];
      meshRef.current.position.y = baseY + Math.sin(time + node.position[0]) * 0.2;
      glowRef.current.position.y = baseY + Math.sin(time + node.position[0]) * 0.2;

      // Pulsing glow effect
      const pulseScale = 1 + Math.sin(time * 2) * 0.1;
      glowRef.current.scale.setScalar(pulseScale * (isSelected ? 1.5 : 1.2));

      // Rotation
      meshRef.current.rotation.y = time * 0.5;
      meshRef.current.rotation.x = time * 0.3;

      // Scroll-based camera movement
      state.camera.position.z = 15 - scrollProgress * 8;
      state.camera.position.x = Math.sin(scrollProgress * Math.PI) * 3;
      state.camera.position.y = scrollProgress * 2;
    }
  });

  return (
    <group position={[node.position[0], node.position[1], node.position[2]]}>
      <mesh ref={meshRef} onClick={onClick}>
        <icosahedronGeometry args={[node.scale, 1]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isSelected ? 1.5 : 0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[node.scale * 1.3, 32, 32]} />
        <meshBasicMaterial
          color={node.color}
          transparent
          opacity={isSelected ? 0.3 : 0.15}
        />
      </mesh>

      <Text
        position={[0, node.scale + 0.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {node.label}
      </Text>
    </group>
  );
}

export function ConstellationNodes({ scrollProgress, onNodeClick, selectedNode }: ConstellationNodesProps) {
  return (
    <>
      {nodes.map((node) => (
        <ConstellationNode
          key={node.id}
          node={node}
          scrollProgress={scrollProgress}
          onClick={() => onNodeClick(node.id)}
          isSelected={selectedNode === node.id}
        />
      ))}
    </>
  );
}
