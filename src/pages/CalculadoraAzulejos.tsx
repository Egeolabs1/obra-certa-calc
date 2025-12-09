import { useState, useRef } from "react";
import { Grid3X3, ArrowLeft, Ruler, Calculator, ShoppingCart, Info } from "lucide-react";
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

const CalculadoraAzulejos = () => {
    // Wall Dimensions
    const [largura, setLargura] = useState("");
    const [altura, setAltura] = useState(""); // Or Comprimento

    // Tile Dimensions (in cm)
    const [tamAzulejo, setTamAzulejo] = useState("60x60");
    const [customWidth, setCustomWidth] = useState("");
    const [customHeight, setCustomHeight] = useState("");

    const [perda, setPerda] = useState("10"); // 10% standard, 15% diagonal

    const [resultado, setResultado] = useState<{
        areaTotal: number;
        areaComPerda: number;
        qtdPecas: number;
        metragemCaixas: number; // Approximate
    } | null>(null);

    const resultRef = useRef<HTMLDivElement>(null);

    const calcular = () => {
        const l = parseFloat(largura.replace(',', '.'));
        const a = parseFloat(altura.replace(',', '.'));

        if (!l || !a) return;

        const area = l * a;

        // Tile size in meters
        let tileW = 0.6;
        let tileH = 0.6;

        if (tamAzulejo === "custom") {
            tileW = parseFloat(customWidth) / 100;
            tileH = parseFloat(customHeight) / 100;
        } else {
            const [w, h] = tamAzulejo.split('x').map(Number);
            tileW = w / 100;
            tileH = h / 100;
        }

        if (!tileW || !tileH) return;

        const areaTile = tileW * tileH;

        // Add margin
        const margin = parseFloat(perda) / 100;
        const areaWithMargin = area * (1 + margin);

        const pecas = Math.ceil(areaWithMargin / areaTile);

        setResultado({
            areaTotal: area,
            areaComPerda: areaWithMargin,
            qtdPecas: pecas,
            metragemCaixas: areaWithMargin // Rough estimate matches area with margin
        });

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Azulejos e Pisos - Quantidade por Metro Quadrado"
                description="Calcule quantos azulejos ou pisos você precisa para sua parede ou chão. Cálculo exato com margem de quebra."
                url="https://suaobracerta.com.br/calculadora-azulejos"
                schema={generateCalculatorSchema(
                    "Calculadora de Azulejos",
                    "Cálculo de quantidade de revestimentos cerâmicos e porcelanatos.",
                    "https://suaobracerta.com.br/calculadora-azulejos"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-azulejo-top" className="max-w-3xl mx-auto" /></div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-cyan-600 rounded-xl p-3 text-white"><Grid3X3 /></div>
                            <div>
                                <h1 className="leading-none text-3xl text-foreground">Calculadora de Azulejos</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1">Pisos e Revestimentos de Parede</p>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Largura da Área (m)</Label>
                                    <Input
                                        type="number"
                                        value={largura}
                                        onChange={e => setLargura(e.target.value)}
                                        placeholder="Ex: 3.5"
                                        className="h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Altura ou Comp. (m)</Label>
                                    <Input
                                        type="number"
                                        value={altura}
                                        onChange={e => setAltura(e.target.value)}
                                        placeholder="Ex: 2.8"
                                        className="h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tamanho da Peça (cm)</Label>
                                    <Select value={tamAzulejo} onValueChange={setTamAzulejo}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="15x15">15x15 (Azulejo Antigo)</SelectItem>
                                            <SelectItem value="20x20">20x20</SelectItem>
                                            <SelectItem value="30x60">30x60 (Revestimento)</SelectItem>
                                            <SelectItem value="45x45">45x45</SelectItem>
                                            <SelectItem value="60x60">60x60 (Porcelanato)</SelectItem>
                                            <SelectItem value="80x80">80x80</SelectItem>
                                            <SelectItem value="90x90">90x90</SelectItem>
                                            <SelectItem value="120x60">120x60</SelectItem>
                                            <SelectItem value="custom">Outro Tamanho</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {tamAzulejo === 'custom' && (
                                    <div className="space-y-2 col-span-2 grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                                        <div>
                                            <Label>Largura Peça (cm)</Label>
                                            <Input type="number" value={customWidth} onChange={e => setCustomWidth(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label>Altura Peça (cm)</Label>
                                            <Input type="number" value={customHeight} onChange={e => setCustomHeight(e.target.value)} />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Margem de Perda (%)</Label>
                                    <Select value={perda} onValueChange={setPerda}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10% (Padrão Reto)</SelectItem>
                                            <SelectItem value="15">15% (Diagonal)</SelectItem>
                                            <SelectItem value="20">20% (Muitos Recortes)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button onClick={calcular} size="lg" className="w-full mt-6 bg-cyan-700 hover:bg-cyan-800 text-white font-bold h-14 text-lg">
                                CALCULAR QUANTIDADE
                            </Button>
                        </div>

                        {/* Result */}
                        {resultado && (
                            <div ref={resultRef} className="animate-fade-up space-y-6">
                                <div className="bg-card border border-cyan-200 rounded-xl p-6 shadow-lg">
                                    <div className="grid grid-cols-2 gap-8 text-center">
                                        <div>
                                            <p className="text-4xl font-bold text-cyan-800">{resultado.qtdPecas}</p>
                                            <p className="text-sm text-cyan-700 font-medium">Peças Necessárias</p>
                                        </div>
                                        <div>
                                            <p className="text-4xl font-bold text-cyan-800">{resultado.areaComPerda.toFixed(2)}m²</p>
                                            <p className="text-sm text-cyan-700 font-medium">Área Total (c/ margem)</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-cyan-100 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                                        <div>
                                            <span className="block font-bold text-foreground">{resultado.areaTotal.toFixed(2)}m²</span>
                                            Área Real
                                        </div>
                                        <div>
                                            <span className="block font-bold text-foreground">+{perda}%</span>
                                            Margem
                                        </div>
                                        <div>
                                            <span className="block font-bold text-foreground">{Math.ceil(resultado.areaComPerda / 1.5)}</span>
                                            Cx Aprox (1.5m²)
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg flex gap-3 text-sm text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-900">
                                    <Info className="h-5 w-5 shrink-0" />
                                    <p>Sempre arredonde para cima na hora de comprar e verifique a metragem exata por caixa indicada pelo fabricante.</p>
                                </div>

                                <Button asChild size="xl" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-16 shadow-lg">
                                    <a href={affiliateLinks.flooring.general} target="_blank" rel="noopener noreferrer">
                                        <ShoppingCart className="mr-2 h-6 w-6" /> COTAR PREÇOS DE PISOS
                                    </a>
                                </Button>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                🧱 Como calcular pisos e revestimentos?
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    O cálculo da área é simples (Largura x Altura), mas o segredo está na margem de segurança.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Por que adicionar Margem?</p>
                                        <p>Peças quebram no transporte ou no corte. Para instalação reta, recomenda-se <strong>10%</strong>. Para diagonal, <strong>15%</strong>.</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Caixas Fechadas</p>
                                        <p>O resultado em peças é exato, mas as lojas vendem por m² ou caixa. Sempre arredonde para a caixa cheia mais próxima.</p>
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

export default CalculadoraAzulejos;
