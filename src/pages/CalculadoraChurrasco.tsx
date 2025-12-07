import { useState } from "react";
import { Flame, Calculator, ShoppingCart, ArrowLeft, Beer, Share2 } from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CalculadoraChurrasco = () => {
    const [homens, setHomens] = useState("5");
    const [mulheres, setMulheres] = useState("5");
    const [criancas, setCriancas] = useState("2");

    const [resultado, setResultado] = useState<{ carne: number, cerveja: number, refri: number, carvao: number } | null>(null);

    const calcular = () => {
        const h = parseInt(homens) || 0;
        const m = parseInt(mulheres) || 0;
        const c = parseInt(criancas) || 0;

        // Regra padrão:
        // H: 400g carne, 1200ml cerveja (3,5 latas)
        // M: 300g carne, 800ml cerveja
        // C: 200g carne, 500ml refri

        const carne = (h * 0.4) + (m * 0.3) + (c * 0.2);
        const cerveja = (h * 1.2) + (m * 0.8);
        const refri = (h * 0.2) + (m * 0.3) + (c * 0.5); // Refri pra todo mundo um pouco, mas foco nas crianças
        const carvao = (carne * 1.0); // 1kg carvão pra cada kg de carne (tem folga)

        setResultado({
            carne: Math.ceil(carne * 10) / 10,
            cerveja: Math.ceil(cerveja), // Litros
            refri: Math.ceil(refri),
            carvao: Math.ceil(carvao)
        });
    };

    const compartilharWhatsApp = () => {
        if (!resultado) return;

        const texto = `🔥 *Lista do Churrasco - Sua Obra Certa*\n\n` +
            `🥩 Carne: ${resultado.carne} kg\n` +
            `🍺 Cerveja: ${resultado.cerveja} L\n` +
            `🥤 Refri/Água: ${resultado.refri} L\n` +
            `🔥 Carvão: ${resultado.carvao} kg\n\n` +
            `Calculado em: https://suaobracerta.com.br/calculadora-churrasco`;

        const link = `https://wa.me/?text=${encodeURIComponent(texto)}`;
        window.open(link, '_blank');
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Churrasco"
                description="Vai fazer um churrasco? Calcule a quantidade certa de carne, cerveja, refrigerante e carvão para seus convidados."
                url="https://suaobracerta.com.br/calculadora-churrasco"
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-churras" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-red-600 rounded-xl p-3 text-white"><Flame /></div>
                            <h1>Calculadora de Churrasco</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Homens</Label>
                                    <Input type="number" value={homens} onChange={e => setHomens(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mulheres</Label>
                                    <Input type="number" value={mulheres} onChange={e => setMulheres(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Crianças</Label>
                                    <Input type="number" value={criancas} onChange={e => setCriancas(e.target.value)} />
                                </div>
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full bg-red-600 hover:bg-red-700">CALCULAR LISTA</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 grid grid-cols-2 gap-4 animate-scale-in">
                                <div className="bg-card p-4 rounded-xl border border-border text-center">
                                    <p className="text-3xl font-bold">🥩 {resultado.carne} kg</p>
                                    <p className="text-sm text-muted-foreground">de Carne</p>
                                </div>
                                <div className="bg-card p-4 rounded-xl border border-border text-center">
                                    <p className="text-3xl font-bold">🍺 {resultado.cerveja} L</p>
                                    <p className="text-sm text-muted-foreground">de Cerveja</p>
                                </div>
                                <div className="bg-card p-4 rounded-xl border border-border text-center">
                                    <p className="text-3xl font-bold">🥤 {resultado.refri} L</p>
                                    <p className="text-sm text-muted-foreground">de Refri/Água</p>
                                </div>
                                <div className="bg-card p-4 rounded-xl border border-border text-center">
                                    <p className="text-3xl font-bold">🔥 {resultado.carvao} kg</p>
                                    <p className="text-sm text-muted-foreground">de Carvão</p>
                                </div>
                                <div className="col-span-2 mt-4 space-y-3">
                                    <Button onClick={compartilharWhatsApp} size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold animate-pulse">
                                        <Share2 className="mr-2 h-5 w-5" /> COMPARTILHAR NO WHATSAPP
                                    </Button>
                                    <Button asChild variant="outline" className="w-full"><a href="#" className="flex gap-2 justify-center items-center"><Beer className="h-4 w-4" /> COMPRAR BEBIDAS SEM SAIR DE CASA</a></Button>
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
export default CalculadoraChurrasco;
