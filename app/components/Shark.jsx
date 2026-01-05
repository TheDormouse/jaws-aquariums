'use client';

import { useRef, useMemo, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function SharkModel({ onBite }) {
  const groupRef = useRef();
  const hasTriggeredBite = useRef(false);
  
  // Load the GLB model with animations
  const { scene, animations } = useGLTF('/great_white_shark.glb');
  
  // Setup animations
  const { actions } = useAnimations(animations, groupRef);
  
  // Start swimming animation on mount
  useEffect(() => {
    if (actions['Swim']) {
      actions['Swim'].reset().fadeIn(0.5).play();
      actions['Swim'].setLoop(THREE.LoopRepeat);
      actions['Swim'].setEffectiveTimeScale(0.8);
    } else if (actions['ArmatureAction']) {
      actions['ArmatureAction'].reset().fadeIn(0.5).play();
      actions['ArmatureAction'].setLoop(THREE.LoopRepeat);
    }
    
    return () => {
      Object.values(actions).forEach(action => action?.stop());
    };
  }, [actions]);
  
  // Swimming path - slow and dramatic
  const swimPath = useMemo(() => ({
    startX: 12,
    endX: -30,
    duration: 12,
    delay: 2
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const elapsed = state.clock.getElapsedTime();
    const swimTime = elapsed - swimPath.delay;
    
    if (swimTime < 0) {
      groupRef.current.position.x = swimPath.startX;
      return;
    }
    
    const progress = Math.min(swimTime / swimPath.duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    const x = swimPath.startX + (swimPath.endX - swimPath.startX) * easeProgress;
    groupRef.current.position.x = x;
    groupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.15;
    
    // Trigger bite when passing center
    if (x <= 0 && x >= -2 && !hasTriggeredBite.current) {
      hasTriggeredBite.current = true;
      
      if (actions['Bite']) {
        actions['Bite'].reset();
        actions['Bite'].setLoop(THREE.LoopOnce);
        actions['Bite'].clampWhenFinished = true;
        actions['Bite'].play();
      }
      
      if (onBite) onBite();
    }
    
    groupRef.current.rotation.z = Math.sin(elapsed * 1.2) * 0.02;
  });

  return (
    <group 
      ref={groupRef} 
      position={[12, 0, 0]} 
      rotation={[0, -Math.PI / 2, 0]}
      scale={1.5}
    >
      <primitive object={scene} />
    </group>
  );
}

function LoadingIndicator() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 2;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[0.3, 0.1, 16, 32]} />
      <meshStandardMaterial color="#4ecdc4" wireframe />
    </mesh>
  );
}

function Caustics() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const causticsShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#1e5b94') }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      
      float caustic(vec2 uv, float time) {
        vec2 p = mod(uv * 6.28318, 6.28318) - 250.0;
        float s = 0.0;
        for(int i = 0; i < 3; i++) {
          p = abs(p) / dot(p, p) - 0.7;
          s += exp(-length(p) * 0.5);
        }
        return s * 0.1;
      }
      
      void main() {
        float c = caustic(vUv + uTime * 0.05, uTime);
        vec3 color = uColor + vec3(c * 0.3, c * 0.4, c * 0.5);
        float alpha = c * 0.5 + 0.1;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true
  }), []);

  return (
    <mesh ref={meshRef} position={[0, -3, -5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <shaderMaterial {...causticsShader} />
    </mesh>
  );
}

function FloatingParticles() {
  const particlesRef = useRef();
  const count = 60;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    const positions = particlesRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += 0.006;
      if (positions[i * 3 + 1] > 5) {
        positions[i * 3 + 1] = -5;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#4ecdc4"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export default function SharkScene({ onBite }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#87ceeb" />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#1e5b94" />
      <pointLight position={[0, -2, 2]} intensity={0.3} color="#4ecdc4" />
      <hemisphereLight args={['#87ceeb', '#0a1628', 0.25]} />
      
      {/* Environment */}
      <fog attach="fog" args={['#0a1628', 6, 25]} />
      
      {/* Shark */}
      <Suspense fallback={<LoadingIndicator />}>
        <SharkModel onBite={onBite} />
      </Suspense>
      
      {/* Underwater Effects */}
      <Caustics />
      <FloatingParticles />
    </Canvas>
  );
}

useGLTF.preload('/great_white_shark.glb');
