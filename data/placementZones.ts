export const PLACEMENT_ZONES = {
  LEFT_PA: { minX: -9, maxX: -2, minZ: -1, maxZ: 2.2 },
  RIGHT_PA: { minX: 2, maxX: 9, minZ: -1, maxZ: 2.2 },
  DJ_AREA: { minX: -2.2, maxX: 2.2, minZ: 1, maxZ: 2.2 },
} as const;

export type PlacementZone = keyof typeof PLACEMENT_ZONES;
