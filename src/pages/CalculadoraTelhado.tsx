import { useState } from "react";
import { Home, Calculator, ShoppingCart, ArrowLeft } from "lucide-react";
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

const CalculadoraTelhado = () => {
    const [area, setArea] = useState("");
    const [tipoTelha, setTipoTelha] = useState("romana"); // romana, portuguesa, americana
    const [inclinacao, setInclinacao] = useState("30"); // %
    const [resultado, setResultado] = useState<number | null>(null);

    const calcular = () => {
        const a = parseFloat(area);
        const i = parseFloat(inclinacao) / 100;

        if (!a) return;

        // Fator de inclinação (Hipotenusa)
        // Se a projeção horizontal é 1, a altura é i. A hipotenusa é sqrt(1 + i²).
        const fatorIncl = Math.sqrt(1 + (i * i));
        const areaReal = a * fatorIncl;

        // Consumo médio p/ m²
        // Romana: ~16, Portuguesa: ~17, Americana: ~12.5, Francesa: ~16, Colonial: ~24
        let consumo = 16;
        if (tipoTelha === "portuguesa") consumo = 17;
        if (tipoTelha === "americana") consumo = 12.5;
        if (tipoTelha === "fibrocimento") consumo = 1.1; // Chapa grande, cálculo diferente, mas vamos simplificar p/ telha cerâmica por eqnt

        const total = Math.ceil(areaReal * consumo);
        setResultado(total);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Telhas"
                description="Calcule a quantidade de telhas (Romana, Portuguesa, Americana) por metro quadrado."
                url="https://suaobracerta.com.br/calculadora-telhado"
                schema={generateCalculatorSchema(
                    "Calculadora de Telhas",
                    "Calcule a quantidade de telhas para cobertura de telhados.",
                    "https://suaobracerta.com.br/calculadora-telhado"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-telhado" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-red-700 rounded-xl p-3"><Home className="text-white" /></div>
                            <h1>Calculadora de Telhas</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="space-y-2">
                                <Label>Área de Cobertura (m²) - Projeção Plana</Label>
                                <Input value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 80" className="h-12" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tipo de Telha</Label>
                                    <Select value={tipoTelha} onValueChange={setTipoTelha}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="romana">Romana (16/m²)</SelectItem>
                                            <SelectItem value="portuguesa">Portuguesa (17/m²)</SelectItem>
                                            <SelectItem value="americana">Americana (12.5/m²)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Inclinação (%)</Label>
                                    <Input value={inclinacao} onChange={e => setInclinacao(e.target.value)} placeholder="30" className="h-12" />
                                    <span className="text-xs text-muted-foreground">Padrão: 30% a 35%</span>
                                </div>
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR QUANTIDADE</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 text-center bg-gradient-result p-8 rounded-xl border-2 border-primary animate-scale-in">
                                <p className="text-lg">Você precisa de:</p>
                                <p className="text-5xl font-extrabold text-primary my-2">{resultado} Telhas</p>
                                <Button className="mt-4 w-full" variant="success" size="lg"><ShoppingCart className="mr-2" /> COTAR TELHAS</Button>
                            </div>
                        )}
                    </div>

                    {/* Informações extras */}
                    <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
                        <h2 className="mb-4 text-lg font-semibold text-foreground">
                            🏠 Entenda o Cálculo de Telhas
                        </h2>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <div className="space-y-2">
                                <p><strong className="text-foreground">1. Área Real vs. Área Projetada:</strong></p>
                                <p>
                                    A área do telhado é maior que a área da casa devido à inclinação.
                                    Nossa calculadora converte a área plana para a área inclinada usando o fator de correção da inclinação informada (hipotenusa).
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p><strong className="text-foreground">2. Consumo por Tipo:</strong></p>
                                <ul className="list-disc list-inside space-y-1 ml-1">
                                    <li><strong>Romana:</strong> ~16 telhas/m²</li>
                                    <li><strong>Portuguesa:</strong> ~17 telhas/m² (encaixe diferente)</li>
                                    <li><strong>Americana:</strong> ~12.5 telhas/m² (maior rendimento)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default CalculadoraTelhado;
