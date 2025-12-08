import { useState } from "react";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { TrendingUp, Calculator, ArrowLeft, Accessibility } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CalculadoraRampa = () => {
    const [altura, setAltura] = useState("");
    const [tipo, setTipo] = useState("acessibilidade");
    const [resultado, setResultado] = useState<{ comprimento: number; inclinacao: number } | null>(null);

    const calcular = () => {
        const h = parseFloat(altura); // metros
        if (!h) return;

        // Inclinacao Maxina:
        // Acessibilidade (NBR 9050): 8.33% (1:12)
        // Carros (Garagem): 20% a 25% (confortavel 20%)

        let inclinacaoMax = 8.33;
        if (tipo === "carro") inclinacaoMax = 20;
        if (tipo === "moto") inclinacaoMax = 25; // Motos sobem mais, mas vamos deixar safe

        // Inclinação (%) = (Altura / Comprimento) * 100
        // Comprimento = (Altura * 100) / Inclinação

        const comprimentoNecessario = (h * 100) / inclinacaoMax;

        setResultado({
            comprimento: Math.ceil(comprimentoNecessario * 100) / 100,
            inclinacao: inclinacaoMax
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Rampa Acessível"
                description="Calcule a inclinação e comprimento de rampas conforme a NBR 9050 para acessibilidade e garagens."
                url="https://suaobracerta.com.br/calculadora-rampa"
                schema={generateCalculatorSchema(
                    "Calculadora de Rampa",
                    "Calcule a inclinação e comprimento de rampas acessíveis.",
                    "https://suaobracerta.com.br/calculadora-rampa"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-rampa" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-teal-600 rounded-xl p-3 text-white"><TrendingUp /></div>
                            <h1>Calculadora de Rampa</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="space-y-2">
                                <Label>Altura do Desnível (metros)</Label>
                                <Input value={altura} onChange={e => setAltura(e.target.value)} placeholder="Ex: 0.50" className="h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label>Finalidade da Rampa</Label>
                                <Select value={tipo} onValueChange={setTipo}>
                                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="acessibilidade">Cadeirantes / Acessibilidade (Norma NBR 9050)</SelectItem>
                                        <SelectItem value="carro">Carros (Garagem)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR COMPRIMENTO</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                <div className="bg-gradient-result p-8 rounded-xl border-2 border-primary text-center">
                                    <p className="text-xl">Comprimento Mínimo:</p>
                                    <p className="text-5xl font-extrabold text-primary my-3">{resultado.comprimento} metros</p>
                                    <div className="inline-flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full text-sm">
                                        {tipo === "acessibilidade" && <Accessibility className="h-4 w-4" />}
                                        <span>Inclinação calculada: {resultado.inclinacao}%</span>
                                    </div>
                                </div>
                                <p className="mt-4 text-center text-sm text-muted-foreground">
                                    *Este é o comprimento da rampa em projeção horizontal.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default CalculadoraRampa;
