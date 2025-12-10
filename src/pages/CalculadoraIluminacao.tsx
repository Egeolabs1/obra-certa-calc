import { useState } from "react";
import { Lightbulb, Calculator, ExternalLink, ArrowLeft, ShoppingCart, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraIluminacao = () => {
    const { addItem } = useOrcamento();
    const [comprimento, setComprimento] = useState("");
    const [largura, setLargura] = useState("");
    const [tipoAmbiente, setTipoAmbiente] = useState("sala");
    const [resultado, setResultado] = useState<{ lumens: number; wattsLed: number; } | null>(null);

    const calcular = () => {
        const c = parseFloat(comprimento);
        const l = parseFloat(largura);
        if (!c || !l) return;

        const area = c * l;

        // NBR 5413 - Lux (Lumen/m²) recomendado
        // Sala: 150-200. Cozinha: 300-500. Quarto: 150. Banheiro: 300. Escritório: 500.
        let lux = 150;
        if (tipoAmbiente === "cozinha") lux = 400;
        if (tipoAmbiente === "banheiro") lux = 300;
        if (tipoAmbiente === "escritorio") lux = 500;
        if (tipoAmbiente === "quarto") lux = 150;
        if (tipoAmbiente === "sala") lux = 200;

        const lumensNecessarios = area * lux;

        // Conversão aproximada para Watts LED (Eficiência ~80-100 Lúmens/Watt)
        const wattsLed = Math.ceil(lumensNecessarios / 90);

        setResultado({
            lumens: Math.ceil(lumensNecessarios),
            wattsLed
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Iluminação (Lúmens e Watts LED)"
                description="Descubra a quantidade de lúmens e watts LED necessários para iluminar cada ambiente."
                url="https://suaobracerta.com.br/calculadora-iluminacao"
                schema={generateCalculatorSchema(
                    "Calculadora de Iluminação",
                    "Calcule a quantidade de luz (lúmens) necessária para cada ambiente.",
                    "https://suaobracerta.com.br/calculadora-iluminacao"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <PrintHeader title="Orçamento de Iluminação" />
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-luz" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-yellow-400 rounded-xl p-3 text-black print:bg-white print:text-yellow-600 print:border print:border-yellow-200 print:shadow-none"><Lightbulb /></div>
                            <div>
                                <h1 className="print:text-2xl">Calculadora de Iluminação</h1>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5 print:shadow-none print:border-none print:p-0 print:mb-6">
                            <div className="print:hidden space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Comprimento (m)</Label>
                                        <Input value={comprimento} onChange={e => setComprimento(e.target.value)} placeholder="Ex: 4.0" className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Largura (m)</Label>
                                        <Input value={largura} onChange={e => setLargura(e.target.value)} placeholder="Ex: 3.0" className="h-12" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tipo de Ambiente</Label>
                                    <Select value={tipoAmbiente} onValueChange={setTipoAmbiente}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sala">Sala de Estar (200 Lux)</SelectItem>
                                            <SelectItem value="cozinha">Cozinha (400 Lux)</SelectItem>
                                            <SelectItem value="quarto">Quarto (150 Lux)</SelectItem>
                                            <SelectItem value="banheiro">Banheiro (300 Lux)</SelectItem>
                                            <SelectItem value="escritorio">Escritório / Home Office (500 Lux)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={calcular} size="xl" className="w-full">CALCULAR LÚMENS</Button>
                            </div>

                            {/* Print Summary */}
                            <div className="hidden print:block mb-6 p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Ambiente</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">Dimensões:</span>
                                        <span className="font-medium">{comprimento}x{largura} m</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Ambiente:</span>
                                        <span className="font-medium capitalize">{tipoAmbiente}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 bg-gradient-result p-6 rounded-xl border-2 border-primary text-center animate-scale-in print:bg-white print:border-black print:p-0 print:text-left print:mt-4">
                                <p className="text-xl text-foreground print:text-gray-600">Iluminação Ideal:</p>
                                <p className="text-5xl font-extrabold text-primary my-3 print:text-black">{resultado.lumens} Lúmens</p>
                                <p className="text-muted-foreground mb-4 print:text-gray-800">Aprox. <strong>{resultado.wattsLed}W</strong> em lâmpadas LED</p>

                                <Button asChild variant="success" size="lg" className="w-full print:hidden">
                                    <a href={affiliateLinks.electrical.lighting} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2" /> COMPRAR LÂMPADAS LED</a>
                                </Button>

                                <div className="print:hidden space-y-3 mt-3">
                                    <Button
                                        onClick={() => {
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Lâmpadas LED (${Math.round(resultado.wattsLed / 5)} un aprox)`, // Estimando lampadas de 5-9W
                                                description: `Para ${tipoAmbiente} (${comprimento}x${largura}m) | Total ${resultado.lumens} Lúmens`,
                                                quantity: Math.ceil(resultado.wattsLed / 9), // Estimando lâmpadas de 9W
                                                unit: "Unidades",
                                                category: "Elétrica - Iluminação",
                                                estimatedPrice: Math.ceil(resultado.wattsLed / 9) * 15 // R$15/lampada
                                            });
                                        }}
                                        variant="outline"
                                        size="xl"
                                        className="w-full border-2 hover:bg-yellow-50 text-yellow-800 border-yellow-200 print:hidden"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar Lâmpadas ao Orçamento
                                    </Button>

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
                                💡 Entenda os Lúmens e Lux
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    A quantidade de luz necessária depende da função do ambiente. Um escritório precisa de muito mais luz que um quarto.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Lux (Lúmens/m²)</p>
                                        <p>Baseado na NBR 5413: Salas (150-200), Cozinhas (300-500), Escritórios (500). Quartos exigem menos luz (150).</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Watts vs Lúmens</p>
                                        <p>Watts é o consumo de energia. Lúmens é a quantidade de luz. Uma lâmpada LED de 9W gera aprox. <strong>800 Lúmens</strong>.</p>
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
export default CalculadoraIluminacao;
