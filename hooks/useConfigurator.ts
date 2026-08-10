"use client";

import { useCallback, useMemo, useState } from "react";
import { SCREEN_SIZES } from "../data/screenSizes";
import { catalogEntry, itemSpec, type ItemCategory } from "../data/catalog";
import * as items from "../data/sceneItems";
import type { SceneItem } from "../data/sceneItems";

export type ScreenType = "LED Outdoor" | "LED Indoor" | "E-Poster";
export type { SceneItem };

export function useConfigurator() {
  const [screenType, setScreenType] = useState<ScreenType>("LED Outdoor");
  const [sizeIndex, setSizeIndex] = useState(6);
  const [eposterQuantity, setEposterQuantity] = useState(2);
  const [list, setList] = useState<SceneItem[]>([]);
  const [extras, setExtras] = useState<string[]>([]);

  const changeUnits = useCallback((key: string, delta: number) => {
    const spec = itemSpec(key);
    if (spec) setList((current) => items.changeUnits(current, spec, delta));
  }, []);
  const toggleGroup = useCallback((key: string) => {
    const spec = itemSpec(key);
    if (spec) setList((current) => items.toggleGroup(current, spec));
  }, []);

  const toggleExtra = useCallback((value: string) => setExtras((current) => (
    current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
  )), []);

  /** Borrado desde el menú contextual de la escena: quita esa instancia y ninguna otra. */
  const removeSceneInstance = useCallback((id: string) => {
    if (id === "dj-area") {
      setExtras((current) => current.filter((item) => item !== "Consola DJ" && item !== "DJ"));
      return;
    }
    setList((current) => items.removeUnit(current, id));
  }, []);

  const counts = useMemo(() => items.countsOf(list), [list]);

  const itemsOf = useCallback((category: ItemCategory) => (
    list.filter((item) => catalogEntry(item.key)?.category === category)
  ), [list]);

  const screen = useMemo(() => (
    screenType === "E-Poster"
      ? { label: "1 × 2 m", width: 1, height: 2 }
      : SCREEN_SIZES[sizeIndex]
  ), [screenType, sizeIndex]);

  const actions = useMemo(() => ({
    setScreenType,
    setSizeIndex,
    setEposterQuantity,
    changeUnits,
    toggleGroup,
    toggleExtra,
    removeSceneInstance,
  }), [changeUnits, toggleGroup, toggleExtra, removeSceneInstance]);

  return useMemo(() => ({
    config: {
      screen: { type: screenType, ...screen, quantity: screenType === "E-Poster" ? eposterQuantity : 1 },
      items: list,
      counts,
      extras,
    },
    actions,
    itemsOf,
    sizeIndex,
    eposterQuantity,
  }), [screenType, screen, list, counts, extras, actions, itemsOf, sizeIndex, eposterQuantity]);
}
