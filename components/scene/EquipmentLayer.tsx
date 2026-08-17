import { EQUIPMENT } from "../../data/equipment";
import type { SceneItem } from "../../data/sceneItems";
import type { SceneTransform } from "../../hooks/useSceneObjects";
import { DJBooth } from "./DJBooth";
import SceneObject from "./SceneObject";
import Speaker from "./Speaker";

type Props = {
  items: SceneItem[]; extras: string[]; screenWidth: number; transforms: Record<string, SceneTransform>;
  selectedId: string | null; moveMode: boolean; onSelect: (id: string, label: string, transform: SceneTransform) => void; onChange: (id: string, transform: SceneTransform) => void;
  onToggleMove: (id: string) => void; onReset: (id: string) => void; onRemove: (id: string) => void;
};

export default function EquipmentLayer({ items, extras, screenWidth, transforms, selectedId, moveMode, onSelect, onChange, onToggleMove, onReset, onRemove }: Props) {
  const stageHalf = Math.max(8, screenWidth + 3) / 2 + Math.max(1.5, screenWidth * .1);
  const bounds = { minX: -stageHalf, maxX: stageHalf, minZ: -1.5, maxZ: Math.max(4.8, screenWidth * .45) };

  // El orden de colocación sale del slot, no del índice del array: así borrar
  // una unidad del medio no reubica a las demás.
  const placed = [...items].sort((a, b) => a.slot - b.slot);
  const ordinals = new Map<string, number>();
  const seen: Record<string, number> = {};
  for (const item of placed) {
    seen[item.key] = (seen[item.key] ?? 0) + 1;
    ordinals.set(item.id, seen[item.key]);
  }

  return <group>
    {placed.map((item) => {
      const definition = EQUIPMENT[item.key];
      if (!definition) return null;
      const side = item.slot % 2 === 0 ? -1 : 1;
      const row = Math.floor(item.slot / 2);
      const initialX = side * Math.min(stageHalf - .45, Math.max(screenWidth / 2 + .85, 2.8) + row * .48);
      const initialZ = definition.kind === "subwoofer" ? 1.1 : Math.min(1.55, row * .38);
      const size: [number, number, number] = definition.kind === "subwoofer"
        ? [1.12, .72, .86]
        : [definition.kind === "column" ? .58 : .82, definition.height + .2, .72];
      return <SceneObject key={item.id} id={item.id} label={`${definition.label} · ${ordinals.get(item.id)}`} defaultPosition={[initialX, .82, initialZ]} transform={transforms[item.id]} selected={selectedId === item.id} moveMode={moveMode && selectedId === item.id} bounds={bounds} size={size} onSelect={onSelect} onChange={onChange} onToggleMove={onToggleMove} onReset={onReset} onRemove={onRemove}><Speaker definition={definition} mirrored={side > 0} /></SceneObject>;
    })}
    {(extras.includes("Consola DJ") || extras.includes("DJ")) && <SceneObject id="dj-area" label={extras.includes("Consola DJ") ? "Consola DJ" : "DJ"} defaultPosition={[0, 1.345, 1.25]} transform={transforms["dj-area"]} selected={selectedId === "dj-area"} moveMode={moveMode && selectedId === "dj-area"} bounds={bounds} size={[2.35, 2.15, .85]} onSelect={onSelect} onChange={onChange} onToggleMove={onToggleMove} onReset={onReset} onRemove={onRemove}><DJBooth showConsole={extras.includes("Consola DJ")} showDJ={extras.includes("DJ")} /></SceneObject>}
  </group>;
}
