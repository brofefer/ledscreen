export function DJBooth({ showConsole, showDJ }: { showConsole: boolean; showDJ: boolean }) {
  if (!showConsole && !showDJ) return null;
  return <group>
    <mesh castShadow receiveShadow><boxGeometry args={[2.2, 1.05, .72]} /><meshStandardMaterial color="#11151b" metalness={.55} roughness={.35} /></mesh>
    <mesh position={[0, 0, .365]}><planeGeometry args={[1.5, .25]} /><meshStandardMaterial color="#16c8ef" emissive="#087c9a" emissiveIntensity={1.6} /></mesh>
    {showConsole && <group position={[0, .62, 0]}><mesh castShadow><boxGeometry args={[1.25, .12, .48]} /><meshStandardMaterial color="#303640" metalness={.7} roughness={.3} /></mesh>{[-.38, 0, .38].map((x) => <mesh key={x} position={[x, .07, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[.12, .014, 8, 24]} /><meshStandardMaterial color="#1bd7ff" emissive="#0a7890" emissiveIntensity={1.2} /></mesh>)}</group>}
    {showDJ && <group position={[0, .55, -.3]}><mesh position={[0, .88, 0]} castShadow><sphereGeometry args={[.15, 18, 18]} /><meshStandardMaterial color="#b9c2cf" /></mesh><mesh position={[0, .42, 0]} castShadow><capsuleGeometry args={[.2, .55, 6, 10]} /><meshStandardMaterial color="#252c36" /></mesh></group>}
  </group>;
}
