import { useState } from "react";
import { Hammer, Calculator, ShoppingCart, ArrowLeft, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraDeck = () => {
    const { addItem } = useOrcamento();
    const [area, setArea] = useState("");
    const [larguraRegua, setLarguraRegua] = useState("10"); // cm
    const [resultado, setResultado] = useState<{ metrosLineares: number; barrotes: number; parafusos: number } | null>(null);

    const calcular = () => {
        const a = parseFloat(area);
        const l = parseFloat(larguraRegua) / 100; // converter pra m

        if (!a || !l) return;

        // Metros Lineares = Area / Largura da regua
        // + 10% perdas
        const metrosLineares = Math.ceil((a / l) * 1.10);

        // Barrotes (Estrutura embaixo):
        // Geralmente espaçados a cada 40 ou 50cm.
        // Estimativa bruta: ~3 a 3.5 metros lineares de barrote por m² de deck.
        const metrosBarrotes = Math.ceil(a * 3.5);

        // Parafusos:
        // 2 por cruzamento com barrote.
        // Se barrote a cada 50cm -> 2 parafusos a cada 50cm de régua.
        // Em 1m² de deck com régua de 10cm -> 10m lineares. / 0.5 = 20 cruzamentos. x 2 = 40 parafusos.
        // Estimativa: ~40 a 50 parafusos por m².
        const parafusos = Math.ceil(a * 45);

        setResultado({
            metrosLineares,
            barrotes: metrosBarrotes,
            parafusos
        });
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Deck de Madeira"
                description="Calcule a quantidade de réguas de madeira, barrotes e parafusos para seu deck."
                url="https://suaobracerta.com.br/calculadora-deck"
                schema={generateCalculatorSchema(
                    "Calculadora de Deck",
                    "Calcule materiais para construção de decks de madeira.",
                    "https://suaobracerta.com.br/calculadora-deck"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>
            <PrintHeader title="Calculadora de Deck de Madeira" />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-deck-top" className="max-w-3xl mx-auto print:hidden" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3 print:hidden">
                            <div className="bg-amber-700 rounded-xl p-3 text-white"><Hammer /></div>
                            <h1>Calculadora de Deck de Madeira</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8 print:hidden space-y-5">
                            <div className="space-y-2">
                                <Label>Área do Deck (m²)</Label>
                                <Input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 12" />
                            </div>
                            <div className="space-y-2">
                                <Label>Largura da Régua (cm)</Label>
                                <Input type="number" value={larguraRegua} onChange={e => setLarguraRegua(e.target.value)} placeholder="Ex: 10 (Padrão)" />
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full bg-amber-700 hover:bg-amber-800">CALCULAR MADEIRA</Button>
                        </div>

                        {/* Print Summary */}
                        <div className="hidden print:block mb-6 p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Cálculo</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-500">Área:</span>
                                    <span className="font-medium">{area} m²</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500">Largura da Régua:</span>
                                    <span className="font-medium">{larguraRegua} cm</span>
                                </div>
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="bg-gradient-result p-6 rounded-xl border-2 border-primary col-span-2 text-center">
                                        <p className="text-lg">Você precisa de:</p>
                                        <p className="text-5xl font-extrabold text-primary my-2">{resultado.metrosLineares} m</p>
                                        <p className="text-muted-foreground">de réguas de madeira (lineares)</p>
                                    </div>
                                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                                        <p className="text-3xl font-bold">{resultado.barrotes} m</p>
                                        <p className="text-sm text-muted-foreground">de Barrotes/Vigas (Estrutura)</p>
                                    </div>
                                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                                        <p className="text-3xl font-bold">{resultado.parafusos} un.</p>
                                        <p className="text-sm text-muted-foreground">Parafusos Inox</p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Button asChild variant="success" size="lg" className="w-full print:hidden">
                                        <a href={affiliateLinks.flooring.deckVarnish} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2" /> VER VERNIZ PARA DECK</a>
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            // Réguas
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Réguas de Deck`,
                                                description: `Para ${area}m² | Largura ${larguraRegua}cm`,
                                                quantity: resultado.metrosLineares,
                                                unit: "Metros Lineares",
                                                category: "Área Externa - Deck",
                                                estimatedPrice: resultado.metrosLineares * 35 // R$35/m
                                            });
                                            // Barrotes
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Barrotes (Estrutura Deck)`,
                                                description: `Vigas para estrutura do deck`,
                                                quantity: resultado.barrotes,
                                                unit: "Metros",
                                                category: "Área Externa - Deck",
                                                estimatedPrice: resultado.barrotes * 20 // R$20/m
                                            });
                                            // Parafusos
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Parafusos Inox Deck`,
                                                description: `Para fixação das réguas`,
                                                quantity: resultado.parafusos,
                                                unit: "Unidades",
                                                category: "Área Externa - Deck",
                                                estimatedPrice: resultado.parafusos * 0.8 // R$0.80/un
                                            });
                                        }}
                                        variant="outline"
                                        size="xl"
                                        className="w-full mt-3 border-2 hover:bg-amber-50 text-amber-900 border-amber-100 print:hidden"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Orçamento
                                    </Button>

                                    <Button
                                        onClick={handlePrint}
                                        variant="outline"
                                        size="xl"
                                        className="w-full mt-3 bg-white hover:bg-gray-100 text-slate-800 border-2 border-slate-200 print:hidden"
                                    >
                                        <Printer className="mr-2 h-5 w-5" /> Salvar em PDF
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                🔨 Como calcular o material para Deck?
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <div className="space-y-2">
                                    <p><strong className="text-foreground">Réguas de Madeira:</strong></p>
                                    <p>Calculamos a metragem linear total dividindo a área pela largura da régua, adicionando 10% de margem de segurança (perdas e recortes).</p>
                                </div>
                                <div className="space-y-2">
                                    <p><strong className="text-foreground">Barrotes (Estrutura):</strong></p>
                                    <p>Consideramos vigas de estrutura espaçadas a cada 40-50cm. A estimativa média é de 3.5 metros lineares de barrote por m² de deck.</p>
                                </div>
                                <div className="space-y-2">
                                    <p><strong className="text-foreground">Parafusos:</strong></p>
                                    <p>Estimamos 2 parafusos por cruzamento entre régua e barrote. Resulta em aproximadamente 40 a 50 parafusos por m².</p>
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
export default CalculadoraDeck;
