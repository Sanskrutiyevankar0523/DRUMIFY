import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 1. A single glowing drum component
function GlowingDrum({ position, color, size = 1 }: { position: [number, number, number], color: string, size?: number }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[size, size, size * 1.2, 32]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.15}
          roughness={0.1}
          metalness={0.8}
          transmission={0.9} 
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, size * 0.6, 0]}>
        <torusGeometry args={[size * 1.05, 0.05, 32, 64]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, -size * 0.6, 0]}>
        <torusGeometry args={[size * 1.05, 0.05, 32, 64]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// 2. Animated, floating drumsticks
function BouncingSticks({ color1 = "#ffffff", color2 = "#00ffff" }) {
  const stick1 = useRef<THREE.Mesh>(null);
  const stick2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (stick1.current) {
      stick1.current.position.y = 2.5 + Math.sin(t * 4) * 0.3;
      stick1.current.rotation.z = Math.sin(t * 2) * 0.2 + 0.5;
    }
    if (stick2.current) {
      stick2.current.position.y = 3 + Math.cos(t * 4.5) * 0.3;
      stick2.current.rotation.z = Math.cos(t * 2) * 0.2 - 0.5;
    }
  });

  return (
    <group>
      <mesh ref={stick1} position={[-1, 1, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.03, 0.03, 1.5, 16]} />
        <meshBasicMaterial color={color1} />
      </mesh>
      <mesh ref={stick2} position={[1, 1.5, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.03, 0.03, 1.5, 16]} />
        <meshBasicMaterial color={color2} />
      </mesh>
    </group>
  );
}

// 3. A Complete 5-Piece Drum Kit Group
function FullDrumKit({ position, rotation, primaryColor, secondaryColor }: { position: [number, number, number], rotation: [number, number, number], primaryColor: string, secondaryColor: string }) {
  return (
    // We scale the whole kit down to 70% so it fits nicely on the sides
    <group position={position} rotation={rotation} scale={0.7}>
      <GlowingDrum position={[0, 0, 0]} color={primaryColor} size={1.3} /> {/* Kick */}
      <GlowingDrum position={[-1.8, 1.4, 0.5]} color={secondaryColor} size={0.7} /> {/* Snare */}
      <GlowingDrum position={[1.8, 1.4, 0.5]} color={secondaryColor} size={0.8} /> {/* Floor Tom */}
      <GlowingDrum position={[-1, 2.6, -0.8]} color={primaryColor} size={0.6} /> {/* High Tom */}
      <GlowingDrum position={[1, 2.6, -0.8]} color={primaryColor} size={0.6} /> {/* Mid Tom */}
      <BouncingSticks color1="#ffffff" color2={secondaryColor} />
    </group>
  );
}

// 4. The Main Scene
export default function Background3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 2, 12], fov: 60 }}>
        
        <color attach="background" args={['#05020a']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={50} color="#aa3bff" />
        <pointLight position={[-10, -10, -10]} intensity={50} color="#00ffff" />

        {/* --- FULL KIT FAR LEFT --- */}
        {/* X is set to -8, Z is set to -4 to push it deep into the back corner */}
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
          <FullDrumKit 
            position={[-12, -1.5, -4]} 
            rotation={[0, 0.6, 0]} 
            primaryColor="#aa3bff" 
            secondaryColor="#00ffff" 
          />
        </Float>

        {/* --- FULL KIT FAR RIGHT --- */}
        {/* X is set to 8, Z is set to -4 to push it deep into the back corner */}
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
          <FullDrumKit 
            position={[12, -1.5, -4]} 
            rotation={[0, -0.6, 0]} 
            primaryColor="#00ffff" 
            secondaryColor="#aa3bff" 
          />
        </Float>

        {/* Cyberpunk Dust/Sparkles */}
        <Sparkles count={400} scale={30} size={2} color="#00ffff" opacity={0.3} speed={0.5} />
        <Sparkles count={200} scale={30} size={3} color="#aa3bff" opacity={0.3} speed={0.3} />
        
      </Canvas>
    </div>
  );
}