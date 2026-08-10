"use client";

import { useConfigurator } from "../../hooks/useConfigurator";
import { lazy, Suspense } from "react";
import ConfiguratorPanel from "./ConfiguratorPanel";
import QuoteSummary from "./QuoteSummary";
import SceneLoader from "./SceneLoader";

const Scene3D = lazy(() => import("../scene/Scene3D"));

export default function Configurator() {
  const { config, actions, sizeIndex, eposterQuantity } = useConfigurator();
  return <section id="cotizador" className="configurator-section">
    <div className="configurator-layout">
      <div className="mobile-scene"><Suspense fallback={<SceneLoader />}><Scene3D screenType={config.screen.type} screenQuantity={config.screen.quantity} width={config.screen.width} height={config.screen.height} sound={config.sound} lighting={config.lighting} extras={config.extras} onRemoveObject={actions.removeSceneInstance} /></Suspense></div>
      <ConfiguratorPanel config={config} actions={actions} sizeIndex={sizeIndex} eposterQuantity={eposterQuantity} />
      <div className="desktop-scene"><Suspense fallback={<SceneLoader />}><Scene3D screenType={config.screen.type} screenQuantity={config.screen.quantity} width={config.screen.width} height={config.screen.height} sound={config.sound} lighting={config.lighting} extras={config.extras} onRemoveObject={actions.removeSceneInstance} /></Suspense></div>
    </div>
    <QuoteSummary config={config} />
  </section>;
}
