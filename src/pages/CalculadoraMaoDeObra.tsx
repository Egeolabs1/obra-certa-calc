import { useState, useRef } from "react";
import { HardHat, ArrowLeft, Ruler, Wallet, AlertTriangle, Hammer, Briefcase, Info } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";

const SERVICES = [
    { id: "piso_comum", label: "Assentar Piso Cerâmico Comum", unit: "m²", priceMin: 40, priceMax: 70 },
    { id: "porcelanato", label: "Assentar Porcelanato (até 80x80)", unit: "m²", priceMin: 60, priceMax: 100 },
    { id: "porcelanato_grande", label: "Assentar Porcelanato Especial (> 80x80)", unit: "m²", priceMin: 90, priceMax: 150 },
    { id: "pintura_simples", label: "Pintura Parede (Lixamento + 2 demãos)", unit: "m²", priceMin: 20, priceMax: 40 },
    { id: "pintura_teto", label: "Pintura Teto", unit: "m²", priceMin: 25, priceMax: 50 },
    { id: "massa_corrida", label: "Aplicação de Massa Corrida (2 demãos)", unit: "m²", priceMin: 20, priceMax: 40 },
    { id: "alvenaria", label: "Levantar Parede (Tijolo/Bloco sem reboco)", unit: "m²", priceMin: 50, priceMax: 90 },
    { id: "reboco", label: "Reboco (Emboço + Reboco)", unit: "m²", priceMin: 35, priceMax: 60 },
    { id: "eletrica_ponto", label: "Elétrica (Instalação por Ponto - Tomada/Interruptor)", unit: "unid", priceMin: 40, priceMax: 100 },
    { id: "telhado", label: "Construção de Telhado (Madeiramento + Telha)", unit: "m²", priceMin: 120, priceMax: 200 },
];

const CalculadoraMaoDeObra = () => {
    const [serviceId, setServiceId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [result, setResult] = useState<{ min: number; max: number; unit: string } | null>(null);

    const resultRef = useRef<HTMLDivElement>(null);

    const calculate = () => {
        const qty = parseFloat(quantity);
        const service = SERVICES.find(s => s.id === serviceId);

        if (!qty || !service) return;

        const totalMin = qty * service.priceMin;
        const totalMax = qty * service.priceMax;

        setResult({
            min: totalMin,
            max: totalMax,
            unit: service.unit
        });

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const selectedService = SERVICES.find(s => s.id === serviceId);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Mão de Obra - Preço Estimado de Pedreiro"
                description="Descubra quanto custa a mão de obra para assentar piso, pintura, reboco e alvenaria. Estimativa de preços de pedreiros."
                url="https://suaobracerta.com.br/calculadora-mao-de-obra"
                keywords="preço mão de obra, quanto cobra pedreiro, custo metro quadrado pintura, valor assentamento porcelanato, tabela sinapi simplificada"
                schema={generateCalculatorSchema(
                    "Calculadora de Mão de Obra",
                    "Estime o custo de serviços de construção e reforma.",
                    "https://suaobracerta.com.br/calculadora-mao-de-obra"
                )}
            />
            <Header />

            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-labor-top" className="max-w-3xl mx-auto" /></div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-4xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-slate-700 rounded-xl p-3 text-white shadow-lg"><HardHat className="h-8 w-8" /></div>
                            <div>
                                <h1 className="leading-none text-3xl md:text-4xl text-foreground">Calculadora de Mão de Obra</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1">Estimativa de preços de serviços de pedreiro e pintor</p>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card mb-12">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Selecione o Serviço</Label>
                                    <Select value={serviceId} onValueChange={setServiceId}>
                                        <SelectTrigger className="h-12"><SelectValue placeholder="O que você vai fazer?" /></SelectTrigger>
                                        <SelectContent>
                                            {SERVICES.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Quantidade {selectedService ? `(${selectedService.unit})` : ""}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={quantity}
                                            onChange={e => setQuantity(e.target.value)}
                                            placeholder="Ex: 50"
                                            className="h-12 text-lg"
                                        />
                                        <span className="absolute right-3 top-3 text-muted-foreground text-sm font-medium">
                                            {selectedService?.unit || "unid"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={calculate} size="lg" className="w-full mt-6 font-bold bg-slate-700 hover:bg-slate-800 text-white h-14 text-lg">
                                <Wallet className="mr-2 h-5 w-5" /> CALCULAR CUSTO ESTIMADO
                            </Button>
                        </div>

                        {/* Results */}
                        {result && (
                            <div ref={resultRef} className="animate-fade-up space-y-6">
                                <div className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-black border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-lg text-center">
                                    <p className="text-lg text-muted-foreground mb-4 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                                        <Hammer className="h-5 w-5" /> Estimativa de Investimento
                                    </p>

                                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Mínimo Estimado</p>
                                            <p className="text-4xl font-bold text-slate-600 dark:text-slate-400">R$ {result.min.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                        <div className="hidden md:block w-px h-16 bg-slate-300 dark:bg-slate-700" />
                                        <div className="md:hidden w-16 h-px bg-slate-300 dark:bg-slate-700" />
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Máximo Estimado</p>
                                            <p className="text-4xl font-bold text-emerald-600">R$ {result.max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg text-sm text-left flex gap-3 items-start border border-yellow-200 dark:border-yellow-900">
                                        <AlertTriangle className="h-5 w-5 shrink-0" />
                                        <div>
                                            <p className="font-bold mb-1">Atenção: Valores de Referência</p>
                                            <p>
                                                Estes valores são baseados em médias de mercado para serviços avulsos. O preço real pode variar dependendo da região,
                                                qualidade do acabamento exigido, estado do imóvel e reputação do profissional.
                                                <br /><strong>Sempre solicite ao menos 3 orçamentos.</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <Button variant="outline" className="h-16 text-lg border-blue-200 hover:bg-blue-50 text-blue-700" asChild>
                                        <a href="#">
                                            <Briefcase className="mr-2 h-5 w-5" /> Encontrar Profissionais (Breve)
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="h-16 text-lg" asChild>
                                        <Link to="/checklist-vistoria">
                                            <Info className="mr-2 h-5 w-5" /> Ver Checklist de Obra
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CalculadoraMaoDeObra;
