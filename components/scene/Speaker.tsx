import type { EquipmentDefinition } from "../../data/equipment";

type Props = { definition: EquipmentDefinition; position?: [number, number, number]; mirrored?: boolean };

function Cabinet({ width, height, depth, y }: { width: number; height: number; depth: number; y: number }) {
  return <mesh position={[0, y, 0]} castShadow receiveShadow><boxGeometry args={[width, height, depth]} /><meshStandardMaterial color="#171b21" metalness={.35} roughness={.58} /></mesh>;
}

export default function Speaker({ definition, position = [0, 0, 0], mirrored = false }: Props) {
  const { kind, height, label } = definition;
  if (kind === "subwoofer") return <group position={position} name={label}><Cabinet width={1.02} height={height} depth={.76} y={height / 2} /><mesh position={[0, height / 2, .386]}><circleGeometry args={[.23, 28]} /><meshStandardMaterial color="#050608" roughness={.8} /></mesh></group>;
  if (kind === "column") return <group position={position} name={label}><Cabinet width={.32} height={1.38} depth={.38} y={.76} /><Cabinet width={.48} height={.65} depth={.55} y={.325} /></group>;
  if (kind === "speaker") return <group position={position} name={label}><mesh position={[0, .9, 0]}><cylinderGeometry args={[.045, .045, 1.25, 10]} /><meshStandardMaterial color="#3e454e" metalness={.8} /></mesh><mesh position={[0, .07, 0]}><cylinderGeometry args={[.38, .38, .08, 20]} /><meshStandardMaterial color="#252a31" /></mesh><Cabinet width={.7} height={.8} depth={.52} y={1.5} /></group>;
  const lean = mirrored ? -.055 : .055;
  return <group position={position} rotation={[0, 0, lean]} name={label}>{[0, 1, 2, 3].map((item) => <group key={item} position={[0, .38 + item * .48, item * .035]}><Cabinet width={.62} height={.43} depth={.58} y={0} /><mesh position={[0, 0, .296]}><circleGeometry args={[.13, 24]} /><meshStandardMaterial color="#050608" /></mesh></group>)}<mesh position={[0, 2.16, 0]}><cylinderGeometry args={[.035, .035, .55, 8]} /><meshStandardMaterial color="#69727d" metalness={.9} /></mesh></group>;
}
