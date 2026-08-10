"use client";

import { useConfigurator } from "../../hooks/useConfigurator";
import { lazy, Suspense } from "react";
import ConfiguratorPanel from "./ConfiguratorPanel";
import QuoteSummary from "./QuoteSummary";
import SceneLoader from "./SceneLoader";

const Scene3D = lazy(() => import("../scene/Scene3D"));

export default function Configurator() {
  const { config, actions } = useConfigurator();
  const scene = <Suspense fallback={<SceneLoader />}><Scene3D screens={config.screens} items={config.items} extras={config.extras} onRemoveObject={actions.removeSceneInstance} /></Suspense>;
  return <section id="cotizador" className="configurator-section">
    <div className="configurator-layout">
      <div className="mobile-scene">{scene}</div>
      <ConfiguratorPanel config={config} actions={actions} />
      <div className="desktop-scene">{scene}</div>
    </div>
    <QuoteSummary config={config} />
  </section>;
}
