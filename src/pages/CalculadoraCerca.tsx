import { useState, useRef } from "react";
import { Ruler, ArrowLeft, Component, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { affiliateLinks } from "@/config/affiliateLinks";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";

const CalculadoraCerca = () => {
    const [perimetro, setPerimetro] = useState("");
    const [distanciaMourao, setDistanciaMourao] = useState("2.5");
    const [tipoCerca, setTipoCerca] = useState("arame_farpado");
    const [fiosArame, setFiosArame] = useState("4");

    const [resultado, setResultado] = useState<{
        mourões: number;
        rolosArame: number;
        grampos: number;
        metrosTela?: number;
    } | null>(null);

    const resultRef = useRef<HTMLDivElement>(null);

    const calcular = () => {
        const p = parseFloat(perimetro);
        const dist = parseFloat(distanciaMourao);
        const fios = parseFloat(fiosArame);

        if (!p || !dist) return;

        // Mourões (Postes)
        // Regra: Perímetro / Distância + 1 (fechamento) + 5% (cantos/escoras)
        const mouroesBase = Math.ceil(p / dist) + 1;
        const mouroesTotal = Math.ceil(mouroesBase * 1.05);

        let rolos = 0;
        let grampos = 0;
        let metrosTela = 0;

        if (tipoCerca === "arame_farpado" || tipoCerca === "arame_liso") {
            // Arame
            // Metragem total de fios = Perímetro * Fios
            const metragemTotalFios = p * fios;
            // Rolo padrão Arame Farpado: 500m / Arame Liso: 1000m (mas vamos padronizar 500m pra simplificar ou deixar generico)
            // Vamos considerar rolos de 500m para farpado e 1000m para liso? 
            // Melhor: Rolos de 500m como base.
            const tamanhoRolo = tipoCerca === "arame_liso" ? 1000 : 500;
            rolos = Math.ceil(metragemTotalFios / tamanhoRolo);

            // Grampos: 1 por fio em cada mourão
            grampos = Math.ceil((mouroesTotal * fios) / 100); // Em kg? Não, em unidades. Vamos por em KG depois? Melhor und.
            // Mas grampo vende por KG. 1kg grampo ~ 190 unidades.
            // Vamos retornar em KG.
            const unidadesGrampo = mouroesBase * fios;
            grampos = parseFloat((unidadesGrampo / 190).toFixed(1)); // KG de grampo
        } else if (tipoCerca === "tela") {
            // Tela
            metrosTela = p;
            // Rolos de tela geralmente são de 25m ou 50m. Vamos sugerir metros lineares.
            rolos = Math.ceil(p / 25); // Rolos de 25m
        }

        setResultado({
            mourões: mouroesTotal,
            rolosArame: rolos,
            grampos: grampos, // KG
            metrosTela: tipoCerca === "tela" ? p : 0
        });

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Cerca (Arame Farpado, Tela e Mourões)"
                description="Calcule a quantidade de mourões, arame farpado ou tela para cercar seu terreno. Orçamento completo de cerca."
                url="https://suaobracerta.com.br/calculadora-cerca"
                schema={generateCalculatorSchema(
                    "Calculadora de Cerca",
                    "Cálculo de materiais para construção de cercas: mourões, arame e tela.",
                    "https://suaobracerta.com.br/calculadora-cerca"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-cerca-top" className="max-w-3xl mx-auto" /></div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-amber-800 rounded-xl p-3 text-white"><Component /></div>
                            <div>
                                <h1 className="leading-none text-3xl text-foreground">Calculadora de Cerca</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1">Mourões, Arame e Tela</p>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Perímetro total da Cerca (metros)</Label>
                                    <div className="relative">
                                        <Ruler className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            value={perimetro}
                                            onChange={e => setPerimetro(e.target.value)}
                                            className="pl-10 h-12"
                                            placeholder="Ex: 200"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tipo de Cerca</Label>
                                        <Select value={tipoCerca} onValueChange={setTipoCerca}>
                                            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="arame_farpado">Arame Farpado</SelectItem>
                                                <SelectItem value="arame_liso">Arame Liso</SelectItem>
                                                <SelectItem value="tela">Tela (Alambrado)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Dist. Mourões (m)</Label>
                                        <Input
                                            type="number"
                                            value={distanciaMourao}
                                            onChange={e => setDistanciaMourao(e.target.value)}
                                            className="h-12"
                                            placeholder="2.5"
                                        />
                                    </div>
                                </div>

                                {tipoCerca !== "tela" && (
                                    <div className="space-y-2">
                                        <Label>Quantidade de Fios</Label>
                                        <Select value={fiosArame} onValueChange={setFiosArame}>
                                            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="3">3 Fios (Simples)</SelectItem>
                                                <SelectItem value="4">4 Fios (Padrão)</SelectItem>
                                                <SelectItem value="5">5 Fios (Reforçada)</SelectItem>
                                                <SelectItem value="6">6 Fios (Segurança)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <Button onClick={calcular} size="lg" className="w-full mt-6 bg-amber-800 hover:bg-amber-900 text-white font-bold text-lg h-14">
                                CALCULAR MATERIAL
                            </Button>
                        </div>

                        {/* Result */}
                        {resultado && (
                            <div ref={resultRef} className="animate-fade-up">
                                <div className="bg-card border-2 border-amber-800/20 rounded-xl p-6 shadow-lg mb-6">
                                    <h3 className="text-lg font-bold text-amber-900 mb-4 border-b border-amber-200 pb-2">Lista de Materiais Estimada</h3>

                                    <div className="grid grid-cols-2 gap-6 text-center">
                                        <div className="bg-amber-50 p-4 rounded-lg">
                                            <p className="text-3xl font-bold text-amber-800">{resultado.mourões}</p>
                                            <p className="text-sm text-amber-700 font-medium">Mourões</p>
                                            <p className="text-xs text-muted-foreground mt-1">(Postes de madeira ou concreto)</p>
                                        </div>

                                        {tipoCerca === "tela" ? (
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <p className="text-3xl font-bold text-blue-800">{resultado.metrosTela}m</p>
                                                <p className="text-sm text-blue-700 font-medium">de Tela</p>
                                                <p className="text-xs text-muted-foreground mt-1">({resultado.rolosArame} rolos de 25m)</p>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-100 p-4 rounded-lg">
                                                <p className="text-3xl font-bold text-gray-800">{resultado.rolosArame}</p>
                                                <p className="text-sm text-gray-700 font-medium">Rolos de Arame</p>
                                                <p className="text-xs text-muted-foreground mt-1">({tipoCerca === 'arame_liso' ? '1000m' : '500m'} cada)</p>
                                            </div>
                                        )}
                                    </div>

                                    {tipoCerca !== "tela" && (
                                        <div className="mt-4 bg-muted/50 p-3 rounded-lg text-center">
                                            <p className="font-medium">Grampos: <span className="font-bold">{resultado.grampos} kg</span></p>
                                            <p className="text-xs text-muted-foreground">Considerando perda e reforços</p>
                                        </div>
                                    )}
                                </div>

                                <Button asChild size="xl" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-16 text-lg shadow-lg">
                                    <a href={affiliateLinks.services.findProfessional} target="_blank" rel="noopener noreferrer">
                                        <ShoppingCart className="mr-2 h-6 w-6" /> VER PREÇOS DE ARAME
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CalculadoraCerca;
