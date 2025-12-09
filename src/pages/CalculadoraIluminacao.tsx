import { useState } from "react";
import { Lightbulb, Calculator, ExternalLink, ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";

const CalculadoraIluminacao = () => {
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
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-luz" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-yellow-400 rounded-xl p-3 text-black"><Lightbulb /></div>
                            <h1>Calculadora de Iluminação</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Comprimento (m)</Label>
                                    <Input value={comprimento} onChange={e => setComprimento(e.target.value)} placeholder="Ex: 4.0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Largura (m)</Label>
                                    <Input value={largura} onChange={e => setLargura(e.target.value)} placeholder="Ex: 3.0" />
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

                        {resultado && (
                            <div className="mt-8 bg-gradient-result p-6 rounded-xl border-2 border-primary text-center animate-scale-in">
                                <p className="text-xl text-foreground">Iluminação Ideal:</p>
                                <p className="text-5xl font-extrabold text-primary my-3">{resultado.lumens} Lúmens</p>
                                <p className="text-muted-foreground mb-4">Aprox. <strong>{resultado.wattsLed}W</strong> em lâmpadas LED</p>
                                <Button asChild variant="success" size="lg" className="w-full">
                                    <a href={affiliateLinks.electrical.lighting} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2" /> COMPRAR LÂMPADAS LED</a>
                                </Button>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
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
            <Footer />
        </div>
    );
};
export default CalculadoraIluminacao;
