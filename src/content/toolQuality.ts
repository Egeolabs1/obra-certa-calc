export type Source = { label: string; url: string; publisher: string; accessedAt: string };
export type ToolQualityRecord = {
  path: string; reviewedAt: string; reviewer: string; sources: Source[];
  assumptions: string[]; limitations: string[]; indexable: boolean;
};

export const TOOL_QUALITY: readonly ToolQualityRecord[] = [
  {
    path: "/calculadora-tinta", reviewedAt: "2026-08-24", reviewer: "Equipe editorial Sua Obra Certa",
    sources: [
      { label: "Boletim técnico de rendimento de tintas", url: "https://www.abrafati.com.br/", publisher: "ABRAFATI", accessedAt: "2026-08-24" },
      { label: "Rendimento e preparação do produto", url: "https://www.suvinil.com.br/", publisher: "Suvinil", accessedAt: "2026-08-24" },
    ],
    assumptions: ["Portas e janelas usam dimensões médias editáveis pelo usuário.", "O rendimento informado é uma estimativa; prevalece a ficha técnica da tinta."],
    limitations: ["Não substitui a especificação do fabricante nem avaliação da superfície.", "Textura, porosidade, cor e método de aplicação podem alterar o consumo."], indexable: true,
  },
  ...["/calculadora-pisos", "/calculadora-tijolos", "/calculadora-concreto", "/calculadora-telhado"].map((path) => ({
    path, reviewedAt: "2026-08-24", reviewer: "Equipe editorial Sua Obra Certa", sources: [], assumptions: [], limitations: [], indexable: false,
  })),
];

export function getToolQuality(path: string) { return TOOL_QUALITY.find((record) => record.path === path); }
