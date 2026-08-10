"use client";

import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type CameraControllerHandle = { reset: () => void };

const CameraController = forwardRef<CameraControllerHandle, { enabled?: boolean; screenWidth: number }>(function CameraController({ enabled = true, screenWidth }, ref) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const reset = () => {
    const distance = Math.max(12.5, Math.min(19, screenWidth * 1.38));
    camera.position.set(0, 1.68, distance);
    controls.current?.target.set(0, 2.6, 0);
    controls.current?.update();
  };
  useEffect(() => { reset(); }, [screenWidth]);
  useImperativeHandle(ref, () => ({ reset }));
  return <OrbitControls ref={controls} enabled={enabled} target={[0, 2.6, 0]} enablePan={false} minDistance={8} maxDistance={21} minPolarAngle={Math.PI * 0.35} maxPolarAngle={Math.PI * 0.53} minAzimuthAngle={-Math.PI * 0.28} maxAzimuthAngle={Math.PI * 0.28} dampingFactor={0.075} enableDamping touches={{ ONE: 1, TWO: 2 }} />;
});

export default CameraController;
