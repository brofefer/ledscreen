import type { SceneItem } from "../../data/sceneItems";
import type { SceneTransform } from "../../hooks/useSceneObjects";
import { ParLed, Sharpy, Strobe } from "./LightingFixture";
import SceneObject from "./SceneObject";

type Props = {
  items: SceneItem[]; screenWidth: number; screenHeight: number; enabled: boolean; demo: boolean;
  transforms: Record<string, SceneTransform>; selectedId: string | null; moveMode: boolean;
  onSelect: (id: string, label: string, transform: SceneTransform) => void; onChange: (id: string, transform: SceneTransform) => void;
  onToggleMove: (id: string) => void; onReset: (id: string) => void; onRemove: (id: string) => void;
};

export default function LightingLayer({ items, screenWidth, screenHeight, enabled, demo, transforms, selectedId, moveMode, onSelect, onChange, onToggleMove, onReset, onRemove }: Props) {
  const trussY = screenHeight + 1.65;
  const spread = Math.min(screenWidth / 2, 4.6);
  const trussBounds = { minX: -spread, maxX: spread, minZ: -.22, maxZ: -.22 };
  const floorBounds = { minX: -spread, maxX: spread, minZ: .7, maxZ: 2.05 };

  // Cada tipo de luminaria tiene sus ubicaciones previstas; el slot de la
  // instancia elige cuál le toca y no cambia si se borra otra.
  const layout = {
    "sharpy": {
      label: "Sharpy",
      spots: [-spread, -spread / 3, spread / 3, spread],
      y: trussY - .18, z: -.22,
      size: [.48, .55, .45] as [number, number, number],
      axis: "x" as const, bounds: trussBounds,
    },
    "strobe": {
      label: "Strobe",
      spots: [-spread * .62, spread * .62],
      y: trussY - .12, z: .05,
      size: [.72, .3, .32] as [number, number, number],
      axis: "x" as const, bounds: trussBounds,
    },
    "par-led": {
      label: "PAR LED",
      spots: [-spread, -spread / 3, spread / 3, spread],
      y: .96, z: 1.75,
      size: [.5, .45, .5] as [number, number, number],
      axis: "xz" as const, bounds: floorBounds,
    },
  };

  const fixture = (key: string, slot: number) => {
    if (key === "sharpy") return <Sharpy position={[0, 0, 0]} enabled={enabled} demo={demo} index={slot} />;
    if (key === "strobe") return <Strobe position={[0, 0, 0]} enabled={enabled} demo={demo} index={slot} />;
    return <ParLed position={[0, 0, 0]} enabled={enabled} demo={demo} index={slot} />;
  };

  return <group>
    {items.map((item) => {
      const spec = layout[item.key as keyof typeof layout];
      if (!spec) return null;
      const x = spec.spots[item.slot % spec.spots.length];
      return <SceneObject key={item.id} id={item.id} label={`${spec.label} · ${item.slot + 1}`} defaultPosition={[x, spec.y, spec.z]} transform={transforms[item.id]} selected={selectedId === item.id} moveMode={moveMode && selectedId === item.id} bounds={spec.bounds} axis={spec.axis} size={spec.size} onSelect={onSelect} onChange={onChange} onToggleMove={onToggleMove} onReset={onReset} onRemove={onRemove}>{fixture(item.key, item.slot)}</SceneObject>;
    })}
  </group>;
}
