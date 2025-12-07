import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef, Suspense, useState } from "react";
import * as THREE from "three";
import profileImage from "@/assets/profile.jpg";

// 3D Photo Frame with rotating effect
const PhotoFrame = ({ imageUrl }) => {
  const meshRef = useRef();
  const frameRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Load the texture
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      
      // Scale on hover
      const targetScale = hovered ? 1.05 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group 
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Main photo plane */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[3, 4]} />
          <meshStandardMaterial 
            map={texture} 
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Glass overlay effect */}
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[3, 4]} />
          <meshPhysicalMaterial 
            transparent
            opacity={0.1}
            roughness={0}
            metalness={0.5}
            clearcoat={1}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Outer glowing frame */}
        <mesh ref={frameRef} position={[0, 0, 0]}>
          <boxGeometry args={[3.3, 4.3, 0.15]} />
          <MeshDistortMaterial
            color="#3b82f6"
            attach="material"
            distort={0.1}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            emissive="#3b82f6"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Inner frame border */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[3.15, 4.15, 0.1]} />
          <meshStandardMaterial 
            color="#1e293b"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Corner decorations */}
        {[[-1.4, 1.9], [1.4, 1.9], [-1.4, -1.9], [1.4, -1.9]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.12]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial 
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}

        {/* Glow ring behind frame */}
        <mesh position={[0, 0, -0.2]} rotation={[0, 0, 0]}>
          <ringGeometry args={[2.5, 3, 64]} />
          <meshBasicMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Orbiting particles around the photo
const OrbitingParticles = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2.8;
        return (
          <mesh 
            key={i} 
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              0
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color="#3b82f6" 
              transparent 
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Profile3D = () => {
  return (
    <div className="w-[300px] h-[400px] md:w-[350px] md:h-[450px] lg:w-[400px] lg:h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, 5]} intensity={0.5} color="#3b82f6" />
          <pointLight position={[5, -5, 5]} intensity={0.3} color="#8b5cf6" />

          {/* 3D Photo */}
          <PhotoFrame imageUrl={profileImage} />

          {/* Orbiting particles */}
          <OrbitingParticles />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Profile3D;
