"use client";

import { useConfigurator } from "../../hooks/useConfigurator";
import { lazy, Suspense } from "react";
import ConfiguratorPanel from "./ConfiguratorPanel";
import QuoteSummary from "./QuoteSummary";
import SceneLoader from "./SceneLoader";

const Scene3D = lazy(() => import("../scene/Scene3D"));

export default function Configurator() {
  const { config, actions } = useConfigurator();
  return <section id="cotizador" className="configurator-section">
    <div className="configurator-intro">
      <div className="eyebrow">CONFIGURADOR 3D</div>
      <h2>Armá tu escenario</h2>
      <p>Elegí pantallas, sonido e iluminación y visualizá cómo podría verse tu montaje a escala.</p>
    </div>
    <div className="configurator-layout">
      <div className="config-scene"><Suspense fallback={<SceneLoader />}><Scene3D screens={config.screens} items={config.items} extras={config.extras} onRemoveObject={actions.removeSceneInstance} /></Suspense></div>
      <ConfiguratorPanel config={config} actions={actions} />
    </div>
    <QuoteSummary config={config} />
  </section>;
}
