import { useTranslate } from "../LanguageContext";

export default function SceneLoader() {
  const tx = useTranslate();
  return <div className="scene-loader" role="status"><span /><strong>{tx("Preparando escenario 3D")}</strong><small>{tx("Cargando la experiencia interactiva…")}</small></div>;
}
