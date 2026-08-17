"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import CameraController, { CameraControllerHandle } from "./CameraController";
import ScreenLayer from "./ScreenLayer";
import Stage from "./Stage";
import Truss from "./Truss";
import EquipmentLayer from "./EquipmentLayer";
import LightingLayer from "./LightingLayer";
import { useSceneObjects, type SceneTransform } from "../../hooks/useSceneObjects";
import { useAdaptiveQuality } from "../../hooks/useAdaptiveQuality";
import type { SceneItem } from "../../data/sceneItems";
import { layoutScreens, screenSizeLabel, stageSpanOf, tallestOf, type ScreenItem } from "../../data/screens";
import { catalogEntry } from "../../data/catalog";
import { ENVIRONMENTS, environmentOf, type EnvironmentKey } from "../../data/environments";
import SceneSurroundings from "./SceneSurroundings";
import SceneObject from "./SceneObject";
import { useTranslate } from "../LanguageContext";

type Props = {
  screens: ScreenItem[];
  items: SceneItem[];
  extras: string[];
  onRemoveObject: (id: string) => void;
};

export default function Scene3D({ screens, items, extras, onRemoveObject }: Props) {
  const tx = useTranslate();
  const shell = useRef<HTMLDivElement>(null);
  const controls = useRef<CameraControllerHandle>(null);
  const [inView, setInView] = useState(true);
  const [lightsEnabled, setLightsEnabled] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [environmentKey, setEnvironmentKey] = useState<EnvironmentKey>("salon");
  const [selected, setSelected] = useState<{ id: string; label: string; transform: SceneTransform } | null>(null);
  const [interactionMode, setInteractionMode] = useState<"camera" | "move">("camera");
  const sceneObjects = useSceneObjects();
  const removeMissing = sceneObjects.removeMissing;
  const quality = useAdaptiveQuality();
  const environment = environmentOf(environmentKey);

  // Las pantallas movidas amplían el área de cámara, pero no arrastran otros objetos.
  const placedScreens = layoutScreens(screens).map(({ item, x }) => ({
    item,
    position: sceneObjects.transforms[item.id]?.position ?? [x, 1, 0],
  }));
  const leftEdge = Math.min(...placedScreens.map(({ item, position }) => position[0] - item.width / 2));
  const rightEdge = Math.max(...placedScreens.map(({ item, position }) => position[0] + item.width / 2));
  const stageSpan = Math.max(1, rightEdge - leftEdge);
  // La tarima responde a cantidad y medidas, pero no persigue objetos movidos.
  const fixedStageSpan = stageSpanOf(screens);
  const fixedStageDepth = Math.max(7, fixedStageSpan * .75);
  const fixedStageCenterZ = (fixedStageDepth - 4.5) / 2;
  const rigCenterX = 0;
  const rigCenterZ = 0;
  const tallest = tallestOf(screens);
  const soundItems = items.filter((item) => catalogEntry(item.key)?.category === "sound");
  const lightingItems = items.filter((item) => catalogEntry(item.key)?.category === "lighting");
  const showTruss = screens.some((screen) => screen.kind === "LED Outdoor")
    || lightingItems.some((item) => item.key === "sharpy" || item.key === "strobe" || item.key === "mirror-ball" || item.key === "pinspot");

  const showBooth = extras.includes("Consola DJ") || extras.includes("DJ");
  const showStage = extras.includes("Escenario");
  const stageLift = showStage ? .82 : 0;
  const floorOffset = showStage ? 0 : -.82;

  // Si el objeto seleccionado dejó de existir, la selección se descarta al
  // derivarla. Hacerlo en un efecto obligaría a un render extra.
  const selectionAlive = selected !== null && (selected.id === "dj-area"
    ? showBooth
    : selected.id === "lighting-rig"
      ? showTruss
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
    if (showTruss) ids.push("lighting-rig");
    removeMissing(ids);
  }, [screens, items, showBooth, showTruss, removeMissing]);

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
        <Stage width={fixedStageSpan} depth={fixedStageDepth} centerX={0} centerZ={fixedStageCenterZ} environment={environment} showPlatform={showStage} />
        {showTruss && <SceneObject
          id="lighting-rig"
          label={tx("Estructura de luces")}
          defaultPosition={[rigCenterX, 0, rigCenterZ]}
          transform={sceneObjects.transforms["lighting-rig"]}
          selected={selectedId === "lighting-rig"}
          moveMode={moveMode && selectedId === "lighting-rig"}
          bounds={{ minX: -fixedStageSpan / 2 - 3, maxX: fixedStageSpan / 2 + 3, minZ: -1.75, maxZ: 4.25 }}
          size={[fixedStageSpan + 1.7, tallest + 1.75, .45]}
          canRemove={false}
          onSelect={selectObject}
          onChange={changeObject}
          onToggleMove={toggleObjectMove}
          onReset={resetObject}
          onRemove={removeObject}
        >
          <Truss width={fixedStageSpan} height={tallest} position={[0, stageLift, 0]} />
          <LightingLayer items={lightingItems} screenWidth={fixedStageSpan} screenHeight={tallest} enabled={lightsEnabled} demo={demoMode} origin={[0, 0]} stageLift={stageLift} transforms={sceneObjects.transforms} selectedId={selectedId} moveMode={moveMode} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />
        </SceneObject>}
        {!showTruss && lightingItems.length > 0 && <LightingLayer items={lightingItems} screenWidth={fixedStageSpan} screenHeight={tallest} enabled={lightsEnabled} demo={demoMode} origin={[rigCenterX, rigCenterZ]} stageLift={stageLift} transforms={sceneObjects.transforms} selectedId={selectedId} moveMode={moveMode} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />}
        <group position={[0, floorOffset, 0]}>
          <ScreenLayer screens={screens} stageSpan={stageSpan} transforms={sceneObjects.transforms} selectedId={selectedId} moveMode={moveMode} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />
          <EquipmentLayer items={soundItems} extras={extras} screenWidth={stageSpan} transforms={sceneObjects.transforms} selectedId={selectedId} moveMode={moveMode} onSelect={selectObject} onChange={changeObject} onToggleMove={toggleObjectMove} onReset={resetObject} onRemove={removeObject} />
        </group>
        {!quality.mobile && !quality.lowPower && <ContactShadows position={[0, 0.01, 0]} opacity={environment.contactShadow} scale={22} blur={2.2} far={8} frames={1} resolution={256} />}
      </Suspense>
      <CameraController ref={controls} enabled={!moveMode} screenWidth={stageSpan} />
    </Canvas>
    <div className="viewer-badge"><span /> {tx("1 unidad = 1 metro")}</div>
    <div className="screen-scene-label"><strong>{tx(environment.label)}</strong><i /><span>{tx(sceneLabel.title)} · {tx(sceneLabel.detail)}</span></div>
    <button className="reset-view" onClick={() => controls.current?.reset()}>{tx("Centrar vista")}</button>
    <div className="environment-controls" role="group" aria-label={tx("Ambiente del escenario")}>{ENVIRONMENTS.map((option) => (
      <button key={option.key} className={environmentKey === option.key ? "active" : ""} aria-pressed={environmentKey === option.key} title={tx(option.hint)} onClick={() => setEnvironmentKey(option.key)}>{tx(option.label)}</button>
    ))}</div>
    <div className="lighting-controls"><button className={lightsEnabled ? "active" : ""} aria-pressed={lightsEnabled} onClick={() => setLightsEnabled((value) => !value)}>{tx("Luces")} {lightsEnabled ? "ON" : "OFF"}</button><button className={demoMode ? "active" : ""} aria-pressed={demoMode} onClick={() => setDemoMode((value) => !value)}>{tx("Luces en movimiento")}</button></div>
    <div className="viewer-help">{tx("Arrastrá para mirar · Pellizcá o desplazá para acercar")}</div>
  </div>;
}
