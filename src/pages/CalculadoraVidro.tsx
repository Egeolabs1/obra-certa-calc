import { useState } from "react";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { AppWindow, Calculator, ArrowLeft, Weight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraVidro = () => {
    const { addItem } = useOrcamento();
    const [largura, setLargura] = useState("");
    const [altura, setAltura] = useState("");
    const [espessura, setEspessura] = useState("8");
    const [resultado, setResultado] = useState<{ peso: number; area: number } | null>(null);

    const calcular = () => {
        const h = parseFloat(altura); // metros
        const l = parseFloat(largura); // metros
        const e = parseFloat(espessura); // mm

        if (!h || !l) return;

        // Densidade Vidro: 2.5 kg por m2 para cada 1mm espessura
        // Ex: 10mm = 25kg/m2

        const area = h * l;
        const pesoPorM2 = 2.5 * e;
        const pesoTotal = area * pesoPorM2;

        setResultado({
            peso: Math.ceil(pesoTotal * 100) / 100,
            area: Math.ceil(area * 100) / 100
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Peso de Vidro"
                description="Estime o peso de vidros temperados ou laminados para escolher as roldanas e ferragens corretas."
                url="https://suaobracerta.com.br/calculadora-vidro"
                schema={generateCalculatorSchema(
                    "Calculadora de Vidro",
                    "Calcule o peso estimado de vidros temperados e laminados.",
                    "https://suaobracerta.com.br/calculadora-vidro"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-vidro" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-cyan-500 rounded-xl p-3 text-white"><AppWindow /></div>
                            <h1>Calculadora de Vidro</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Altura (m)</Label>
                                    <Input value={altura} onChange={e => setAltura(e.target.value)} placeholder="2.10" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Largura (m)</Label>
                                    <Input value={largura} onChange={e => setLargura(e.target.value)} placeholder="0.80" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Espessura do Vidro (mm)</Label>
                                <Select value={espessura} onValueChange={setEspessura}>
                                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="4">4mm (Box simples/Janelinha)</SelectItem>
                                        <SelectItem value="6">6mm</SelectItem>
                                        <SelectItem value="8">8mm (Temperado Padrão)</SelectItem>
                                        <SelectItem value="10">10mm (Portas Grandes/Divisórias)</SelectItem>
                                        <SelectItem value="12">12mm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR PESO</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                <div className="bg-gradient-result p-8 rounded-xl border-2 border-primary text-center">
                                    <p className="text-xl">Peso Estimado da Peça:</p>
                                    <p className="text-5xl font-extrabold text-primary my-3 flex items-center justify-center gap-3">
                                        <Weight className="h-8 w-8 text-foreground/50" />
                                        {resultado.peso} kg
                                    </p>
                                    <p className="text-sm text-muted-foreground">Área Total: {resultado.area} m²</p>
                                </div>
                                <div className="mt-6 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                                    ⚠️ <strong>Importante:</strong> Use este peso para dimensionar as "Roldanas" ou o "Kit Trilho" da porta de correr. Roldanas fracas quebram com vidros pesados.
                                </div>

                                <Button
                                    onClick={() => {
                                        addItem({
                                            id: crypto.randomUUID(),
                                            name: `Vidro Temperado ${espessura}mm`,
                                            description: `Peça de ${altura}m x ${largura}m | Peso estim. ${resultado.peso}kg`,
                                            quantity: resultado.area,
                                            unit: "m²",
                                            category: "Vidraçaria",
                                            estimatedPrice: resultado.area * 450 // R$450/m2
                                        });
                                    }}
                                    variant="outline"
                                    size="xl"
                                    className="w-full mt-3 border-2 hover:bg-cyan-50 text-cyan-800 border-cyan-200"
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar Vidro ao Orçamento
                                </Button>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                ⚖️ Entenda o cálculo de Peso
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    O cálculo de peso é fundamental para comprar o kit de roldanas correto, evitando que a porta emperre ou quebre o trilho.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Fórmula da Densidade</p>
                                        <p>Consideramos a densidade média do vidro: <strong>2.5kg/m²</strong> para cada 1mm de espessura.</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Exemplo</p>
                                        <p>Um vidro de 10mm pesa <strong>25kg por m²</strong>. Uma porta de 2m² pesará 50kg.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default CalculadoraVidro;
