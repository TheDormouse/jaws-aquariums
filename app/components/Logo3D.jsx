'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, useMask, Mask } from '@react-three/drei';
import * as THREE from 'three';

// Bite mask shape - creates a shark bite cutout
function BiteMask({ visible, position = [4.5, 0.3, 0] }) {
  const stencil = useMask(1, true);
  
  if (!visible) return null;
  
  return (
    <group position={position}>
      {/* Upper jaw bite */}
      <mesh {...stencil}>
        <circleGeometry args={[0.8, 32, 0, Math.PI]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>
      {/* Lower jaw bite */}
      <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI]} {...stencil}>
        <circleGeometry args={[0.6, 32, 0, Math.PI]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>
      {/* Teeth indents - upper */}
      {[-0.5, -0.25, 0, 0.25, 0.5].map((x, i) => (
        <mesh key={`upper-${i}`} position={[x, 0.1, 0]} {...stencil}>
          <coneGeometry args={[0.12, 0.25, 3]} />
          <meshBasicMaterial />
        </mesh>
      ))}
      {/* Teeth indents - lower */}
      {[-0.35, -0.1, 0.15, 0.4].map((x, i) => (
        <mesh key={`lower-${i}`} position={[x, -0.3, 0]} rotation={[0, 0, Math.PI]} {...stencil}>
          <coneGeometry args={[0.1, 0.2, 3]} />
          <meshBasicMaterial />
        </mesh>
      ))}
    </group>
  );
}

// 3D Text with mask support
function LogoText({ showBite }) {
  const textRef = useRef();
  const stencil = useMask(1, false);
  
  // Animate subtle floating
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  // Text material with underwater look
  const textMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f7f9fc',
    metalness: 0.1,
    roughness: 0.3,
    ...stencil
  }), [stencil]);

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4ecdc4',
    metalness: 0.2,
    roughness: 0.2,
    emissive: '#4ecdc4',
    emissiveIntensity: 0.1,
    ...stencil
  }), [stencil]);

  return (
    <group ref={textRef}>
      <Center>
        {/* "Just Add " in white */}
        <Text3D
          font="/fonts/playfair.json"
          size={0.8}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          position={[-4.2, 0, 0]}
          material={textMaterial}
        >
          Just Add
        </Text3D>
        
        {/* "Water" in accent color */}
        <Text3D
          font="/fonts/playfair.json"
          size={0.8}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          position={[1.8, 0, 0]}
          material={accentMaterial}
        >
          Water
        </Text3D>
      </Center>
      
      {/* Bite mask - only visible after shark passes */}
      <Mask id={1} position={[4.5, 0.3, 0.1]}>
        <circleGeometry args={[1, 32]} />
      </Mask>
    </group>
  );
}

export default function Logo3D({ showBite }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '300px',
        pointerEvents: 'none'
      }}
      gl={{ alpha: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#4ecdc4" />
      
      {/* Logo with bite effect */}
      <LogoText showBite={showBite} />
      <BiteMask visible={showBite} />
    </Canvas>
  );
}


