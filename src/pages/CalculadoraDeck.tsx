import { useState } from "react";
import { Hammer, Calculator, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CalculadoraDeck = () => {
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
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-deck" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-amber-700 rounded-xl p-3 text-white"><Hammer /></div>
                            <h1>Calculadora de Deck de Madeira</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
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
                                    <Button asChild className="w-full" variant="secondary" size="lg"><a href="#" target="_blank"><ShoppingCart className="mr-2" /> ENCONTRAR VERNIZ POLISTEN</a></Button>
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
export default CalculadoraDeck;
