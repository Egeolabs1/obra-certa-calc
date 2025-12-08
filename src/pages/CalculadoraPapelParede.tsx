import { useState } from "react";
import { Scroll, Calculator, ShoppingCart, ArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";

const CalculadoraPapelParede = () => {
    const [alturaParede, setAlturaParede] = useState("");
    const [larguraParede, setLarguraParede] = useState("");
    const [rapport, setRapport] = useState("0");
    const [comprimentoRolo, setComprimentoRolo] = useState("10"); // metros
    const [larguraRolo, setLarguraRolo] = useState("0.53"); // metros

    const [resultado, setResultado] = useState<number | null>(null);

    const calcular = () => {
        const hParede = parseFloat(alturaParede);
        const lParede = parseFloat(larguraParede);
        const r = parseFloat(rapport) / 100; // cm -> m
        const cRolo = parseFloat(comprimentoRolo);
        const lRolo = parseFloat(larguraRolo);

        if (!hParede || !lParede) return;

        // 1. Quantas faixas (tiras) são necessárias para cobrir a largura?
        const numFaixas = Math.ceil(lParede / lRolo);

        // 2. Qual o tamanho de cada faixa considerando o casamento de desenho (rapport)?
        // Altura necessária por faixa = Altura Parede + Sobra (5cm cima + 5cm baixo = 0.10) + Rapport
        // Se houver rapport, a cada faixa a gente "perde" um pedaço para casar, ou a faixa precisa ser multiplo do rapport.
        // Formula usual: Cada faixa consome Altura + Rapport (para garantir encaixe)
        // Mais preciso: Teto do (Altura / Rapport) * Rapport. Mas simplificando: Altura + Rapport + 0.10m margem.

        let alturaFaixaReal = hParede + 0.10;
        if (r > 0) {
            alturaFaixaReal += r;
        }

        // 3. Quantas faixas cabem em um rolo?
        const faixasPorRolo = Math.floor(cRolo / alturaFaixaReal);

        // 4. Total de rolos
        // Se o rolo não der nem pra 1 faixa (parede muito alta), precisa de rolos especiais, mas assumindo normal:
        if (faixasPorRolo === 0) {
            // Caso raro: pé direito > 10m? ou rolo pequeno. Vamos assumir 1 rolo por faixa se for muito grande.
            setResultado(numFaixas);
            return;
        }

        const rolosNecessarios = Math.ceil(numFaixas / faixasPorRolo);
        setResultado(rolosNecessarios);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Papel de Parede"
                description="Calcule quantos rolos de papel de parede você precisa, considerando rapport (desenho)."
                url="https://suaobracerta.com.br/calculadora-papel-parede"
                schema={generateCalculatorSchema(
                    "Calculadora de Papel de Parede",
                    "Calcule a quantidade de rolos de papel de parede considerando altura, largura e rapport.",
                    "https://suaobracerta.com.br/calculadora-papel-parede"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-papel" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-purple-500 rounded-xl p-3 text-white"><Scroll /></div>
                            <h1>Calculadora de Papel de Parede</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Altura Parede (m)</Label>
                                    <Input value={alturaParede} onChange={e => setAlturaParede(e.target.value)} placeholder="2.80" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Largura Parede (m)</Label>
                                    <Input value={larguraParede} onChange={e => setLarguraParede(e.target.value)} placeholder="3.50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label>Rapport do Desenho (cm)</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                                            <TooltipContent><p>Medida de repetição do desenho. Se liso, deixe 0.</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <Input value={rapport} onChange={e => setRapport(e.target.value)} placeholder="Ex: 53" />
                                <p className="text-xs text-muted-foreground">Deixe 0 se o papel for liso ou listrado simples.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label>Comp. Rolo (m)</Label>
                                    <Input value={comprimentoRolo} onChange={e => setComprimentoRolo(e.target.value)} placeholder="10.0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Larg. Rolo (m)</Label>
                                    <Input value={larguraRolo} onChange={e => setLarguraRolo(e.target.value)} placeholder="0.53" />
                                </div>
                            </div>

                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR ROLOS</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 text-center bg-gradient-result p-8 rounded-xl border-2 border-primary animate-scale-in">
                                <p className="text-xl">Você precisa de:</p>
                                <p className="text-5xl font-extrabold text-primary my-3">{resultado} Rolos</p>
                                <Button variant="outline" className="w-full mt-4"><ShoppingCart className="mr-2" /> ENCONTRAR PAPEL DE PAREDE</Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default CalculadoraPapelParede;
