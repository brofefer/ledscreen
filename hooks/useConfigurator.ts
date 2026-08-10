"use client";

import { useMemo, useState } from "react";
import { SCREEN_SIZES } from "../data/screenSizes";

export type ScreenType = "LED Outdoor" | "LED Indoor" | "E-Poster";

export function useConfigurator() {
  const [screenType, setScreenType] = useState<ScreenType>("LED Outdoor");
  const [sizeIndex, setSizeIndex] = useState(6);
  const [eposterQuantity, setEposterQuantity] = useState(2);
  const [sound, setSound] = useState<Record<string, number>>({});
  const [lighting, setLighting] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const selectedScreen = SCREEN_SIZES[sizeIndex];
  const screen = screenType === "E-Poster" ? { label: "1 × 2 m", width: 1, height: 2 } : selectedScreen;
  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) =>
    setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  const changeSoundQuantity = (value: string, delta: number) => setSound((current) => {
    const quantity = Math.max(0, Math.min(8, (current[value] ?? 0) + delta));
    const next = { ...current };
    if (quantity === 0) delete next[value]; else next[value] = quantity;
    return next;
  });
  const removeSceneInstance = (id: string) => {
    const soundByPrefix: Record<string, string> = { "jbl-vrx": "JBL VRX", "rcf-evox-j8": "RCF EVOX J8", "rcf-ax15": "RCF AX15", "sub-vrx": "SUB VRX" };
    const soundEntry = Object.entries(soundByPrefix).find(([prefix]) => id.startsWith(prefix));
    if (soundEntry) { changeSoundQuantity(soundEntry[1], -1); return; }
    if (id.startsWith("sharpy")) toggle(setLighting, "Sharpy");
    else if (id.startsWith("strobe")) toggle(setLighting, "Strobe");
    else if (id.startsWith("par-")) toggle(setLighting, "PAR LED");
    else if (id === "dj-area") setExtras((current) => current.filter((item) => item !== "Consola DJ" && item !== "DJ"));
  };

  return useMemo(() => ({
    config: { screen: { type: screenType, ...screen, quantity: screenType === "E-Poster" ? eposterQuantity : 1 }, sound, lighting, extras },
    actions: {
      setScreenType,
      setSizeIndex,
      setEposterQuantity,
      changeSoundQuantity,
      removeSceneInstance,
      toggleLighting: (value: string) => toggle(setLighting, value),
      toggleExtra: (value: string) => toggle(setExtras, value),
    },
    sizeIndex,
    eposterQuantity,
  }), [screenType, screen, sound, lighting, extras, sizeIndex, eposterQuantity]);
}
