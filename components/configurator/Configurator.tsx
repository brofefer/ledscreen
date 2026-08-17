"use client";

import { useConfigurator } from "../../hooks/useConfigurator";
import { lazy, Suspense, useEffect, useState } from "react";
import { FaExpand, FaXmark } from "react-icons/fa6";
import ConfiguratorPanel from "./ConfiguratorPanel";
import QuoteSummary from "./QuoteSummary";
import SceneLoader from "./SceneLoader";
import { useTranslate } from "../LanguageContext";

const Scene3D = lazy(() => import("../scene/Scene3D"));

export default function Configurator() {
  const tx = useTranslate();
  const { config, actions } = useConfigurator();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  useEffect(() => {
    if (!workspaceOpen) return;
    document.body.classList.add("configurator-workspace-open");
    return () => document.body.classList.remove("configurator-workspace-open");
  }, [workspaceOpen]);

  return <section id="cotizador" className={workspaceOpen ? "configurator-section workspace-active" : "configurator-section"}>
    <button className="workspace-open" type="button" onClick={() => setWorkspaceOpen(true)}><FaExpand aria-hidden="true" /> {tx("Abrir Cotizador 3D")}</button>
    {workspaceOpen && <button className="workspace-close" type="button" aria-label={tx("Cerrar Cotizador 3D")} onClick={() => setWorkspaceOpen(false)}><FaXmark aria-hidden="true" /></button>}
    <div className="configurator-intro">
      <div className="eyebrow">{tx("COTIZADOR 3D")}</div>
      <h2>{tx("Armá tu escenario")}</h2>
      <p>{tx("Elegí pantallas, sonido e iluminación y visualizá cómo podría verse tu montaje a escala.")}</p>
    </div>
    <div className="configurator-layout">
      <div className="config-scene"><Suspense fallback={<SceneLoader />}><Scene3D screens={config.screens} items={config.items} extras={config.extras} onRemoveObject={actions.removeSceneInstance} /></Suspense></div>
      <ConfiguratorPanel config={config} actions={actions} />
    </div>
    <QuoteSummary config={config} />
  </section>;
}
