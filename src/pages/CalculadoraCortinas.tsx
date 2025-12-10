import { useState } from "react";
import { Blinds, Calculator, ShoppingCart, ArrowLeft, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraCortinas = () => {
    const { addItem } = useOrcamento();
    const [larguraJanela, setLarguraJanela] = useState("");
    const [alturaJanela, setAlturaJanela] = useState("");
    const [pregas, setPregas] = useState("2"); // 2x ou 3x
    const [resultado, setResultado] = useState<{ tecidoL: number; tecidoA: number } | null>(null);

    const calcular = () => {
        const l = parseFloat(larguraJanela);
        const h = parseFloat(alturaJanela);
        const fator = parseFloat(pregas);

        if (!l || !h) return;

        // Largura total tecido = (Largura Janela + 20cm cada lado sobra) * Fator
        // Altura total tecido = Altura Janela + 20cm (cima) + 20cm (baixo/barra)
        // Se for até o chão, usuario deve por altura até o chão.

        const larguraTecido = (l + 0.40) * fator;
        const alturaTecido = h + 0.40;

        setResultado({
            tecidoL: Math.ceil(larguraTecido * 100) / 100,
            tecidoA: Math.ceil(alturaTecido * 100) / 100
        });
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Cortinas"
                description="Calcule a quantidade de tecido para cortinas com pregas (2x ou 3x volume)."
                url="https://suaobracerta.com.br/calculadora-cortinas"
                schema={generateCalculatorSchema(
                    "Calculadora de Cortinas",
                    "Calcule a metragem de tecido necessária para cortinas com base na largura da janela.",
                    "https://suaobracerta.com.br/calculadora-cortinas"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-cortina" className="max-w-3xl mx-auto print:hidden" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3 print:hidden">
                            <div className="bg-pink-500 rounded-xl p-3 text-white"><Blinds /></div>
                            <h1>Calculadora de Cortinas</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8 print:hidden space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Largura Janela (m)</Label>
                                    <Input value={larguraJanela} onChange={e => setLarguraJanela(e.target.value)} placeholder="2.00" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Altura Desejada (m)</Label>
                                    <Input value={alturaJanela} onChange={e => setAlturaJanela(e.target.value)} placeholder="2.60" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Tipo de Prega / Volume</Label>
                                <Select value={pregas} onValueChange={setPregas}>
                                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2">Padrão (2x a largura)</SelectItem>
                                        <SelectItem value="3">Volumosa / Varão (3x a largura)</SelectItem>
                                        <SelectItem value="1.5">Econômica (1.5x a largura)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR TECIDO</Button>
                        </div>

                        {/* Print Summary */}
                        <div className="hidden print:block mb-6 p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Cálculo</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-500">Janela:</span>
                                    <span className="font-medium">{larguraJanela}x{alturaJanela} m</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500">Pregas:</span>
                                    <span className="font-medium">{pregas}x</span>
                                </div>
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 text-center bg-gradient-result p-8 rounded-xl border-2 border-primary animate-scale-in print:shadow-none print:border-none print:bg-white">
                                <PrintHeader />
                                <p className="text-xl">Dimensões do Tecido:</p>
                                <div className="flex justify-center gap-8 my-4">
                                    <div>
                                        <p className="text-3xl font-bold text-foreground">{resultado.tecidoL}m</p>
                                        <p className="text-sm text-muted-foreground">Largura Total</p>
                                    </div>
                                    <div className="border-l border-border pl-8">
                                        <p className="text-3xl font-bold text-foreground">{resultado.tecidoA}m</p>
                                        <p className="text-sm text-muted-foreground">Altura Total</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">Já incluindo margens laterais e barra.</p>
                                <Button asChild variant="success" size="lg" className="w-full print:hidden">
                                    <a href={affiliateLinks.furniture.curtains} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2" /> VER MODELOS DE CORTINA</a>
                                </Button>

                                <Button
                                    onClick={() => {
                                        addItem({
                                            id: crypto.randomUUID(),
                                            name: `Tecido para Cortina`,
                                            description: `Janela: ${larguraJanela}x${alturaJanela}m | Tecido: ${resultado.tecidoL}x${resultado.tecidoA}m (Prega ${pregas}x)`,
                                            quantity: resultado.tecidoL, // Quantidade em metros de largura do tecido
                                            unit: "Metros (Largura)",
                                            category: "Decoração - Cortinas",
                                            estimatedPrice: resultado.tecidoL * 45 // Estimativa R$45/m
                                        });
                                    }}
                                    variant="outline"
                                    size="xl"
                                    className="w-full mt-3 border-2 hover:bg-pink-50 text-pink-700 border-pink-100"
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
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                🪟 Entenda o cálculo de Tecido
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    Para que a cortina tenha aquele caimento bonito com ondas, precisamos de muito mais tecido do que a largura da janela.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Fator de Franzimento</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li><strong>2x (Padrão):</strong> Para cada 1m de janela, usamos 2m de tecido. Bom para tecidos encorpados (Linho, Shantung).</li>
                                            <li><strong>3x (Volumosa):</strong> Ideal para tecidos leves como Voil, para dar volume.</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Acabamentos (Barras)</p>
                                        <p>Adicionamos automaticamente <strong>40cm na altura</strong> (20cm para cabeçote + 20cm para barra) e <strong>40cm na largura</strong> (bainhas laterais).</p>
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
export default CalculadoraCortinas;
