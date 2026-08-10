import * as THREE from "three";
import type { ScreenKind } from "../../data/screens";

/**
 * Una pantalla, dibujada con su base en el origen local: así el objeto se
 * puede envolver en `SceneObject` y moverse como cualquier otro equipo.
 */
export default function LEDScreen({ kind, width, height }: { kind: ScreenKind; width: number; height: number }) {
  return (
    <group>
      <group position={[0, height / 2, 0]}>
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
      {kind === "E-Poster" && <group>
        <mesh position={[0, -0.06, 0]} castShadow>
          <boxGeometry args={[1.12, 0.12, 0.48]} />
          <meshStandardMaterial color="#151a20" metalness={0.65} roughness={0.32} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.72, 0.06, 0.68]} />
          <meshStandardMaterial color="#222832" metalness={0.55} roughness={0.4} />
        </mesh>
      </group>}
    </group>
  );
}
