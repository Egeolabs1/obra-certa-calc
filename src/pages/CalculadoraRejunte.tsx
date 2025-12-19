import { useState } from "react";
import { Grid3X3, Calculator, ShoppingCart, ArrowLeft, ExternalLink, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraRejunte = () => {
    const { addItem } = useOrcamento();
    const [area, setArea] = useState("");
    const [alturaPeca, setAlturaPeca] = useState(""); // mm (mas usuario poe cm)
    const [larguraPeca, setLarguraPeca] = useState(""); // mm (mas usuario poe cm)
    const [espessuraPeca, setEspessuraPeca] = useState(""); // mm
    const [junta, setJunta] = useState("2"); // mm

    const [kgRejunte, setKgRejunte] = useState<number | null>(null);

    const calcular = () => {
        // FORMULA GERAL:
        // Kg/m² = ( (A+L) x E x J x 1.58 ) / (A x L)
        // Onde:
        // A = Altura peça (mm)
        // L = Largura peça (mm)
        // E = Espessura (mm)
        // J = Junta (mm)
        // 1.58 = Coeficiente densidade (pode variar, 1.58 a 1.70. Usaremos 1.6 média para segurança)

        // Inputs estão em CM para A e L, MM para E e J. Precisamos converter.
        const A = parseFloat(alturaPeca) * 10; // cm -> mm
        const L = parseFloat(larguraPeca) * 10; // cm -> mm
        const E = parseFloat(espessuraPeca); // já em mm
        const J = parseFloat(junta); // já em mm
        const AreaTotal = parseFloat(area); // m²

        if (!A || !L || !E || !J || !AreaTotal) return;

        const coef = 1.60;
        const consumoM2 = ((A + L) * E * J * coef) / (A * L);
        const totalKg = consumoM2 * AreaTotal;

        setKgRejunte(Math.ceil(totalKg * 10) / 10); // 1 casa decimal
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Rejunte"
                description="Descubra a quantidade de rejunte (kg) necessária para seu piso ou revestimento."
                url="https://www.suaobracerta.com.br/calculadora-rejunte"
                schema={generateCalculatorSchema(
                    "Calculadora de Rejunte",
                    "Calcule o consumo de rejunte para pisos e azulejos.",
                    "https://www.suaobracerta.com.br/calculadora-rejunte"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <PrintHeader title="Orçamento de Rejunte" />
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-rejunte" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-orange-500 rounded-xl p-3 text-white print:bg-white print:text-orange-500 print:border print:border-orange-200 print:shadow-none"><Grid3X3 /></div>
                            <h1 className="print:text-2xl">Calculadora de Rejunte</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5 print:shadow-none print:border-none print:p-0 print:mb-6">
                            <div className="print:hidden space-y-5">
                                <div className="space-y-2">
                                    <Label>Área Total (m²)</Label>
                                    <Input value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 50" className="h-12" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Comprimento Peça (cm)</Label>
                                        <Input value={alturaPeca} onChange={e => setAlturaPeca(e.target.value)} placeholder="Ex: 60" className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Largura Peça (cm)</Label>
                                        <Input value={larguraPeca} onChange={e => setLarguraPeca(e.target.value)} placeholder="Ex: 60" className="h-12" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Espessura Peça (mm)</Label>
                                        <Input value={espessuraPeca} onChange={e => setEspessuraPeca(e.target.value)} placeholder="Ex: 8" className="h-12" />
                                        <span className="text-xs text-muted-foreground">Geralmente 8mm a 10mm</span>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Largura da Junta (mm)</Label>
                                        <Input value={junta} onChange={e => setJunta(e.target.value)} placeholder="Ex: 2" className="h-12" />
                                    </div>
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
                                        <span className="block text-gray-500">Tamanho da Peça:</span>
                                        <span className="font-medium">{larguraPeca}x{alturaPeca} cm</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Espessura:</span>
                                        <span className="font-medium">{espessuraPeca} mm</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Junta:</span>
                                        <span className="font-medium">{junta} mm</span>
                                    </div>
                                </div>
                            </div>

                            <div className="print:hidden grid grid-cols-1 gap-4">
                                <Button onClick={calcular} size="xl" className="w-full">CALCULAR KG</Button>
                                {kgRejunte !== null && (
                                    <Button onClick={handlePrint} variant="outline" size="xl" className="w-full border-2">
                                        <Printer className="mr-2 h-5 w-5" /> Salvar em PDF
                                    </Button>
                                )}
                            </div>
                        </div>

                        {kgRejunte !== null && (
                            <div className="mt-8 text-center bg-gradient-result p-8 rounded-xl border-2 border-primary animate-scale-in print:bg-white print:border-black print:p-0 print:text-left print:mt-4">
                                <p className="text-muted-foreground text-lg print:text-gray-600">Você vai precisar de:</p>
                                <p className="text-6xl font-extrabold text-primary my-2 print:text-black">{kgRejunte} kg</p>
                                <p className="text-muted-foreground print:text-gray-500">de rejunte</p>

                                <div className="mt-6 flex justify-center print:hidden">
                                    <Button variant="success" size="lg" className="w-full max-w-sm">
                                        <ShoppingCart className="mr-2 h-4 w-4" /> Ver Ofertas de Rejunte
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            if (kgRejunte) {
                                                addItem({
                                                    id: crypto.randomUUID(),
                                                    name: `Rejunte Cimentício`,
                                                    description: `Para ${area}m² | Peça ${larguraPeca}x${alturaPeca}cm | Junta ${junta}mm`,
                                                    quantity: kgRejunte,
                                                    unit: "kg",
                                                    category: "Acabamento - Revestimento",
                                                    estimatedPrice: kgRejunte * 5 // R$5/kg
                                                });
                                            }
                                        }}
                                        variant="outline"
                                        size="lg"
                                        className="w-full max-w-sm mt-2 border-2 hover:bg-orange-50 text-orange-800 border-orange-200 print:hidden"
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar ao Orçamento
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Informações extras */}
                    <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">
                            🔢 Entenda o Cálculo de Rejunte
                        </h2>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <p>
                                Utilizamos a fórmula padrão da indústria para estimar o consumo de rejunte cimentício:
                            </p>
                            <div className="bg-card border border-border p-4 rounded-lg font-mono text-xs md:text-sm text-foreground overflow-x-auto">
                                Kg/m² = ((A + L) x E x J x 1,60) / (A x L)
                            </div>
                            <ul className="list-disc list-inside space-y-1 ml-1 text-xs md:text-sm">
                                <li><strong>A:</strong> Altura da peça (mm)</li>
                                <li><strong>L:</strong> Largura da peça (mm)</li>
                                <li><strong>E:</strong> Espessura da peça (mm)</li>
                                <li><strong>J:</strong> Largura da junta (mm)</li>
                                <li><strong>1,60:</strong> Coeficiente de densidade médio do rejunte</li>
                            </ul>
                            <p className="text-xs mt-2">
                                * O resultado final pode variar dependendo da profundidade real da junta e desperdício na aplicação.
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

export default CalculadoraRejunte;
