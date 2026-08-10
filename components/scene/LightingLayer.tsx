import type { SceneTransform } from "../../hooks/useSceneObjects";
import { ParLed, Sharpy, Strobe } from "./LightingFixture";
import SceneObject from "./SceneObject";

type Props = {
  selected: string[]; screenWidth: number; screenHeight: number; enabled: boolean; demo: boolean;
  transforms: Record<string, SceneTransform>; selectedId: string | null; moveMode: boolean;
  onSelect: (id: string, label: string, transform: SceneTransform) => void; onChange: (id: string, transform: SceneTransform) => void;
  onToggleMove: (id: string) => void; onReset: (id: string) => void; onRemove: (id: string) => void;
};

export default function LightingLayer({ selected, screenWidth, screenHeight, enabled, demo, transforms, selectedId, moveMode, onSelect, onChange, onToggleMove, onReset, onRemove }: Props) {
  const trussY = screenHeight + 1.65;
  const spread = Math.min(screenWidth / 2, 4.6);
  const bounds = { minX: -spread, maxX: spread, minZ: -.22, maxZ: -.22 };
  const sceneLight = (id: string, label: string, position: [number, number, number], size: [number, number, number], child: React.ReactNode, axis: "xz" | "x" = "x", customBounds = bounds) => <SceneObject key={id} id={id} label={label} defaultPosition={position} transform={transforms[id]} selected={selectedId === id} moveMode={moveMode && selectedId === id} bounds={customBounds} axis={axis} size={size} onSelect={onSelect} onChange={onChange} onToggleMove={onToggleMove} onReset={onReset} onRemove={onRemove}>{child}</SceneObject>;
  return <group>
    {selected.includes("Sharpy") && [-spread, -spread / 3, spread / 3, spread].map((x, index) => sceneLight(`sharpy-${index}`, "Sharpy", [x, trussY - .18, -.22], [.48, .55, .45], <Sharpy position={[0, 0, 0]} enabled={enabled} demo={demo} index={index} />))}
    {selected.includes("Strobe") && [-spread * .62, spread * .62].map((x, index) => sceneLight(`strobe-${index}`, "Strobe", [x, trussY - .12, .05], [.72, .3, .32], <Strobe position={[0, 0, 0]} enabled={enabled} demo={demo} index={index} />))}
    {selected.includes("PAR LED") && [-spread, -spread / 3, spread / 3, spread].map((x, index) => sceneLight(`par-${index}`, "PAR LED", [x, .96, 1.75], [.5, .45, .5], <ParLed position={[0, 0, 0]} enabled={enabled} demo={demo} index={index} />, "xz", { minX: -spread, maxX: spread, minZ: .7, maxZ: 2.05 }))}
  </group>;
}
