import { useState, useRef } from "react";
import { Banknote, ArrowLeft, Percent, CalendarRange, Calculator, Briefcase, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";

const CalculadoraFinanciamento = () => {
    const [valorTotal, setValorTotal] = useState("");
    const [entrada, setEntrada] = useState("");
    const [meses, setMeses] = useState("48");
    const [resultado, setResultado] = useState<{
        parcela: number;
        totalPago: number;
        totalJuros: number;
        taxaUsada: number;
    } | null>(null);

    const resultRef = useRef<HTMLDivElement>(null);

    const calcular = () => {
        const total = parseFloat(valorTotal);
        const ent = parseFloat(entrada) || 0;
        const n = parseInt(meses);

        if (!total || !n) return;

        const valorFinanciado = total - ent;
        const i = 0.015; // 1.5% a.m (Estimate for Personal Loan/Construction Loan)

        // PMT Formula (Tabela Price)
        // PMT = PV * (i * (1 + i)^n) / ((1 + i)^n - 1)
        const parcela = valorFinanciado * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);

        const totalPago = (parcela * n) + ent;
        const totalJuros = (parcela * n) - valorFinanciado;

        setResultado({
            parcela,
            totalPago,
            totalJuros,
            taxaUsada: i * 100
        });

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Simulador de Financiamento de Reforma e Construção"
                description="Calcule o valor da parcela do financiamento da sua obra. Simulação Construcard, Home Equity e Empréstimo Pessoal."
                url="https://suaobracerta.com.br/calculadora-financiamento"
                keywords="simulador financiamento reforma, construcard caixa, emprestimo para obra, financiar construção"
                schema={generateCalculatorSchema(
                    "Simulador de Financiamento de Reforma",
                    "Calculadora financeira para estimar parcelas de crédito para construção.",
                    "https://suaobracerta.com.br/calculadora-financiamento",
                    "https://suaobracerta.com.br/og-image.png",
                    "FinancialApplication"
                )}
            />
            <Header />

            <main className="flex-1">
                {/* Top Ad - Premium Spot for Banks */}
                <div className="container pt-6"><AdPlaceholder id="ad-finance-top" className="max-w-3xl mx-auto h-[120px]" /></div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-4xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-emerald-600 rounded-xl p-3 text-white shadow-lg"><Landmark className="h-8 w-8" /></div>
                            <div>
                                <h1 className="leading-none text-3xl md:text-4xl text-foreground">Simulador de Reforma</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1">Estimativa de parcelas para financiar sua obra</p>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Valor TOTAL da Obra</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-muted-foreground font-semibold">R$</span>
                                        <Input
                                            type="number"
                                            value={valorTotal}
                                            onChange={e => setValorTotal(e.target.value)}
                                            className="pl-10 h-12"
                                            placeholder="Ex: 50000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Valor de Entrada (Se houver)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-muted-foreground font-semibold">R$</span>
                                        <Input
                                            type="number"
                                            value={entrada}
                                            onChange={e => setEntrada(e.target.value)}
                                            className="pl-10 h-12"
                                            placeholder="Ex: 10000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Prazo (Meses)</Label>
                                    <div className="relative">
                                        <CalendarRange className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            value={meses}
                                            onChange={e => setMeses(e.target.value)}
                                            className="pl-10 h-12"
                                            placeholder="Ex: 48"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button onClick={calcular} size="lg" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white h-14 font-bold text-lg">
                                <Calculator className="mr-2 h-5 w-5" /> SIMULAR PARCELAS
                            </Button>
                        </div>

                        {/* Result */}
                        {resultado && (
                            <div ref={resultRef} className="animate-fade-up space-y-8">
                                <Card className="border-2 border-emerald-100 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20">
                                    <CardContent className="p-8 text-center">
                                        <p className="text-lg font-medium text-emerald-800 dark:text-emerald-200 mb-2">Valor da Parcela Estimada</p>
                                        <div className="flex justify-center items-end gap-2 mb-4">
                                            <span className="text-5xl font-extrabold text-emerald-600">R$ {resultado.parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            <span className="text-lg text-emerald-600/80 mb-2">/mês</span>
                                        </div>
                                        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1 rounded-full text-xs font-medium border shadow-sm">
                                            <Percent className="h-3 w-3" /> Taxa média usada: {resultado.taxaUsada}% a.m.
                                        </div>

                                        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-emerald-200 dark:border-emerald-800 pt-6">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total Pago (com Juros)</p>
                                                <p className="font-semibold text-lg">R$ {resultado.totalPago.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Custo Efetivo (Juros)</p>
                                                <p className="font-semibold text-lg text-red-500">+ R$ {resultado.totalJuros.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Bank Ad Placeholder - Huge Revenue Potential */}
                                    <div className="border rounded-xl p-4 bg-muted/20 flex flex-col items-center justify-center min-h-[200px] text-center">
                                        <p className="text-xs text-muted-foreground mb-2">Publicidade</p>
                                        <AdPlaceholder id="ad-finance-result-1" className="w-full h-full min-h-[150px]" />
                                    </div>
                                    <div className="border rounded-xl p-4 bg-muted/20 flex flex-col items-center justify-center min-h-[200px] text-center">
                                        <p className="text-xs text-muted-foreground mb-2">Publicidade</p>
                                        <AdPlaceholder id="ad-finance-result-2" className="w-full h-full min-h-[150px]" />
                                    </div>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-900">
                                    <strong className="block mb-1">Nota Legal:</strong>
                                    Esta é uma simulação aproximada baseada na Tabela Price e taxas médias de mercado (1.5% a.m). O CET (Custo Efetivo Total) real pode variar conforme seu score de crédito e o banco escolhido. Consulte seu gerente.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CalculadoraFinanciamento;
