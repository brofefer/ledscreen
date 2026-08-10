"use client";

import { useEffect, useState } from "react";

export type QualityProfile = { mobile: boolean; lowPower: boolean; dpr: [number, number]; shadows: boolean; shadowMapSize: number };

export function useAdaptiveQuality(): QualityProfile {
  const [profile, setProfile] = useState<QualityProfile>({ mobile: false, lowPower: false, dpr: [1, 1.5], shadows: true, shadowMapSize: 1024 });
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const mobile = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
    const lowPower = (nav.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4;
    setProfile({ mobile, lowPower, dpr: mobile || lowPower ? [1, 1.25] : [1, 1.5], shadows: !lowPower, shadowMapSize: mobile || lowPower ? 512 : 1024 });
  }, []);
  return profile;
}
