"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneTransform } from "../../hooks/useSceneObjects";
import { useTranslate } from "../LanguageContext";

type Bounds = { minX: number; maxX: number; minZ: number; maxZ: number };
export type CollisionBox = Bounds;
type Props = {
  id: string; label: string; defaultPosition: [number, number, number]; defaultRotationY?: number;
  transform?: SceneTransform; selected: boolean; moveMode: boolean; bounds: Bounds; forbidden?: Bounds; axis?: "xz" | "x";
  collisionBoxes?: CollisionBox[];
  /** El escenario no puede quedarse sin pantallas, así que la última no ofrece "Eliminar". */
  canRemove?: boolean;
  size: [number, number, number]; onSelect: (id: string, label: string, transform: SceneTransform) => void; onChange: (id: string, transform: SceneTransform) => void;
  onToggleMove: (id: string) => void; onReset: (id: string) => void; onRemove: (id: string) => void;
  children: React.ReactNode;
};

export default function SceneObject({ id, label, defaultPosition, defaultRotationY = 0, transform, selected, moveMode, bounds, forbidden, collisionBoxes = [], axis = "xz", canRemove = true, size, onSelect, onChange, onToggleMove, onReset, onRemove, children }: Props) {
  const tx = useTranslate();
  const dragging = useRef(false);
  const offset = useRef(new THREE.Vector3());
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -defaultPosition[1]), [defaultPosition]);
  const position = transform?.position ?? defaultPosition;
  const rotationY = transform?.rotationY ?? defaultRotationY;
  const intersect = (event: ThreeEvent<PointerEvent>) => event.ray.intersectPlane(plane, new THREE.Vector3());
  const pointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    event.nativeEvent.preventDefault();
    if (!moveMode) onSelect(id, label, { position, rotationY });
    if (!moveMode) return;
    const point = intersect(event); if (!point) return;
    dragging.current = true; offset.current.set(position[0] - point.x, 0, position[2] - point.z);
    (event.target as Element).setPointerCapture?.(event.pointerId);
  };
  const pointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging.current || !moveMode) return;
    event.stopPropagation(); const point = intersect(event); if (!point) return;
    const x = THREE.MathUtils.clamp(point.x + offset.current.x, bounds.minX, bounds.maxX);
    let z = axis === "x" ? position[2] : THREE.MathUtils.clamp(point.z + offset.current.z, bounds.minZ, bounds.maxZ);
    if (forbidden && x >= forbidden.minX && x <= forbidden.maxX && z >= forbidden.minZ && z <= forbidden.maxZ) z = forbidden.maxZ;
    const overlap = (px: number, pz: number) => collisionBoxes.reduce((score, box) => {
      const overlapX = Math.max(0, Math.min(px + size[0] / 2, box.maxX) - Math.max(px - size[0] / 2, box.minX));
      const overlapZ = Math.max(0, Math.min(pz + size[2] / 2, box.maxZ) - Math.max(pz - size[2] / 2, box.minZ));
      return score + overlapX * overlapZ;
    }, 0);
    // Si dos objetos ya estaban juntos, se permite únicamente el movimiento
    // que reduce la intersección hasta poder separarlos por completo.
    if (overlap(x, z) > overlap(position[0], position[2]) + .0001) return;
    onChange(id, { position: [x, defaultPosition[1], z], rotationY });
  };
  const pointerUp = (event: ThreeEvent<PointerEvent>) => { if (dragging.current) event.stopPropagation(); dragging.current = false; };
  return <group position={position} rotation={[0, rotationY, 0]} onClick={(event) => { event.stopPropagation(); if (!moveMode) onSelect(id, label, { position, rotationY }); }} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
    {children}
    {selected && <mesh position={[0, size[1] / 2, 0]}><boxGeometry args={size} /><meshBasicMaterial color="#1bd7ff" wireframe transparent opacity={.9} depthTest={false} /></mesh>}
    {selected && <Html position={[0, size[1] + .28, 0]} center distanceFactor={9} zIndexRange={[80, 40]}><div className="object-popover" onPointerDown={(event) => event.stopPropagation()}><div className="object-popover-title"><span>{tx(label)}</span><small>{tx(moveMode ? "Deslizá para mover" : "Seleccionado")}</small></div><div className="object-popover-actions"><button className={moveMode ? "active" : ""} onClick={() => onToggleMove(id)}>{tx(moveMode ? "Listo" : "Mover")}</button><button onClick={() => onChange(id, { position, rotationY: rotationY + Math.PI / 8 })}>{tx("Rotar")}</button><button onClick={() => onReset(id)}>{tx("Restablecer")}</button>{canRemove && <button className="danger" onClick={() => onRemove(id)}>{tx("Eliminar")}</button>}</div></div></Html>}
  </group>;
}
