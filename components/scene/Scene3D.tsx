"use client";

import { ContactShadows, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import CameraController, { CameraControllerHandle } from "./CameraController";
import ReferencePerson from "./ReferencePerson";
import ScreenLayer from "./ScreenLayer";
import Stage from "./Stage";
import Truss from "./Truss";
import EquipmentLayer from "./EquipmentLayer";
import LightingLayer from "./LightingLayer";
import { useSceneObjects, type SceneTransform } from "../../hooks/useSceneObjects";
import { useAdaptiveQuality } from "../../hooks/useAdaptiveQuality";
import type { SceneItem } from "../../data/sceneItems";
import { screenSizeLabel, stageSpanOf, tallestOf, type ScreenItem } from "../../data/screens";
import { catalogEntry } from "../../data/catalog";

type Props = {
  screens: ScreenItem[];
  items: SceneItem[];
  extras: string[];
  onRemoveObject: (id: string) => void;
};

export default function Scene3D({ screens, items, extras, onRemoveObject }: Props) {
  const controls = useRef<CameraControllerHandle>(null);
  const [lightsEnabled, setLightsEnabled] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [selected, setSelected] = useState<{ id: string; label: string; transform: SceneTransform } | null>(null);
  const [interactionMode, setInteractionMode] = useState<"camera" | "move">("camera");
  const sceneObjects = useSceneObjects();
  const quality = useAdaptiveQuality();

  // Todo el escenario se dimensiona por el conjunto de pantallas, no por una sola.
  const stageSpan = stageSpanOf(screens);
  const tallest = tallestOf(screens);
  const soundItems = items.filter((item) => catalogEntry(item.key)?.category === "sound");
  const lightingItems = items.filter((item) => catalogEntry(item.key)?.category === "lighting");
  const showTruss = screens.some((screen) => screen.kind === "LED Outdoor")
    || lightingItems.some((item) => item.key === "sharpy" || item.key === "strobe");

  const showBooth = extras.includes("Consola DJ") || extras.includes("DJ");

  // Si el objeto seleccionado dejó de existir, la selección se descarta al
  // derivarla. Hacerlo en un efecto obligaría a un render extra.
  const selectionAlive = selected !== null && (selected.id === "dj-area"
    ? showBooth
    : screens.some((screen) => screen.id === selected.id) || items.some((item) => item.id === selected.id));
  const selectedId = selectionAlive ? selected.id : null;
  const moveMode = selectionAlive && interactionMode === "move";

  const selectObject = (id: string, label: string, transform: SceneTransform) => { setSelected({ id, label, transform }); setInteractionMode("camera"); };
  const changeObject = (id: string, transform: SceneTransform) => { sceneObjects.update(id, transform); setSelected((current) => current?.id === id ? { ...current, transform } : current); };
  const toggleObjectMove = (id: string) => { if (selectedId === id) setInteractionMode((mode) => mode === "move" ? "camera" : "move"); };
  const resetObject = (id: string) => { sceneObjects.reset(id); setSelected(null); setInteractionMode("camera"); };
  const removeObject = (id: string) => { sceneObjects.reset(id); onRemoveObject(id); setSelected(null); setInteractionMode("camera"); };

  useEffect(() => {
    const ids = [...screens.map((screen) => screen.id), ...items.map((item) => item.id)];
    if (showBooth) ids.push("dj-area");
    sceneObjects.removeMissing(ids);
  }, [screens, items, showBooth, sceneObjects.removeMissing]);

  const sceneLabel = screens.length === 1
    ? { title: screens[0].kind === "E-Poster" ? "E-Poster 1×2" : screens[0].kind, detail: screenSizeLabel(screens[0]) }
    : { title: `${screens.length} pantallas`, detail: `${String(Number(stageSpan.toFixed(1))).replace(".", ",")} m de ancho` };

  return <div className="scene-shell">
    <Canvas shadows={quality.shadows} dpr={quality.dpr} onPointerMissed={() => { if (interactionMode === "camera") setSelected(null); }} camera={{ position: [0, 1.68, 12.5], fov: 48, near: 0.1, far: 80 }} gl={{ antialias: !quality.lowPower, powerPreference: "high-performance" }}>
      <color attach="background" args={["#090c12"]} />
      <fog attach="fog" args={["#090c12", 17, 34]} />
      <hemisphereLight intensity={0.85} color="#d8f3ff" groundColor="#11131a" />
      <directionalLight position={[5, 10, 7]} intensity={2.1} castShadow={quality.shadows} shadow-mapSize={[quality.shadowMapSize, quality.shadowMapSize]} />
      <Suspense fallback={null}>
        <Stage width={stageSpan} />
        {showTruss && <Truss width={stageSpan} height={tallest} />}
        <ScreenLayer screens={screens} stageSpan={stageSpan} transforms={sceneObjects.transforms} selectedId={selectedId} moveMode={moveMode} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />
        <ReferencePerson screenWidth={stageSpan} />
        <EquipmentLayer items={soundItems} extras={extras} screenWidth={stageSpan} transforms={sceneObjects.transforms} selectedId={selectedId} moveMode={moveMode} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />
        <LightingLayer items={lightingItems} screenWidth={stageSpan} screenHeight={tallest} enabled={lightsEnabled} demo={demoMode} transforms={sceneObjects.transforms} selectedId={selectedId} moveMode={moveMode} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />
        {!quality.lowPower && <ContactShadows position={[0, 0.01, 0]} opacity={0.55} scale={22} blur={2.2} far={8} />}
        <Environment preset="city" environmentIntensity={0.3} />
      </Suspense>
      <CameraController ref={controls} enabled={!moveMode} screenWidth={stageSpan} />
    </Canvas>
    <div className="viewer-badge"><span /> 1 unidad = 1 metro</div>
    <div className="screen-scene-label"><strong>{sceneLabel.title}</strong><i /><span>{sceneLabel.detail}</span></div>
    <button className="reset-view" onClick={() => controls.current?.reset()}>Centrar vista</button>
    <div className="lighting-controls"><button className={lightsEnabled ? "active" : ""} aria-pressed={lightsEnabled} onClick={() => setLightsEnabled((value) => !value)}>Luces {lightsEnabled ? "ON" : "OFF"}</button><button className={demoMode ? "active" : ""} aria-pressed={demoMode} onClick={() => setDemoMode((value) => !value)}>Modo demo</button></div>
    <div className="viewer-help">Arrastrá para mirar · Pellizcá o desplazá para acercar</div>
  </div>;
}
