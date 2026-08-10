import { layoutScreens, screenSizeLabel, type ScreenItem } from "../../data/screens";
import type { SceneTransform } from "../../hooks/useSceneObjects";
import LEDScreen from "./LEDScreen";
import SceneObject from "./SceneObject";

type Props = {
  screens: ScreenItem[]; stageSpan: number; transforms: Record<string, SceneTransform>;
  selectedId: string | null; moveMode: boolean;
  onSelect: (id: string, label: string, transform: SceneTransform) => void; onChange: (id: string, transform: SceneTransform) => void;
  onToggleMove: (id: string) => void; onReset: (id: string) => void; onRemove: (id: string) => void;
};

/** Altura a la que apoya la base de las pantallas, sobre la tarima. */
const SCREEN_BASE_Y = 1;

export default function ScreenLayer({ screens, stageSpan, transforms, selectedId, moveMode, onSelect, onChange, onToggleMove, onReset, onRemove }: Props) {
  // Margen a los costados para poder correrlas más allá de su lugar por defecto.
  const half = Math.max(8, stageSpan + 3) / 2 + 1.5;
  const bounds = { minX: -half, maxX: half, minZ: -1.4, maxZ: 0.4 };
  const canRemove = screens.length > 1;

  return <group>{layoutScreens(screens).map(({ item, x }) => (
    <SceneObject
      key={item.id}
      id={item.id}
      label={item.kind === "E-Poster" ? "E-Poster 1×2" : `${item.kind} · ${screenSizeLabel(item)}`}
      defaultPosition={[x, SCREEN_BASE_Y, 0]}
      transform={transforms[item.id]}
      selected={selectedId === item.id}
      moveMode={moveMode && selectedId === item.id}
      bounds={bounds}
      size={[item.width + .2, item.height, .3]}
      canRemove={canRemove}
      onSelect={onSelect}
      onChange={onChange}
      onToggleMove={onToggleMove}
      onReset={onReset}
      onRemove={onRemove}
    >
      <LEDScreen kind={item.kind} width={item.width} height={item.height} />
    </SceneObject>
  ))}</group>;
}
