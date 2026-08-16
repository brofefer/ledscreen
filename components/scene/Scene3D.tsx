"use client";

import { ContactShadows } from "@react-three/drei";
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
import { DEFAULT_ENVIRONMENT, ENVIRONMENTS, environmentOf, type EnvironmentKey } from "../../data/environments";
import SceneSurroundings from "./SceneSurroundings";

type Props = {
  screens: ScreenItem[];
  items: SceneItem[];
  extras: string[];
  onRemoveObject: (id: string) => void;
};

export default function Scene3D({ screens, items, extras, onRemoveObject }: Props) {
  const shell = useRef<HTMLDivElement>(null);
  const controls = useRef<CameraControllerHandle>(null);
  const [inView, setInView] = useState(true);
  const [lightsEnabled, setLightsEnabled] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [environmentKey, setEnvironmentKey] = useState<EnvironmentKey>(DEFAULT_ENVIRONMENT);
  const [selected, setSelected] = useState<{ id: string; label: string; transform: SceneTransform } | null>(null);
  const [interactionMode, setInteractionMode] = useState<"camera" | "move">("camera");
  const sceneObjects = useSceneObjects();
  const removeMissing = sceneObjects.removeMissing;
  const quality = useAdaptiveQuality();
  const environment = environmentOf(environmentKey);

  // Todo el escenario se dimensiona por el conjunto de pantallas, no por una sola.
  const stageSpan = stageSpanOf(screens);
  const tallest = tallestOf(screens);
  const soundItems = items.filter((item) => catalogEntry(item.key)?.category === "sound");
  const lightingItems = items.filter((item) => catalogEntry(item.key)?.category === "lighting");
  const showTruss = screens.some((screen) => screen.kind === "LED Outdoor")
    || lightingItems.some((item) => item.key === "sharpy" || item.key === "strobe" || item.key === "mirror-ball" || item.key === "pinspot");

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
    removeMissing(ids);
  }, [screens, items, showBooth, removeMissing]);

  useEffect(() => {
    const element = shell.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "180px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const sceneLabel = screens.length === 1
    ? { title: screens[0].kind === "E-Poster" ? "E-Poster 1×2" : screens[0].kind, detail: screenSizeLabel(screens[0]) }
    : { title: `${screens.length} pantallas`, detail: `${String(Number(stageSpan.toFixed(1))).replace(".", ",")} m de ancho` };

  return <div className="scene-shell" ref={shell}>
    <Canvas frameloop={inView ? "always" : "never"} shadows={quality.shadows} dpr={quality.dpr} performance={{ min: .55 }} onPointerMissed={() => { if (interactionMode === "camera") setSelected(null); }} camera={{ position: [0, 1.68, 12.5], fov: 48, near: 0.1, far: 80 }} gl={{ antialias: !quality.mobile && !quality.lowPower, powerPreference: "high-performance" }}>
      <color attach="background" args={[environment.background]} />
      <fog attach="fog" args={[environment.fog.color, environment.fog.near, environment.fog.far]} />
      <hemisphereLight intensity={environment.hemisphere.intensity} color={environment.hemisphere.sky} groundColor={environment.hemisphere.ground} />
      <directionalLight position={environment.sun.position} color={environment.sun.color} intensity={environment.sun.intensity} castShadow={quality.shadows} shadow-mapSize={[quality.shadowMapSize, quality.shadowMapSize]} />
      <directionalLight position={[0, 3, 12]} color={environment.fill.color} intensity={environment.fill.intensity} />
      <Suspense fallback={null}>
        <SceneSurroundings environment={environment} span={stageSpan} />
        <Stage width={stageSpan} environment={environment} />
        {showTruss && <Truss width={stageSpan} height={tallest} />}
        <ScreenLayer screens={screens} stageSpan={stageSpan} transforms={sceneObjects.transforms} selectedId={selectedId} moveMode={moveMode} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />
        <ReferencePerson screenWidth={stageSpan} />
        <EquipmentLayer items={soundItems} extras={extras} screenWidth={stageSpan} transforms={sceneObjects.transforms} selectedId={selectedId} moveMode={moveMode} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />
        <LightingLayer items={lightingItems} screenWidth={stageSpan} screenHeight={tallest} enabled={lightsEnabled} demo={demoMode} transforms={sceneObjects.transforms} selectedId={selectedId} moveMode={moveMode} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />
        {!quality.mobile && !quality.lowPower && <ContactShadows position={[0, 0.01, 0]} opacity={environment.contactShadow} scale={22} blur={2.2} far={8} frames={1} resolution={256} />}
      </Suspense>
      <CameraController ref={controls} enabled={!moveMode} screenWidth={stageSpan} />
    </Canvas>
    <div className="viewer-badge"><span /> 1 unidad = 1 metro</div>
    <div className="screen-scene-label"><strong>{sceneLabel.title}</strong><i /><span>{sceneLabel.detail}</span></div>
    <button className="reset-view" onClick={() => controls.current?.reset()}>Centrar vista</button>
    <div className="environment-controls" role="group" aria-label="Ambiente del escenario">{ENVIRONMENTS.map((option) => (
      <button key={option.key} className={environmentKey === option.key ? "active" : ""} aria-pressed={environmentKey === option.key} title={option.hint} onClick={() => setEnvironmentKey(option.key)}>{option.label}</button>
    ))}</div>
    <div className="lighting-controls"><button className={lightsEnabled ? "active" : ""} aria-pressed={lightsEnabled} onClick={() => setLightsEnabled((value) => !value)}>Luces {lightsEnabled ? "ON" : "OFF"}</button><button className={demoMode ? "active" : ""} aria-pressed={demoMode} onClick={() => setDemoMode((value) => !value)}>Modo demo</button></div>
    <div className="viewer-help">Arrastrá para mirar · Pellizcá o desplazá para acercar</div>
  </div>;
}
