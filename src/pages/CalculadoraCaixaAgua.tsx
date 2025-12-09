import { useState } from "react";
import { Droplets, Calculator, ShoppingCart, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";

const CalculadoraCaixaAgua = () => {
    const [pessoas, setPessoas] = useState("4");
    const [dias, setDias] = useState("2");
    const [resultado, setResultado] = useState<number | null>(null);

    const calcular = () => {
        const p = parseFloat(pessoas);
        const d = parseFloat(dias);
        if (!p || !d) return;

        // Consumo médio: 150L por pessoa/dia (Casa) a 200L (Apto)
        // Usaremos 150L como base segura para casas padrão
        const consumoDiario = p * 150;
        const total = consumoDiario * d;
        setResultado(total);
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Caixa D'água"
                description="Calcule o tamanho ideal da caixa d'água para sua casa com base no número de moradores."
                url="https://suaobracerta.com.br/calculadora-caixa-agua"
                schema={generateCalculatorSchema(
                    "Calculadora de Caixa D'água",
                    "Calcule o volume necessário para a caixa d'água residencial.",
                    "https://suaobracerta.com.br/calculadora-caixa-agua"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-agua" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-blue-600 rounded-xl p-3 text-white"><Droplets /></div>
                            <h1>Calculadora de Caixa D'água</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="space-y-2">
                                <Label>Número de Moradores</Label>
                                <Input type="number" value={pessoas} onChange={e => setPessoas(e.target.value)} className="h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label>Dias de Reserva (Segurança)</Label>
                                <Input type="number" value={dias} onChange={e => setDias(e.target.value)} className="h-12" />
                                <p className="text-xs text-muted-foreground">Recomendado: Pelo menos 2 dias para casos de falta de água.</p>
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR VOLUME</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 bg-gradient-result p-6 rounded-xl border-2 border-primary text-center animate-scale-in">
                                <p className="text-xl text-foreground">Volume Recomendado:</p>
                                <p className="text-5xl font-extrabold text-primary my-3">{resultado} Litros</p>

                                <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg my-4">
                                    <p className="font-semibold">Sugestão de Compra:</p>
                                    <p className="text-lg">
                                        {resultado <= 500 ? "1 Caixa de 500L" :
                                            resultado <= 1000 ? "1 Caixa de 1000L" :
                                                resultado <= 1500 ? "1 Caixa de 1500L ou 1000L + 500L" :
                                                    "Caixa de 2000L ou mais"}
                                    </p>
                                </div>

                                <Button asChild variant="success" size="lg" className="w-full">
                                    <a href={affiliateLinks.water.tank} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2" /> VER PREÇOS DE CAIXAS</a>
                                </Button>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                💧 Entenda o consumo de água
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    O cálculo é baseado na média de consumo diário recomendada pela ABNT e concessionárias de água.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Consumo por Pessoa</p>
                                        <p>Estimamos <strong>150 litros/dia</strong> por morador em casas e <strong>200 litros/dia</strong> em apartamentos.</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Reserva de Segurança</p>
                                        <p>Recomendamos ter água armazenada suficiente para pelo menos <strong>2 dias</strong> de consumo, prevenindo falta de abastecimento.</p>
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
export default CalculadoraCaixaAgua;
