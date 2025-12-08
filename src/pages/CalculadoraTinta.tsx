import { useState } from "react";
import { Paintbrush, Calculator, ShoppingCart, ExternalLink, ArrowLeft, Info } from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { affiliateLinks } from "@/config/affiliateLinks";

interface ResultadoCalculo {
  litrosNecessarios: number;
  areaParedes: number;
  areaTeto: number;
  areaTotal: number;
  sugestaoEmbalagem: string;
}

import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraTinta = () => {
  const { addItem } = useOrcamento();
  const [altura, setAltura] = useState("");
  const [largura, setLargura] = useState("");
  const [comprimento, setComprimento] = useState("");
  const [portas, setPortas] = useState("");
  const [janelas, setJanelas] = useState("");
  const [demaos, setDemaos] = useState("2");
  const [rendimento, setRendimento] = useState("10");
  const [pintarTeto, setPintarTeto] = useState(false);
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

    const alturaNum = parseNumero(altura);
    const larguraNum = parseNumero(largura);
    const comprimentoNum = parseNumero(comprimento);
    const portasNum = parseNumero(portas) || 0;
    const janelasNum = parseNumero(janelas) || 0;
    const demaosNum = parseInt(demaos);
    const rendimentoNum = parseInt(rendimento);

    // Validações
    if (alturaNum <= 0) {
      setErro("Por favor, informe a altura do ambiente.");
      return;
    }
    if (larguraNum <= 0) {
      setErro("Por favor, informe a largura do ambiente.");
      return;
    }
    if (comprimentoNum <= 0) {
      setErro("Por favor, informe o comprimento do ambiente.");
      return;
    }

    // Área da porta padrão: 0.80m x 2.10m = 1.68m²
    // Área da janela padrão: 1.20m x 1.20m = 1.44m²
    const areaPortas = portasNum * 1.68;
    const areaJanelas = janelasNum * 1.44;
    const areaDesconto = areaPortas + areaJanelas;

    // Área Paredes = Perímetro * Altura
    // Perímetro = 2 * (Largura + Comprimento)
    const perimetro = 2 * (larguraNum + comprimentoNum);
    const areaParedesBruta = perimetro * alturaNum;
    const areaParedesLiquida = Math.max(0, areaParedesBruta - areaDesconto);

    // Área Teto
    const areaTetoCalc = pintarTeto ? (larguraNum * comprimentoNum) : 0;

    const areaTotalPintura = areaParedesLiquida + areaTetoCalc;

    if (areaTotalPintura <= 0) {
      setErro("A área total de pintura é zero ou negativa. Verifique os valores.");
      return;
    }

    // Litros = (Área Total / Rendimento) * Demãos
    const litros = (areaTotalPintura / rendimentoNum) * demaosNum;
    const litrosArredondados = Math.ceil(litros * 10) / 10;

    // Sugestão de embalagem
    let sugestao = "";
    if (litrosArredondados > 16) {
      sugestao = "Recomendamos latas de 18L para melhor custo-benefício.";
    } else if (litrosArredondados < 4) {
      sugestao = "Para pequenas áreas, galões de 3,6L são ideais.";
    } else {
      sugestao = "Galões de 3,6L ou latas de 18L, dependendo do preço.";
    }

    setResultado({
      litrosNecessarios: litrosArredondados,
      areaParedes: Math.round(areaParedesLiquida * 100) / 100,
      areaTeto: Math.round(areaTetoCalc * 100) / 100,
      areaTotal: Math.round(areaTotalPintura * 100) / 100,
      sugestaoEmbalagem: sugestao,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title="Calculadora de Tinta"
        description="Calcule a quantidade exata de tinta para paredes e tetos. Evite desperdícios na sua obra."
        url="https://suaobracerta.com.br/calculadora-tinta"
      />
      <Header />

      <main className="flex-1">
        {/* Ad Placeholder - Topo */}
        <div className="container pt-6">
          <AdPlaceholder id="ad-topo-calc" className="max-w-3xl mx-auto" />
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
                  <Paintbrush className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Calculadora de Tinta
                </h1>
              </div>
              <p className="text-muted-foreground">
                Calcule a tinta necessária para paredes e teto. Evite sobras e economize.
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="grid gap-5">

                {/* Switch Pintar Teto */}
                <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Vou pintar o teto também?</Label>
                    <p className="text-sm text-muted-foreground">
                      Adiciona a área do teto ao cálculo total
                    </p>
                  </div>
                  <Switch
                    checked={pintarTeto}
                    onCheckedChange={setPintarTeto}
                  />
                </div>

                {/* Dimensões do Ambiente */}
                <div className="space-y-3">
                  <Label className="text-foreground font-medium">Dimensões do Ambiente</Label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="altura" className="text-sm text-muted-foreground">
                        Altura (m)
                      </Label>
                      <Input
                        id="altura"
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex: 2.80"
                        value={altura}
                        onChange={(e) => setAltura(e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="largura" className="text-sm text-muted-foreground">
                          Largura (m)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Largura de uma das paredes</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="largura"
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex: 3.50"
                        value={largura}
                        onChange={(e) => setLargura(e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="comprimento" className="text-sm text-muted-foreground">
                          Comprimento (m)
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Comprimento da outra parede</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="comprimento"
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex: 4.00"
                        value={comprimento}
                        onChange={(e) => setComprimento(e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Portas e Janelas */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="portas" className="text-foreground font-medium">
                      Quantidade de portas
                    </Label>
                    <Input
                      id="portas"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      value={portas}
                      onChange={(e) => setPortas(e.target.value)}
                      className="h-12 text-base"
                    />
                    <p className="text-xs text-muted-foreground">Desconta 1,68m² por porta</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="janelas" className="text-foreground font-medium">
                      Quantidade de janelas
                    </Label>
                    <Input
                      id="janelas"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      value={janelas}
                      onChange={(e) => setJanelas(e.target.value)}
                      className="h-12 text-base"
                    />
                    <p className="text-xs text-muted-foreground">Desconta 1,44m² por janela</p>
                  </div>
                </div>

                {/* Demãos e Rendimento */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="demaos" className="text-foreground font-medium">
                      Número de demãos
                    </Label>
                    <Select value={demaos} onValueChange={setDemaos}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 demão</SelectItem>
                        <SelectItem value="2">2 demãos (recomendado)</SelectItem>
                        <SelectItem value="3">3 demãos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rendimento" className="text-foreground font-medium">
                      Tipo de tinta
                    </Label>
                    <Select value={rendimento} onValueChange={setRendimento}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">Econômica (rende ~8 m²/L)</SelectItem>
                        <SelectItem value="10">Standard (rende ~10 m²/L)</SelectItem>
                        <SelectItem value="15">Premium (rende ~15 m²/L)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                  CALCULAR LITROS
                </Button>
              </div>
            </div>

            {/* Resultado */}
            {resultado && (
              <div className="mt-6 rounded-xl border-2 border-primary bg-gradient-result p-6 animate-scale-in">
                <div className="text-center">
                  <div className="mb-4 grid grid-cols-2 gap-4 text-left sm:grid-cols-3">
                    <div className="rounded bg-card/50 p-2">
                      <p className="text-xs text-muted-foreground">Área Paredes</p>
                      <p className="font-semibold">{resultado.areaParedes} m²</p>
                    </div>
                    <div className="rounded bg-card/50 p-2">
                      <p className="text-xs text-muted-foreground">Área Teto</p>
                      <p className="font-semibold">{resultado.areaTeto} m²</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 rounded bg-card/50 p-2">
                      <p className="text-xs text-muted-foreground">Área Total</p>
                      <p className="font-semibold text-primary">{resultado.areaTotal} m²</p>
                    </div>
                  </div>

                  <p className="text-lg font-medium text-foreground mb-1">
                    Você precisa de aproximadamente
                  </p>
                  <p className="text-5xl font-extrabold text-primary mb-2">
                    {resultado.litrosNecessarios} Litros
                  </p>
                  <p className="text-sm text-muted-foreground">de tinta ({demaos} demãos)</p>
                </div>

                <div className="mt-4 rounded-lg bg-card/80 p-4 text-center">
                  <p className="text-sm text-foreground font-medium">
                    💡 {resultado.sugestaoEmbalagem}
                  </p>
                </div>

                {/* Ad Placeholder - Meio do Resultado */}
                <div className="mt-6">
                  <AdPlaceholder id="ad-meio-resultado" />
                </div>

                {/* Botão Afiliado & Orçamento */}
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => {
                      addItem({
                        id: crypto.randomUUID(),
                        name: "Tinta de Parede",
                        description: `Área: ${resultado.areaTotal}m² | ${demaos} Demãos`,
                        quantity: resultado.litrosNecessarios,
                        unit: "Litros",
                        category: "Acabamento - Pintura",
                        estimatedPrice: resultado.litrosNecessarios * 30 // Estimativa grosseira R$30/L
                      });
                    }}
                    variant="outline"
                    size="xl"
                    className="w-full border-2 hover:bg-slate-50 text-slate-700"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Adicionar ao Meu Orçamento
                  </Button>

                  <Button
                    asChild
                    variant="success"
                    size="xl"
                    className="w-full"
                  >
                    <a href={affiliateLinks.paints.general} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      VER PREÇO DAS TINTAS NA AMAZON
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
                📋 Como é feito o cálculo?
              </h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Nossa calculadora de tinta considera a área total das paredes (e teto, se selecionado) subtraindo as aberturas.
                </p>
                <ul className="list-inside list-disc space-y-1">
                  <li><strong>Área das Paredes:</strong> Perímetro do ambiente × Altura.</li>
                  <li><strong>Área do Teto:</strong> Largura × Comprimento.</li>
                  <li><strong>Descontos:</strong> Portas (1,68m²) e Janelas (1,44m²).</li>
                  <li><strong>Litragem Final:</strong> (Área Total ÷ Rendimento da Tinta) × Número de Demãos.</li>
                </ul>
                <p className="mt-2 font-medium text-foreground">
                  Dica: O rendimento varia conforme a marca, mas usamos médias de mercado (Econômica, Standard e Premium) para garantir uma estimativa segura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalculadoraTinta;
