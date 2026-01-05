'use client';

import { useRef, useMemo, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function FullScreenWater() {
  const materialRef = useRef();
  const { viewport } = useThree();

  // oversize the plane so it fully covers the frustum in perspective
  const planeScale = useMemo(() => [viewport.width * 2.5, viewport.height * 2.5, 1], [viewport.width, viewport.height]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color('#061225') },
      uShallowColor: { value: new THREE.Color('#2fb7c6') },
      uHighlight: { value: new THREE.Color('#4ecdc4') }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uDeepColor;
      uniform vec3 uShallowColor;
      uniform vec3 uHighlight;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
        float f = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 5; i++) {
          f += amp * noise(p);
          p *= 2.0;
          amp *= 0.5;
        }
        return f;
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = uv * 3.0;

        // Layer 1: broad undulation
        float f1 = fbm(p + vec2(uTime * 0.12, -uTime * 0.08));

        // Layer 2: tight caustics
        float f2 = fbm(p * 2.35 + vec2(-uTime * 0.18, uTime * 0.11));
        float caustics = pow(f2, 3.2);

        // Depth tint
        float depth = smoothstep(0.05, 0.95, uv.y);
        vec3 base = mix(uDeepColor, uShallowColor, depth);

        // Soft rays
        float rays = sin((uv.y + uTime * 0.22) * 10.0 + sin(uTime * 0.4)) * 0.12;

        // Focus glow behind hero
        float focus = exp(-length(uv - vec2(0.5, 0.35)) * 5.5);

        vec3 color = base;
        color += (f1 * 0.35 + caustics * 0.8 + rays * 0.4 + focus * 0.4) * uHighlight;

        float alpha = 0.42 + caustics * 0.35 + rays * 0.08;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  return (
    <mesh
      position={[0, 0, -12]}
      scale={planeScale}
      renderOrder={-2}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial ref={materialRef} {...shader} />
    </mesh>
  );
}

function OceanFloor() {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uBase: { value: new THREE.Color('#0a1124') },
      uSand: { value: new THREE.Color('#123a4a') }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uBase;
      uniform vec3 uSand;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
        float f = 0.0;
        float amp = 0.6;
        for (int i = 0; i < 4; i++) {
          f += amp * noise(p);
          p *= 2.2;
          amp *= 0.5;
        }
        return f;
      }

      void main() {
        vec2 uv = vUv * 4.0;
        float dunes = fbm(uv + vec2(uTime * 0.02, uTime * 0.01));
        float ridges = fbm(uv * 1.5 + vec2(-uTime * 0.015, 0.0));
        float height = dunes * 0.6 + ridges * 0.4;

        vec3 color = mix(uBase, uSand, 0.35 + height * 0.4);
        float vignette = smoothstep(1.2, 0.2, length(vUv - 0.5) * 1.2);
        color *= vignette;

        float alpha = 0.4 * vignette;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true
  }), []);

  return (
    <mesh position={[0, -6, -12]} rotation={[-Math.PI / 2, 0, 0]} scale={[80, 80, 1]} renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial ref={materialRef} {...shader} />
    </mesh>
  );
}

function CubeScape() {
  const cubes = useMemo(() => ([
    { position: [-3.5, -1.2, -6], scale: [0.8, 0.8, 0.8] },
    { position: [2.5, -0.8, -5], scale: [0.6, 0.6, 0.6] },
    { position: [0.5, -1.5, -4], scale: [0.5, 0.5, 0.5] },
  ]), []);

  return (
    <group>
      {cubes.map((cube, idx) => (
        <mesh
          key={idx}
          position={cube.position}
          scale={cube.scale}
          rotation={[Math.PI * 0.1, Math.PI * 0.25, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#1b3c57"
            metalness={0.1}
            roughness={0.7}
            emissive="#0c2f44"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function BoxAquariumModel() {
  const groupRef = useRef();
  const { scene, animations } = useGLTF('/box_aquarium.glb');
  const { actions, names } = useAnimations(animations, groupRef);
  const [loaded, setLoaded] = useState(false);
  const fadeRef = useRef(0);
  const materialsRef = useRef([]);

  // Normalize materials so they pick up scene lighting
  useEffect(() => {
    materialsRef.current = [];
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        const mat = obj.material;
        if (mat && mat.isMeshStandardMaterial) {
          mat.roughness = 0.4;
          mat.metalness = 0.1;
          mat.envMapIntensity = 0.9;
          mat.transparent = true;
          mat.opacity = 0;
          mat.needsUpdate = true;
          materialsRef.current.push(mat);
        }
      }
    });
    setLoaded(true);
  }, [scene]);

  // Play default animation if present
  useEffect(() => {
    if (!names || names.length === 0) return;
    const first = actions[names[0]];
    first?.reset().setLoop(THREE.LoopRepeat).play();
    return () => {
      first?.stop();
    };
  }, [actions, names]);

  useFrame((state, delta) => {
    if (!loaded || !materialsRef.current.length) return;
    fadeRef.current = Math.min(1, fadeRef.current + delta * 0.8);
    materialsRef.current.forEach((mat) => {
      mat.opacity = fadeRef.current;
    });
  });

  return (
    <primitive
      ref={groupRef}
      object={scene}
      position={[0, -0.75, 0]}
      rotation={[0, 0, 0]}
      scale={1.42}
    />
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
      camera={{ position: [0, 0, 2.6], fov: 34, near: 0.1, far: 40 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
      shadows
      onCreated={({ camera }) => {
        camera.lookAt(0, -0.2, 0);
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 6]} intensity={1.2} color="#dff5ff" castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={0.45} color="#7ac7ff" />
      <pointLight position={[0, 2, 3]} intensity={0.6} color="#4ecdc4" />
      <hemisphereLight args={['#bce6ff', '#0a1628', 0.4]} />
      
      {/* Environment */}
      <fog attach="fog" args={['#0a1628', 4, 20]} />
      
      {/* Model */}
      <Suspense fallback={null}>
        <BoxAquariumModel />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload('/great_white_shark.glb');
