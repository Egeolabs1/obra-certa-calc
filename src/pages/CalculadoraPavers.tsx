import { useState } from "react";
import { LayoutDashboard, Calculator, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";

const CalculadoraPavers = () => {
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

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Pavers"
                description="Calcule a quantidade de pavers (bloquetes) para calçadas e garagens."
                url="https://suaobracerta.com.br/calculadora-pavers"
                schema={generateCalculatorSchema(
                    "Calculadora de Pavers",
                    "Calcule a quantidade de blocos de concreto (pavers) por metro quadrado.",
                    "https://suaobracerta.com.br/calculadora-pavers"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-pavers" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-gray-700 rounded-xl p-3 text-white"><LayoutDashboard /></div>
                            <h1>Calculadora de Pavers</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
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
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR BLOQUETES</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 text-center bg-gradient-result p-8 rounded-xl border-2 border-primary animate-scale-in">
                                <p className="text-lg">Você precisa de:</p>
                                <p className="text-5xl font-extrabold text-primary my-2">{resultado} Peças</p>
                                <p className="text-sm text-muted-foreground">(Já incluindo 5% de margem)</p>
                                <Button className="mt-6 w-full" variant="secondary" size="lg"><ShoppingCart className="mr-2" /> VER MÁQUINAS DE LAVAR PISO</Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default CalculadoraPavers;
