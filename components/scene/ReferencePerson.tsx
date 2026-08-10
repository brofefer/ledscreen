export default function ReferencePerson({ screenWidth }: { screenWidth: number }) {
  const x = screenWidth / 2 + 0.7;
  return <group position={[x, 0, 0.8]}>
    <mesh position={[0, 1.54, 0]} castShadow><sphereGeometry args={[0.16, 20, 20]} /><meshStandardMaterial color="#cbd4df" /></mesh>
    <mesh position={[0, 1.03, 0]} castShadow><capsuleGeometry args={[0.18, 0.62, 6, 12]} /><meshStandardMaterial color="#748399" /></mesh>
    <mesh position={[-0.1, 0.36, 0]} rotation={[0, 0, 0.04]} castShadow><capsuleGeometry args={[0.07, 0.55, 4, 10]} /><meshStandardMaterial color="#303845" /></mesh>
    <mesh position={[0.1, 0.36, 0]} rotation={[0, 0, -0.04]} castShadow><capsuleGeometry args={[0.07, 0.55, 4, 10]} /><meshStandardMaterial color="#303845" /></mesh>
  </group>;
}
