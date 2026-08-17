import type { SceneItem } from "../../data/sceneItems";
import type { SceneTransform } from "../../hooks/useSceneObjects";
import { MirrorBall, ParLed, PinSpot, Sharpy, Strobe } from "./LightingFixture";
import SceneObject, { type CollisionBox } from "./SceneObject";

type Props = {
  items: SceneItem[]; screenWidth: number; screenHeight: number; enabled: boolean; demo: boolean;
  origin: [number, number];
  stageLift: number;
  transforms: Record<string, SceneTransform>; selectedId: string | null; moveMode: boolean;
  onSelect: (id: string, label: string, transform: SceneTransform) => void; onChange: (id: string, transform: SceneTransform) => void;
  onToggleMove: (id: string) => void; onReset: (id: string) => void; onRemove: (id: string) => void;
};

export default function LightingLayer({ items, screenWidth, screenHeight, enabled, demo, origin, stageLift, transforms, selectedId, moveMode, onSelect, onChange, onToggleMove, onReset, onRemove }: Props) {
  const trussY = screenHeight + 1.65;
  const spread = Math.min(screenWidth / 2, 4.6);
  const trussBounds = { minX: -spread, maxX: spread, minZ: -.22, maxZ: -.22 };
  const pinBounds = { minX: -spread, maxX: spread, minZ: .18, maxZ: .18 };
  const floorHalf = Math.max(8, screenWidth + 3) / 2 + Math.max(2, screenWidth * .12);
  const floorBounds = { minX: -floorHalf, maxX: floorHalf, minZ: -2.2, maxZ: Math.max(4.8, screenWidth * .45) };

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
      y: .14, z: 1.75,
      size: [.5, .45, .5] as [number, number, number],
      axis: "xz" as const, bounds: floorBounds,
    },
    "mirror-ball": {
      label: "Globo Espejado",
      spots: [-spread * .55, 0, spread * .55],
      y: trussY - .95, z: -.12,
      size: [.72, 1.1, .72] as [number, number, number],
      axis: "x" as const, bounds: trussBounds,
    },
    "pinspot": {
      label: "Pin",
      // Se intercalan entre los Sharpys y ocupan el frente del travesano.
      spots: [-spread * .76, -spread * .25, spread * .25, spread * .76],
      y: trussY - .28, z: .18,
      size: [.35, .5, .35] as [number, number, number],
      axis: "x" as const, bounds: pinBounds,
    },
  };

  const fixture = (key: string, slot: number) => {
    if (key === "sharpy") return <Sharpy position={[0, 0, 0]} enabled={enabled} demo={demo} index={slot} />;
    if (key === "strobe") return <Strobe position={[0, 0, 0]} enabled={enabled} demo={demo} index={slot} />;
    if (key === "mirror-ball") return <MirrorBall position={[0, 0, 0]} enabled={enabled} demo={demo} index={slot} />;
    if (key === "pinspot") return <PinSpot position={[0, 0, 0]} enabled={enabled} demo={demo} index={slot} />;
    return <ParLed position={[0, 0, 0]} enabled={enabled} demo={demo} index={slot} />;
  };

  return <group position={[origin[0], stageLift, origin[1]]}>
    {items.map((item) => {
      const spec = layout[item.key as keyof typeof layout];
      if (!spec) return null;
      const x = spec.spots[item.slot % spec.spots.length];
      const collisionBoxes: CollisionBox[] = item.key === "par-led" ? items
        .filter((other) => other.key === "par-led" && other.id !== item.id)
        .map((other) => {
          const otherSpec = layout["par-led"];
          const otherX = otherSpec.spots[other.slot % otherSpec.spots.length];
          const position = transforms[other.id]?.position ?? [otherX, otherSpec.y, otherSpec.z];
          return { minX: position[0] - .3, maxX: position[0] + .3, minZ: position[2] - .3, maxZ: position[2] + .3 };
        }) : [];
      return <SceneObject key={item.id} id={item.id} label={`${spec.label} · ${item.slot + 1}`} defaultPosition={[x, spec.y, spec.z]} transform={transforms[item.id]} selected={selectedId === item.id} moveMode={moveMode && selectedId === item.id} bounds={spec.bounds} collisionBoxes={collisionBoxes} axis={spec.axis} size={spec.size} onSelect={onSelect} onChange={onChange} onToggleMove={onToggleMove} onReset={onReset} onRemove={onRemove}>{fixture(item.key, item.slot)}</SceneObject>;
    })}
  </group>;
}
