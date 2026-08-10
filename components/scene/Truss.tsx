function Beam({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return <mesh position={position} scale={scale} castShadow><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#7d8795" metalness={0.9} roughness={0.22} /></mesh>;
}

export default function Truss({ width, height }: { width: number; height: number }) {
  const outerWidth = width + 1.5;
  const top = height + 1.65;
  return <group>
    <Beam position={[-outerWidth / 2, top / 2, -0.25]} scale={[0.14, top, 0.14]} />
    <Beam position={[outerWidth / 2, top / 2, -0.25]} scale={[0.14, top, 0.14]} />
    <Beam position={[0, top, -0.25]} scale={[outerWidth, 0.14, 0.14]} />
  </group>;
}
