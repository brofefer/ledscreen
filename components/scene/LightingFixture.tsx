"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type FixtureProps = { position: [number, number, number]; enabled: boolean; demo: boolean; index: number };

export function Sharpy({ position, enabled, demo, index }: FixtureProps) {
  const pan = useRef<THREE.Group>(null);
  const pivot = useRef<THREE.Group>(null);
  const beamMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const lensMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const beamColors = useMemo(() => [new THREE.Color("#20d8ff"), new THREE.Color("#8e5cff"), new THREE.Color("#ff4db8")], []);
  useFrame(({ clock }) => {
    if (!pivot.current || !pan.current) return;
    const t = clock.getElapsedTime();
    const phase = index * 1.37;
    pan.current.rotation.y = demo && enabled ? Math.sin(t * (.22 + index * .014) + phase) * .82 : 0;
    pivot.current.rotation.z = demo && enabled ? Math.sin(t * (.38 + index * .018) + phase) * .48 : (index % 2 ? -.18 : .18);
    pivot.current.rotation.x = demo && enabled ? -.18 + Math.sin(t * .27 + phase * .7) * .14 : -.22;
    const colorMix = (Math.sin(t * .22 + phase) + 1) / 2;
    const activeColor = beamColors[index % beamColors.length].clone().lerp(beamColors[(index + 1) % beamColors.length], colorMix);
    if (beamMaterial.current) { beamMaterial.current.opacity = enabled ? .105 : 0; beamMaterial.current.color.copy(activeColor); }
    if (lensMaterial.current) { lensMaterial.current.emissive.copy(activeColor); lensMaterial.current.emissiveIntensity = enabled ? 2.2 : 0; }
  });
  return <group position={position} name="Sharpy">
    <mesh castShadow><cylinderGeometry args={[.21, .24, .16, 18]} /><meshStandardMaterial color="#12161c" metalness={.7} roughness={.28} /></mesh>
    <group ref={pan} position={[0, -.14, 0]}>
      <mesh position={[-.19, -.14, 0]}><boxGeometry args={[.07, .36, .12]} /><meshStandardMaterial color="#252b33" metalness={.65} roughness={.3} /></mesh>
      <mesh position={[.19, -.14, 0]}><boxGeometry args={[.07, .36, .12]} /><meshStandardMaterial color="#252b33" metalness={.65} roughness={.3} /></mesh>
      <group ref={pivot} position={[0, -.16, 0]} rotation={[-.22, 0, 0]}>
        <mesh castShadow><cylinderGeometry args={[.16, .12, .3, 18]} /><meshStandardMaterial color="#272d35" metalness={.7} roughness={.25} /></mesh>
        <mesh position={[0, -.16, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.105, 20]} /><meshStandardMaterial ref={lensMaterial} color="#dffaff" emissive="#20d8ff" emissiveIntensity={enabled ? 2.2 : 0} /></mesh>
        <mesh position={[0, -2.8, 0]} rotation={[0, 0, Math.PI]}><coneGeometry args={[.62, 5.2, 22, 1, true]} /><meshBasicMaterial ref={beamMaterial} color="#20d8ff" transparent opacity={enabled ? .105 : 0} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} /></mesh>
        {enabled && <spotLight position={[0, -.25, 0]} color="#b9efff" intensity={7} distance={9} angle={.16} penumbra={.65} decay={1.7} />}
      </group>
    </group>
  </group>;
}

export function ParLed({ position, enabled, demo, index }: FixtureProps) {
  const light = useRef<THREE.SpotLight>(null);
  const face = useRef<THREE.MeshStandardMaterial>(null);
  const colors = useMemo(() => [new THREE.Color("#16d7ff"), new THREE.Color("#a44cff"), new THREE.Color("#ff3c97")], []);
  useFrame(({ clock }) => {
    if (!light.current) return;
    const t = clock.getElapsedTime();
    const mix = demo && enabled ? (Math.sin(t * .5 + index) + 1) / 2 : 0;
    const activeColor = colors[index % colors.length].clone().lerp(colors[(index + 1) % colors.length], mix);
    light.current.color.copy(activeColor);
    light.current.intensity = enabled ? (demo ? 4.8 + Math.sin(t * .72 + index) * .7 : 5.5) : 0;
    if (face.current) { face.current.color.copy(activeColor); face.current.emissive.copy(activeColor); face.current.emissiveIntensity = enabled ? 1.5 : 0; }
  });
  return <group position={position} name="PAR LED">
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[.18, .22, .22, 18]} /><meshStandardMaterial color="#1a1f26" metalness={.6} roughness={.34} /></mesh>
    <mesh position={[0, .08, -.08]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.13, 18]} /><meshStandardMaterial ref={face} color={enabled ? "#39dcff" : "#29313a"} emissive={enabled ? "#18a8cb" : "#000"} emissiveIntensity={1.5} /></mesh>
    <spotLight ref={light} position={[0, .12, 0]} target-position={[0, 3.5, -2]} color={colors[index % colors.length]} intensity={enabled ? 5.5 : 0} distance={8} angle={.45} penumbra={.75} decay={1.8} />
  </group>;
}

export function Strobe({ position, enabled, demo, index }: FixtureProps) {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const phase = (clock.getElapsedTime() + index * 2.15) % 7.4;
    const flash = enabled && demo && ((phase > 6.82 && phase < 6.92) || (phase > 7.08 && phase < 7.18));
    if (material.current) material.current.emissiveIntensity = flash ? 6 : enabled ? .32 : 0;
    if (light.current) light.current.intensity = flash ? 12 : 0;
  });
  return <group position={position} name="Strobe">
    <mesh castShadow><boxGeometry args={[.62, .18, .22]} /><meshStandardMaterial color="#181c22" metalness={.6} roughness={.3} /></mesh>
    <mesh position={[0, -.01, .116]}><planeGeometry args={[.48, .1]} /><meshStandardMaterial ref={material} color="#dfeaff" emissive="#ffffff" emissiveIntensity={enabled ? .45 : 0} /></mesh>
    <pointLight ref={light} position={[0, -.5, 1]} color="#e7f5ff" intensity={0} distance={7} decay={2} />
  </group>;
}

export function MirrorBall({ position, enabled, demo, index }: FixtureProps) {
  const ball = useRef<THREE.Group>(null);
  const reflection = useRef<THREE.PointLight>(null);
  useFrame(({ clock }, delta) => {
    if (ball.current) ball.current.rotation.y += delta * (demo ? .42 : .12);
    if (reflection.current) {
      const pulse = .72 + Math.sin(clock.getElapsedTime() * .55 + index) * .18;
      reflection.current.intensity = enabled ? (demo ? pulse : .42) : 0;
    }
  });

  return <group position={position} name="Globo Espejado">
    <mesh position={[0, .52, 0]} castShadow>
      <cylinderGeometry args={[.012, .012, .72, 8]} />
      <meshStandardMaterial color="#b8c1cc" metalness={.95} roughness={.12} />
    </mesh>
    <group ref={ball}>
      <mesh castShadow>
        <sphereGeometry args={[.34, 24, 16]} />
        <meshStandardMaterial color={enabled ? "#d9f5ff" : "#7f8892"} metalness={1} roughness={.08} />
      </mesh>
      <mesh scale={1.012}>
        <sphereGeometry args={[.34, 16, 12]} />
        <meshBasicMaterial color="#26313d" wireframe transparent opacity={.5} depthWrite={false} />
      </mesh>
    </group>
    <pointLight ref={reflection} color={index % 2 ? "#bf75ff" : "#6ee8ff"} intensity={enabled ? .42 : 0} distance={5} decay={2} />
  </group>;
}

export function PinSpot({ position, enabled, demo, index }: FixtureProps) {
  const pivot = useRef<THREE.Group>(null);
  const beam = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (pivot.current) pivot.current.rotation.z = demo && enabled ? Math.sin(time * .28 + index * .9) * .26 : (index % 2 ? -.12 : .12);
    if (beam.current) beam.current.opacity = enabled ? .085 : 0;
  });

  return <group position={position} name="Pin">
    <mesh position={[0, .13, 0]} castShadow>
      <boxGeometry args={[.18, .12, .16]} />
      <meshStandardMaterial color="#151a20" metalness={.7} roughness={.28} />
    </mesh>
    <group ref={pivot} rotation={[0, 0, index % 2 ? -.12 : .12]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[.09, .12, .3, 16]} />
        <meshStandardMaterial color="#242a32" metalness={.7} roughness={.25} />
      </mesh>
      <mesh position={[0, -.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[.075, 16]} />
        <meshStandardMaterial color="#f5fbff" emissive="#d8f5ff" emissiveIntensity={enabled ? 2 : 0} />
      </mesh>
      <mesh position={[0, -2.1, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[.26, 3.8, 16, 1, true]} />
        <meshBasicMaterial ref={beam} color="#dff8ff" transparent opacity={enabled ? .085 : 0} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      {enabled && <spotLight position={[0, -.18, 0]} color="#e7f8ff" intensity={3.4} distance={7} angle={.09} penumbra={.5} decay={1.8} />}
    </group>
  </group>;
}
