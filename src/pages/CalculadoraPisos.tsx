import { useState } from "react";
import { LayoutGrid, Calculator, ShoppingCart, ExternalLink, ArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { affiliateLinks } from "@/config/affiliateLinks";
import { generateCalculatorSchema } from "@/utils/schemas";

interface ResultadoCalculo {
  areaTotal: number;
  areaMoveis: number;
  areaLiquida: number;
  areaComMargem: number;
  areaPorPeca: number;
  qtdPecas: number;
  qtdCaixas: number;
  pecasPorCaixa: number;
}

import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraPisos = () => {
  const { addItem } = useOrcamento();
  const [comprimentoAmbiente, setComprimentoAmbiente] = useState("");
  const [larguraAmbiente, setLarguraAmbiente] = useState("");
  const [comprimentoPiso, setComprimentoPiso] = useState("");
  const [larguraPiso, setLarguraPiso] = useState("");
  const [areaMoveis, setAreaMoveis] = useState("");
  const [margemCorte, setMargemCorte] = useState("10");
  const [pecasPorCaixa, setPecasPorCaixa] = useState("");
  const [tipoPiso, setTipoPiso] = useState("ceramica");
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

    const compAmbiente = parseNumero(comprimentoAmbiente);
    const largAmbiente = parseNumero(larguraAmbiente);
    const compPiso = parseNumero(comprimentoPiso);
    const largPiso = parseNumero(larguraPiso);
    const areaDescontoMoveis = parseNumero(areaMoveis) || 0;
    const margem = parseNumero(margemCorte) || 10;
    const pecasCaixa = parseNumero(pecasPorCaixa) || 0;

    // Validações
    if (compAmbiente <= 0) {
      setErro("Por favor, informe o comprimento do ambiente.");
      return;
    }
    if (largAmbiente <= 0) {
      setErro("Por favor, informe a largura do ambiente.");
      return;
    }
    if (compPiso <= 0) {
      setErro("Por favor, informe o comprimento do piso/revestimento.");
      return;
    }
    if (largPiso <= 0) {
      setErro("Por favor, informe a largura do piso/revestimento.");
      return;
    }

    // Cálculos
    const areaTotal = compAmbiente * largAmbiente;
    const areaLiquida = Math.max(0, areaTotal - areaDescontoMoveis);

    if (areaLiquida <= 0) {
      setErro("A área líquida é zero ou negativa. Verifique os valores informados.");
      return;
    }

    // Área com margem de corte
    const fatorMargem = 1 + (margem / 100);
    const areaComMargem = areaLiquida * fatorMargem;

    // Área por peça (converter cm para m²)
    const areaPorPeca = (compPiso / 100) * (largPiso / 100);

    // Quantidade de peças (arredondar para cima)
    const qtdPecas = Math.ceil(areaComMargem / areaPorPeca);

    // Quantidade de caixas
    let qtdCaixas = 0;
    if (pecasCaixa > 0) {
      qtdCaixas = Math.ceil(qtdPecas / pecasCaixa);
    }

    setResultado({
      areaTotal: Math.round(areaTotal * 100) / 100,
      areaMoveis: areaDescontoMoveis,
      areaLiquida: Math.round(areaLiquida * 100) / 100,
      areaComMargem: Math.round(areaComMargem * 100) / 100,
      areaPorPeca: Math.round(areaPorPeca * 10000) / 10000,
      qtdPecas,
      qtdCaixas,
      pecasPorCaixa: pecasCaixa,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title="Calculadora de Pisos e Porcelanatos"
        description="Descubra a quantidade de caixas de piso, rodapés e argamassa. Inclui cálculo de perda (quebra)."
        url="https://suaobracerta.com.br/calculadora-pisos"
        schema={generateCalculatorSchema(
          "Calculadora de Pisos",
          "Calcule a quantidade de pisos, revestimentos e rodapés.",
          "https://suaobracerta.com.br/calculadora-pisos"
        )}
      />
      <Header />

      <main className="flex-1">
        {/* Ad Placeholder - Topo */}
        <div className="container pt-6">
          <AdPlaceholder id="ad-topo-calc-piso" className="max-w-3xl mx-auto" />
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
                  <LayoutGrid className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Calculadora de Pisos
                </h1>
              </div>
              <p className="text-muted-foreground">
                Calcule a quantidade exata de cerâmica ou porcelanato para seu ambiente, incluindo margem de corte.
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-up">
              <div className="grid gap-5">
                {/* Tipo de Piso */}
                <div className="space-y-2">
                  <Label htmlFor="tipoPiso" className="text-foreground font-medium">
                    Tipo de Revestimento
                  </Label>
                  <Select value={tipoPiso} onValueChange={setTipoPiso}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ceramica">Cerâmica</SelectItem>
                      <SelectItem value="porcelanato">Porcelanato</SelectItem>
                      <SelectItem value="vinilico">Piso Vinílico</SelectItem>
                      <SelectItem value="laminado">Piso Laminado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dimensões do Ambiente */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-foreground font-medium">Dimensões do Ambiente</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Meça o comprimento e largura do ambiente em metros</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="compAmbiente" className="text-sm text-muted-foreground">
                        Comprimento (metros)
                      </Label>
                      <Input
                        id="compAmbiente"
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex: 5.50"
                        value={comprimentoAmbiente}
                        onChange={(e) => setComprimentoAmbiente(e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="largAmbiente" className="text-sm text-muted-foreground">
                        Largura (metros)
                      </Label>
                      <Input
                        id="largAmbiente"
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex: 4.00"
                        value={larguraAmbiente}
                        onChange={(e) => setLarguraAmbiente(e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Dimensões do Piso */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-foreground font-medium">Dimensões do Piso/Revestimento</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Informe as dimensões de cada peça em centímetros</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="compPiso" className="text-sm text-muted-foreground">
                        Comprimento (cm)
                      </Label>
                      <Input
                        id="compPiso"
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex: 60"
                        value={comprimentoPiso}
                        onChange={(e) => setComprimentoPiso(e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="largPiso" className="text-sm text-muted-foreground">
                        Largura (cm)
                      </Label>
                      <Input
                        id="largPiso"
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex: 60"
                        value={larguraPiso}
                        onChange={(e) => setLarguraPiso(e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Área de Móveis Fixos */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="areaMoveis" className="text-foreground font-medium">
                      Área de móveis fixos a descontar (m²)
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <p>Área ocupada por armários embutidos, bancadas ou outros móveis que não terão piso embaixo</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="areaMoveis"
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    value={areaMoveis}
                    onChange={(e) => setAreaMoveis(e.target.value)}
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Opcional: deixe em branco ou 0 se não houver desconto
                  </p>
                </div>

                {/* Margem e Peças por Caixa */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="margemCorte" className="text-foreground font-medium">
                        Margem de corte (%)
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[250px]">
                          <p>Porcentagem extra para cobrir perdas com cortes, quebras e encaixes</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select value={margemCorte} onValueChange={setMargemCorte}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5% (Paginação simples)</SelectItem>
                        <SelectItem value="10">10% (Recomendado)</SelectItem>
                        <SelectItem value="15">15% (Cortes diagonais)</SelectItem>
                        <SelectItem value="20">20% (Paginação complexa)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pecasCaixa" className="text-foreground font-medium">
                      Peças por caixa (opcional)
                    </Label>
                    <Input
                      id="pecasCaixa"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      placeholder="Ex: 6"
                      value={pecasPorCaixa}
                      onChange={(e) => setPecasPorCaixa(e.target.value)}
                      className="h-12 text-base"
                    />
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
                <div className="text-center mb-6">
                  <p className="text-lg font-medium text-foreground mb-1">
                    Você precisa de aproximadamente
                  </p>
                  <p className="text-5xl font-extrabold text-primary mb-2">
                    {resultado.qtdPecas} peças
                  </p>
                  {resultado.qtdCaixas > 0 && (
                    <p className="text-xl font-semibold text-foreground">
                      = {resultado.qtdCaixas} {resultado.qtdCaixas === 1 ? 'caixa' : 'caixas'}
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        ({resultado.pecasPorCaixa} peças/caixa)
                      </span>
                    </p>
                  )}
                </div>

                {/* Detalhamento */}
                <div className="grid gap-3 rounded-lg bg-card/80 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Área total do ambiente:</span>
                    <span className="font-medium text-foreground">{resultado.areaTotal} m²</span>
                  </div>
                  {resultado.areaMoveis > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto (móveis fixos):</span>
                      <span className="font-medium text-foreground">- {resultado.areaMoveis} m²</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Área líquida:</span>
                    <span className="font-medium text-foreground">{resultado.areaLiquida} m²</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Área com margem ({margemCorte}%):</span>
                    <span className="font-medium text-foreground">{resultado.areaComMargem} m²</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-3">
                    <span className="text-muted-foreground">Área por peça:</span>
                    <span className="font-medium text-foreground">{resultado.areaPorPeca} m²</span>
                  </div>
                </div>

                {/* Dica */}
                <div className="mt-4 rounded-lg bg-accent/10 border border-accent/20 p-4 text-center">
                  <p className="text-sm text-foreground">
                    💡 <strong>Dica:</strong> Sempre compre caixas fechadas e guarde algumas peças extras para futuras manutenções.
                  </p>
                </div>

                {/* Ad Placeholder - Meio do Resultado */}
                <div className="mt-6">
                  <AdPlaceholder id="ad-meio-resultado-piso" />
                </div>

                {/* Botão Afiliado */}
                {/* Botão Afiliado & Orçamento */}
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => {
                      addItem({
                        id: crypto.randomUUID(),
                        name: `Piso ${tipoPiso.charAt(0).toUpperCase() + tipoPiso.slice(1)}`,
                        description: `Área cobrível: ${resultado.areaComMargem}m² | Margem ${margemCorte}%`,
                        quantity: resultado.qtdPecas,
                        unit: "Peças",
                        category: "Acabamento - Piso",
                        estimatedPrice: resultado.areaComMargem * 60 // Estimativa R$60/m²
                      });
                    }}
                    variant="outline"
                    size="xl"
                    className="w-full border-2 hover:bg-slate-50 text-slate-700"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Adicionar Piso ao Orçamento
                  </Button>

                  <Button
                    asChild
                    variant="success"
                    size="xl"
                    className="w-full"
                  >
                    <a href={affiliateLinks.flooring.general} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      VER PISOS NA AMAZON (Promoção)
                    </a>
                  </Button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    *Link de afiliado. Você não paga nada a mais por isso.
                  </p>
                </div>
              </div>
            )}

            {/* Informações extras */}
            <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                📋 Como calcular a quantidade de piso?
              </h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Nossa calculadora usa a fórmula: <strong>(Área × Fator de Margem) ÷ Área por Peça</strong>.
                </p>
                <p>
                  • Primeiro calculamos a área total do ambiente (comprimento × largura).
                </p>
                <p>
                  • Descontamos a área de móveis fixos como armários embutidos ou bancadas.
                </p>
                <p>
                  • Adicionamos a margem de corte (recomendamos 10% para paginação tradicional).
                </p>
                <p>
                  • Dividimos pela área de cada peça para obter a quantidade necessária.
                </p>
              </div>

              <h3 className="mt-6 mb-3 text-base font-semibold text-foreground">
                🔧 Margem de corte recomendada:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>5%</strong> - Ambientes retangulares simples, sem recortes</li>
                <li>• <strong>10%</strong> - Padrão para a maioria dos ambientes</li>
                <li>• <strong>15%</strong> - Paginação diagonal (45°) ou muitos recortes</li>
                <li>• <strong>20%</strong> - Formatos irregulares ou paginação complexa</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalculadoraPisos;
