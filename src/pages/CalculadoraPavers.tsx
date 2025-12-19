import { useState } from "react";
import { LayoutDashboard, ShoppingCart, ArrowLeft, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraPavers = () => {
    const { addItem } = useOrcamento();
    const [area, setArea] = useState("");
    const [tipo, setTipo] = useState("retangular");
    const [resultado, setResultado] = useState<number | null>(null);

    const calcular = () => {
        const a = parseFloat(area);
        if (!a) return;

        // Consumo médio por m²
        // Retangular (10x20): 50 peças/m²
        // 16 Faces / Ossinho: ~35 a 40 peças/m² (depende fabricante, geralmente 39)
        // Sextavado (25x25): ~16 peças/m²

        let pecasPorM2 = 50;
        if (tipo === "ossinho") pecasPorM2 = 39;
        if (tipo === "sextavado") pecasPorM2 = 18; // aproximado

        // Perda 5%
        const total = Math.ceil(a * pecasPorM2 * 1.05);
        setResultado(total);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Pavers"
                description="Calcule a quantidade de pavers (bloquetes) para calçadas e garagens."
                url="https://www.suaobracerta.com.br/calculadora-pavers"
                schema={generateCalculatorSchema(
                    "Calculadora de Pavers",
                    "Calcule a quantidade de blocos de concreto (pavers) por metro quadrado.",
                    "https://www.suaobracerta.com.br/calculadora-pavers"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <PrintHeader title="Orçamento de Pavers" />
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-pavers" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-gray-700 rounded-xl p-3 text-white print:bg-white print:text-gray-700 print:border print:border-gray-200 print:shadow-none"><LayoutDashboard /></div>
                            <h1 className="print:text-2xl">Calculadora de Pavers</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5 print:shadow-none print:border-none print:p-0 print:mb-6">
                            <div className="print:hidden space-y-5">
                                <div className="space-y-2">
                                    <Label>Área da Calçada / Garagem (m²)</Label>
                                    <Input value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 30" className="h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Modelo de Paver</Label>
                                    <Select value={tipo} onValueChange={setTipo}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="retangular">Retangular / Holandês (10x20cm)</SelectItem>
                                            <SelectItem value="ossinho">16 Faces / Ossinho</SelectItem>
                                            <SelectItem value="sextavado">Sextavado (25cm)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Print Summary */}
                            <div className="hidden print:block mb-4 p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Cálculo</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">Área:</span>
                                        <span className="font-medium">{area} m²</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Modelo:</span>
                                        <span className="font-medium">
                                            {tipo === 'retangular' && 'Retangular / Holandês'}
                                            {tipo === 'ossinho' && '16 Faces / Ossinho'}
                                            {tipo === 'sextavado' && 'Sextavado'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="print:hidden grid grid-cols-1 gap-4">
                                <Button onClick={calcular} size="xl" className="w-full">CALCULAR BLOQUETES</Button>
                                {resultado && (
                                    <Button onClick={handlePrint} variant="outline" size="xl" className="w-full border-2">
                                        <Printer className="mr-2 h-5 w-5" /> Salvar em PDF
                                    </Button>
                                )}
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 text-center bg-gradient-result p-8 rounded-xl border-2 border-primary animate-scale-in print:bg-white print:border-black print:p-0 print:text-left print:mt-4">
                                <p className="text-lg print:text-gray-600">Você precisa de:</p>
                                <p className="text-5xl font-extrabold text-primary my-2 print:text-black">{resultado} Peças</p>
                                <p className="text-sm text-muted-foreground print:text-gray-500">(Já incluindo 5% de margem)</p>
                                <Button className="mt-6 w-full print:hidden" variant="secondary" size="lg"><ShoppingCart className="mr-2" /> VER MÁQUINAS DE LAVAR PISO</Button>

                                <Button
                                    onClick={() => {
                                        addItem({
                                            id: crypto.randomUUID(),
                                            name: `Pavers ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
                                            description: `Para ${area}m²`,
                                            quantity: resultado,
                                            unit: "Peças",
                                            category: "Área Externa - Piso",
                                            estimatedPrice: resultado * 1.20 // R$1.20/peça
                                        });
                                    }}
                                    variant="outline"
                                    size="xl"
                                    className="w-full mt-3 border-2 hover:bg-gray-50 text-gray-800 border-gray-200 print:hidden"
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar Pavers ao Orçamento
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Informações extras */}
                    <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">
                            📋 Sobre o Cálculo de Pavers
                        </h2>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <p>
                                O cálculo de bloquetes é feito considerando a área total e o consumo médio por metro quadrado de cada modelo.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="p-3 rounded-lg bg-card border border-border">
                                    <p className="font-medium text-foreground mb-1">Retangular</p>
                                    <p>Modelo Holandês (10x20cm). Consumo aproximado de <strong>50 peças/m²</strong>.</p>
                                </div>
                                <div className="p-3 rounded-lg bg-card border border-border">
                                    <p className="font-medium text-foreground mb-1">Ossinho</p>
                                    <p>Modelo 16 faces. Consumo médio de <strong>39 peças/m²</strong>.</p>
                                </div>
                                <div className="p-3 rounded-lg bg-card border border-border">
                                    <p className="font-medium text-foreground mb-1">Sextavado</p>
                                    <p>Modelo de 25cm. Consumo aproximado de <strong>18 peças/m²</strong>.</p>
                                </div>
                            </div>
                            <p className="mt-2 text-xs">
                                * O cálculo já inclui uma margem de segurança de 5% para recortes e quebras.
                            </p>
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
export default CalculadoraPavers;
