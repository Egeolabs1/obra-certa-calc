import { renderToString } from "react-dom/server";
import { HelmetData, HelmetProvider } from "react-helmet-async";
import App from "./App";

export function renderRoute(path: string) {
  const helmetContext = {} as HelmetData;
  const html = renderToString(<App location={path} helmetContext={helmetContext} />);
  const helmet = (helmetContext as unknown as { helmet?: HelmetData["helmet"] }).helmet;
  return { html, helmet };
}
