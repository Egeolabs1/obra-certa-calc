export type IndexableRoute = {
  path: string;
  kind: "tool" | "article" | "institutional";
  priority: "core" | "supporting";
};

export const INDEXABLE_ROUTES: readonly IndexableRoute[] = [
  { path: "/", kind: "institutional", priority: "core" },
  { path: "/blog", kind: "institutional", priority: "supporting" },
  { path: "/sobre", kind: "institutional", priority: "core" },
  { path: "/contato", kind: "institutional", priority: "supporting" },
  { path: "/politica-de-privacidade", kind: "institutional", priority: "supporting" },
  { path: "/termos-de-uso", kind: "institutional", priority: "supporting" },
  { path: "/mapa-do-site", kind: "institutional", priority: "supporting" },
  { path: "/calculadora-tinta", kind: "tool", priority: "core" },
  { path: "/calculadora-pisos", kind: "tool", priority: "core" },
  { path: "/calculadora-tijolos", kind: "tool", priority: "core" },
  { path: "/calculadora-concreto", kind: "tool", priority: "core" },
  { path: "/calculadora-telhado", kind: "tool", priority: "core" },
];

export const INDEXABLE_PATHS = INDEXABLE_ROUTES.map((route) => route.path);
