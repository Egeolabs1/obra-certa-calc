import { useState } from "react";
import { Flower2, Calculator, ShoppingCart, ArrowLeft, ExternalLink, Printer } from "lucide-react";
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

const CalculadoraGrama = () => {
    const { addItem } = useOrcamento();
    const [area, setArea] = useState("");
    const [resultado, setResultado] = useState<{ rolos: number; placas: number } | null>(null);

    const calcular = () => {
        const a = parseFloat(area);
        if (!a) return;

        // Rolo padrão: 0.40m x 1.25m = 0.50m² (Geralmente vende-se 2 rolos por m²)
        // Placa padrão: 0.50m x 0.50m = 0.25m² (4 placas por m²)

        // Perda recomendada: 5-10%. Vamos usar 5% para rolos (encaixe melhor) e 10% placas.
        const margem = 1.05;

        const areaComMargem = a * margem;

        const rolos = Math.ceil(areaComMargem / 0.50);
        const placas = Math.ceil(areaComMargem / 0.25);

        setResultado({ rolos, placas });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Grama"
                description="Calcule a quantidade de grama (rolos ou placas) para seu jardim."
                url="https://suaobracerta.com.br/calculadora-grama"
                schema={generateCalculatorSchema(
                    "Calculadora de Grama",
                    "Calcule quantos rolos ou placas de grama são necessários para uma área.",
                    "https://suaobracerta.com.br/calculadora-grama"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <PrintHeader title="Orçamento de Grama" />
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-grama" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-green-600 rounded-xl p-3 text-white print:bg-white print:text-green-600 print:border print:border-green-200 print:shadow-none"><Flower2 /></div>
                            <h1 className="print:text-2xl">Calculadora de Grama</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5 print:shadow-none print:border-none print:p-0 print:mb-6">
                            <div className="print:hidden space-y-5">
                                <div className="space-y-2">
                                    <Label>Área do Jardim (m²)</Label>
                                    <Input value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 50" className="h-12" />
                                </div>
                            </div>

                            {/* Print Summary */}
                            <div className="hidden print:block mb-4 p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Dados do Jardim</h3>
                                <div>
                                    <span className="block text-gray-500 text-sm">Área Total:</span>
                                    <span className="font-medium">{area} m²</span>
                                </div>
                            </div>

                            <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button onClick={calcular} size="xl" className="w-full">CALCULAR QUANTIDADE</Button>
                                {resultado && (
                                    <Button onClick={handlePrint} variant="outline" size="xl" className="w-full border-2">
                                        <Printer className="mr-2 h-5 w-5" /> Salvar Orçamento
                                    </Button>
                                )}
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 grid gap-4 sm:grid-cols-2 animate-scale-in">
                                <div className="bg-gradient-result p-6 rounded-xl border border-primary text-center print:bg-white print:border-black">
                                    <p className="text-lg">Opção 1: Rolos</p>
                                    <p className="text-4xl font-extrabold text-primary my-2 print:text-black">{resultado.rolos} Rolos</p>
                                    <p className="text-xs text-muted-foreground">Padrão 40cm x 125cm</p>
                                </div>
                                <div className="bg-card p-6 rounded-xl border border-border text-center print:bg-white print:border-gray-200">
                                    <p className="text-lg">Opção 2: Placas</p>
                                    <p className="text-4xl font-extrabold text-foreground my-2 print:text-black">{resultado.placas} Placas</p>
                                    <p className="text-xs text-muted-foreground">Padrão 50cm x 50cm</p>
                                </div>
                                <div className="col-span-1 sm:col-span-2 mt-4 print:hidden">
                                    <Button asChild variant="success" size="lg" className="w-full">
                                        <a href={affiliateLinks.garden.mowers} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2" /> VER CORTADORES DE GRAMA</a>
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Grama Esmeralda (Placas)`,
                                                description: `Para cobrir ${area}m² (com 5-10% margem)`,
                                                quantity: resultado.placas,
                                                unit: "Placas (0.25m²)",
                                                category: "Jardinagem & Paisagismo",
                                                estimatedPrice: resultado.placas * 3.50 // Estimativa R$3.50/placa
                                            });
                                        }}
                                        variant="outline"
                                        size="xl"
                                        className="w-full mt-3 border-2 hover:bg-green-50 text-green-800 border-green-200 print:hidden"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar Grama ao Orçamento
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                🌿 Tipos de Grama e Formatos
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    Calculamos a quantidade com uma margem de segurança de <strong>5%</strong> para recortes.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Grama em Rolo</p>
                                        <p>Geralmente comercializada em rolos de <strong>40cm x 125cm</strong> (0.50m²). Ideal para áreas grandes e planas.</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Grama em Placa</p>
                                        <p>Geralmente vendida em placas de <strong>50cm x 50cm</strong> (0.25m²). Mais comum para Esmeralda e São Carlos.</p>
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
export default CalculadoraGrama;
