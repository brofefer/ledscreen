export default function Stage({ width }: { width: number }) {
  const stageWidth = Math.max(8, width + 3);
  return <group>
    <mesh position={[0, 0.42, 0]} receiveShadow castShadow><boxGeometry args={[stageWidth, 0.8, 4.5]} /><meshStandardMaterial color="#20232b" roughness={0.72} /></mesh>
    <mesh position={[0, -0.05, 4]} receiveShadow><boxGeometry args={[24, 0.1, 16]} /><meshStandardMaterial color="#0f1218" roughness={0.88} /></mesh>
  </group>;
}
