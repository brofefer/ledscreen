import * as THREE from "three";

export default function LEDScreen({ width, height }: { width: number; height: number }) {
  const y = 1 + height / 2;
  return (
    <group position={[0, y, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width + 0.18, height + 0.18, 0.18]} />
        <meshStandardMaterial color="#151922" metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.101]}>
        <planeGeometry args={[width, height, Math.max(4, Math.round(width * 2)), Math.max(3, Math.round(height * 2))]} />
        <meshStandardMaterial color="#1bd7ff" emissive="#087ea4" emissiveIntensity={0.8} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.107]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} wireframe />
      </mesh>
    </group>
  );
}
