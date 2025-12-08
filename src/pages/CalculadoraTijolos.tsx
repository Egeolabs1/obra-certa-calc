import { useState } from "react";
import { Boxes, Calculator, ShoppingCart, ExternalLink, ArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";

interface TipoTijolo {
  nome: string;
  largura: number; // cm
  altura: number; // cm
  comprimento: number; // cm
  tijolosPorM2: number;
  espessuraJunta: number; // cm
}

const TIPOS_TIJOLOS: Record<string, TipoTijolo> = {
  "6furos": {
    nome: "Tijolo 6 Furos (9×14×19cm)",
    largura: 9,
    altura: 14,
    comprimento: 19,
    tijolosPorM2: 25,
    espessuraJunta: 1,
  },
  "9furos": {
    nome: "Tijolo 9 Furos (9×19×19cm)",
    largura: 9,
    altura: 19,
    comprimento: 19,
    tijolosPorM2: 22,
    espessuraJunta: 1,
  },
  "macico": {
    nome: "Tijolo Maciço (5×10×20cm)",
    largura: 5,
    altura: 10,
    comprimento: 20,
    tijolosPorM2: 75,
    espessuraJunta: 1,
  },
  "baiano": {
    nome: "Tijolo Baiano (9×19×29cm)",
    largura: 9,
    altura: 19,
    comprimento: 29,
    tijolosPorM2: 16,
    espessuraJunta: 1,
  },
};

interface ResultadoCalculo {
  areaBruta: number;
  areaDescontada: number;
  areaLiquida: number;
  qtdTijolos: number;
  qtdTijolosComPerda: number;
  tipoTijolo: TipoTijolo;
  argamassa: {
    volumeTotal: number; // litros
    cimento: number; // kg
    areia: number; // kg
    sacosAreia: number;
    sacosCimento: number;
  };
}

const CalculadoraTijolos = () => {
  const [alturaParede, setAlturaParede] = useState("");
  const [comprimentoParede, setComprimentoParede] = useState("");
  const [tipoTijolo, setTipoTijolo] = useState("6furos");
  const [qtdPortas, setQtdPortas] = useState("");
  const [qtdJanelas, setQtdJanelas] = useState("");
  const [perdas, setPerdas] = useState("10");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [erro, setErro] = useState("");

  const parseNumero = (valor: string): number => {
    const valorLimpo = valor.replace(",", ".").trim();
    const numero = parseFloat(valorLimpo);
    return isNaN(numero) ? 0 : numero;
  };

  const calcular = () => {
    setErro("");
    setResultado(null);

    const altura = parseNumero(alturaParede);
    const comprimento = parseNumero(comprimentoParede);
    const portas = parseNumero(qtdPortas) || 0;
    const janelas = parseNumero(qtdJanelas) || 0;
    const margemPerdas = parseNumero(perdas) || 10;
    const tijolo = TIPOS_TIJOLOS[tipoTijolo];

    // Validações
    if (altura <= 0) {
      setErro("Por favor, informe a altura da parede.");
      return;
    }
    if (comprimento <= 0) {
      setErro("Por favor, informe o comprimento total das paredes.");
      return;
    }

    // Cálculos de área
    const areaBruta = altura * comprimento;

    // Área porta padrão: 0.80m x 2.10m = 1.68m²
    // Área janela padrão: 1.20m x 1.20m = 1.44m²
    const areaPortas = portas * 1.68;
    const areaJanelas = janelas * 1.44;
    const areaDescontada = areaPortas + areaJanelas;

    const areaLiquida = Math.max(0, areaBruta - areaDescontada);

    if (areaLiquida <= 0) {
      setErro("A área líquida é zero ou negativa. Verifique os valores.");
      return;
    }

    // Quantidade de tijolos
    const qtdTijolos = Math.ceil(areaLiquida * tijolo.tijolosPorM2);
    const fatorPerdas = 1 + (margemPerdas / 100);
    const qtdTijolosComPerda = Math.ceil(qtdTijolos * fatorPerdas);

    // Cálculo de argamassa
    // Consumo médio: ~15-20 litros de argamassa por m² de parede
    // Proporção traço 1:4 (1 cimento : 4 areia)
    const consumoArgamassaPorM2 = 18; // litros
    const volumeArgamassa = areaLiquida * consumoArgamassaPorM2;

    // Rendimento: 1 saco de 50kg de cimento = ~35-40 litros de argamassa (traço 1:4)
    // Areia: proporção 4:1, então 4x mais areia
    const rendimentoCimentoPorSaco = 38; // litros por saco de 50kg
    const sacosCimento = Math.ceil(volumeArgamassa / rendimentoCimentoPorSaco);
    const cimentoKg = sacosCimento * 50;

    // Areia: ~1.2 ton/m³, traço 1:4 em volume
    // Para cada saco de cimento, usamos ~0.16m³ de areia (~180kg)
    const areiaKg = sacosCimento * 180;
    const sacosAreia = Math.ceil(areiaKg / 20); // sacos de 20kg

    setResultado({
      areaBruta: Math.round(areaBruta * 100) / 100,
      areaDescontada: Math.round(areaDescontada * 100) / 100,
      areaLiquida: Math.round(areaLiquida * 100) / 100,
      qtdTijolos,
      qtdTijolosComPerda,
      tipoTijolo: tijolo,
      argamassa: {
        volumeTotal: Math.round(volumeArgamassa),
        cimento: cimentoKg,
        areia: areiaKg,
        sacosCimento,
        sacosAreia,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title="Calculadora de Tijolos"
        description="Calcule quantos tijolos e argamassa você precisa para erguer suas paredes."
        url="https://suaobracerta.com.br/calculadora-tijolos"
        schema={generateCalculatorSchema(
          "Calculadora de Tijolos",
          "Calcule a quantidade de tijolos e argamassa para paredes de alvenaria.",
          "https://suaobracerta.com.br/calculadora-tijolos"
        )}
      />
      <Header />

      <main className="flex-1">
        {/* Ad Placeholder - Topo */}
        <div className="container pt-6">
          <AdPlaceholder id="ad-topo-calc-tijolos" className="max-w-3xl mx-auto" />
        </div>

        <div className="container py-8 md:py-12">
          <div className="mx-auto max-w-2xl">
            {/* Breadcrumb */}
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Início
            </Link>

            {/* Title */}
            <div className="mb-8 animate-fade-up">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <Boxes className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Calculadora de Tijolos
                </h1>
              </div>
              <p className="text-muted-foreground">
                Calcule quantos tijolos e argamassa você precisa para erguer suas paredes.
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="grid gap-5">
                {/* Tipo de Tijolo */}
                <div className="space-y-2">
                  <Label htmlFor="tipoTijolo" className="text-foreground font-medium">
                    Tipo de Tijolo
                  </Label>
                  <Select value={tipoTijolo} onValueChange={setTipoTijolo}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6furos">Tijolo 6 Furos (9×14×19cm) - ~25/m²</SelectItem>
                      <SelectItem value="9furos">Tijolo 9 Furos (9×19×19cm) - ~22/m²</SelectItem>
                      <SelectItem value="macico">Tijolo Maciço (5×10×20cm) - ~75/m²</SelectItem>
                      <SelectItem value="baiano">Tijolo Baiano (9×19×29cm) - ~16/m²</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dimensões da Parede */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-foreground font-medium">Dimensões da Parede</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Informe a altura e comprimento total das paredes em metros</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="alturaParede" className="text-sm text-muted-foreground">
                        Altura (metros)
                      </Label>
                      <Input
                        id="alturaParede"
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex: 2.80"
                        value={alturaParede}
                        onChange={(e) => setAlturaParede(e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comprimentoParede" className="text-sm text-muted-foreground">
                        Comprimento total (metros)
                      </Label>
                      <Input
                        id="comprimentoParede"
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex: 15.00"
                        value={comprimentoParede}
                        onChange={(e) => setComprimentoParede(e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Portas e Janelas */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="qtdPortas" className="text-foreground font-medium">
                      Quantidade de portas
                    </Label>
                    <Input
                      id="qtdPortas"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      value={qtdPortas}
                      onChange={(e) => setQtdPortas(e.target.value)}
                      className="h-12 text-base"
                    />
                    <p className="text-xs text-muted-foreground">Padrão: 0,80m × 2,10m</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qtdJanelas" className="text-foreground font-medium">
                      Quantidade de janelas
                    </Label>
                    <Input
                      id="qtdJanelas"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      value={qtdJanelas}
                      onChange={(e) => setQtdJanelas(e.target.value)}
                      className="h-12 text-base"
                    />
                    <p className="text-xs text-muted-foreground">Padrão: 1,20m × 1,20m</p>
                  </div>
                </div>

                {/* Margem de Perdas */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="perdas" className="text-foreground font-medium">
                      Margem de perdas/quebras (%)
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <p>Porcentagem extra para cobrir quebras, cortes e perdas durante a obra</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={perdas} onValueChange={setPerdas}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5% (Paredes simples)</SelectItem>
                      <SelectItem value="10">10% (Recomendado)</SelectItem>
                      <SelectItem value="15">15% (Muitos recortes)</SelectItem>
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
                  CALCULAR QUANTIDADE
                </Button>
              </div>
            </div>

            {/* Resultado */}
            {resultado && (
              <div className="mt-6 space-y-4 animate-scale-in">
                {/* Resultado Tijolos */}
                <div className="rounded-xl border-2 border-primary bg-gradient-result p-6">
                  <div className="text-center mb-6">
                    <p className="text-lg font-medium text-foreground mb-1">
                      Você precisa de aproximadamente
                    </p>
                    <p className="text-5xl font-extrabold text-primary mb-2">
                      {resultado.qtdTijolosComPerda.toLocaleString('pt-BR')} tijolos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ({resultado.qtdTijolos.toLocaleString('pt-BR')} + {perdas}% de margem)
                    </p>
                  </div>

                  {/* Detalhamento Área */}
                  <div className="grid gap-3 rounded-lg bg-card/80 p-4 mb-4">
                    <h3 className="font-semibold text-foreground text-sm border-b border-border pb-2">
                      📐 Detalhamento da Área
                    </h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Área bruta:</span>
                      <span className="font-medium text-foreground">{resultado.areaBruta} m²</span>
                    </div>
                    {resultado.areaDescontada > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Desconto (portas/janelas):</span>
                        <span className="font-medium text-foreground">- {resultado.areaDescontada} m²</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Área líquida:</span>
                      <span className="font-medium text-foreground">{resultado.areaLiquida} m²</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                      <span className="text-muted-foreground">Tipo de tijolo:</span>
                      <span className="font-medium text-foreground">{resultado.tipoTijolo.nome}</span>
                    </div>
                  </div>

                  {/* Dica */}
                  <div className="rounded-lg bg-accent/10 border border-accent/20 p-4 text-center">
                    <p className="text-sm text-foreground">
                      💡 <strong>Milheiros:</strong> Você precisa de aproximadamente{" "}
                      <strong>{Math.ceil(resultado.qtdTijolosComPerda / 1000)} milheiro(s)</strong> de tijolos.
                    </p>
                  </div>
                </div>

                {/* Resultado Argamassa */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                    🧱 Argamassa Necessária
                    <span className="text-xs font-normal text-muted-foreground">(Traço 1:4)</span>
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {resultado.argamassa.sacosCimento}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sacos de Cimento (50kg)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        = {resultado.argamassa.cimento} kg
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {resultado.argamassa.sacosAreia}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sacos de Areia (20kg)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        = {resultado.argamassa.areia} kg
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Volume total de argamassa: ~{resultado.argamassa.volumeTotal} litros
                  </p>
                </div>

                {/* Ad Placeholder - Meio do Resultado */}
                <AdPlaceholder id="ad-meio-resultado-tijolos" />

                {/* Botão Afiliado */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <Button
                    asChild
                    variant="success"
                    size="xl"
                    className="w-full"
                  >
                    <a href={affiliateLinks.structural.bricks} target="_blank" rel="noopener noreferrer">
                      <ShoppingCart className="h-5 w-5" />
                      VER MATERIAIS NA AMAZON
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    *Link de afiliado. Você não paga nada a mais por isso.
                  </p>
                </div>
              </div>
            )}

            {/* Informações extras */}
            <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                📋 Tipos de Tijolos e Rendimento
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card">
                    <span className="text-lg">🧱</span>
                    <div>
                      <p className="font-medium text-foreground">Tijolo 6 Furos (9×14×19cm)</p>
                      <p>O mais comum em construções. Rendimento: ~25 unidades/m²</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card">
                    <span className="text-lg">🧱</span>
                    <div>
                      <p className="font-medium text-foreground">Tijolo 9 Furos (9×19×19cm)</p>
                      <p>Maior isolamento térmico e acústico. Rendimento: ~22 unidades/m²</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card">
                    <span className="text-lg">🧱</span>
                    <div>
                      <p className="font-medium text-foreground">Tijolo Maciço (5×10×20cm)</p>
                      <p>Ideal para churrasqueiras e estruturas aparentes. Rendimento: ~75 unidades/m²</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-card">
                    <span className="text-lg">🧱</span>
                    <div>
                      <p className="font-medium text-foreground">Tijolo Baiano (9×19×29cm)</p>
                      <p>Maior dimensão, construção mais rápida. Rendimento: ~16 unidades/m²</p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="mt-6 mb-3 text-base font-semibold text-foreground">
                🔧 Sobre a Argamassa
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• O cálculo usa o <strong>traço 1:4</strong> (1 parte de cimento para 4 de areia)</li>
                <li>• Consumo médio estimado: ~18 litros de argamassa por m² de parede</li>
                <li>• Valores podem variar conforme espessura das juntas e tipo de assentamento</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalculadoraTijolos;
