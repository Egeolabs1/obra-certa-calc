import { useState, useRef } from "react";
import { Zap, Calculator, ShoppingCart, ArrowLeft, Sun, BatteryCharging, Leaf, PiggyBank, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { affiliateLinks } from "@/config/affiliateLinks";

const CalculadoraEnergia = () => {
    const [regiao, setRegiao] = useState("");
    const [valorConta, setValorConta] = useState("");

    // Constants
    const TARIFA_KWH = 0.95;
    const POTENCIA_PAINEL = 550; // W
    const CUSTO_POR_KWP = 3800; // R$
    const TAXA_MINIMA = 50; // R$

    const [resultado, setResultado] = useState<{
        consumoMensal: number;
        tamanhoSistema: number;
        qtdPaineis: number;
        areaNecessaria: number;
        economiaAnual: number;
        investimento: number;
        tempoRetorno: number;
        producaoMensal: number;
    } | null>(null);

    const resultSectionRef = useRef<HTMLDivElement>(null);

    const calcular = () => {
        const conta = parseFloat(valorConta);
        if (!conta || !regiao) return;

        // 1. HSP por Região
        let hsp = 4.9; // Default Sudeste/Norte
        switch (regiao) {
            case "nordeste":
            case "centro-oeste":
                hsp = 5.4;
                break;
            case "sul":
                hsp = 4.3;
                break;
            case "norte":
            case "sudeste":
                hsp = 4.9;
                break;
        }

        // 2. Cálculos
        const consumoEstimado = conta / TARIFA_KWH; // kWh
        const tamanhoSistema = (consumoEstimado / 30) / hsp; // kWp
        const qtdPaineis = Math.ceil((tamanhoSistema * 1000) / POTENCIA_PAINEL);
        const areaNecessaria = qtdPaineis * 2.2; // m2
        const producaoMensal = tamanhoSistema * hsp * 30; // kWh gerado

        // Financeiro
        const economiaMensal = conta - TAXA_MINIMA;
        const economiaAnual = economiaMensal * 12;
        const investimento = tamanhoSistema * CUSTO_POR_KWP;
        const tempoRetorno = investimento / economiaAnual;

        setResultado({
            consumoMensal: Math.round(consumoEstimado),
            tamanhoSistema: parseFloat(tamanhoSistema.toFixed(2)),
            qtdPaineis,
            areaNecessaria: parseFloat(areaNecessaria.toFixed(1)),
            economiaAnual: parseFloat(economiaAnual.toFixed(2)),
            investimento: parseFloat(investimento.toFixed(2)),
            tempoRetorno: parseFloat(tempoRetorno.toFixed(1)),
            producaoMensal: Math.round(producaoMensal)
        });

        // Scroll
        setTimeout(() => {
            resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Energia Solar Fotovoltaica (On-Grid)"
                description="Descubra quantos painéis solares você precisa para zerar sua conta de luz e calcule o retorno do investimento. Simule de graça!"
                url="https://suaobracerta.com.br/calculadora-energia"
                keywords="energia solar, calculadora solar, placa solar, painel solar, kit energia solar, on grid, off grid, inversor solar, economia de energia, reduzir conta de luz, fotovoltaica, energia limpa, sustentabilidade, financiamento solar, orçamento solar, quanto custa energia solar, retorno investimento solar, payback solar, kit solar amazon, energia solar residencial"
                schema={generateCalculatorSchema(
                    "Calculadora Solar",
                    "Simule seu kit de energia solar fotovoltaica e economia estimada.",
                    "https://suaobracerta.com.br/calculadora-energia"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-solar-top" className="max-w-3xl mx-auto" /></div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-4xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-yellow-500 rounded-xl p-3 text-white shadow-lg"><Sun className="h-8 w-8" /></div>
                            <div>
                                <h1 className="leading-none text-3xl md:text-4xl text-foreground">Calculadora Solar</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1">Simule seu sistema On-Grid</p>
                            </div>
                        </div>

                        {/* Input Section */}
                        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card mb-12">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-base">Onde você mora?</Label>
                                    <Select value={regiao} onValueChange={setRegiao}>
                                        <SelectTrigger className="h-12 text-lg"><SelectValue placeholder="Selecione sua Região" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sul">Região Sul</SelectItem>
                                            <SelectItem value="sudeste">Região Sudeste</SelectItem>
                                            <SelectItem value="centro-oeste">Região Centro-Oeste</SelectItem>
                                            <SelectItem value="nordeste">Região Nordeste</SelectItem>
                                            <SelectItem value="norte">Região Norte</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-base">Valor da Conta de Luz (R$)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-muted-foreground">R$</span>
                                        <Input
                                            type="number"
                                            value={valorConta}
                                            onChange={e => setValorConta(e.target.value)}
                                            placeholder="Ex: 400"
                                            className="h-12 text-lg pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button onClick={calcular} size="xl" className="w-full mt-8 text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg h-14">
                                CALCULAR ECONOMIA E KIT SOLAR
                            </Button>
                        </div>

                        {/* Results Section */}
                        {resultado && (
                            <div ref={resultSectionRef} className="animate-fade-up space-y-8">

                                {/* Card Destaque: Sistema */}
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl shadow-xl p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={180} /></div>
                                    <div className="relative z-10">
                                        <h2 className="text-2xl font-bold mb-4 opacity-90 uppercase tracking-wider flex items-center gap-2"><Sun className="text-yellow-400" /> Seu Sistema Ideal</h2>
                                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
                                            <div>
                                                <p className="text-6xl font-black mb-2">{resultado.qtdPaineis} <span className="text-3xl font-medium">Painéis</span></p>
                                                <p className="text-xl opacity-80">Potência Total: {resultado.tamanhoSistema} kWp</p>
                                            </div>
                                            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                                                <p className="font-semibold text-lg flex items-center gap-2"><Leaf className="h-5 w-5 text-green-400" /> Área Necessária</p>
                                                <p className="opacity-80">Aprox. {resultado.areaNecessaria} m² de telhado</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Card Financeiro */}
                                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl p-6 shadow-md flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <PiggyBank /> Bolso Cheio
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Economia Anual Estimada</p>
                                                    <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">R$ {resultado.economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Investimento Estimado</p>
                                                    <p className="text-xl font-bold">~ R$ {resultado.investimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 bg-white dark:bg-black/20 p-3 rounded-lg text-center">
                                            <p className="font-medium text-emerald-700 dark:text-emerald-300">
                                                Seu investimento se paga em <span className="font-bold text-xl">{resultado.tempoRetorno.toLocaleString('pt-BR')} Anos</span>!
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Ação */}
                                    <div className="bg-card border border-border rounded-xl p-6 shadow-md flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Briefcase /> Próximo Passo
                                            </h3>
                                            <p className="text-muted-foreground mb-6">
                                                Você tem duas opções: comprar um kit online ou contratar um projeto completo.
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            {/* Affiliate Link */}
                                            <Button asChild variant="default" size="lg" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold">
                                                <a href={affiliateLinks.solar.offGridKit} target="_blank" rel="noopener noreferrer">
                                                    <ShoppingCart className="mr-2 h-5 w-5" /> Ver Kits na Amazon
                                                </a>
                                            </Button>

                                            {/* Ad Placeholder wrapper tailored for 'Lead Gen' feel */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                                                    {/* Optional hover effect */}
                                                </div>
                                                <Button asChild variant="outline" size="lg" className="w-full border-blue-200 hover:bg-blue-50 text-blue-700">
                                                    <a href="#" className="opacity-50 cursor-not-allowed">
                                                        Pedir Orçamento Profissional
                                                    </a>
                                                </Button>
                                            </div>

                                            {/* Strategic Ad Placement */}
                                            <div className="mt-4">
                                                <p className="text-xs text-center text-muted-foreground mb-2">Publicidade</p>
                                                <AdPlaceholder id="ad-solar-middle" className="h-[100px]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center text-xs text-muted-foreground opacity-70 max-w-2xl mx-auto">
                                    *Estimativa baseada em médias nacionais de irradiação solar e custos de mercado.
                                    Os valores reais podem variar de acordo com a inclinação do telhado, sombreamento,
                                    marca dos equipamentos e tarifa da concessionária local.
                                </div>

                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                ☀️ Como calculamos seu sistema solar?
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    Esta simulação considera sistemas <strong>On-Grid</strong> (conectados à rede).
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Irradiação Solar (HSP)</p>
                                        <p>Utilizamos a média de Horas de Sol Pleno (HSP) da sua região (Ex: Nordeste 5.4h, Sul 4.3h) para estimar a geração.</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Equipamentos</p>
                                        <p>Consideramos painéis modernos de <strong>550W</strong> e inversor compatível. A área estimada inclui o espaçamento necessário entre placas.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default CalculadoraEnergia;
