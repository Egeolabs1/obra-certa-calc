import { useState } from "react";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { AlignHorizontalJustifyStart, Calculator, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CalculadoraRodape = () => {
    const [perimetro, setPerimetro] = useState("");
    const [portas, setPortas] = useState(""); // para descontar e adicionar acabamento
    const [tamanhoBarra, setTamanhoBarra] = useState("2.40");

    const [resultado, setResultado] = useState<{ barras: number; cola: number } | null>(null);

    const calcular = () => {
        const p = parseFloat(perimetro);
        const numPortas = parseFloat(portas) || 0;
        const tam = parseFloat(tamanhoBarra);

        if (!p || !tam) return;

        // Desconto portas: Aprox 80cm-90cm por porta.
        // Vamos descontar 0.90m por porta.
        const perimetroLiquido = Math.max(0, p - (numPortas * 0.90));

        // Perda de cortes: ~10%
        const metrosNecessarios = perimetroLiquido * 1.10;

        const barras = Math.ceil(metrosNecessarios / tam);

        // Cola: Tubo de 400g faz uns 10 a 12 metros lineares.
        const tubosCola = Math.ceil(metrosNecessarios / 10);

        setResultado({ barras, cola: tubosCola });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Rodapé"
                description="Quantas barras de rodapé comprar? Calcule metros lineares e tubos de cola ou prego líquido."
                url="https://suaobracerta.com.br/calculadora-rodape"
                schema={generateCalculatorSchema(
                    "Calculadora de Rodapé",
                    "Calcule a quantidade de barras de rodapé e cola necessárias.",
                    "https://suaobracerta.com.br/calculadora-rodape"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-rodape" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-slate-700 rounded-xl p-3 text-white"><AlignHorizontalJustifyStart /></div>
                            <h1>Calculadora de Rodapé</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="space-y-2">
                                <Label>Perímetro da Sala (Soma das paredes em m)</Label>
                                <Input value={perimetro} onChange={e => setPerimetro(e.target.value)} placeholder="Ex: 14.5" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Quantas Portas?</Label>
                                    <Input type="number" value={portas} onChange={e => setPortas(e.target.value)} placeholder="0" />
                                    <p className="text-xs text-muted-foreground">Desconta 90cm cada</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tamanho da Barra (m)</Label>
                                    <Input value={tamanhoBarra} onChange={e => setTamanhoBarra(e.target.value)} placeholder="2.40" />
                                </div>
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR BARRAS</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 grid gap-4 sm:grid-cols-2 animate-scale-in">
                                <div className="bg-gradient-result p-6 rounded-xl border-2 border-primary text-center col-span-2">
                                    <p className="text-lg">Você precisa de:</p>
                                    <p className="text-5xl font-extrabold text-primary my-2">{resultado.barras} Barras</p>
                                    <p className="text-sm text-muted-foreground">de {tamanhoBarra}m cada</p>
                                </div>
                                <div className="bg-card p-6 rounded-xl border border-border text-center col-span-2 sm:col-span-2">
                                    <p className="text-lg font-bold">🧴 {resultado.cola} Tubos de Cola</p>
                                    <p className="text-xs text-muted-foreground">ou Prego Líquido (400g)</p>
                                </div>
                                <div className="col-span-2">
                                    <Button asChild variant="outline" className="w-full"><a href={affiliateLinks.flooring.baseboards} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2" /> VER RODAPÉS SANTA LUZIA</a></Button>
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
export default CalculadoraRodape;
