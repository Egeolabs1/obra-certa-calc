import { useState } from "react";
import { Scroll, Calculator, ShoppingCart, ArrowLeft, Info, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraPapelParede = () => {
    const { addItem } = useOrcamento();
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

    const handlePrint = () => {
        window.print();
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
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <PrintHeader title="Orçamento de Papel de Parede" />
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-papel" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-purple-500 rounded-xl p-3 text-white print:bg-white print:text-purple-500 print:border print:border-purple-200 print:shadow-none"><Scroll /></div>
                            <h1 className="print:text-2xl">Calculadora de Papel de Parede</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5 print:shadow-none print:border-none print:p-0 print:mb-6">
                            <div className="print:hidden space-y-5">
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
                            </div>

                            {/* Print Summary */}
                            <div className="hidden print:block mb-4 p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Cálculo</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">Dimensões Parede:</span>
                                        <span className="font-medium">{larguraParede}x{alturaParede}m</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Rapport:</span>
                                        <span className="font-medium">{rapport} cm</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Dimensões Rolo:</span>
                                        <span className="font-medium">{larguraRolo}x{comprimentoRolo}m</span>
                                    </div>
                                </div>
                            </div>

                            <div className="print:hidden grid grid-cols-1 gap-4">
                                <Button onClick={calcular} size="xl" className="w-full">CALCULAR ROLOS</Button>
                                {resultado && (
                                    <Button onClick={handlePrint} variant="outline" size="xl" className="w-full border-2">
                                        <Printer className="mr-2 h-5 w-5" /> Salvar em PDF
                                    </Button>
                                )}
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 text-center bg-gradient-result p-8 rounded-xl border-2 border-primary animate-scale-in print:bg-white print:border-black print:p-0 print:text-left print:mt-4">
                                <p className="text-xl print:text-gray-600">Você precisa de:</p>
                                <p className="text-5xl font-extrabold text-primary my-3 print:text-black">{resultado} Rolos</p>

                                <div className="print:hidden">
                                    <Button variant="outline" className="w-full mt-4"><ShoppingCart className="mr-2" /> ENCONTRAR PAPEL DE PAREDE</Button>

                                    <Button
                                        onClick={() => {
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Papel de Parede`,
                                                description: `Parede ${larguraParede}x${alturaParede}m | Rapport ${rapport}cm`,
                                                quantity: resultado,
                                                unit: "Rolos",
                                                category: "Decoração - Papel de Parede",
                                                estimatedPrice: resultado * 150 // Estimativa R$150/rolo
                                            });
                                        }}
                                        variant="outline"
                                        size="xl"
                                        className="w-full mt-3 border-2 hover:bg-purple-50 text-purple-800 border-purple-200"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar Papel ao Orçamento
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                📜 Como calculamos os rolos?
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    Consideramos o casamento do desenho (Rapport) para garantir que as listras ou estampas se alinhem perfeitamente.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Cálculo da Faixa</p>
                                        <p>Cada faixa consome a <strong>Altura da Parede + Rapport + 10cm de sobra</strong> (para recortes no teto e rodapé).</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Rolos Necessários</p>
                                        <p>Dividimos o comprimento do rolo pelo tamanho da faixa real para saber quantas faixas cabem em cada rolo.</p>
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
export default CalculadoraPapelParede;
