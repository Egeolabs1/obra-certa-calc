import { useState, useRef } from "react";
import { Cctv, ArrowLeft, ShieldCheck, HardDrive, Eye, Lock, ShoppingCart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { affiliateLinks } from "@/config/affiliateLinks";

const CalculadoraCFTV = () => {
    const [comodos, setComodos] = useState("");
    const [externas, setExternas] = useState("");
    const [dias, setDias] = useState("15");
    const [resultado, setResultado] = useState<{
        totalCameras: number;
        dvrCanais: number;
        armazenamentoGB: number;
        hdRecomendado: string;
    } | null>(null);

    const resultRef = useRef<HTMLDivElement>(null);

    const calcular = () => {
        const nComodos = parseInt(comodos) || 0;
        const nExternas = parseInt(externas) || 0;
        const nDias = parseInt(dias) || 15;

        const totalCameras = nComodos + nExternas;

        if (totalCameras === 0) return;

        // DVR Logic
        let dvrCanais = 4;
        if (totalCameras > 16) dvrCanais = 32;
        else if (totalCameras > 8) dvrCanais = 16;
        else if (totalCameras > 4) dvrCanais = 8;

        // Storage Logic (20GB per cam per day)
        const consumoDiario = totalCameras * 20; // GB
        const totalArmazenamento = consumoDiario * nDias; // GB

        // HD Recommendation
        let hdRecomendado = "1TB";
        if (totalArmazenamento > 8000) hdRecomendado = "10TB";
        else if (totalArmazenamento > 6000) hdRecomendado = "8TB";
        else if (totalArmazenamento > 4000) hdRecomendado = "6TB";
        else if (totalArmazenamento > 2000) hdRecomendado = "4TB";
        else if (totalArmazenamento > 1000) hdRecomendado = "2TB";
        else if (totalArmazenamento <= 500) hdRecomendado = "500GB (Mas sugerimos 1TB)";

        setResultado({
            totalCameras,
            dvrCanais,
            armazenamentoGB: totalArmazenamento,
            hdRecomendado
        });

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Câmeras de Segurança (CFTV) e HD"
                description="Descubra quantas câmeras e qual o tamanho do HD para gravar as imagens da sua casa ou empresa."
                url="https://suaobracerta.com.br/calculadora-cftv"
                keywords="calculadora cftv, projeto cftv, calculo hd dvr, kit cameras segurança, intelbras"
                schema={generateCalculatorSchema(
                    "Calculadora CFTV",
                    "Projeto de segurança eletrônica residencial.",
                    "https://suaobracerta.com.br/calculadora-cftv"
                )}
            />
            <Header />

            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-cftv-top" className="max-w-3xl mx-auto" /></div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-4xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-slate-900 rounded-xl p-3 text-white shadow-lg"><Cctv className="h-8 w-8" /></div>
                            <div>
                                <h1 className="leading-none text-3xl md:text-4xl text-foreground">Projeto de Segurança (CFTV)</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1">Calcule câmeras e armazenamento para proteger seu patrimônio</p>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Quantos cômodos INTERNOS?</Label>
                                    <div className="relative">
                                        <Eye className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            min="0"
                                            value={comodos}
                                            onChange={e => setComodos(e.target.value)}
                                            className="pl-10 h-12"
                                            placeholder="Ex: 3 (Sala, Loja...)"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Quantas áreas EXTERNAS?</Label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            min="0"
                                            value={externas}
                                            onChange={e => setExternas(e.target.value)}
                                            className="pl-10 h-12"
                                            placeholder="Ex: 2 (Frente, Quintal...)"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Dias de Gravação desejados</Label>
                                    <div className="relative">
                                        <HardDrive className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            min="1"
                                            value={dias}
                                            onChange={e => setDias(e.target.value)}
                                            className="pl-10 h-12"
                                            placeholder="Padrão: 15 dias"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button onClick={calcular} size="lg" className="w-full mt-6 bg-slate-900 hover:bg-black text-white h-14 font-bold text-lg">
                                <Lock className="mr-2 h-5 w-5" /> PROJETAR MEU KIT
                            </Button>
                        </div>

                        {/* Result */}
                        {resultado && (
                            <div ref={resultRef} className="animate-fade-up space-y-6">
                                <Card className="border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                    <CardContent className="p-6 md:p-8">
                                        <div className="text-center mb-8">
                                            <h3 className="text-lg font-medium text-muted-foreground mb-2">Seu Kit Ideal:</h3>
                                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 min-w-[200px]">
                                                    <p className="text-sm text-muted-foreground mb-1">Câmeras + DVR</p>
                                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">Kit {resultado.dvrCanais} Canais</p>
                                                    <Badge variant="secondary" className="mt-2">Suporta até {resultado.dvrCanais} câmeras</Badge>
                                                </div>
                                                <div className="text-2xl text-slate-300 hidden md:block">+</div>
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 min-w-[200px]">
                                                    <p className="text-sm text-muted-foreground mb-1">HD de Armazenamento</p>
                                                    <p className="text-3xl font-bold text-purple-600">HD {resultado.hdRecomendado}</p>
                                                    <p className="text-xs text-muted-foreground mt-2">Para gravar ~{dias} dias</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200 mb-6 flex gap-3">
                                            <ShieldCheck className="h-5 w-5 shrink-0" />
                                            <p>
                                                <strong>Por que esse Kit?</strong><br />
                                                Você precisa de <strong>{resultado.totalCameras} câmeras</strong>. O DVR de {resultado.dvrCanais} canais é o ideal para suportar essa quantidade e permitir expansão futura.
                                                O HD de {resultado.hdRecomendado} suporta o fluxo de dados 24h por {dias} dias.
                                            </p>
                                        </div>

                                        {/* Affiliate Links */}
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <Button asChild size="xl" className="h-auto py-4 bg-[#FF9900] hover:bg-[#ffad33] text-black border-none">
                                                <a href={affiliateLinks.cftv.kitIntelbras4} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <ShoppingCart className="h-5 w-5" />
                                                        <span className="font-bold">VER KIT INTELBRAS {resultado.dvrCanais} CANAIS</span>
                                                    </div>
                                                    <span className="text-xs font-normal opacity-90">Melhor preço na Amazon</span>
                                                </a>
                                            </Button>
                                            <Button asChild size="xl" className="h-auto py-4 bg-purple-700 hover:bg-purple-800 text-white">
                                                <a href={affiliateLinks.cftv.hdPurple1TB} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <HardDrive className="h-5 w-5" />
                                                        <span className="font-bold">VER HD PURPLE {resultado.hdRecomendado}</span>
                                                    </div>
                                                    <span className="text-xs font-normal opacity-90">Específico para Segurança (WD Purple)</span>
                                                </a>
                                            </Button>
                                        </div>
                                        <p className="text-center text-xs text-muted-foreground mt-3">*Links seguros da Amazon Brasil</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CalculadoraCFTV;
