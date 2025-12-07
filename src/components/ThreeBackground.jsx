import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars, Ring } from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

// Sun component - the center of our solar system
const Sun = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group position={[0, 0, -8]}>
      <Sphere ref={meshRef} args={[1.8, 64, 64]}>
        <MeshDistortMaterial
          color="#fbbf24"
          attach="material"
          distort={0.2}
          speed={1.5}
          roughness={0}
          metalness={0.1}
          emissive="#f97316"
          emissiveIntensity={1}
        />
      </Sphere>
      {/* Sun glow */}
      <Sphere args={[2.2, 32, 32]}>
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.15} />
      </Sphere>
    </group>
  );
};

// Planet component with orbital animation
const Planet = ({ orbitRadius, size, color, speed, orbitTilt = 0, startAngle = 0, hasRings = false, ringColor = "#a78bfa" }) => {
  const meshRef = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed + startAngle;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={groupRef} rotation={[orbitTilt, 0, 0]}>
      <group position={[orbitRadius, 0, -8]}>
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
          <Sphere ref={meshRef} args={[size, 32, 32]}>
            <MeshDistortMaterial
              color={color}
              attach="material"
              distort={0.1}
              speed={1}
              roughness={0.4}
              metalness={0.5}
            />
          </Sphere>
          {hasRings && (
            <Ring args={[size * 1.4, size * 2.2, 32]} rotation={[Math.PI / 2.5, 0, 0]}>
              <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} opacity={0.6} transparent />
            </Ring>
          )}
        </Float>
      </group>
    </group>
  );
};

// Orbit ring visualization
const OrbitRing = ({ radius, tilt = 0 }) => {
  const points = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius - 8));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <group rotation={[tilt, 0, 0]}>
      <line geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color="#3b82f6" opacity={0.08} transparent />
      </line>
    </group>
  );
};

const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 4, 18], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, -8]} intensity={3} color="#fbbf24" />
          <directionalLight position={[10, 10, 5]} intensity={0.3} />

          {/* Sun - center of solar system */}
          <Sun />

          {/* Orbit rings for all planets */}
          <OrbitRing radius={2.8} />
          <OrbitRing radius={3.8} tilt={0.02} />
          <OrbitRing radius={5} tilt={0.01} />
          <OrbitRing radius={6.5} tilt={-0.02} />
          <OrbitRing radius={9} tilt={0.03} />
          <OrbitRing radius={11} tilt={0.05} />
          <OrbitRing radius={13} tilt={-0.03} />
          <OrbitRing radius={15} tilt={0.02} />

          {/* Mercury - smallest, closest to sun, fastest */}
          <Planet
            orbitRadius={2.8}
            size={0.15}
            color="#9ca3af"
            speed={0.8}
            startAngle={0}
          />

          {/* Venus - similar to Earth size, yellowish */}
          <Planet
            orbitRadius={3.8}
            size={0.25}
            color="#fcd34d"
            speed={0.6}
            orbitTilt={0.02}
            startAngle={Math.PI / 3}
          />

          {/* Earth - blue and green */}
          <Planet
            orbitRadius={5}
            size={0.28}
            color="#3b82f6"
            speed={0.45}
            orbitTilt={0.01}
            startAngle={Math.PI / 2}
          />

          {/* Mars - red planet */}
          <Planet
            orbitRadius={6.5}
            size={0.2}
            color="#ef4444"
            speed={0.35}
            orbitTilt={-0.02}
            startAngle={Math.PI}
          />

          {/* Jupiter - largest, orange/brown stripes */}
          <Planet
            orbitRadius={9}
            size={0.7}
            color="#f97316"
            speed={0.2}
            orbitTilt={0.03}
            startAngle={Math.PI * 1.2}
          />

          {/* Saturn - with prominent rings */}
          <Planet
            orbitRadius={11}
            size={0.55}
            color="#fbbf24"
            speed={0.15}
            orbitTilt={0.05}
            startAngle={Math.PI * 1.5}
            hasRings={true}
            ringColor="#d4a574"
          />

          {/* Uranus - ice giant, cyan colored, tilted rings */}
          <Planet
            orbitRadius={13}
            size={0.4}
            color="#06b6d4"
            speed={0.1}
            orbitTilt={-0.03}
            startAngle={Math.PI * 0.7}
            hasRings={true}
            ringColor="#67e8f9"
          />

          {/* Neptune - blue ice giant */}
          <Planet
            orbitRadius={15}
            size={0.38}
            color="#2563eb"
            speed={0.07}
            orbitTilt={0.02}
            startAngle={Math.PI * 1.8}
          />

          {/* Starfield background */}
          <Stars
            radius={150}
            depth={80}
            count={5000}
            factor={4}
            saturation={0.1}
            fade
            speed={0.3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
