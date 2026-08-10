"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneTransform } from "../../hooks/useSceneObjects";

type Bounds = { minX: number; maxX: number; minZ: number; maxZ: number };
type Props = {
  id: string; label: string; defaultPosition: [number, number, number]; defaultRotationY?: number;
  transform?: SceneTransform; selected: boolean; moveMode: boolean; bounds: Bounds; forbidden?: Bounds; axis?: "xz" | "x";
  size: [number, number, number]; onSelect: (id: string, label: string, transform: SceneTransform) => void; onChange: (id: string, transform: SceneTransform) => void;
  onToggleMove: (id: string) => void; onReset: (id: string) => void; onRemove: (id: string) => void;
  children: React.ReactNode;
};

export default function SceneObject({ id, label, defaultPosition, defaultRotationY = 0, transform, selected, moveMode, bounds, forbidden, axis = "xz", size, onSelect, onChange, onToggleMove, onReset, onRemove, children }: Props) {
  const dragging = useRef(false);
  const offset = useRef(new THREE.Vector3());
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -defaultPosition[1]), [defaultPosition]);
  const position = transform?.position ?? defaultPosition;
  const rotationY = transform?.rotationY ?? defaultRotationY;
  const intersect = (event: ThreeEvent<PointerEvent>) => event.ray.intersectPlane(plane, new THREE.Vector3());
  const pointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
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
    onChange(id, { position: [x, defaultPosition[1], z], rotationY });
  };
  const pointerUp = (event: ThreeEvent<PointerEvent>) => { if (dragging.current) event.stopPropagation(); dragging.current = false; };
  return <group position={position} rotation={[0, rotationY, 0]} onClick={(event) => { event.stopPropagation(); if (!moveMode) onSelect(id, label, { position, rotationY }); }} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
    {children}
    {selected && <mesh position={[0, size[1] / 2, 0]}><boxGeometry args={size} /><meshBasicMaterial color="#1bd7ff" wireframe transparent opacity={.9} depthTest={false} /></mesh>}
    {selected && <Html position={[0, size[1] + .28, 0]} center distanceFactor={9} zIndexRange={[80, 40]}><div className="object-popover" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()}><div className="object-popover-title"><span>{label}</span><small>{moveMode ? "Deslizá para mover" : "Seleccionado"}</small></div><div className="object-popover-actions"><button className={moveMode ? "active" : ""} onClick={() => onToggleMove(id)}>{moveMode ? "Listo" : "Mover"}</button><button onClick={() => onChange(id, { position, rotationY: rotationY + Math.PI / 8 })}>Rotar</button><button onClick={() => onReset(id)}>Restablecer</button><button className="danger" onClick={() => onRemove(id)}>Eliminar</button></div></div></Html>}
  </group>;
}
