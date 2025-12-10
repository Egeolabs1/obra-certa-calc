import { useState } from "react";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { TrendingUp, Calculator, ArrowLeft, Accessibility, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
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

    const handlePrint = () => {
        window.print();
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
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <PrintHeader title="Calculadora de Rampa" />
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-rampa" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-teal-600 rounded-xl p-3 text-white print:bg-white print:text-teal-600 print:shadow-none print:border print:border-teal-200"><TrendingUp /></div>
                            <div>
                                <h1 className="print:text-2xl">Calculadora de Rampa</h1>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5 print:shadow-none print:border-none print:p-0 print:mb-6">
                            <div className="print:hidden space-y-5">
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

                            {/* Print Summary */}
                            <div className="hidden print:block mb-6 p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Cálculo</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">Altura do Desnível:</span>
                                        <span className="font-medium">{altura} m</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Finalidade:</span>
                                        <span className="font-medium capitalize">{tipo === "acessibilidade" ? "Acessibilidade (NBR 9050)" : "Carros"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                <div className="bg-gradient-result p-8 rounded-xl border-2 border-primary text-center print:bg-white print:border-black print:text-left print:p-0 print:mt-4">
                                    <p className="text-xl print:text-gray-600">Comprimento Mínimo:</p>
                                    <p className="text-5xl font-extrabold text-primary my-3 print:text-black">{resultado.comprimento} metros</p>
                                    <div className="inline-flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full text-sm print:bg-gray-100 print:text-gray-800">
                                        {tipo === "acessibilidade" && <Accessibility className="h-4 w-4" />}
                                        <span>Inclinação calculada: {resultado.inclinacao}%</span>
                                    </div>
                                </div>
                                <p className="mt-4 text-center text-sm text-muted-foreground print:hidden">
                                    *Este é o comprimento da rampa em projeção horizontal.
                                </p>

                                <div className="print:hidden mt-6">
                                    <Button
                                        onClick={handlePrint}
                                        variant="outline"
                                        size="xl"
                                        className="w-full border-2 border-slate-200 bg-white text-slate-800 hover:bg-gray-100"
                                    >
                                        <Printer className="mr-2 h-5 w-5" /> Salvar em PDF
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                📐 Normas de Inclinação
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    Uma rampa muito íngreme é perigosa e inutilizável para cadeirantes.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">NBR 9050 (Acessibilidade)</p>
                                        <p>A inclinação máxima permitida é <strong>8.33% (1:12)</strong>. Ou seja, para cada 1m de altura, precisa de 12m de comprimento.</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Rampas de Garagem</p>
                                        <p>Carros conseguem subir rampas mais íngremes, geralmente entre <strong>20% e 25%</strong>. Acima disso, o carro pode raspar embaixo.</p>
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
export default CalculadoraRampa;
