import { useState } from "react";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";
import { AlignHorizontalJustifyStart, Calculator, ShoppingCart, ArrowLeft, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CalculadoraRodape = () => {
    const { addItem } = useOrcamento();
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

    const handlePrint = () => {
        window.print();
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
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <PrintHeader title="Orçamento de Rodapé" />
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-rodape" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-slate-700 rounded-xl p-3 text-white print:bg-white print:text-slate-700 print:border print:border-slate-200 print:shadow-none"><AlignHorizontalJustifyStart /></div>
                            <h1 className="print:text-2xl">Calculadora de Rodapé</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5 print:shadow-none print:border-none print:p-0 print:mb-6">
                            <div className="print:hidden space-y-5">
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
                            </div>

                            {/* Print Summary */}
                            <div className="hidden print:block mb-4 p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Cálculo</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">Perímetro Total:</span>
                                        <span className="font-medium">{perimetro} m</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Portas:</span>
                                        <span className="font-medium">{portas || 0} (Desconto)</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Tamanho Barra:</span>
                                        <span className="font-medium">{tamanhoBarra} m</span>
                                    </div>
                                </div>
                            </div>

                            <div className="print:hidden grid grid-cols-1 gap-4">
                                <Button onClick={calcular} size="xl" className="w-full">CALCULAR BARRAS</Button>
                                {resultado && (
                                    <Button onClick={handlePrint} variant="outline" size="xl" className="w-full border-2">
                                        <Printer className="mr-2 h-5 w-5" /> Salvar em PDF
                                    </Button>
                                )}
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 grid gap-4 sm:grid-cols-2 animate-scale-in print:block">
                                <div className="bg-gradient-result p-6 rounded-xl border-2 border-primary text-center col-span-2 print:bg-white print:border-black print:p-0 print:text-left">
                                    <p className="text-lg print:text-gray-600">Você precisa de:</p>
                                    <p className="text-5xl font-extrabold text-primary my-2 print:text-black">{resultado.barras} Barras</p>
                                    <p className="text-sm text-muted-foreground print:text-gray-500">de {tamanhoBarra}m cada</p>
                                </div>
                                <div className="bg-card p-6 rounded-xl border border-border text-center col-span-2 sm:col-span-2 print:bg-white print:border print:border-gray-200 print:mt-4 print:text-left print:flex print:items-center print:justify-between">
                                    <p className="text-lg font-bold">🧴 {resultado.cola} Tubos de Cola</p>
                                    <p className="text-xs text-muted-foreground print:text-gray-500">ou Prego Líquido (400g)</p>
                                </div>
                                <div className="col-span-2 print:hidden">
                                    <Button asChild variant="outline" className="w-full"><a href={affiliateLinks.flooring.baseboards} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2" /> VER RODAPÉS SANTA LUZIA</a></Button>
                                </div>
                                <div className="col-span-2 print:hidden">
                                    <Button
                                        onClick={() => {
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Rodapé (${tamanhoBarra}m)`,
                                                description: `Perímetro: ${perimetro}m | Portas: ${portas || 0}`,
                                                quantity: resultado.barras,
                                                unit: "Barras",
                                                category: "Acabamento - Piso",
                                                estimatedPrice: resultado.barras * 45 // Estimativa R$45/barra
                                            });
                                            if (resultado.cola > 0) {
                                                addItem({
                                                    id: crypto.randomUUID(),
                                                    name: `Cola Rodapé (400g)`,
                                                    description: `Para ${resultado.barras} barras`,
                                                    quantity: resultado.cola,
                                                    unit: "Tubos",
                                                    category: "Acabamento - Piso",
                                                    estimatedPrice: resultado.cola * 35 // Estimativa R$35/tubo
                                                });
                                            }
                                        }}
                                        variant="default"
                                        size="xl"
                                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Adicionar ao Orçamento
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                📏 Cálculo de Rodapé e Cola
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    O cálculo leva em conta o perímetro total da sala, descontando as portas e adicionando a quebra de corte.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Descontos</p>
                                        <p>Descontamos aprox. <strong>90cm</strong> para cada porta. Adicionamos <strong>10%</strong> de margem de segurança para os cortes (meia-esquadria).</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Cola / Fixação</p>
                                        <p>Para rodapés de poliestireno ou MDF, 1 tubo de 400g de cola (prego líquido) rende entre <strong>10 a 12 metros lineares</strong>.</p>
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
export default CalculadoraRodape;
