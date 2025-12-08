import { useState, useRef } from "react";
import { CalendarDays, ArrowLeft, Clock, Hammer, Paintbrush, HardHat, CheckCircle2, Calendar as CalendarIcon, FileDown } from "lucide-react";
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
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

type ObraType = "construcao" | "reforma_total" | "reforma_banheiro" | "reforma_cozinha";

interface Phase {
    name: string;
    description: string;
    icon: any;
    durationWeeks: number;
    startDate: Date;
    endDate: Date;
    color: string;
}

const CalculadoraCronograma = () => {
    const [tipo, setTipo] = useState<ObraType>("construcao");
    const [area, setArea] = useState("");
    const [dataInicio, setDataInicio] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [cronograma, setCronograma] = useState<Phase[] | null>(null);
    const [totalDuration, setTotalDuration] = useState(0);

    const resultRef = useRef<HTMLDivElement>(null);

    const calcularCronograma = () => {
        const areaNum = parseFloat(area);
        const start = new Date(dataInicio);

        if (!areaNum || !start) return;

        let phases: Phase[] = [];
        let totalWeeks = 0;

        // Base Logic (Simplified for MVP)
        // Construção: ~1.2 m² per day per team -> ~20 weeks for 100m² ? 
        // Let's use empirical rules: 100m² house = ~6 months (24 weeks). ~0.24 weeks per m².

        let weeksPerSqm = 0.25;
        if (tipo === "reforma_total") weeksPerSqm = 0.15;
        if (tipo === "reforma_banheiro" || tipo === "reforma_cozinha") weeksPerSqm = 0.5; // High density work

        // Adjust for fixed minimums
        let estimatedWeeks = Math.ceil(areaNum * weeksPerSqm);
        if (tipo === "construcao" && estimatedWeeks < 12) estimatedWeeks = 12; // Min 3 months
        if (tipo === "reforma_total" && estimatedWeeks < 4) estimatedWeeks = 4;

        if (tipo === "construcao") {
            // Distribution: 
            // 1. Projects/Preliminaries: 10%
            // 2. Foundation/Structure: 25%
            // 3. Walls/Roof: 20%
            // 4. Electrical/Hydraulic: 15%
            // 5. Finishing/Floors: 25%
            // 6. Delivery: 5%

            const p1 = Math.max(2, Math.round(estimatedWeeks * 0.10));
            const p2 = Math.max(3, Math.round(estimatedWeeks * 0.25));
            const p3 = Math.max(3, Math.round(estimatedWeeks * 0.20));
            const p4 = Math.max(2, Math.round(estimatedWeeks * 0.15));
            const p5 = Math.max(3, Math.round(estimatedWeeks * 0.25));
            const p6 = 1;

            totalWeeks = p1 + p2 + p3 + p4 + p5 + p6;

            let current = start;

            const addPhase = (name: string, desc: string, icon: any, w: number, color: string) => {
                const end = addDays(current, w * 7);
                phases.push({
                    name,
                    description: desc,
                    icon,
                    durationWeeks: w,
                    startDate: current,
                    endDate: end,
                    color
                });
                current = end;
            };

            addPhase("Planejamento e Projetos", "Projetos arquitetônico, estrutural, licenças na prefeitura e limpeza do terreno.", FileDown, p1, "bg-blue-500");
            addPhase("Fundação e Estrutura", "Escavação, baldrames, concretagem de lajes e pilares.", HardHat, p2, "bg-orange-500");
            addPhase("Alvenaria e Cobertura", "Levantamento de paredes, reboco e instalação do telhado.", Hammer, p3, "bg-yellow-500");
            addPhase("Instalações", "Elétrica, hidráulica, esgoto e tubulações de ar.", Clock, p4, "bg-purple-500");
            addPhase("Acabamentos", "Pisos, revestimentos, pintura, gesso e vidros.", Paintbrush, p5, "bg-teal-500");
            addPhase("Limpeza e Entrega", "Limpeza fina, testes finais e mudança.", CheckCircle2, p6, "bg-green-500");

        } else if (tipo === "reforma_total") {
            // Simpler logic for Reform
            const p1 = Math.max(1, Math.round(estimatedWeeks * 0.15)); // Demo
            const p2 = Math.max(2, Math.round(estimatedWeeks * 0.25)); // Infra
            const p3 = Math.max(2, Math.round(estimatedWeeks * 0.40)); // Finishing
            const p4 = 1; // Cleanup

            totalWeeks = p1 + p2 + p3 + p4;
            let current = start;

            phases.push({ name: "Demolição e Retirada", description: "Quebra-quebra e remoção de entulho.", icon: Hammer, durationWeeks: p1, startDate: current, endDate: addDays(current, p1 * 7), color: "bg-red-500" });
            current = addDays(current, p1 * 7);

            phases.push({ name: "Infraestrutura", description: "Novos pontos de elétrica, hidráulica e regularização.", icon: HardHat, durationWeeks: p2, startDate: current, endDate: addDays(current, p2 * 7), color: "bg-orange-500" });
            current = addDays(current, p2 * 7);

            phases.push({ name: "Acabamentos", description: "Pisos, pintura, gesso e marcenaria.", icon: Paintbrush, durationWeeks: p3, startDate: current, endDate: addDays(current, p3 * 7), color: "bg-teal-500" });
            current = addDays(current, p3 * 7);

            phases.push({ name: "Entrega", description: "Limpeza final.", icon: CheckCircle2, durationWeeks: p4, startDate: current, endDate: addDays(current, p4 * 7), color: "bg-green-500" });
        } else {
            // Small reforms
            totalWeeks = 3;
            phases.push({ name: "Reforma Rápida", description: "Execução direta da reforma.", icon: Hammer, durationWeeks: 3, startDate: start, endDate: addDays(start, 21), color: "bg-blue-500" });
        }

        setCronograma(phases);
        setTotalDuration(totalWeeks);

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background print:bg-white">
            <SEO
                title="Gerador de Cronograma de Obra Grátis"
                description="Crie um cronograma físico-financeiro estimado para sua construção ou reforma. Organize as etapas da sua obra."
                url="https://suaobracerta.com.br/calculadora-cronograma"
                keywords="cronograma obra, planejamento construção, etapas da obra, tempo de obra, gerenciamento obra"
                schema={generateCalculatorSchema(
                    "Gerador de Cronograma",
                    "Estime o tempo e as etapas da sua obra.",
                    "https://suaobracerta.com.br/calculadora-cronograma"
                )}
            />
            <div className="print:hidden"><Header /></div>

            <main className="flex-1">
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-cronograma-top" className="max-w-3xl mx-auto" /></div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-4xl">
                        <Link to="/" className="print:hidden mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-orange-600 rounded-xl p-3 text-white shadow-lg print:bg-transparent print:text-black print:p-0 print:shadow-none"><CalendarDays className="h-8 w-8" /></div>
                            <div>
                                <h1 className="leading-none text-3xl md:text-4xl text-foreground">Gerador de Cronograma</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1 print:hidden">Planeje as etapas e o tempo da sua obra</p>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card mb-12 print:hidden">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Tipo de Obra</Label>
                                    <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="construcao">Construção Completa (Do Zero)</SelectItem>
                                            <SelectItem value="reforma_total">Reforma Total (Apto/Casa)</SelectItem>
                                            <SelectItem value="reforma_banheiro">Reforma Banheiro/Cozinha</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Área Aproximada (m²)</Label>
                                    <Input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 80" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Data de Início</Label>
                                    <Input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                                </div>
                            </div>
                            <Button onClick={calcularCronograma} size="lg" className="w-full mt-6 font-bold bg-orange-600 hover:bg-orange-700 text-white">
                                <CalendarIcon className="mr-2 h-5 w-5" /> GERAR CRONOGRAMA
                            </Button>
                        </div>

                        {/* Results */}
                        {cronograma && (
                            <div ref={resultRef} className="animate-fade-up">
                                <AlertBox duration={totalDuration} />

                                <div className="relative border-l-4 border-muted ml-4 md:ml-8 space-y-8 py-4">
                                    {cronograma.map((phase, idx) => (
                                        <div key={idx} className="relative pl-8 md:pl-12">
                                            {/* Dot */}
                                            <div className={`absolute -left-[14px] top-6 h-6 w-6 rounded-full border-4 border-background ${phase.color}`} />

                                            <Card className="hover:shadow-md transition-shadow">
                                                <CardHeader className="pb-3">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-2 rounded-lg bg-opacity-10 ${phase.color.replace('bg-', 'bg-opacity-10 text-')}`}>
                                                                <phase.icon className={`h-5 w-5 ${phase.color.replace('bg-', 'text-')}`} />
                                                            </div>
                                                            <CardTitle className="text-lg">{phase.name}</CardTitle>
                                                        </div>
                                                        <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full whitespace-nowrap">
                                                            {phase.durationWeeks} Semanas
                                                        </div>
                                                    </div>
                                                    <CardDescription>{phase.description}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-semibold text-foreground">Início:</span> {format(phase.startDate, 'dd/MM/yyyy')}
                                                        </div>
                                                        <div className="w-px h-4 bg-border" />
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-semibold text-foreground">Fim:</span> {format(phase.endDate, 'dd/MM/yyyy')}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-center print:hidden">
                                    <Button onClick={handlePrint} variant="outline" className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50">
                                        <FileDown className="h-4 w-4" /> Imprimir Cronograma
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <div className="print:hidden"><Footer /></div>
        </div>
    );
};

// Helper simple components
const AlertBox = ({ duration }: { duration: number }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
            <h3 className="font-bold text-blue-800">Tempo Total Estimado: {duration} Semanas (~{Math.round(duration / 4.3)} Meses)</h3>
            <p className="text-sm text-blue-600">
                Esta é uma estimativa baseada em médias de mercado. O tempo real pode variar conforme a disponibilidade de mão de obra,
                chuvas e fluxo financeiro.
            </p>
        </div>
    </div>
);

export default CalculadoraCronograma;
