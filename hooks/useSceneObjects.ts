"use client";

import { useCallback, useState } from "react";

export type SceneTransform = { position: [number, number, number]; rotationY: number };

export function useSceneObjects() {
  const [transforms, setTransforms] = useState<Record<string, SceneTransform>>({});
  const update = useCallback((id: string, transform: SceneTransform) => setTransforms((current) => ({ ...current, [id]: transform })), []);
  const reset = useCallback((id: string) => setTransforms((current) => {
    const next = { ...current };
    delete next[id];
    return next;
  }), []);
  const removeMissing = useCallback((validIds: string[]) => setTransforms((current) => {
    const entries = Object.entries(current).filter(([id]) => validIds.includes(id));
    return entries.length === Object.keys(current).length ? current : Object.fromEntries(entries);
  }), []);
  return { transforms, update, reset, removeMissing };
}
