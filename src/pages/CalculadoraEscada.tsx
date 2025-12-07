import { useState } from "react";
import { ArrowUpFromLine, Calculator, ShoppingCart, ArrowLeft, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CalculadoraEscada = () => {
    const [alturaTotal, setAlturaTotal] = useState("");
    const [resultado, setResultado] = useState<{ degraus: number; espelho: number; piso: number; formula: string } | null>(null);

    const calcular = () => {
        const h = parseFloat(alturaTotal); // em cm ou m? Vamos assumir metros e converter
        if (!h) return;

        const alturaCm = h * 100;

        // Altura ideal do espelho (E): entre 16cm e 18cm.
        // Tentar chegar o mais próximo possível de 17.5cm (confortável).
        const numeroDegraus = Math.round(alturaCm / 17.5);
        const espelhoReal = alturaCm / numeroDegraus;

        // Lei de Blondel: 2E + P = 63 a 65 (ideal 64)
        // P = 64 - 2E
        const pisoIdeal = 64 - (2 * espelhoReal);

        setResultado({
            degraus: numeroDegraus,
            espelho: Math.round(espelhoReal * 100) / 100,
            piso: Math.round(pisoIdeal * 100) / 100,
            formula: `2 x ${espelhoReal.toFixed(1)} + ${pisoIdeal.toFixed(1)} = ${(2 * espelhoReal + pisoIdeal).toFixed(1)}`
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-escada" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-orange-600 rounded-xl p-3 text-white"><ArrowUpFromLine /></div>
                            <h1>Calculadora de Escada (Blondel)</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="space-y-2">
                                <Label>Altura Total do Desnível (metros)</Label>
                                <Input value={alturaTotal} onChange={e => setAlturaTotal(e.target.value)} placeholder="Ex: 2.80" className="h-12 text-lg" />
                                <p className="text-xs text-muted-foreground">Medida do chão do andar de baixo até o chão do andar de cima.</p>
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR DEGRAUS</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                <div className="grid gap-4 sm:grid-cols-3 text-center mb-6">
                                    <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                                        <p className="text-3xl font-bold text-primary">{resultado.degraus}</p>
                                        <p className="text-sm font-medium">Degraus</p>
                                    </div>
                                    <div className="bg-card p-4 rounded-xl border border-border">
                                        <p className="text-3xl font-bold">{resultado.espelho} cm</p>
                                        <p className="text-sm text-muted-foreground">Altura (Espelho)</p>
                                    </div>
                                    <div className="bg-card p-4 rounded-xl border border-border">
                                        <p className="text-3xl font-bold">{resultado.piso} cm</p>
                                        <p className="text-sm text-muted-foreground">Pisada (Passo)</p>
                                    </div>
                                </div>

                                <div className="bg-muted/30 rounded-xl p-6 border border-border">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Ruler className="h-4 w-4" /> Conferência (Lei de Blondel)</h3>
                                    <p className="text-sm text-muted-foreground">
                                        A fórmula de conforto é 2E + P = ~64cm.
                                        <br />
                                        Seu cálculo: <strong>{resultado.formula}</strong> (Está dentro do padrão!)
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <Button asChild variant="outline" className="w-full"><a href="#" target="_blank"><ShoppingCart className="mr-2" /> VER PROTETORES DE DEGRAU</a></Button>
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
export default CalculadoraEscada;
