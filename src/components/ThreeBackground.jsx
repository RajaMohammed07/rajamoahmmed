import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars, Ring } from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

// Sun component - the center of our solar system
const Sun = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, -5]}>
      <MeshDistortMaterial
        color="#fbbf24"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0}
        metalness={0.2}
        emissive="#f59e0b"
        emissiveIntensity={0.8}
      />
    </Sphere>
  );
};

// Planet component with orbital animation
const Planet = ({ orbitRadius, size, color, speed, orbitTilt = 0, startAngle = 0 }) => {
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
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <Sphere ref={meshRef} args={[size, 32, 32]} position={[orbitRadius, 0, -5]}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.2}
            speed={1.5}
            roughness={0.3}
            metalness={0.6}
          />
        </Sphere>
      </Float>
    </group>
  );
};

// Orbit ring visualization
const OrbitRing = ({ radius, tilt = 0 }) => {
  const points = useMemo(() => {
    const pts = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius - 5));
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
        <lineBasicMaterial attach="material" color="#3b82f6" opacity={0.15} transparent />
      </line>
    </group>
  );
};

// Saturn-like planet with rings
const RingedPlanet = ({ orbitRadius, speed, startAngle = 0 }) => {
  const groupRef = useRef();
  const planetRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed + startAngle;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <group position={[orbitRadius, 0, -5]}>
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
          <Sphere ref={planetRef} args={[0.5, 32, 32]}>
            <MeshDistortMaterial
              color="#a78bfa"
              attach="material"
              distort={0.15}
              speed={1}
              roughness={0.4}
              metalness={0.5}
            />
          </Sphere>
          <Ring args={[0.7, 1, 32]} rotation={[Math.PI / 2.5, 0, 0]}>
            <meshBasicMaterial color="#c4b5fd" side={THREE.DoubleSide} opacity={0.6} transparent />
          </Ring>
        </Float>
      </group>
    </group>
  );
};

const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 12], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 0, -5]} intensity={2} color="#fbbf24" />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />

          {/* Sun - center of solar system */}
          <Sun />

          {/* Orbit rings */}
          <OrbitRing radius={3} />
          <OrbitRing radius={4.5} tilt={0.1} />
          <OrbitRing radius={6} tilt={-0.05} />
          <OrbitRing radius={7.5} tilt={0.15} />

          {/* Planets orbiting the sun */}
          <Planet
            orbitRadius={3}
            size={0.3}
            color="#3b82f6"
            speed={0.4}
            startAngle={0}
          />
          <Planet
            orbitRadius={4.5}
            size={0.45}
            color="#10b981"
            speed={0.25}
            orbitTilt={0.1}
            startAngle={Math.PI / 2}
          />
          <RingedPlanet
            orbitRadius={6}
            speed={0.15}
            startAngle={Math.PI}
          />
          <Planet
            orbitRadius={7.5}
            size={0.35}
            color="#06b6d4"
            speed={0.1}
            orbitTilt={0.15}
            startAngle={Math.PI * 1.5}
          />

          {/* Starfield background */}
          <Stars
            radius={100}
            depth={50}
            count={3000}
            factor={4}
            saturation={0.2}
            fade
            speed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
