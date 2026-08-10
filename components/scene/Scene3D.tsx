"use client";

import { ContactShadows, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import CameraController, { CameraControllerHandle } from "./CameraController";
import LEDScreen from "./LEDScreen";
import ReferencePerson from "./ReferencePerson";
import Stage from "./Stage";
import Truss from "./Truss";
import EquipmentLayer from "./EquipmentLayer";
import LightingLayer from "./LightingLayer";
import { useSceneObjects, type SceneTransform } from "../../hooks/useSceneObjects";
import { useAdaptiveQuality } from "../../hooks/useAdaptiveQuality";
import EPosterGroup from "./EPosterGroup";
import type { ScreenType } from "../../hooks/useConfigurator";

export default function Scene3D({ screenType, screenQuantity, width, height, sound, lighting, extras, onRemoveObject }: { screenType: ScreenType; screenQuantity: number; width: number; height: number; sound: Record<string, number>; lighting: string[]; extras: string[]; onRemoveObject: (id: string) => void }) {
  const controls = useRef<CameraControllerHandle>(null);
  const [lightsEnabled, setLightsEnabled] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [selected, setSelected] = useState<{ id: string; label: string; transform: SceneTransform } | null>(null);
  const [interactionMode, setInteractionMode] = useState<"camera" | "move">("camera");
  const sceneObjects = useSceneObjects();
  const quality = useAdaptiveQuality();
  const isEPoster = screenType === "E-Poster";
  const visualWidth = isEPoster ? Math.max(2.7, screenQuantity * 1.35) : width;
  const showTruss = screenType === "LED Outdoor" || lighting.includes("Sharpy") || lighting.includes("Strobe");
  const selectObject = (id: string, label: string, transform: SceneTransform) => { setSelected({ id, label, transform }); setInteractionMode("camera"); };
  const changeObject = (id: string, transform: SceneTransform) => { sceneObjects.update(id, transform); setSelected((current) => current?.id === id ? { ...current, transform } : current); };
  const toggleObjectMove = (id: string) => { if (selected?.id === id) setInteractionMode((mode) => mode === "move" ? "camera" : "move"); };
  const resetObject = (id: string) => { sceneObjects.reset(id); setSelected(null); setInteractionMode("camera"); };
  const removeObject = (id: string) => { sceneObjects.reset(id); onRemoveObject(id); setSelected(null); setInteractionMode("camera"); };
  useEffect(() => {
    const ids = Object.entries(sound).flatMap(([item, quantity]) => {
      const key = item === "JBL VRX" ? "jbl-vrx" : item === "RCF EVOX J8" ? "rcf-evox-j8" : item === "RCF AX15" ? "rcf-ax15" : "sub-vrx";
      return Array.from({ length: quantity }, (_, index) => `${key}-${index + 1}`);
    });
    if (extras.includes("Consola DJ") || extras.includes("DJ")) ids.push("dj-area");
    if (lighting.includes("Sharpy")) ids.push("sharpy-0", "sharpy-1", "sharpy-2", "sharpy-3");
    if (lighting.includes("Strobe")) ids.push("strobe-0", "strobe-1");
    if (lighting.includes("PAR LED")) ids.push("par-0", "par-1", "par-2", "par-3");
    sceneObjects.removeMissing(ids);
    if (selected && !ids.includes(selected.id)) { setSelected(null); setInteractionMode("camera"); }
  }, [sound, lighting, extras, sceneObjects.removeMissing, selected]);
  return <div className="scene-shell">
    <Canvas shadows={quality.shadows} dpr={quality.dpr} onPointerMissed={() => { if (interactionMode === "camera") setSelected(null); }} camera={{ position: [0, 1.68, 12.5], fov: 48, near: 0.1, far: 80 }} gl={{ antialias: !quality.lowPower, powerPreference: "high-performance" }}>
      <color attach="background" args={["#090c12"]} />
      <fog attach="fog" args={["#090c12", 17, 34]} />
      <hemisphereLight intensity={0.85} color="#d8f3ff" groundColor="#11131a" />
      <directionalLight position={[5, 10, 7]} intensity={2.1} castShadow={quality.shadows} shadow-mapSize={[quality.shadowMapSize, quality.shadowMapSize]} />
      <Suspense fallback={null}>
        <Stage width={visualWidth} />
        {showTruss && <Truss width={visualWidth} height={height} />}
        {isEPoster ? <EPosterGroup quantity={screenQuantity} /> : <LEDScreen width={width} height={height} />}
        <ReferencePerson screenWidth={visualWidth} />
        <EquipmentLayer sound={sound} extras={extras} screenWidth={visualWidth} transforms={sceneObjects.transforms} selectedId={selected?.id ?? null} moveMode={interactionMode === "move"} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />
        <LightingLayer selected={lighting} screenWidth={visualWidth} screenHeight={height} enabled={lightsEnabled} demo={demoMode} transforms={sceneObjects.transforms} selectedId={selected?.id ?? null} moveMode={interactionMode === "move"} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />
        {!quality.lowPower && <ContactShadows position={[0, 0.01, 0]} opacity={0.55} scale={22} blur={2.2} far={8} />}
        <Environment preset="city" environmentIntensity={0.3} />
      </Suspense>
      <CameraController ref={controls} enabled={interactionMode === "camera"} screenWidth={visualWidth} />
    </Canvas>
    <div className="viewer-badge"><span /> 1 unidad = 1 metro</div>
    <div className="screen-scene-label"><strong>{screenType === "E-Poster" ? "E-Poster 1×2" : screenType}</strong><i /><span>{screenType === "E-Poster" ? `1 × 2 m · ${screenQuantity} ${screenQuantity === 1 ? "tótem" : "tótems"}` : `${width} × ${String(height).replace(".", ",")} m`}</span></div>
    <button className="reset-view" onClick={() => controls.current?.reset()}>Centrar vista</button>
    <div className="lighting-controls"><button className={lightsEnabled ? "active" : ""} aria-pressed={lightsEnabled} onClick={() => setLightsEnabled((value) => !value)}>Luces {lightsEnabled ? "ON" : "OFF"}</button><button className={demoMode ? "active" : ""} aria-pressed={demoMode} onClick={() => setDemoMode((value) => !value)}>Modo demo</button></div>
    <div className="viewer-help">Arrastrá para mirar · Pellizcá o desplazá para acercar</div>
  </div>;
}
