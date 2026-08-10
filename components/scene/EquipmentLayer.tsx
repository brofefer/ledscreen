import { EQUIPMENT } from "../../data/equipment";
import type { SceneTransform } from "../../hooks/useSceneObjects";
import { DJBooth } from "./DJBooth";
import SceneObject from "./SceneObject";
import Speaker from "./Speaker";

type Props = {
  sound: Record<string, number>; extras: string[]; screenWidth: number; transforms: Record<string, SceneTransform>;
  selectedId: string | null; moveMode: boolean; onSelect: (id: string, label: string, transform: SceneTransform) => void; onChange: (id: string, transform: SceneTransform) => void;
  onToggleMove: (id: string) => void; onReset: (id: string) => void; onRemove: (id: string) => void;
};

export default function EquipmentLayer({ sound, extras, screenWidth, transforms, selectedId, moveMode, onSelect, onChange, onToggleMove, onReset, onRemove }: Props) {
  const stageHalf = Math.max(8, screenWidth + 3) / 2 - .45;
  const bounds = { minX: -stageHalf, maxX: stageHalf, minZ: -.75, maxZ: 1.95 };
  const forbidden = { minX: -screenWidth / 2 - .45, maxX: screenWidth / 2 + .45, minZ: -.75, maxZ: .42 };
  const entries = Object.entries(sound).flatMap(([item, quantity]) => {
    const definition = EQUIPMENT[item];
    if (!definition) return [];
    return Array.from({ length: quantity }, (_, index) => ({ item, definition, index, id: `${definition.key}-${index + 1}` }));
  });
  const audioObject = ({ definition, index, id }: typeof entries[number], globalIndex: number) => {
    const side = globalIndex % 2 === 0 ? -1 : 1;
    const row = Math.floor(globalIndex / 2);
    const initialX = side * Math.min(stageHalf - .45, Math.max(screenWidth / 2 + .85, 2.8) + row * .48);
    const initialZ = definition.kind === "subwoofer" ? 1.1 : Math.min(1.55, row * .38);
    const size: [number, number, number] = definition.kind === "subwoofer" ? [1.12, .72, .86] : [definition.kind === "column" ? .58 : .82, definition.height + .2, .72];
    return <SceneObject key={id} id={id} label={`${definition.label} · ${index + 1}`} defaultPosition={[initialX, .82, initialZ]} transform={transforms[id]} selected={selectedId === id} moveMode={moveMode && selectedId === id} bounds={bounds} forbidden={forbidden} size={size} onSelect={onSelect} onChange={onChange} onToggleMove={onToggleMove} onReset={onReset} onRemove={onRemove}><Speaker definition={definition} mirrored={side > 0} /></SceneObject>;
  };
  return <group>
    {entries.map(audioObject)}
    {(extras.includes("Consola DJ") || extras.includes("DJ")) && <SceneObject id="dj-area" label={extras.includes("Consola DJ") ? "Consola DJ" : "DJ"} defaultPosition={[0, 1.345, 1.25]} transform={transforms["dj-area"]} selected={selectedId === "dj-area"} moveMode={moveMode && selectedId === "dj-area"} bounds={{ minX: -2.6, maxX: 2.6, minZ: .65, maxZ: 1.85 }} size={[2.35, 2.15, .85]} onSelect={onSelect} onChange={onChange} onToggleMove={onToggleMove} onReset={onReset} onRemove={onRemove}><DJBooth showConsole={extras.includes("Consola DJ")} showDJ={extras.includes("DJ")} /></SceneObject>}
  </group>;
}
