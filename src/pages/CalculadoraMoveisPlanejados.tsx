import { useState, useRef } from "react";
import { Armchair, ArrowLeft, Ruler, Calculator, ExternalLink, Lightbulb, Wallet, CheckCircle2, ShoppingCart, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
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
import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraMoveisPlanejados = () => {
    const { addItem } = useOrcamento();
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Estimador de Custo de Móveis Planejados"
                description="Quanto custa fazer cozinha planejada ou guarda-roupa? Simule o valor da marcenaria."
                url="https://www.suaobracerta.com.br/calculadora-moveis-planejados"
                keywords="quanto custa moveis planejados, orçamento marcenaria, preço cozinha planejada, moveis sob medida"
                schema={generateCalculatorSchema(
                    "Estimador de Móveis Planejados",
                    "Orçamento estimado para marcenaria e móveis sob medida.",
                    "https://www.suaobracerta.com.br/calculadora-moveis-planejados"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>

            <main className="flex-1">
                <PrintHeader title="Estimativa de Móveis Planejados" />
                {/* Top Ad - High Value for Furniture Stores */}
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-furniture-top" className="max-w-3xl mx-auto h-[120px]" /></div>

                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-4xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-amber-700 rounded-xl p-3 text-white shadow-lg print:bg-white print:text-amber-800 print:shadow-none print:border print:border-amber-200"><Armchair className="h-8 w-8" /></div>
                            <div>
                                <h1 className="leading-none text-3xl md:text-4xl text-foreground print:text-2xl">Quanto custa Móveis Planejados?</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1 print:hidden">Estimativa de mercado para Cozinhas e Quartos (Marcenaria)</p>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8 print:shadow-none print:border-none print:p-0 print:mb-6">
                            <div className="print:hidden">
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

                            {/* Print Summary */}
                            <div className="hidden print:block mb-6 p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Projeto</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">Metragem Linear:</span>
                                        <span className="font-medium">{metros} m</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Acabamento:</span>
                                        <span className="font-medium capitalize">{acabamento}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Result */}
                        {resultado && (
                            <div ref={resultRef} className="animate-fade-up space-y-8 print:space-y-4">
                                <Card className="border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 print:bg-white print:border print:border-amber-200 print:shadow-none">
                                    <CardContent className="p-8 text-center print:p-4 print:text-left">
                                        <p className="text-lg font-medium text-amber-800 dark:text-amber-200 mb-2 print:text-gray-600">Investimento Estimado</p>
                                        <div className="flex justify-center items-end gap-2 mb-2 print:justify-start">
                                            <span className="text-sm text-muted-foreground mb-2 print:hidden">de R$ {resultado.custoMin.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} até</span>
                                            <span className="text-5xl font-extrabold text-amber-600 print:text-black">R$ {resultado.custoEstimado.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                                            <span className="hidden print:inline text-sm text-gray-500 ml-2">(variação entre R$ {resultado.custoMin.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} e R$ {resultado.custoMax.toLocaleString('pt-BR', { maximumFractionDigits: 0 })})</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground print:text-gray-500">Valor médio de mercado (Mão de obra + Material)</p>
                                    </CardContent>
                                </Card>

                                <div className="print:hidden space-y-3">
                                    <Button
                                        onClick={() => {
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Móveis Planejados (${acabamento})`,
                                                description: `Para ${metros} metros lineares | Estimativa de Mercado`,
                                                quantity: 1,
                                                unit: "Projeto",
                                                category: "Mobiliário - Planejados",
                                                estimatedPrice: resultado.custoEstimado
                                            });
                                        }}
                                        variant="outline"
                                        size="xl"
                                        className="w-full border-2 hover:bg-amber-50 text-amber-900 border-amber-200"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar Estimativa ao Orçamento
                                    </Button>

                                    <Button
                                        onClick={handlePrint}
                                        variant="outline"
                                        size="xl"
                                        className="w-full border-2 border-slate-200 bg-white text-slate-800 hover:bg-gray-100"
                                    >
                                        <Printer className="mr-2 h-5 w-5" /> Salvar em PDF
                                    </Button>
                                </div>

                                {/* Monetization Block: Modular Kitchens */}
                                <div className="grid md:grid-cols-2 gap-6 print:hidden">
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

                                <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground print:bg-white print:border print:border-gray-200">
                                    <strong className="block mb-1 text-foreground">⚠️ Importante:</strong>
                                    Este valor é uma estimativa baseada em preços médios de marcenarias. O valor real pode variar dependendo da região, ferragens escolhidas (amortecedores, corrediças invisíveis) e reputação da empresa.
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                🪚 Composição do Preço
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    O valor do móvel sob medida varia muito dependendo do material e das ferragens utilizadas.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">MDF Branco vs Madeirado</p>
                                        <p>O MDF branco é o mais econômico. Cores madeiradas, foscas ou brilhosas podem encarecer o projeto em até 40%.</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Móveis Modulados</p>
                                        <p>Se o orçamento estiver apertado, considere cozinhas <strong>moduladas</strong> (prontas de fábrica), que custam uma fração do preço da marcenaria sob medida.</p>
                                    </div>
                                </div>
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
export default CalculadoraMoveisPlanejados;
