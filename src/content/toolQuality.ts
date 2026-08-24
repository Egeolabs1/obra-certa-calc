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
  { path: "/calculadora-pisos", reviewedAt: "2026-08-24", reviewer: "Equipe editorial Sua Obra Certa", sources: [{ label: "Manual técnico de assentamento", url: "https://www.anicer.com.br/", publisher: "ANICER", accessedAt: "2026-08-24" }, { label: "Orientações de produto e rejunte", url: "https://www.quartzolit.weber/", publisher: "Quartzolit", accessedAt: "2026-08-24" }], assumptions: ["As peças são instaladas em superfície regularizada e as dimensões são informadas pelo usuário."], limitations: ["Perdas dependem de paginação, recortes, lote e formato das peças.", "Não substitui o projeto de paginação nem a ficha do fabricante."], indexable: false },
  { path: "/calculadora-tijolos", reviewedAt: "2026-08-24", reviewer: "Equipe editorial Sua Obra Certa", sources: [{ label: "Materiais cerâmicos para alvenaria", url: "https://www.abceram.org.br/", publisher: "ABCERAM", accessedAt: "2026-08-24" }, { label: "Desempenho de sistemas de vedação", url: "https://www.abntcatalogo.com.br/", publisher: "ABNT Catálogo", accessedAt: "2026-08-24" }], assumptions: ["O cálculo usa dimensões nominais do bloco e junta informadas no modelo."], limitations: ["Não dimensiona alvenaria estrutural, fundações ou estabilidade.", "Projeto e especificação devem ser feitos por profissional habilitado."], indexable: false },
  { path: "/calculadora-concreto", reviewedAt: "2026-08-24", reviewer: "Equipe editorial Sua Obra Certa", sources: [{ label: "Normas e catálogo técnico", url: "https://www.abntcatalogo.com.br/", publisher: "ABNT Catálogo", accessedAt: "2026-08-24" }, { label: "Boas práticas de concreto", url: "https://ibracon.org.br/", publisher: "Instituto Brasileiro do Concreto", accessedAt: "2026-08-24" }], assumptions: ["O volume é estimado geometricamente a partir das dimensões fornecidas."], limitations: ["Não define traço, resistência, armadura, escoramento ou cura.", "Para elementos estruturais, siga projeto e especificação técnica."], indexable: false },
  { path: "/calculadora-telhado", reviewedAt: "2026-08-24", reviewer: "Equipe editorial Sua Obra Certa", sources: [{ label: "Manual de instalação de telhas", url: "https://www.abntcatalogo.com.br/", publisher: "ABNT Catálogo", accessedAt: "2026-08-24" }, { label: "Orientações de fabricantes", url: "https://www.brasilit.com.br/", publisher: "Brasilit", accessedAt: "2026-08-24" }], assumptions: ["A área considera o plano informado e a inclinação selecionada."], limitations: ["Não dimensiona estrutura, vento, cargas ou segurança de trabalho em altura.", "Confirme inclinação e sobreposição na ficha do fabricante."], indexable: false },
];

export function getToolQuality(path: string) { return TOOL_QUALITY.find((record) => record.path === path); }
