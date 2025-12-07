import { useState } from "react";
import { Paintbrush, Calculator, ShoppingCart, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResultadoCalculo {
  litrosNecessarios: number;
  areaLiquida: number;
  sugestaoEmbalagem: string;
}

const CalculadoraTinta = () => {
  const [altura, setAltura] = useState("");
  const [largura, setLargura] = useState("");
  const [portas, setPortas] = useState("");
  const [janelas, setJanelas] = useState("");
  const [demaos, setDemaos] = useState("2");
  const [rendimento, setRendimento] = useState("10");
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
    const portasNum = parseNumero(portas) || 0;
    const janelasNum = parseNumero(janelas) || 0;
    const demaosNum = parseInt(demaos);
    const rendimentoNum = parseInt(rendimento);

    // Validações
    if (alturaNum <= 0) {
      setErro("Por favor, informe a altura da parede.");
      return;
    }
    if (larguraNum <= 0) {
      setErro("Por favor, informe a largura total das paredes.");
      return;
    }

    // Área da porta padrão: 0.80m x 2.10m = 1.68m²
    // Área da janela padrão: 1.20m x 1.20m = 1.44m²
    const areaPortas = portasNum * 1.68;
    const areaJanelas = janelasNum * 1.44;
    
    const areaBruta = alturaNum * larguraNum;
    const areaDesconto = areaPortas + areaJanelas;
    const areaLiquida = Math.max(0, areaBruta - areaDesconto);

    if (areaLiquida <= 0) {
      setErro("A área líquida é zero ou negativa. Verifique os valores informados.");
      return;
    }

    // Litros = (Área Líquida / Rendimento) * Demãos
    const litros = (areaLiquida / rendimentoNum) * demaosNum;
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
      areaLiquida: Math.round(areaLiquida * 100) / 100,
      sugestaoEmbalagem: sugestao,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
                Quantos litros você realmente precisa? Preencha os dados abaixo e descubra em segundos.
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="grid gap-5">
                {/* Altura e Largura */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="altura" className="text-foreground font-medium">
                      Altura da parede (metros)
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
                    <Label htmlFor="largura" className="text-foreground font-medium">
                      Largura total das paredes (metros)
                    </Label>
                    <Input
                      id="largura"
                      type="text"
                      inputMode="decimal"
                      placeholder="Ex: 12.50"
                      value={largura}
                      onChange={(e) => setLargura(e.target.value)}
                      className="h-12 text-base"
                    />
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
                    <p className="text-xs text-muted-foreground">Padrão: 0,80m × 2,10m</p>
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
                    <p className="text-xs text-muted-foreground">Padrão: 1,20m × 1,20m</p>
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
                      Tipo de tinta / Rendimento
                    </Label>
                    <Select value={rendimento} onValueChange={setRendimento}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">Econômica (~8 m²/L)</SelectItem>
                        <SelectItem value="10">Standard (~10 m²/L)</SelectItem>
                        <SelectItem value="15">Premium (~15 m²/L)</SelectItem>
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
                  CALCULAR QUANTIDADE
                </Button>
              </div>
            </div>

            {/* Resultado */}
            {resultado && (
              <div className="mt-6 rounded-xl border-2 border-primary bg-gradient-result p-6 animate-scale-in">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Área a ser pintada: {resultado.areaLiquida} m²
                  </p>
                  <p className="text-lg font-medium text-foreground mb-1">
                    Você precisa de aproximadamente
                  </p>
                  <p className="text-5xl font-extrabold text-primary mb-2">
                    {resultado.litrosNecessarios} Litros
                  </p>
                  <p className="text-sm text-muted-foreground">de tinta</p>
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

                {/* Botão Afiliado */}
                <div className="mt-6">
                  <Button 
                    asChild 
                    variant="success" 
                    size="xl" 
                    className="w-full"
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ShoppingCart className="h-5 w-5" />
                      VER PREÇO DAS TINTAS NA AMAZON (Promoção)
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
                📋 Como calcular a quantidade de tinta?
              </h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Nossa calculadora usa a fórmula padrão do mercado: <strong>(Área × Demãos) ÷ Rendimento</strong>.
                </p>
                <p>
                  • A área é calculada multiplicando a altura pela largura total das paredes.
                </p>
                <p>
                  • Descontamos automaticamente as portas (0,80m × 2,10m = 1,68m²) e janelas (1,20m × 1,20m = 1,44m²).
                </p>
                <p>
                  • Recomendamos sempre 2 demãos para uma cobertura uniforme.
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
