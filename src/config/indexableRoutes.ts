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
  { path: "/blog/seguranca-em-obras-nr18-basico", kind: "article", priority: "supporting" },
  { path: "/blog/comparativo-precos-materiais-construcao-2026", kind: "article", priority: "supporting" },
  { path: "/blog/como-contratar-profissionais-construcao-pedreiro-engenheiro", kind: "article", priority: "supporting" },
  { path: "/blog/cronograma-de-obra-realista-passo-a-passo", kind: "article", priority: "supporting" },
  { path: "/blog/orcamento-de-obra-completo-calcular-economizar", kind: "article", priority: "supporting" },
  { path: "/blog/como-escolher-materiais-construcao-guia-2026", kind: "article", priority: "supporting" },
  { path: "/blog/guia-completo-construcao-civil-2026", kind: "article", priority: "supporting" },
  { path: "/blog/normas-abnt-construcao-civil-nbr-essenciais", kind: "article", priority: "supporting" },
  { path: "/blog/erros-comuns-reformas-construcao", kind: "article", priority: "supporting" },
  { path: "/blog/construcao-sustentavel-2026-tendencias", kind: "article", priority: "supporting" },
];

export const INDEXABLE_PATHS = INDEXABLE_ROUTES.map((route) => route.path);
