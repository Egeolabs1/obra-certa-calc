import { useState, useRef } from "react";
import { Waves, Calculator, ShoppingCart, ArrowLeft, Droplet, Sun, Lightbulb, Bot, Layers, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { affiliateLinks } from "@/config/affiliateLinks";

const CalculadoraPiscina = () => {
    const [formato, setFormato] = useState("retangular");
    const [comprimento, setComprimento] = useState("");
    const [largura, setLargura] = useState("");
    const [profundidade, setProfundidade] = useState("");
    const [diametro, setDiametro] = useState("");

    const [resultado, setResultado] = useState<{
        volumeLitros: number;
        areaRevestimento: number;
        impermeabilizante: number;
        capacidadeFiltro: number;
        placasSolar: number;
    } | null>(null);

    const resultSectionRef = useRef<HTMLDivElement>(null);

    const calcular = () => {
        const prof = parseFloat(profundidade);
        if (!prof) return;

        let vol = 0; // m3
        let areaChao = 0;
        let areaParedes = 0;
        let perimetro = 0;

        if (formato === "retangular") {
            const comp = parseFloat(comprimento);
            const larg = parseFloat(largura);
            if (!comp || !larg) return;

            vol = comp * larg * prof;
            areaChao = comp * larg;
            perimetro = (comp * 2) + (larg * 2);
            areaParedes = perimetro * prof;

        } else if (formato === "redonda") {
            const diam = parseFloat(diametro);
            if (!diam) return;

            const raio = diam / 2;
            areaChao = Math.PI * Math.pow(raio, 2);
            perimetro = Math.PI * diam;
            areaParedes = perimetro * prof;
            vol = areaChao * prof;

        } else if (formato === "oval") {
            // Aproximação para oval
            const comp = parseFloat(comprimento);
            const larg = parseFloat(largura);
            if (!comp || !larg) return;

            vol = comp * larg * prof * 0.85;
            areaChao = comp * larg * 0.85;
            perimetro = (Math.PI * (3 * (comp + larg) - Math.sqrt((3 * comp + larg) * (comp + 3 * larg)))) / 2; // Ramanujan approx (divided by 2 because comp/larg are usually diameters in formula, here treated as axes) - Simplified:
            // Standard simplistic perimeter for oval pools:
            perimetro = 2 * Math.PI * Math.sqrt((Math.pow(comp / 2, 2) + Math.pow(larg / 2, 2)) / 2);
            areaParedes = perimetro * prof;
        }

        const areaTotal = areaChao + areaParedes;
        const volumeLitros = vol * 1000;
        const impermeabilizante = areaTotal * 4; // 4kg/m2
        const capacidadeFiltro = vol / 8; // m3/h
        const placasSolar = Math.ceil(areaChao * 1.0); // 100% da area da piscina

        setResultado({
            volumeLitros: Math.round(volumeLitros),
            areaRevestimento: parseFloat(areaTotal.toFixed(2)),
            impermeabilizante: Math.ceil(impermeabilizante),
            capacidadeFiltro: parseFloat(capacidadeFiltro.toFixed(1)),
            placasSolar
        });

        // Scroll to results
        setTimeout(() => {
            resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Material de Piscina Completa"
                description="Calcule volume, filtro, revestimento, impermeabilização e aquecimento solar para sua piscina."
                url="https://suaobracerta.com.br/calculadora-piscina"
                schema={generateCalculatorSchema(
                    "Calculadora de Piscina",
                    "Ferramenta completa para calcular materiais de construção, filtro e manutenção de piscinas.",
                    "https://suaobracerta.com.br/calculadora-piscina"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-piscina-top" className="max-w-3xl mx-auto" /></div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-4xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-blue-500 rounded-xl p-3 text-white shadow-lg"><Waves className="h-8 w-8" /></div>
                            <div>
                                <h1 className="leading-none text-3xl md:text-4xl text-foreground">Calculadora de Piscina</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1">Material, Filtro e Equipamentos</p>
                            </div>
                        </div>

                        {/* Input Section */}
                        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card mb-12">
                            <Tabs defaultValue="retangular" onValueChange={setFormato} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-6">
                                    <TabsTrigger value="retangular">Retangular</TabsTrigger>
                                    <TabsTrigger value="redonda">Redonda</TabsTrigger>
                                    <TabsTrigger value="oval">Oval</TabsTrigger>
                                </TabsList>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {formato !== "redonda" ? (
                                        <>
                                            <div className="space-y-2">
                                                <Label className="text-base">Comprimento (m)</Label>
                                                <Input
                                                    type="number"
                                                    value={comprimento}
                                                    onChange={e => setComprimento(e.target.value)}
                                                    placeholder="Ex: 8.00"
                                                    className="h-12 text-lg"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-base">Largura (m)</Label>
                                                <Input
                                                    type="number"
                                                    value={largura}
                                                    onChange={e => setLargura(e.target.value)}
                                                    placeholder="Ex: 4.00"
                                                    className="h-12 text-lg"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-base">Diâmetro (m)</Label>
                                            <Input
                                                type="number"
                                                value={diametro}
                                                onChange={e => setDiametro(e.target.value)}
                                                placeholder="Ex: 5.00"
                                                className="h-12 text-lg"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-base">Profundidade Média (m)</Label>
                                        <Input
                                            type="number"
                                            value={profundidade}
                                            onChange={e => setProfundidade(e.target.value)}
                                            placeholder="Ex: 1.40"
                                            className="h-12 text-lg"
                                        />
                                        <p className="text-xs text-muted-foreground">Se houver prainha e fundo, tire uma média.</p>
                                    </div>
                                </div>
                            </Tabs>

                            <Button onClick={calcular} size="xl" className="w-full mt-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg">
                                <Calculator className="mr-2 h-5 w-5" /> CALCULAR MATERIAL
                            </Button>
                        </div>

                        {/* Results Section */}
                        {resultado && (
                            <div ref={resultSectionRef} className="animate-fade-up space-y-8">
                                <div className="grid gap-6 md:grid-cols-3">

                                    {/* Card 1: A Água */}
                                    <div className="bg-card border-l-4 border-blue-500 rounded-r-xl shadow-lg p-6 relative overflow-hidden group hover:shadow-xl transition-all">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Droplet className="w-24 h-24 text-blue-500" /></div>
                                        <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider mb-2">🌊 Capacidade</h3>
                                        <div className="text-3xl font-black text-blue-600 mb-1">{(resultado.volumeLitros / 1000).toLocaleString('pt-BR')} Mil Litros</div>
                                        <p className="text-sm text-muted-foreground mb-4">Volume Total: {resultado.volumeLitros.toLocaleString('pt-BR')} L</p>

                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                Precisa de Filtro/Bomba com vazão de <span className="font-bold">{resultado.capacidadeFiltro} m³/h</span>
                                            </p>
                                        </div>

                                        <Button asChild variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white">
                                            <a href={affiliateLinks.pool.filter} target="_blank" rel="noopener noreferrer">
                                                Ver Filtros em Promoção
                                            </a>
                                        </Button>
                                    </div>

                                    {/* Card 2: O Revestimento */}
                                    <div className="bg-card border-l-4 border-yellow-500 rounded-r-xl shadow-lg p-6 relative overflow-hidden group hover:shadow-xl transition-all">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Layers className="w-24 h-24 text-yellow-500" /></div>
                                        <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider mb-2">🧱 Revestimento</h3>
                                        <div className="text-3xl font-black text-yellow-600 mb-1">{resultado.areaRevestimento} m²</div>
                                        <p className="text-sm text-muted-foreground mb-4">Área total (Chão + Paredes)</p>

                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
                                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                Sugestão: Compre <span className="font-bold">{(resultado.areaRevestimento * 1.10).toFixed(1)} m²</span> (+10% quebra)
                                            </p>
                                        </div>

                                        <Button asChild variant="default" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                                            <a href={affiliateLinks.pool.tiles} target="_blank" rel="noopener noreferrer">
                                                Ver Pastilhas de Vidro
                                            </a>
                                        </Button>
                                    </div>

                                    {/* Card 3: A Estrutura */}
                                    <div className="bg-card border-l-4 border-gray-500 rounded-r-xl shadow-lg p-6 relative overflow-hidden group hover:shadow-xl transition-all">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><CheckCircle2 className="w-24 h-24 text-gray-500" /></div>
                                        <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-wider mb-2">🏗️ Impermeabilização</h3>
                                        <div className="text-3xl font-black text-gray-600 dark:text-gray-300 mb-1">{resultado.impermeabilizante} kg</div>
                                        <p className="text-sm text-muted-foreground mb-4">Argamassa Polimérica (Est. 4kg/m²)</p>

                                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                Fundamental para evitar vazamentos na estrutura.
                                            </p>
                                        </div>

                                        <Button asChild variant="default" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                                            <a href={affiliateLinks.pool.waterproofing} target="_blank" rel="noopener noreferrer">
                                                Ver Impermeabilizante
                                            </a>
                                        </Button>
                                    </div>
                                </div>

                                {/* Extras Section */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Iluminação */}
                                    <div className="bg-indigo-900 text-indigo-100 p-6 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 opacity-10"><Lightbulb size={120} /></div>
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold text-xl mb-2 text-white"><Lightbulb className="text-yellow-300" /> Iluminação LED</h4>
                                            <p className="text-indigo-200 mb-4">Uma piscina desse tamanho fica incrível com iluminação noturna.</p>
                                            <div className="bg-white/10 p-3 rounded-lg mb-4 backdrop-blur-sm">
                                                <p className="font-medium text-yellow-300">Dica: Use 2 Refletores LED de 9W ou mais.</p>
                                            </div>
                                        </div>
                                        <Button asChild variant="secondary" className="w-full hover:bg-white hover:text-indigo-900 transition-colors">
                                            <a href={affiliateLinks.pool.ledKit} target="_blank" rel="noopener noreferrer">Ver Kits de LED</a>
                                        </Button>
                                    </div>

                                    {/* Robô */}
                                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute -bottom-4 -right-4 opacity-20"><Bot size={140} /></div>
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold text-xl mb-2"><Bot /> Cansado de limpar?</h4>
                                            <p className="text-blue-50 mb-4">Existem robôs aspiradores que limpam o fundo e as paredes dessa piscina sozinhos.</p>
                                        </div>
                                        <Button asChild className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold border border-transparent hover:border-white/50">
                                            <a href={affiliateLinks.pool.robot} target="_blank" rel="noopener noreferrer">Ver Robôs Aspiradores</a>
                                        </Button>
                                    </div>
                                </div>

                                {/* Aquecimento Solar */}
                                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                                    <div className="bg-orange-100 dark:bg-orange-900/50 p-4 rounded-full text-orange-600 dark:text-orange-400">
                                        <Sun size={48} />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-bold text-orange-700 dark:text-orange-300 mb-1">Aquecimento Solar</h3>
                                        <p className="text-muted-foreground mb-2">Quer água quente o ano todo?</p>
                                        <p className="text-sm">
                                            Para esta piscina, você precisará de aproximadamente <span className="font-bold text-orange-600 text-lg">{resultado.placasSolar} m²</span> de placas coletoras solares (Considerando 100% da área).
                                        </p>
                                    </div>
                                    <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white min-w-[200px]">
                                        <a href={affiliateLinks.pool.heating} target="_blank" rel="noopener noreferrer">Ver Sistema Solar</a>
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                📐 Geometria da Piscina
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    Calculamos o volume e a área de revestimento com base na forma geométrica escolhida.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Volume (Litros)</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li><strong>Retangular:</strong> Comprimento x Largura x Profundidade.</li>
                                            <li><strong>Redonda:</strong> Área do Círculo x Profundidade.</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Impermeabilização</p>
                                        <p>Consideramos a área total (chão + paredes) e uma média de consumo de argamassa polimérica de <strong>4kg/m²</strong>.</p>
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
export default CalculadoraPiscina;
