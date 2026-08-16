"use client";

import { useEffect, useState } from "react";

export type QualityProfile = { mobile: boolean; lowPower: boolean; dpr: [number, number]; shadows: boolean; shadowMapSize: number };

export function useAdaptiveQuality(): QualityProfile {
  const [profile, setProfile] = useState<QualityProfile>({ mobile: false, lowPower: false, dpr: [1, 1.25], shadows: true, shadowMapSize: 768 });
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const nav = navigator as Navigator & { deviceMemory?: number };
      const mobile = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
      const lowPower = (nav.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4;
      setProfile({
        mobile,
        lowPower,
        dpr: lowPower ? [.75, 1] : mobile ? [.85, 1] : [1, 1.25],
        shadows: !mobile && !lowPower,
        shadowMapSize: mobile || lowPower ? 512 : 768,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return profile;
}
