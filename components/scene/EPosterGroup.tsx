import LEDScreen from "./LEDScreen";

export default function EPosterGroup({ quantity }: { quantity: number }) {
  const spacing = 1.35;
  return <group>{Array.from({ length: quantity }, (_, index) => {
    const x = (index - (quantity - 1) / 2) * spacing;
    return <group key={index} position={[x, 0, 0]}><LEDScreen width={1} height={2} /><mesh position={[0, .88, 0]} castShadow><boxGeometry args={[1.12, .12, .48]} /><meshStandardMaterial color="#151a20" metalness={.65} roughness={.32} /></mesh><mesh position={[0, .83, 0]}><boxGeometry args={[.72, .08, .68]} /><meshStandardMaterial color="#222832" metalness={.55} roughness={.4} /></mesh></group>;
  })}</group>;
}
