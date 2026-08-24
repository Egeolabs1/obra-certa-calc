import { useState, useRef } from "react";
import { Container, Calculator, ShoppingCart, ExternalLink, ArrowLeft, Info, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import SEO from "@/components/SEO";
import { generateCalculatorSchema, generateFAQSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";
import { ProductCard } from "@/components/ProductCard";

interface TracoConcreto {
  nome: string;
  descricao: string;
  cimento: number; // kg por m³
  areia: number; // kg por m³
  brita: number; // kg por m³
  agua: number; // litros por m³
  resistencia: string;
}

const TRACOS_CONCRETO: Record<string, TracoConcreto> = {
  "magro": {
    nome: "Concreto Magro",
    descricao: "Regularização, contrapisos",
    cimento: 150,
    areia: 650,
    brita: 800,
    agua: 120,
    resistencia: "~10 MPa",
  },
  "estrutural-15": {
    nome: "Estrutural Leve (1:3:4)",
    descricao: "Fundações simples, muros",
    cimento: 250,
    areia: 600,
    brita: 800,
    agua: 150,
    resistencia: "~15 MPa",
  },
  "estrutural-20": {
    nome: "Estrutural Médio (1:2,5:3,5)",
    descricao: "Lajes, vigas, pilares residenciais",
    cimento: 300,
    areia: 550,
    brita: 850,
    agua: 170,
    resistencia: "~20 MPa",
  },
  "estrutural-25": {
    nome: "Estrutural Forte (1:2:3)",
    descricao: "Estruturas com maior carga",
    cimento: 350,
    areia: 500,
    brita: 900,
    agua: 180,
    resistencia: "~25 MPa",
  },
  "estrutural-30": {
    nome: "Alta Resistência (1:1,5:2,5)",
    descricao: "Pilares, estruturas especiais",
    cimento: 400,
    areia: 450,
    brita: 900,
    agua: 190,
    resistencia: "~30 MPa",
  },
};

interface ResultadoCalculo {
  volumeTotal: number;
  traco: TracoConcreto;
  materiais: {
    cimentoKg: number;
    sacosCimento: number;
    areiaKg: number;
    areiaM3: number;
    britaKg: number;
    britaM3: number;
    aguaLitros: number;
  };
  perdas: number;
}

const CalculadoraConcreto = () => {
  const { addItem } = useOrcamento();
  const [tipoCalculo, setTipoCalculo] = useState("volume");
  const [comprimento, setComprimento] = useState("");
  const [largura, setLargura] = useState("");
  const [altura, setAltura] = useState("");
  const [volumeManual, setVolumeManual] = useState("");
  const [traco, setTraco] = useState("estrutural-20");
  const [perdas, setPerdas] = useState("10");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [erro, setErro] = useState("");
  const faqItems = [
    {
      question: "Como calcular concreto por m3?",
      answer: "Voce pode informar o volume direto em m3 ou calcular por dimensoes (comprimento x largura x espessura). Depois aplique o traco e a margem de perdas."
    },
    {
      question: "Quantos sacos de cimento por metro cubico de concreto?",
      answer: "Varia com o traco. Em concreto estrutural medio, normalmente fica perto de 6 sacos de 50kg por m3."
    },
    {
      question: "Qual margem de perda usar no concreto?",
      answer: "Use 10 por cento como referencia geral. Em execucao manual ou com baixa previsibilidade, considere 15 por cento."
    }
  ];
  const resultRef = useRef<HTMLDivElement>(null);

  const parseNumero = (valor: string): number => {
    const valorLimpo = valor.replace(",", ".").trim();
    const numero = parseFloat(valorLimpo);
    return isNaN(numero) ? 0 : numero;
  };

  const calcular = () => {
    setErro("");
    setResultado(null);

    let volume = 0;

    if (tipoCalculo === "volume") {
      volume = parseNumero(volumeManual);
      if (volume <= 0) {
        setErro("Por favor, informe o volume em m³.");
        return;
      }
    } else {
      const comp = parseNumero(comprimento);
      const larg = parseNumero(largura);
      const alt = parseNumero(altura);

      if (comp <= 0 || larg <= 0 || alt <= 0) {
        setErro("Por favor, informe todas as dimensões.");
        return;
      }

      volume = comp * larg * alt;
    }

    const tracoSelecionado = TRACOS_CONCRETO[traco];
    const margemPerdas = parseNumero(perdas) || 10;
    const fatorPerdas = 1 + (margemPerdas / 100);
    const volumeComPerdas = volume * fatorPerdas;

    // Cálculo dos materiais
    const cimentoKg = Math.ceil(volumeComPerdas * tracoSelecionado.cimento);
    const sacosCimento = Math.ceil(cimentoKg / 50);

    const areiaKg = Math.ceil(volumeComPerdas * tracoSelecionado.areia);
    const areiaM3 = Math.round((areiaKg / 1500) * 100) / 100; // densidade areia ~1500 kg/m³

    const britaKg = Math.ceil(volumeComPerdas * tracoSelecionado.brita);
    const britaM3 = Math.round((britaKg / 1400) * 100) / 100; // densidade brita ~1400 kg/m³

    const aguaLitros = Math.ceil(volumeComPerdas * tracoSelecionado.agua);

    setResultado({
      volumeTotal: Math.round(volumeComPerdas * 100) / 100,
      traco: tracoSelecionado,
      materiais: {
        cimentoKg,
        sacosCimento,
        areiaKg,
        areiaM3,
        britaKg,
        britaM3,
        aguaLitros,
      },
      perdas: margemPerdas,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title="Calculadora de Concreto por m3"
        description="Calcule traco de concreto por m3: cimento, areia, brita e agua para laje, piso, viga e fundacao."
        url="https://www.suaobracerta.com.br/calculadora-concreto"
        noindex
        schema={[
          generateCalculatorSchema(
            "Calculadora de Concreto",
            "Calculadora de traço de concreto para lajes, pisos e fundações.",
            "https://www.suaobracerta.com.br/calculadora-concreto"
          ),
          generateFAQSchema(faqItems)
        ]}
      />
      <div className="print:hidden">
        <Header />
      </div>

      <main className="flex-1">
        {/* Ad Placeholder - Topo */}
        <div className="container pt-6">
          <AdPlaceholder id="ad-topo-calc-concreto" className="max-w-3xl mx-auto print:hidden" />
        </div>

        <div className="container py-8 md:py-12">
          <div className="mx-auto max-w-2xl">
            {/* Breadcrumb */}
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors print:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Início
            </Link>

            {/* Title */}
            <div className="mb-8 animate-fade-up">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <Container className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Calculadora de Concreto
                </h1>
              </div>
              <p className="text-muted-foreground">
                Calcule a quantidade de cimento, areia, brita e água para fundações, lajes e estruturas.
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-up print:hidden">
              <div className="grid gap-5">
                {/* Tipo de Cálculo */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">
                    Como deseja calcular?
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={tipoCalculo === "dimensoes" ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setTipoCalculo("dimensoes")}
                    >
                      Por Dimensões
                    </Button>
                    <Button
                      type="button"
                      variant={tipoCalculo === "volume" ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setTipoCalculo("volume")}
                    >
                      Por Volume (m³)
                    </Button>
                  </div>
                </div>

                {/* Inputs de Dimensões ou Volume */}
                {tipoCalculo === "dimensoes" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-foreground font-medium">Dimensões da Estrutura</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Informe comprimento, largura e altura/espessura em metros</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="comprimento" className="text-sm text-muted-foreground">
                          Comprimento (m)
                        </Label>
                        <Input
                          id="comprimento"
                          type="text"
                          inputMode="decimal"
                          placeholder="Ex: 5.00"
                          value={comprimento}
                          onChange={(e) => setComprimento(e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="largura" className="text-sm text-muted-foreground">
                          Largura (m)
                        </Label>
                        <Input
                          id="largura"
                          type="text"
                          inputMode="decimal"
                          placeholder="Ex: 4.00"
                          value={largura}
                          onChange={(e) => setLargura(e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="altura" className="text-sm text-muted-foreground">
                          Altura/Espessura (m)
                        </Label>
                        <Input
                          id="altura"
                          type="text"
                          inputMode="decimal"
                          placeholder="Ex: 0.10"
                          value={altura}
                          onChange={(e) => setAltura(e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="volumeManual" className="text-foreground font-medium">
                      Volume de concreto (m³)
                    </Label>
                    <Input
                      id="volumeManual"
                      type="text"
                      inputMode="decimal"
                      placeholder="Ex: 2.50"
                      value={volumeManual}
                      onChange={(e) => setVolumeManual(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                )}

                {/* Tipo de Traço */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="traco" className="text-foreground font-medium">
                      Tipo de Concreto / Aplicação
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px]">
                        <p>Escolha o traço de acordo com a aplicação. Quanto maior a resistência (MPa), mais cimento é utilizado.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={traco} onValueChange={setTraco}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="magro">Concreto Magro (~10 MPa) - Contrapisos</SelectItem>
                      <SelectItem value="estrutural-15">Estrutural Leve (~15 MPa) - Fundações simples</SelectItem>
                      <SelectItem value="estrutural-20">Estrutural Médio (~20 MPa) - Lajes, vigas</SelectItem>
                      <SelectItem value="estrutural-25">Estrutural Forte (~25 MPa) - Maior carga</SelectItem>
                      <SelectItem value="estrutural-30">Alta Resistência (~30 MPa) - Pilares</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Margem de Perdas */}
                <div className="space-y-2">
                  <Label htmlFor="perdas" className="text-foreground font-medium">
                    Margem de perdas (%)
                  </Label>
                  <Select value={perdas} onValueChange={setPerdas}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5% (Betoneira profissional)</SelectItem>
                      <SelectItem value="10">10% (Recomendado)</SelectItem>
                      <SelectItem value="15">15% (Manual/improvisado)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Erro */}
                {erro && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive animate-scale-in">
                    {erro}
                  </div>
                )}

                {/* Botão Calcular */}
                <Button onClick={calcular} size="xl" className="w-full mt-2">
                  <Calculator className="h-5 w-5" />
                  CALCULAR MATERIAIS
                </Button>
              </div>
            </div>

            {/* Resultado */}
            {resultado && (
              <div ref={resultRef} className="mt-6 space-y-4 animate-scale-in">
                <PrintHeader />
                {/* Print Summary */}
                <div className="hidden print:block mb-4 p-4 border rounded-lg bg-gray-50 border-gray-200 text-left">
                  <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Detalhes do Cálculo</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-gray-500">Traço:</span>
                      <span className="font-medium">{resultado.traco.nome}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Tipo de Cálculo:</span>
                      <span className="font-medium">{tipoCalculo === "volume" ? "Volume Direto" : "Por Dimensões"}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Volume Bruto:</span>
                      <span className="font-medium">
                        {tipoCalculo === "volume"
                          ? `${volumeManual} m³`
                          : `${comprimento}m x ${largura}m x ${altura}m`}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Margem Perda:</span>
                      <span className="font-medium">{perdas}%</span>
                    </div>
                  </div>
                </div>

                {/* Resumo */}
                <div className="rounded-xl border-2 border-primary bg-gradient-result p-6 print:border-none print:shadow-none print:bg-white">
                  <div className="text-center mb-6">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Para {resultado.volumeTotal} m³ de concreto ({resultado.traco.nome})
                    </p>
                    <p className="text-lg text-foreground">
                      Resistência estimada: <strong>{resultado.traco.resistencia}</strong>
                    </p>
                  </div>

                  {/* Grid de Materiais */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Cimento */}
                    <div className="rounded-lg bg-card p-4 text-center shadow-sm print:border print:border-gray-200">
                      <div className="text-4xl mb-2">🧱</div>
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {resultado.materiais.sacosCimento}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        Sacos de Cimento
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({resultado.materiais.cimentoKg} kg)
                      </p>
                    </div>

                    {/* Areia */}
                    <div className="rounded-lg bg-card p-4 text-center shadow-sm print:border print:border-gray-200">
                      <div className="text-4xl mb-2">🏖️</div>
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {resultado.materiais.areiaM3} m³
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        Areia Média
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({resultado.materiais.areiaKg} kg)
                      </p>
                    </div>

                    {/* Brita */}
                    <div className="rounded-lg bg-card p-4 text-center shadow-sm print:border print:border-gray-200">
                      <div className="text-4xl mb-2">🪨</div>
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {resultado.materiais.britaM3} m³
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        Brita (Pedra 1)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({resultado.materiais.britaKg} kg)
                      </p>
                    </div>

                    {/* Água */}
                    <div className="rounded-lg bg-card p-4 text-center shadow-sm print:border print:border-gray-200">
                      <div className="text-4xl mb-2">💧</div>
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {resultado.materiais.aguaLitros} L
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        Água
                      </p>
                      <p className="text-xs text-muted-foreground">
                        (aproximadamente)
                      </p>
                    </div>
                  </div>

                  {/* Dica */}
                  <div className="mt-4 rounded-lg bg-accent/10 border border-accent/20 p-4 text-center">
                    <p className="text-sm text-foreground">
                      💡 <strong>Dica:</strong> A quantidade de água pode variar conforme a umidade da areia.
                      Adicione aos poucos até obter a consistência desejada.
                    </p>
                  </div>
                </div>

                {/* Ad Placeholder - Meio do Resultado */}
                <AdPlaceholder id="ad-meio-resultado-concreto" className="print:hidden" />

                {/* Affiliate Products */}
                <div className="rounded-xl border border-border bg-card p-6 print:hidden">
                  <h3 className="font-bold text-sm mb-4 uppercase text-muted-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Ofertas Relacionadas
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ProductCard
                      title="Betoneira 400 Litros Monofásica"
                      image="https://m.media-amazon.com/images/I/61Nl-X3qI6L._AC_SX679_.jpg"
                      price="R$ 3.899"
                      link="https://amzn.to/3VjQjOq"
                      category="Maquinário"
                    />
                    <ProductCard
                      title="Carrinho de Mão Reforçado"
                      image="https://m.media-amazon.com/images/I/61y+M+gg+BL._AC_SX679_.jpg"
                      price="R$ 249,90"
                      link="https://amzn.to/3VjQjOq"
                      category="Ferramentas"
                    />
                    <ProductCard
                      title="Pá Quadrada com Cabo"
                      image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                      price="R$ 45,90"
                      link="https://amzn.to/3VjQjOq"
                      category="Ferramentas"
                    />
                    <ProductCard
                      title="Enxada Larga 2.5 com Cabo"
                      image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                      price="R$ 59,90"
                      link="https://amzn.to/3VjQjOq"
                      category="Ferramentas"
                    />
                  </div>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    *Link de afiliado. Você não paga nada a mais por isso.
                  </p>

                  <Button
                    onClick={() => {
                      // Cimento
                      addItem({
                        id: crypto.randomUUID(),
                        name: `Cimento (Sacos 50kg)`,
                        description: `Para ${resultado.volumeTotal}m³ de concreto ${resultado.traco.nome}`,
                        quantity: resultado.materiais.sacosCimento,
                        unit: "Sacos",
                        category: "Estrutural - Concreto",
                        estimatedPrice: resultado.materiais.sacosCimento * 35 // R$35/saco
                      });
                      // Areia
                      addItem({
                        id: crypto.randomUUID(),
                        name: `Areia Média`,
                        description: `${resultado.materiais.areiaM3}m³ / ${resultado.materiais.areiaKg}kg`,
                        quantity: resultado.materiais.areiaM3,
                        unit: "m³",
                        category: "Estrutural - Agregados",
                        estimatedPrice: resultado.materiais.areiaM3 * 120 // R$120/m3
                      });
                      // Brita
                      addItem({
                        id: crypto.randomUUID(),
                        name: `Brita 1`,
                        description: `${resultado.materiais.britaM3}m³ / ${resultado.materiais.britaKg}kg`,
                        quantity: resultado.materiais.britaM3,
                        unit: "m³",
                        category: "Estrutural - Agregados",
                        estimatedPrice: resultado.materiais.britaM3 * 110 // R$110/m3
                      });
                    }}
                    variant="outline"
                    size="xl"
                    className="w-full mt-3 border-2 hover:bg-primary/5 text-primary print:hidden"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar Tudo ao Orçamento
                  </Button>

                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    size="xl"
                    className="w-full mt-4 border-2 hover:bg-orange-50 text-orange-900 print:hidden"
                  >
                    <Printer className="mr-2 h-5 w-5" /> Salvar em PDF
                  </Button>
                </div>
              </div>
            )}

            {/* Informações extras */}
            <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                📋 Tipos de Concreto e Aplicações
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card">
                    <span className="text-lg">🏗️</span>
                    <div>
                      <p className="font-medium text-foreground">Concreto Magro (~10 MPa)</p>
                      <p>Ideal para regularização de terreno, contrapisos e lastros.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card">
                    <span className="text-lg">🏠</span>
                    <div>
                      <p className="font-medium text-foreground">Estrutural Médio (~20 MPa)</p>
                      <p>O mais usado em construções residenciais: lajes, vigas e pilares.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card">
                    <span className="text-lg">🏢</span>
                    <div>
                      <p className="font-medium text-foreground">Alta Resistência (~30 MPa)</p>
                      <p>Para estruturas com alta carga ou elementos esbeltos.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="mt-6 mb-3 text-base font-semibold text-foreground">
                🔧 Dicas Importantes
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• O <strong>traço 1:2:3</strong> significa 1 parte de cimento, 2 de areia e 3 de brita (em volume)</li>
                <li>• A água deve ser adicionada aos poucos até o concreto ficar "pastoso"</li>
                <li>• Para estruturas importantes, consulte um engenheiro para especificação do concreto</li>
                <li>• O tempo de cura ideal é de 28 dias para atingir a resistência máxima</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalculadoraConcreto;
