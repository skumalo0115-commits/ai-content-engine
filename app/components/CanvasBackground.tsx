"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PointMaterial, Points } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group } from "three";

function OrbitalShapes() {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x += delta * 0.08;
    groupRef.current.rotation.y += delta * 0.1;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.25;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.3} rotationIntensity={1.4} floatIntensity={2.1}>
        <mesh position={[-2.4, 1, -1.5]}>
          <icosahedronGeometry args={[0.45, 1]} />
          <meshStandardMaterial color="#7c3aed" emissive="#5b21b6" emissiveIntensity={0.7} metalness={0.65} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={1.6} rotationIntensity={1.2} floatIntensity={1.8}>
        <mesh position={[2.8, -0.6, -2]}>
          <torusKnotGeometry args={[0.4, 0.16, 140, 20]} />
          <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.8} metalness={0.75} roughness={0.12} />
        </mesh>
      </Float>

      <Float speed={2.6} rotationIntensity={1.8} floatIntensity={2.4}>
        <mesh position={[0.4, 1.7, -3]}>
          <octahedronGeometry args={[0.38]} />
          <meshStandardMaterial color="#f43f5e" emissive="#be123c" emissiveIntensity={0.68} metalness={0.6} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

function StarField() {
  const points = useMemo(() => {
    const values = new Float32Array(1200);

    for (let i = 0; i < values.length; i += 3) {
      const seed = i * 0.37;
      values[i] = Math.sin(seed) * 7;
      values[i + 1] = Math.cos(seed * 1.3) * 5;
      values[i + 2] = Math.sin(seed * 0.7) * 5;
    }

    return values;
  }, []);

  return (
    <Points positions={points} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#67e8f9" size={0.04} sizeAttenuation depthWrite={false} opacity={0.75} />
    </Points>
  );
}

export function CanvasBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-80">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#030014"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} color="#a5b4fc" intensity={1.2} />
        <pointLight position={[-4, -3, 2]} color="#22d3ee" intensity={1.2} />
        <StarField />
        <OrbitalShapes />
      </Canvas>
    </div>
  );
}
