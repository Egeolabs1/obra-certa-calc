import { useState } from "react";
import { Wind, Calculator, ShoppingCart, ExternalLink, ArrowLeft, Sun, Smartphone, Users, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrintHeader from "@/components/PrintHeader";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";

interface ResultadoBTU {
    btuNecessario: number;
    btuRecomendado: number;
    classificacao: string;
}

const CalculadoraArCondicionado = () => {
    const { addItem } = useOrcamento();
    const [area, setArea] = useState("");
    const [pessoas, setPessoas] = useState("2");
    const [eletronicos, setEletronicos] = useState("1");
    const [exposicaoSol, setExposicaoSol] = useState("manha");
    const [resultado, setResultado] = useState<ResultadoBTU | null>(null);
    const [erro, setErro] = useState("");

    const parseNumero = (valor: string): number => {
        const valorLimpo = valor.replace(",", ".").trim();
        const numero = parseFloat(valorLimpo);
        return isNaN(numero) ? 0 : numero;
    };

    const calcular = () => {
        setErro("");
        setResultado(null);

        const areaNum = parseNumero(area);
        const pessoasNum = parseNumero(pessoas);
        const eletronicosNum = parseNumero(eletronicos);

        if (areaNum <= 0) {
            setErro("Por favor, informe a área do ambiente em m².");
            return;
        }

        // Lógica de Cálculo
        // Base: 600 BTU/m² (Sol da manhã ou sombra) ou 800 BTU/m² (Sol da tarde)
        // Pessoas: 600 BTU por pessoa adicional (a primeira não conta na base, mas vamos simplificar e contar todas ou ajustar)
        // Regra comum: 600 * area + 600 * (pessoas - 1) + 600 * eletronicos
        // Se sol forte: 800 * area + 800 * (pessoas - 1) + 800 * eletronicos

        // Vamos usar:
        // Fator base: 600 ou 800
        const fatorSol = exposicaoSol === "tarde" ? 800 : 600;

        // Cálculo
        const btuArea = areaNum * fatorSol;
        // Pessoas extras (considerando que o fator área já consideraria 1 pessoa? A norma varia. Vamos somar 600 por pessoa total para garantir conforto)
        const btuPessoas = pessoasNum * 600;
        const btuEletronicos = eletronicosNum * 600;

        const totalBTU = btuArea + btuPessoas + btuEletronicos;

        // Arredondar para capacidades de mercado padrão
        // 9.000, 12.000, 18.000, 24.000, 30.000, 36.000
        const capacidadesPadrao = [9000, 12000, 18000, 24000, 30000, 36000];
        let recomendado = capacidadesPadrao[capacidadesPadrao.length - 1]; // Default to max

        for (const cap of capacidadesPadrao) {
            if (cap >= totalBTU) {
                recomendado = cap;
                break;
            }
        }

        // Se passar do máximo, sugerir múltiplos ou sistema maior
        let classificacao = "";
        if (totalBTU > 36000) {
            classificacao = "Ambiente muito grande! Considere dois aparelhos ou um sistema central.";
            recomendado = Math.ceil(totalBTU / 1000) * 1000; // Arredonda
        } else {
            classificacao = `Ideal para seu ambiente de ${areaNum}m²`;
        }

        setResultado({
            btuNecessario: Math.round(totalBTU),
            btuRecomendado: recomendado,
            classificacao
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de BTUs - Ar Condicionado"
                description="Descubra a potência ideal (BTUs) do ar condicionado para seu quarto ou sala."
                url="https://suaobracerta.com.br/calculadora-ar-condicionado"
                schema={generateCalculatorSchema(
                    "Calculadora de Ar Condicionado",
                    "Calcule a capacidade necessária de BTUs para ar condicionado baseado no ambiente.",
                    "https://suaobracerta.com.br/calculadora-ar-condicionado"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>

            <main className="flex-1">
                <div className="container pt-6">
                    <AdPlaceholder id="ad-topo-ar" className="max-w-3xl mx-auto print:hidden" />
                </div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link
                            to="/"
                            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors print:hidden"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para Início
                        </Link>

                        <div className="mb-8 animate-fade-up print:hidden">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                                    <Wind className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                                    Calculadora de BTUs
                                </h1>
                            </div>
                            <p className="text-muted-foreground">
                                Descubra a potência ideal do Ar Condicionado para gelar seu ambiente de verdade.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-up print:hidden">
                            <div className="grid gap-6">

                                {/* Área */}
                                <div className="space-y-2">
                                    <Label htmlFor="area" className="text-foreground font-medium">
                                        Área do ambiente (m²)
                                    </Label>
                                    <Input
                                        id="area"
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="Ex: 15"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className="h-12 text-base"
                                    />
                                </div>

                                {/* Sol */}
                                <div className="space-y-3">
                                    <Label className="text-foreground font-medium flex items-center gap-2">
                                        <Sun className="h-4 w-4" /> Incidência de Sol
                                    </Label>
                                    <RadioGroup defaultValue="manha" value={exposicaoSol} onValueChange={setExposicaoSol} className="grid grid-cols-2 gap-4">
                                        <div>
                                            <RadioGroupItem value="manha" id="manha" className="peer sr-only" />
                                            <Label
                                                htmlFor="manha"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                                            >
                                                <span className="mb-1 text-lg">🌤️</span>
                                                <span className="text-sm font-medium">Manhã / Sombra</span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="tarde" id="tarde" className="peer sr-only" />
                                            <Label
                                                htmlFor="tarde"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                                            >
                                                <span className="mb-1 text-lg">☀️</span>
                                                <span className="text-sm font-medium">Tarde / Sol Forte</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Pessoas e Eletrônicos */}
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="pessoas" className="text-foreground font-medium flex items-center gap-2">
                                            <Users className="h-4 w-4" /> Quantidade de pessoas
                                        </Label>
                                        <Input
                                            id="pessoas"
                                            type="number"
                                            inputMode="numeric"
                                            min="1"
                                            placeholder="2"
                                            value={pessoas}
                                            onChange={(e) => setPessoas(e.target.value)}
                                            className="h-12 text-base"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="eletronicos" className="text-foreground font-medium flex items-center gap-2">
                                            <Smartphone className="h-4 w-4" /> Eletrônicos (TV, PC)
                                        </Label>
                                        <Input
                                            id="eletronicos"
                                            type="number"
                                            inputMode="numeric"
                                            min="0"
                                            placeholder="1"
                                            value={eletronicos}
                                            onChange={(e) => setEletronicos(e.target.value)}
                                            className="h-12 text-base"
                                        />
                                    </div>
                                </div>

                                {erro && (
                                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive animate-scale-in">
                                        {erro}
                                    </div>
                                )}

                                <Button onClick={calcular} size="xl" className="w-full mt-2">
                                    <Calculator className="h-5 w-5" />
                                    CALCULAR POTÊNCIA
                                </Button>
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-6 rounded-xl border-2 border-primary bg-gradient-result p-6 animate-scale-in print:shadow-none print:border-none print:bg-white">
                                <PrintHeader />
                                <div className="text-center">
                                    <p className="text-lg font-medium text-foreground mb-1">
                                        Potência recomendada:
                                    </p>
                                    <p className="text-5xl font-extrabold text-blue-600 mb-2">
                                        {resultado.btuRecomendado.toLocaleString('pt-BR')} BTUs
                                    </p>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        (Cálculo exato: {resultado.btuNecessario.toLocaleString('pt-BR')} BTUs)
                                    </p>
                                    <p className="mt-2 text-sm text-foreground/80">{resultado.classificacao}</p>
                                </div>

                                <div className="mt-6">
                                    <Button
                                        asChild
                                        variant="success"
                                        size="xl"
                                        className="w-full print:hidden"
                                    >
                                        <a href={affiliateLinks.electrical.ac} target="_blank" rel="noopener noreferrer">
                                            <ShoppingCart className="h-5 w-5" />
                                            VER AR CONDICIONADO EM OFERTA
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Ar Condicionado ${resultado.btuRecomendado.toLocaleString('pt-BR')} BTUs`,
                                                description: `Para área de ${area}m² | Sol: ${exposicaoSol === 'tarde' ? 'Tarde' : 'Manhã'}`,
                                                quantity: 1,
                                                unit: "Unidade",
                                                category: "Climatização",
                                                estimatedPrice: resultado.btuRecomendado / 5 // Estimativa tosca, mas serve como placeholder (ex: 12000/5 = 2400)
                                            });
                                        }}
                                        variant="outline"
                                        size="xl"
                                        className="w-full border-2 hover:bg-slate-50 text-slate-700 print:hidden"
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Adicionar ao Orçamento
                                    </Button>

                                    <Button
                                        onClick={handlePrint}
                                        variant="outline"
                                        size="xl"
                                        className="w-full border-2 hover:bg-slate-50 text-slate-700 mt-2 print:hidden"
                                    >
                                        <Printer className="h-5 w-5 mr-2" />
                                        Salvar em PDF
                                    </Button>
                                    <p className="mt-2 text-center text-xs text-muted-foreground">
                                        *Melhores preços na Amazon/Mercado Livre.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                ❄️ Guia Completo: Escolhendo seu Ar Condicionado
                            </h2>
                            <div className="space-y-6 text-sm text-muted-foreground">

                                <div className="space-y-2">
                                    <h3 className="font-medium text-foreground">1. O que são BTUs?</h3>
                                    <p>
                                        BTU (British Thermal Unit) é a unidade que mede a capacidade de refrigeração.
                                        Basicamente, quanto maior o BTU, mais rápido e eficiente o aparelho consegue "tirar o calor" do ambiente.
                                        Um aparelho com BTUs insuficientes nunca desligará o compressor, gastando muita energia sem gelar.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="bg-card p-4 rounded-lg border border-border">
                                        <h3 className="font-medium text-foreground mb-2">⚡ Tecnologia Inverter</h3>
                                        <p>
                                            Sempre prefira modelos <strong>Inverter</strong>. Eles regulam a velocidade do compressor em vez de ficar ligando e desligando.
                                            Isso gera uma economia de energia de até <strong>60%</strong> e é muito mais silencioso.
                                        </p>
                                    </div>
                                    <div className="bg-card p-4 rounded-lg border border-border">
                                        <h3 className="font-medium text-foreground mb-2">☀️ O Fator Sol</h3>
                                        <p>
                                            O sol é o maior vilão. Um quarto que recebe sol da tarde (poente) precisa de cerca de <strong>30% a mais de potência</strong> do que um quarto que só pega sol da manhã.
                                            Nossa calculadora já ajusta isso automaticamente para você.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-medium text-foreground">3. Dicas de Instalação e Uso</h3>
                                    <ul className="list-disc list-inside space-y-1 ml-1">
                                        <li>Mantenha portas e janelas fechadas enquanto ligado.</li>
                                        <li>Limpe os filtros a cada 15 dias para manter a eficiência e a saúde do ar.</li>
                                        <li>A temperatura ideal para saúde e economia fica entre <strong>23°C e 24°C</strong>. Abaixar para 17°C gasta muito mais energia e muitas vezes não gela mais rápido.</li>
                                        <li>A evaporadora (parte interna) deve ficar centralizada na parede maior, se possível, para distribuir melhor o vento.</li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-xs">
                                    * Cálculo baseado na norma ABNT NBR 5858 e práticas de mercado (600 a 800 BTU/m²).
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >

            <div className="print:hidden">
                <Footer />
            </div>
        </div >
    );
};

export default CalculadoraArCondicionado;
