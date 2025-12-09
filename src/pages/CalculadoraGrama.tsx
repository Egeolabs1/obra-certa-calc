import { useState } from "react";
import { Flower2, Calculator, ShoppingCart, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";

const CalculadoraGrama = () => {
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
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-grama" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-green-600 rounded-xl p-3 text-white"><Flower2 /></div>
                            <h1>Calculadora de Grama</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="space-y-2">
                                <Label>Área do Jardim (m²)</Label>
                                <Input value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 50" className="h-12" />
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR QUANTIDADE</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 grid gap-4 sm:grid-cols-2 animate-scale-in">
                                <div className="bg-gradient-result p-6 rounded-xl border border-primary text-center">
                                    <p className="text-lg">Opção 1: Rolos</p>
                                    <p className="text-4xl font-extrabold text-primary my-2">{resultado.rolos} Rolos</p>
                                    <p className="text-xs text-muted-foreground">Padrão 40cm x 125cm</p>
                                </div>
                                <div className="bg-card p-6 rounded-xl border border-border text-center">
                                    <p className="text-lg">Opção 2: Placas</p>
                                    <p className="text-4xl font-extrabold text-foreground my-2">{resultado.placas} Placas</p>
                                    <p className="text-xs text-muted-foreground">Padrão 50cm x 50cm</p>
                                </div>
                                <div className="col-span-1 sm:col-span-2 mt-4">
                                    <Button asChild variant="success" size="lg" className="w-full">
                                        <a href={affiliateLinks.garden.mowers} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2" /> VER CORTADORES DE GRAMA</a>
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
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
            <Footer />
        </div>
    );
};
export default CalculadoraGrama;
