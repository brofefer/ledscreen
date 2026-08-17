import type { SceneEnvironment } from "../../data/environments";

export default function Stage({ width, depth, centerX, centerZ, environment, showPlatform }: { width: number; depth: number; centerX: number; centerZ: number; environment: SceneEnvironment; showPlatform: boolean }) {
  const stageWidth = Math.max(8, width + 3);
  const stageDepth = Math.max(4.5, depth);
  return <group>
    {showPlatform && <mesh position={[centerX, 0.42, centerZ]} receiveShadow castShadow>
      <boxGeometry args={[stageWidth, 0.8, stageDepth]} />
      <meshStandardMaterial color={environment.stage.color} roughness={environment.stage.roughness} />
    </mesh>}
    {/* El piso llega más lejos que la niebla del ambiente más despejado (115 m),
        para que al aire libre no se vea su borde recortado contra el cielo. */}
    <mesh position={[0, -0.05, 4]} receiveShadow>
      <boxGeometry args={[280, 0.1, 280]} />
      <meshStandardMaterial color={environment.ground.color} roughness={environment.ground.roughness} />
    </mesh>
  </group>;
}
