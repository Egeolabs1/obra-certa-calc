import { useState, useRef } from "react";
import { Armchair, ArrowLeft, Ruler, Calculator, ExternalLink, Lightbulb, Wallet, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { affiliateLinks } from "@/config/affiliateLinks";

const CalculadoraMoveisPlanejados = () => {
    const [metros, setMetros] = useState("");
    const [acabamento, setAcabamento] = useState("branco");
    const [resultado, setResultado] = useState<{
        custoEstimado: number;
        custoMin: number;
        custoMax: number;
    } | null>(null);

    const resultRef = useRef<HTMLDivElement>(null);

    const calcular = () => {
        const met = parseFloat(metros);
        if (!met) return;

        let precoBase = 1500; // Branco Simples
        if (acabamento === "madeirado") precoBase = 2200; // Madeirado/Vidro
        if (acabamento === "laqueado") precoBase = 2800; // Laca

        const total = met * precoBase;

        // Margin of error 15%
        const min = total * 0.9;
        const max = total * 1.15;

        setResultado({
            custoEstimado: total,
            custoMin: min,
            custoMax: max
        });

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Estimador de Custo de Móveis Planejados"
                description="Quanto custa fazer cozinha planejada ou guarda-roupa? Simule o valor da marcenaria."
                url="https://suaobracerta.com.br/calculadora-moveis-planejados"
                keywords="quanto custa moveis planejados, orçamento marcenaria, preço cozinha planejada, moveis sob medida"
                schema={generateCalculatorSchema(
                    "Estimador de Móveis Planejados",
                    "Orçamento estimado para marcenaria e móveis sob medida.",
                    "https://suaobracerta.com.br/calculadora-moveis-planejados"
                )}
            />
            <Header />

            <main className="flex-1">
                {/* Top Ad - High Value for Furniture Stores */}
                <div className="container pt-6"><AdPlaceholder id="ad-furniture-top" className="max-w-3xl mx-auto h-[120px]" /></div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-4xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-amber-700 rounded-xl p-3 text-white shadow-lg"><Armchair className="h-8 w-8" /></div>
                            <div>
                                <h1 className="leading-none text-3xl md:text-4xl text-foreground">Quanto custa Móveis Planejados?</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1">Estimativa de mercado para Cozinhas e Quartos (Marcenaria)</p>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Metros Lineares (Parede)</Label>
                                    <div className="relative">
                                        <Ruler className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            value={metros}
                                            onChange={e => setMetros(e.target.value)}
                                            className="pl-10 h-12"
                                            placeholder="Ex: 3.5 metros"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Some o comprimento das paredes onde terão móveis.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Padrão de Acabamento</Label>
                                    <Select value={acabamento} onValueChange={setAcabamento}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="branco">Branco Simples (Mais Barato)</SelectItem>
                                            <SelectItem value="madeirado">Madeirado / Com Vidro (Padrão)</SelectItem>
                                            <SelectItem value="laqueado">Laca / Alto Brilho (Premium)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={calcular} size="lg" className="w-full mt-6 bg-amber-700 hover:bg-amber-800 text-white h-14 font-bold text-lg">
                                <Wallet className="mr-2 h-5 w-5" /> CALCULAR INVESTIMENTO
                            </Button>
                        </div>

                        {/* Result */}
                        {resultado && (
                            <div ref={resultRef} className="animate-fade-up space-y-8">
                                <Card className="border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20">
                                    <CardContent className="p-8 text-center">
                                        <p className="text-lg font-medium text-amber-800 dark:text-amber-200 mb-2">Investimento Estimado</p>
                                        <div className="flex justify-center items-end gap-2 mb-2">
                                            <span className="text-sm text-muted-foreground mb-2">de R$ {resultado.custoMin.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} até</span>
                                            <span className="text-5xl font-extrabold text-amber-600">R$ {resultado.custoEstimado.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Valor médio de mercado (Mão de obra + Material)</p>
                                    </CardContent>
                                </Card>

                                {/* Monetization Block: Modular Kitchens */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="border rounded-xl p-6 bg-card flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                                <Lightbulb className="h-5 w-5 text-yellow-500" /> Quer economizar até 50%?
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-4">
                                                Cozinhas moduladas prontas custam <strong>metade do preço</strong> das planejadas e entregam em dias, sem esperar marceneiro.
                                            </p>
                                        </div>
                                        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                                            <a href={affiliateLinks.furniture.modularKitchen} target="_blank" rel="noopener noreferrer">
                                                Ver Cozinhas Moduladas (Promoção) <ExternalLink className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>

                                    {/* Ad Placeholder Inside Results - Very high CTR */}
                                    <div className="border rounded-xl p-1 bg-muted/20 flex items-center justify-center min-h-[160px]">
                                        <AdPlaceholder id="ad-furniture-result" />
                                    </div>
                                </div>

                                <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                                    <strong className="block mb-1 text-foreground">⚠️ Importante:</strong>
                                    Este valor é uma estimativa baseada em preços médios de marcenarias. O valor real pode variar dependendo da região, ferragens escolhidas (amortecedores, corrediças invisíveis) e reputação da empresa.
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

export default CalculadoraMoveisPlanejados;
