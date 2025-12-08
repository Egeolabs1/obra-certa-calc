import { useState } from "react";
import { Grid3X3, Calculator, ShoppingCart, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";

const CalculadoraRejunte = () => {
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

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Rejunte"
                description="Descubra a quantidade de rejunte (kg) necessária para seu piso ou revestimento."
                url="https://suaobracerta.com.br/calculadora-rejunte"
                schema={generateCalculatorSchema(
                    "Calculadora de Rejunte",
                    "Calcule o consumo de rejunte para pisos e azulejos.",
                    "https://suaobracerta.com.br/calculadora-rejunte"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-rejunte" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-orange-500 rounded-xl p-3"><Grid3X3 className="text-white" /></div>
                            <h1>Calculadora de Rejunte</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
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

                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR KG</Button>
                        </div>

                        {kgRejunte !== null && (
                            <div className="mt-8 text-center bg-gradient-result p-8 rounded-xl border-2 border-primary animate-scale-in">
                                <p className="text-muted-foreground text-lg">Você vai precisar de:</p>
                                <p className="text-6xl font-extrabold text-primary my-2">{kgRejunte} kg</p>
                                <p className="text-muted-foreground">de rejunte</p>

                                <div className="mt-6 flex justify-center">
                                    <Button variant="success" size="lg" className="w-full max-w-sm">
                                        <ShoppingCart className="mr-2 h-4 w-4" /> Ver Ofertas de Rejunte
                                    </Button>
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

export default CalculadoraRejunte;
