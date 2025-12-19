import { useState } from "react";
import { Paintbrush, Calculator, ShoppingCart, ExternalLink, ArrowLeft, Info, Printer } from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { affiliateLinks } from "@/config/affiliateLinks";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";
import { ProductCard } from "@/components/ProductCard";

interface ResultadoCalculo {
  litrosNecessarios: number;
  areaParedes: number;
  areaTeto: number;
  areaTotal: number;
  sugestaoEmbalagem: string;
}

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title="Calculadora de Tinta | Quantidade de Tinta por M²"
        description="Calcule a quantidade exata de tinta para paredes e tetos. Saiba quantos litros usar, número de demãos e evite desperdícios na sua obra."
        url="https://www.suaobracerta.com.br/calculadora-tinta"
        keywords="calculadora de tinta, quanto de tinta preciso, rendimento tinta suvinil, rendimento tinta coral, calcular pintura parede, tinta acrilica rendimento, pintura casa custo, como calcular litro de tinta, tinta parede m2, tinta piso, tinta teto, calcular tinta metros quadrados"
        schema={generateCalculatorSchema(
          "Calculadora de Tinta",
          "Ferramenta para calcular quantidade de tinta para paredes e tetos.",
          "https://www.suaobracerta.com.br/calculadora-tinta"
        )}
      />
      <div className="print:hidden">
        <Header />
      </div>

      <main className="flex-1">
        <PrintHeader title="Calculadora de Tinta" />
        {/* Ad Placeholder - Topo */}
        <div className="container pt-6 print:hidden">
          <AdPlaceholder id="ad-topo-calc" className="max-w-3xl mx-auto" />
        </div>

        <div className="container py-8 md:py-12 print:py-0">
          <div className="mx-auto max-w-2xl print:max-w-full">
            {/* Breadcrumb */}
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors print:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Início
            </Link>

            {/* Title */}
            <div className="mb-8 animate-fade-up print:hidden">
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
            <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-up print:hidden">
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
              <div className="mt-6 rounded-xl border-2 border-primary bg-gradient-result p-6 animate-scale-in print:bg-white print:border print:border-gray-200 print:shadow-none">

                {/* Print Summary */}
                <div className="hidden print:block mb-4 p-4 border rounded-lg bg-gray-50 border-gray-200 text-left">
                  <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Projeto</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-gray-500">Ambiente:</span>
                      <span className="font-medium">{altura}m (A) x {largura}m (L) x {comprimento}m (C)</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Paredes + Teto?</span>
                      <span className="font-medium">{pintarTeto ? "Sim" : "Apenas Paredes"}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Qualidade Tinta:</span>
                      <span className="font-medium">{rendimento} m²/L ({demaos} demãos)</span>
                    </div>
                  </div>
                </div>

                <div className="text-center print:text-left">
                  <div className="mb-4 grid grid-cols-2 gap-4 text-left sm:grid-cols-3 print:grid-cols-3">
                    <div className="rounded bg-card/50 p-2 print:border print:border-gray-100">
                      <p className="text-xs text-muted-foreground">Área Paredes</p>
                      <p className="font-semibold">{resultado.areaParedes} m²</p>
                    </div>
                    <div className="rounded bg-card/50 p-2 print:border print:border-gray-100">
                      <p className="text-xs text-muted-foreground">Área Teto</p>
                      <p className="font-semibold">{resultado.areaTeto} m²</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 rounded bg-card/50 p-2 print:border print:border-gray-100">
                      <p className="text-xs text-muted-foreground">Área Total</p>
                      <p className="font-semibold text-primary">{resultado.areaTotal} m²</p>
                    </div>
                  </div>

                  <p className="text-lg font-medium text-foreground mb-1 print:text-gray-600">
                    Você precisa de aproximadamente
                  </p>
                  <p className="text-5xl font-extrabold text-primary mb-2 print:text-black">
                    {resultado.litrosNecessarios} Litros
                  </p>
                  <p className="text-sm text-muted-foreground">de tinta ({demaos} demãos)</p>
                </div>

                <div className="mt-4 rounded-lg bg-card/80 p-4 text-center print:border print:border-gray-200">
                  <p className="text-sm text-foreground font-medium">
                    💡 {resultado.sugestaoEmbalagem}
                  </p>
                </div>

                {/* Ad Placeholder - Meio do Resultado */}
                <div className="mt-6 print:hidden">
                  <AdPlaceholder id="ad-meio-resultado" />
                </div>

                {/* Affiliate Products */}
                <div className="mt-8 mb-8 print:hidden">
                  <h3 className="font-bold text-sm mb-4 uppercase text-muted-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Ofertas Relacionadas
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ProductCard
                      title="Kit Pintura 7 Peças Tigre"
                      image="https://m.media-amazon.com/images/I/41D+9+a+K+L._AC._SR360,460.jpg"
                      price="R$ 49,90"
                      link="https://amzn.to/3VjQjOq" // Placeholder
                      category="Kits"
                    />
                    <ProductCard
                      title="Tinta Suvinil Fosco Completo 18L Branco"
                      image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg" // Placeholder image
                      price="R$ 389,90"
                      link="https://amzn.to/3VjQjOq"
                      category="Tintas"
                    />
                    <ProductCard
                      title="Fita Crepe Automotiva Verde"
                      image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                      price="R$ 15,90"
                      link="https://amzn.to/3VjQjOq"
                      category="Acessórios"
                    />
                    <ProductCard
                      title="Lona Plástica Preta 4x4m"
                      image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                      price="R$ 22,90"
                      link="https://amzn.to/3VjQjOq"
                      category="Proteção"
                    />
                  </div>
                </div>

                {/* Botão Afiliado & Orçamento */}
                <div className="mt-6 space-y-3 print:hidden">
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
                    onClick={handlePrint}
                    variant="outline"
                    size="xl"
                    className="w-full border-2 hover:bg-slate-50 text-slate-700 mt-2"
                  >
                    <Printer className="h-5 w-5 mr-2" />
                    Salvar em PDF
                  </Button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    *Link de afiliado. Você não paga nada a mais por isso.
                  </p>
                </div>
              </div>
            )}

            {/* Informações extras */}
            {/* Informações extras e FAQ */}
            <div className="mt-8 space-y-8 animate-fade-up print:hidden">
              <div className="rounded-xl border border-border bg-muted/30 p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  📋 Como é feito o cálculo de tinta?
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Para chegar ao resultado preciso, nossa calculadora considera:
                  </p>
                  <ul className="list-inside list-disc space-y-1">
                    <li><strong>Área Total:</strong> Soma das larguras das paredes multiplicada pela altura (Pé-direito).</li>
                    <li><strong>Teto:</strong> Área calculada separadamente (Largura x Comprimento) se selecionado.</li>
                    <li><strong>Descontos:</strong> Subtraímos a área padrão de portas (1,68m²) e janelas (1,44m²).</li>
                    <li><strong>Rendimento:</strong> Divide-se a área total pelo rendimento m²/L da tinta escolhida.</li>
                    <li><strong>Demãos:</strong> Multiplica-se o resultado pelo número de demãos necessárias.</li>
                  </ul>
                  <p className="mt-2 font-medium text-foreground">
                    Fatores importantes:
                  </p>
                  <p>
                    O tipo de superfície influencia muito! Paredes rugosas ou texturizadas absorvem mais tinta (reduzem o rendimento em até 20%). Paredes novas com selador absorvem menos. Se for repintura de cor escura para clara, pode ser necessária mais uma demão.
                  </p>
                </div>
              </div>

              {/* FAQ */}
              <div className="mx-auto max-w-2xl">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Perguntas Frequentes sobre Pintura (FAQ)</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Como calcular o metro quadrado (m²) da parede?</AccordionTrigger>
                    <AccordionContent>
                      Multiplique a largura pela altura da parede. Se tiver uma parede de 3m de largura e 2,80m de altura, a área é 3 x 2,80 = 8,4m². Some a área de todas as paredes para ter o total.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Qual a diferença entre Tinta Acrílica, Látex e Esmalte?</AccordionTrigger>
                    <AccordionContent>
                      <strong>Acrílica:</strong> Resistente à água, ótima para exteriores e áreas molhadas. <br />
                      <strong>Látex (PVA):</strong> Base água, ideal para interiores e tetos, seca rápido mas limpa menos fácil. <br />
                      <strong>Esmalte:</strong> Para madeiras e metais, cria película resistente.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Preciso passar Selador antes de pintar?</AccordionTrigger>
                    <AccordionContent>
                      Sim, se a parede for nova (reboco cru) ou estiver descascando muito. O selador uniformiza a absorção, fazendo a tinta render muito mais e evitando manchas.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Posso pintar parede com mofo ou umidade?</AccordionTrigger>
                    <AccordionContent>
                      Jamais! O mofo voltará em pouco tempo. Limpe com água sanitária e resolva a causa da infiltração antes de pintar. Use fundo preparador se necessário.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Quanto de água devo colocar na tinta?</AccordionTrigger>
                    <AccordionContent>
                      Consulte sempre a lata! Geralmente varia de 10% a 30% de água potável. Diluir demais deixa a tinta fraca (cobre menos); diluir de menos deixa difícil de aplicar e marca o rolo.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6">
                    <AccordionTrigger>Pintar madeira e alvenaria requer tintas diferentes?</AccordionTrigger>
                    <AccordionContent>
                      Sim. Alvenaria usa Acrílica ou PVA. Madeira requer Esmalte Sintético ou Verniz, pois ela dilata e contrai com a temperatura de forma diferente do cimento.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-7">
                    <AccordionTrigger>Qual o tempo de secagem entre demãos?</AccordionTrigger>
                    <AccordionContent>
                      Geralmente 4 horas ao toque. Mas para repintura (nova demão), recomenda-se esperar o tempo indicado pelo fabricante (geralmente 4 a 6 horas) para não arrancar a tinta de baixo.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-8">
                    <AccordionTrigger>O que significa "Rendimento" na lata?</AccordionTrigger>
                    <AccordionContent>
                      É a área que aquele volume de tinta cobre. Ex: "Rende até 100m² por demão". Se você vai dar 2 demãos, essa lata cobrirá 50m² de parede pronta.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-9">
                    <AccordionTrigger>Como calcular tinta pro teto?</AccordionTrigger>
                    <AccordionContent>
                      A área do teto é igual à área do piso (Largura x Comprimento). Geralmente usa-se tinta Látex PVA ou Acrílica Fosca para disfarçar imperfeições.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-10">
                    <AccordionTrigger>Como cobrir uma parede de cor escura?</AccordionTrigger>
                    <AccordionContent>
                      Tinta branca sobre parede preta/vermelha exige mais demãos (3 a 4). Uma dica é usar uma demão de tinta cinza claro antes da branca para "quebrar" a cor forte.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-11">
                    <AccordionTrigger>Acabamento Fosco, Acetinado ou Semibrilho?</AccordionTrigger>
                    <AccordionContent>
                      <strong>Fosco:</strong> Disfarça defeitos, mas suja mais fácil. <br />
                      <strong>Acetinado:</strong> Toque de seda, brilho leve, fácil de limpar (ótimo para sala/quarto). <br />
                      <strong>Semibrilho:</strong> Muito resistente e lavável, mas destaca qualquer imperfeição da parede.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-12">
                    <AccordionTrigger>Quais ferramentas eu preciso?</AccordionTrigger>
                    <AccordionContent>
                      Rolo de lã (pelo baixo para liso, alto para rugoso), trincha (pincel) para recortes cantos, bandeja, fita crepe, lona/jornal para chão e lixa para preparar a parede.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-13">
                    <AccordionTrigger>Como proteger o chão e móveis?</AccordionTrigger>
                    <AccordionContent>
                      Use lona plástica ou papelão ondulado. Cobrir com jornal pode rasgar e manchar o piso se a tinta pingar e molhar o papel.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-14">
                    <AccordionTrigger>Devo descontar portas e janelas do cálculo?</AccordionTrigger>
                    <AccordionContent>
                      Sim! Ninguém pinta vidro ou madeira com tinta de parede. Nossa calculadora já faz esse desconto automaticamente para você economizar.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-15">
                    <AccordionTrigger>Existem tintas sem cheiro?</AccordionTrigger>
                    <AccordionContent>
                      Sim, a maioria das tintas Acrílicas Premium e Standard modernas são à base de água e têm baixo odor ("sem cheiro" após cerca de 3 horas ventilando).
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};
export default CalculadoraTinta;
