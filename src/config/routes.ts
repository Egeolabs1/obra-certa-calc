import {
    Calculator,
    PaintBucket,
    BrickWall,
    Hammer,
    Zap,
    Droplets,
    Trees,
    Thermometer,
    CalendarDays,
    CheckSquare,
    Users,
    Home,
    Ruler,
    Scissors,
    Armchair,
    Video,
    MonitorPlay,
    Waves,
    LucideIcon
} from "lucide-react";

export interface AppRoute {
    title: string;
    path: string;
    category: string;
    icon: LucideIcon;
    keywords?: string[];
}

export const appRoutes: AppRoute[] = [
    // Estrutura
    { title: "Calculadora de Tijolos", path: "/calculadora-tijolos", category: "Estrutura", icon: BrickWall, keywords: ["alvenaria", "bloco", "muro", "construção"] },
    { title: "Calculadora de Concreto", path: "/calculadora-concreto", category: "Estrutura", icon: Calculator, keywords: ["cimento", "areia", "pedra", "fundaçao", "laje"] },
    { title: "Calculadora de Telhado", path: "/calculadora-telhado", category: "Estrutura", icon: Home, keywords: ["telha", "cobertura", "calha", "madeira"] },
    { title: "Calculadora de Escada", path: "/calculadora-escada", category: "Estrutura", icon: Ruler, keywords: ["degrau", "blondel", "patamar", "espelho"] },
    { title: "Calculadora de Rampa", path: "/calculadora-rampa", category: "Estrutura", icon: Ruler, keywords: ["acessibilidade", "inclinação", "cadeirante"] },
    { title: "Calculadora de Vidro", path: "/calculadora-vidro", category: "Estrutura", icon: Calculator, keywords: ["janela", "peso", "temperado", "laminado"] },

    // Acabamento
    { title: "Calculadora de Tinta", path: "/calculadora-tinta", category: "Acabamento", icon: PaintBucket, keywords: ["pintura", "parede", "teto", "demão"] },
    { title: "Calculadora de Pisos", path: "/calculadora-pisos", category: "Acabamento", icon: Calculator, keywords: ["revestimento", "porcelanato", "ceramica", "azulejo", "metro quadrado"] },
    { title: "Calculadora de Rodapé", path: "/calculadora-rodape", category: "Acabamento", icon: Ruler, keywords: ["perimetro", "linear", "acabamento"] },
    { title: "Calculadora de Drywall", path: "/calculadora-drywall", category: "Acabamento", icon: Hammer, keywords: ["gesso", "parede", "forro", "placa"] },
    { title: "Calculadora de Rejunte", path: "/calculadora-rejunte", category: "Acabamento", icon: Calculator, keywords: ["fresta", "espaçamento", "junta"] },
    { title: "Calculadora de Azulejos", path: "/calculadora-azulejos", category: "Acabamento", icon: Calculator, keywords: ["revestimento", "banheiro", "cozinha"] },

    // Jardim
    { title: "Calculadora de Grama", path: "/calculadora-grama", category: "Jardim", icon: Trees, keywords: ["jardim", "paisagismo", "verde"] },
    { title: "Calculadora de Deck", path: "/calculadora-deck", category: "Jardim", icon: Hammer, keywords: ["madeira", "piscina", "area externa"] },
    { title: "Calculadora de Pavers", path: "/calculadora-pavers", category: "Jardim", icon: BrickWall, keywords: ["calçada", "bloco intertravado", "piso"] },
    { title: "Calculadora de Piscina", path: "/calculadora-piscina", category: "Jardim", icon: Waves, keywords: ["água", "litros", "volume"] },
    { title: "Calculadora de Cerca", path: "/calculadora-cerca", category: "Jardim", icon: Ruler, keywords: ["muro", "alambrado", "limite"] },

    // Instalações
    { title: "Calculadora de Fios", path: "/calculadora-fios", category: "Instalações", icon: Zap, keywords: ["eletrica", "cabo", "bitola", "corrente", "amperagem"] },
    { title: "Calculadora de Ar Condicionado", path: "/calculadora-ar-condicionado", category: "Instalações", icon: Thermometer, keywords: ["btu", "refrigeração", "climatização"] },
    { title: "Calculadora de Iluminação", path: "/calculadora-iluminacao", category: "Instalações", icon: Zap, keywords: ["lampada", "luz", "lux", "lumen", "watts"] },
    { title: "Calculadora de Energia", path: "/calculadora-energia", category: "Instalações", icon: Zap, keywords: ["conta", "kwh", "consumo", "elétrica"] },
    { title: "Calculadora de Caixa D'água", path: "/calculadora-caixa-agua", category: "Instalações", icon: Droplets, keywords: ["reservatório", "litros", "consumo"] },
    { title: "Calculadora de CFTV", path: "/calculadora-cftv", category: "Instalações", icon: Video, keywords: ["camera", "segurança", "hd", "gravacao"] },

    // Decoração
    { title: "Calculadora de Papel de Parede", path: "/calculadora-papel-parede", category: "Decoração", icon: Scissors, keywords: ["rolo", "parede", "decor"] },
    { title: "Calculadora de Cortinas", path: "/calculadora-cortinas", category: "Decoração", icon: Scissors, keywords: ["tecido", "janela", "pano"] },
    { title: "Calculadora de Móveis Planejados", path: "/calculadora-moveis-planejados", category: "Decoração", icon: Armchair, keywords: ["marcenaria", "armario", "cozinha", "quarto"] },

    // Gestão / Outros
    { title: "Calculadora de Churrasco", path: "/calculadora-churrasco", category: "Gestão", icon: Users, keywords: ["carne", "bebida", "festa", "rateio"] },
    { title: "Checklist de Vistoria", path: "/checklist-vistoria", category: "Gestão", icon: CheckSquare, keywords: ["inspeção", "entrega", "chaves", "apartamento"] },
    { title: "Cronograma de Obra", path: "/calculadora-cronograma", category: "Gestão", icon: CalendarDays, keywords: ["tempo", "prazo", "gantt", "etapas"] },
    { title: "Calculadora de Mão de Obra", path: "/calculadora-mao-de-obra", category: "Gestão", icon: Users, keywords: ["pedreiro", "pintor", "diaria", "custo"] },
    { title: "Calculadora de Financiamento", path: "/calculadora-financiamento", category: "Gestão", icon: Calculator, keywords: ["juros", "parcela", "banco", "imovel"] },
];
