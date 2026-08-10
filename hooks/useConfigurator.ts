"use client";

import { useCallback, useMemo, useState } from "react";
import { catalogEntry, itemSpec, type ItemCategory } from "../data/catalog";
import * as items from "../data/sceneItems";
import type { SceneItem } from "../data/sceneItems";
import * as screensApi from "../data/screens";
import type { ScreenItem, ScreenKind } from "../data/screens";

export type { SceneItem, ScreenItem, ScreenKind };
/** Se mantiene el nombre anterior: el tipo de una pantalla suelta. */
export type ScreenType = ScreenKind;

export function useConfigurator() {
  const [screens, setScreens] = useState<ScreenItem[]>(() => screensApi.addScreen([], "LED Outdoor", { width: 6, height: 4 }));
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

  const addScreen = useCallback((kind: ScreenKind) => setScreens((current) => screensApi.addScreen(current, kind)), []);
  const removeScreen = useCallback((id: string) => setScreens((current) => screensApi.removeScreen(current, id)), []);
  const setScreenKind = useCallback((id: string, kind: ScreenKind) => setScreens((current) => screensApi.updateScreen(current, id, { kind })), []);
  const setScreenSize = useCallback((id: string, size: screensApi.ScreenSize) => setScreens((current) => screensApi.setScreenSize(current, id, size)), []);
  const setScreenCustom = useCallback((id: string, custom: boolean) => setScreens((current) => screensApi.setScreenCustom(current, id, custom)), []);
  const resizeScreen = useCallback((id: string, axis: "width" | "height", delta: number) => (
    setScreens((current) => screensApi.resizeScreen(current, id, axis, delta))
  ), []);

  /** Borrado desde el menú contextual de la escena: quita esa instancia y ninguna otra. */
  const removeSceneInstance = useCallback((id: string) => {
    if (id === "dj-area") {
      setExtras((current) => current.filter((item) => item !== "Consola DJ" && item !== "DJ"));
      return;
    }
    if (id.startsWith("screen-")) {
      setScreens((current) => screensApi.removeScreen(current, id));
      return;
    }
    setList((current) => items.removeUnit(current, id));
  }, []);

  const counts = useMemo(() => items.countsOf(list), [list]);

  const itemsOf = useCallback((category: ItemCategory) => (
    list.filter((item) => catalogEntry(item.key)?.category === category)
  ), [list]);

  const actions = useMemo(() => ({
    addScreen,
    removeScreen,
    setScreenKind,
    setScreenSize,
    setScreenCustom,
    resizeScreen,
    changeUnits,
    toggleGroup,
    toggleExtra,
    removeSceneInstance,
  }), [addScreen, removeScreen, setScreenKind, setScreenSize, setScreenCustom, resizeScreen, changeUnits, toggleGroup, toggleExtra, removeSceneInstance]);

  return useMemo(() => ({
    config: { screens, items: list, counts, extras },
    actions,
    itemsOf,
  }), [screens, list, counts, extras, actions, itemsOf]);
}
