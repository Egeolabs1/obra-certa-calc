import { useState, useRef } from "react";
import { CalendarDays, ArrowLeft, Clock, Hammer, Paintbrush, HardHat, CheckCircle2, Calendar as CalendarIcon, Printer, FileDown } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import PrintHeader from "@/components/PrintHeader";
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
    icon: React.ElementType;
    durationWeeks: number;
    startDate: Date;
    endDate: Date;
    color: string;
}

// ... imports remain the same

// ... types remain the same

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

        const phases: Phase[] = [];
        let totalWeeks = 0;

        // Common addPhase helper
        let current = start;
        const addPhase = (name: string, desc: string, icon: React.ElementType, w: number, color: string) => {
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

        if (tipo === "construcao") {
            // Rule of thumb: ~0.25 weeks per sqm for full construction
            let estimatedWeeks = Math.ceil(areaNum * 0.25);
            if (estimatedWeeks < 12) estimatedWeeks = 12; // Min 3 months

            const p1 = Math.max(2, Math.round(estimatedWeeks * 0.10)); // Planning
            const p2 = Math.max(3, Math.round(estimatedWeeks * 0.25)); // Foundation
            const p3 = Math.max(3, Math.round(estimatedWeeks * 0.20)); // Walls/Roof
            const p4 = Math.max(2, Math.round(estimatedWeeks * 0.15)); // Installations
            const p5 = Math.max(3, Math.round(estimatedWeeks * 0.25)); // Finishing
            const p6 = 1; // Delivery

            totalWeeks = p1 + p2 + p3 + p4 + p5 + p6;

            addPhase("Planejamento e Projetos", "Projetos, licenças e preparação do terreno.", FileDown, p1, "bg-blue-500");
            addPhase("Fundação e Estrutura", "Escavação, baldrames, lajes e pilares.", HardHat, p2, "bg-orange-500");
            addPhase("Alvenaria e Cobertura", "Paredes, reboco e telhado.", Hammer, p3, "bg-yellow-500");
            addPhase("Instalações", "Elétrica, hidráulica e esgoto.", Clock, p4, "bg-purple-500");
            addPhase("Acabamentos", "Pisos, pintura, louças e metais.", Paintbrush, p5, "bg-teal-500");
            addPhase("Limpeza e Entrega", "Limpeza fina e vistoria.", CheckCircle2, p6, "bg-green-500");

        } else if (tipo === "reforma_total") {
            // Rule of thumb: ~0.15 weeks per sqm for total reform
            let estimatedWeeks = Math.ceil(areaNum * 0.15);
            if (estimatedWeeks < 4) estimatedWeeks = 4;

            const p1 = Math.max(1, Math.round(estimatedWeeks * 0.15)); // Demo
            const p2 = Math.max(2, Math.round(estimatedWeeks * 0.25)); // Infra
            const p3 = Math.max(2, Math.round(estimatedWeeks * 0.50)); // Finishing
            const p4 = 1; // Delivery

            totalWeeks = p1 + p2 + p3 + p4;

            addPhase("Demolição", "Retirada de pisos, quebra de paredes e entulho.", Hammer, p1, "bg-red-500");
            addPhase("Infraestrutura", "Novos pontos de elétrica, hidráulica e regularização.", HardHat, p2, "bg-orange-500");
            addPhase("Acabamentos", "Pisos, revestimentos, pintura e gesso.", Paintbrush, p3, "bg-teal-500");
            addPhase("Entrega", "Limpeza e retoques finais.", CheckCircle2, p4, "bg-green-500");

        } else {
            // Reforms (Bathroom/Kitchen) - Higher density, explicit phases
            // Base duration on complexity, not just area (though area helps)
            // Small bath (<4m²): ~3 weeks. Large bath/Kitchen (>8m²): ~5-6 weeks.

            let baseDuration = 3;
            if (areaNum > 5) baseDuration = 4;
            if (areaNum > 10) baseDuration = 6;

            const p1 = 1; // Demo (usually 1 week is enough for a room)
            const p2 = Math.ceil(baseDuration * 0.3); // Infra (pipes, waterproofing)
            const p3 = Math.ceil(baseDuration * 0.5); // Tiling/Finishing
            const p4 = 1; // Paint/Installations

            totalWeeks = p1 + p2 + p3 + p4;

            addPhase("Demolição e Retirada", "Remoção de louças, bancadas e revestimentos antigos.", Hammer, p1, "bg-red-500");
            addPhase("Infra e Impermeabilização", "Adequação de encanamento, elétrica e impermeabilização (box).", HardHat, p2, "bg-orange-500");
            addPhase("Revestimentos", "Assentamento de piso, azulejos e rejunte.", Paintbrush, p3, "bg-teal-500");
            addPhase("Finalização", "Pintura teto, instalação de louças, metais e luminárias.", CheckCircle2, p4, "bg-green-500");
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
                description="Planeje sua obra com nosso gerador de cronograma físico-financeiro. Ideal para construções e reformas."
                url="https://suaobracerta.com.br/calculadora-cronograma"
                keywords="cronograma obra, planejamento construção, etapas reforma, cronograma reforma banheiro"
                schema={generateCalculatorSchema(
                    "Gerador de Cronograma",
                    "Estime o tempo e as etapas da sua obra com precisão.",
                    "https://suaobracerta.com.br/calculadora-cronograma",
                    "https://suaobracerta.com.br/og-image.png",
                    "UtilitiesApplication"
                )}
            />
            <div className="print:hidden"><Header /></div>

            <main className="flex-1">
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-cronograma-top" className="max-w-3xl mx-auto" /></div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-4xl">
                        <Link to="/" className="print:hidden mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-orange-600 rounded-xl p-3 text-white shadow-lg print:bg-transparent print:text-orange-600 print:p-0 print:shadow-none"><CalendarDays className="h-8 w-8" /></div>
                            <div>
                                <h1 className="leading-none text-3xl md:text-4xl text-foreground">Gerador de Cronograma</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1 print:hidden">Planejamento profissional para sua obra</p>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card mb-12 print:hidden">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Tipo de Obra</Label>
                                    <Select value={tipo} onValueChange={(v) => setTipo(v as ObraType)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="construcao">Construção Completa</SelectItem>
                                            <SelectItem value="reforma_total">Reforma Geral (Apto/Casa)</SelectItem>
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
                            <Button onClick={calcularCronograma} size="lg" className="w-full mt-6 font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20">
                                <CalendarIcon className="mr-2 h-5 w-5" /> GERAR CRONOGRAMA
                            </Button>
                        </div>

                        {/* Results */}
                        {cronograma && (
                            <div ref={resultRef} className="animate-fade-up">
                                {/* ---------------- SCREEN VIEW (Interactive) ---------------- */}
                                <div className="print:hidden">
                                    <PrintHeader />
                                    <AlertBox duration={totalDuration} />

                                    {/* Timeline Visualization */}
                                    <div className="relative ml-4 md:ml-6 space-y-0 py-4">
                                        {/* Continuous Vertical Line */}
                                        <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-border" />

                                        {cronograma.map((phase, idx) => (
                                            <div key={idx} className="relative pl-12 md:pl-16 pb-8">
                                                {/* Dot */}
                                                <div className={`absolute left-[9px] top-6 h-6 w-6 rounded-full border-4 border-background ${phase.color} z-10`} />

                                                <Card className="hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-orange-500">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2.5 rounded-lg ${phase.color.replace('bg-', 'bg-opacity-10 text-')}`}>
                                                                    <phase.icon className={`h-5 w-5 ${phase.color.replace('bg-', 'text-')}`} />
                                                                </div>
                                                                <div>
                                                                    <CardTitle className="text-lg font-bold">{phase.name}</CardTitle>
                                                                    <CardDescription className="line-clamp-2 md:line-clamp-none">{phase.description}</CardDescription>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm font-bold bg-orange-50 text-orange-700 px-3 py-1 rounded-full whitespace-nowrap border border-orange-100">
                                                                {phase.durationWeeks} Semanas
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                                            <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-md shadow-sm border">
                                                                <span className="font-semibold text-foreground">Início:</span> {format(phase.startDate, 'dd MMM yyyy', { locale: ptBR })}
                                                            </div>
                                                            <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground/50 hidden md:block" />
                                                            <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-md shadow-sm border">
                                                                <span className="font-semibold text-foreground">Fim:</span> {format(phase.endDate, 'dd MMM yyyy', { locale: ptBR })}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex justify-center">
                                        <Button onClick={handlePrint} size="lg" variant="outline" className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 font-bold">
                                            <Printer className="h-5 w-5" /> Salvar em PDF
                                        </Button>
                                    </div>
                                </div>

                                {/* ---------------- PRINT VIEW (PDF) ---------------- */}
                                <div className="hidden print:block p-8 bg-white text-black max-w-[210mm] mx-auto">
                                    {/* Header */}
                                    <div className="border-b-2 border-orange-500 pb-4 mb-6 flex justify-between items-end">
                                        <div>
                                            <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900">Cronograma de Obra</h1>
                                            <p className="text-sm text-slate-500">Estimativa Físico-Financeira</p>
                                        </div>
                                        <div className="text-right text-sm">
                                            <p><strong>Emissão:</strong> {format(new Date(), "dd/MM/yyyy")}</p>
                                            <p className="text-slate-500">SuaObraCerta.com.br</p>
                                        </div>
                                    </div>

                                    {/* Project Info */}
                                    <div className="bg-slate-50 border rounded-lg p-4 mb-8 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="block text-xs uppercase text-slate-500 font-bold">Tipo de Obra</span>
                                            <span className="font-medium text-lg">
                                                {tipo === "construcao" ? "Construção Completa" :
                                                    tipo === "reforma_total" ? "Reforma Geral" : "Reforma Banheiro/Cozinha"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase text-slate-500 font-bold">Área Total</span>
                                            <span className="font-medium text-lg">{area} m²</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase text-slate-500 font-bold">Início Previsto</span>
                                            <span className="font-medium">{format(new Date(dataInicio), "dd/MM/yyyy")}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase text-slate-500 font-bold">Duração Total Estimada</span>
                                            <span className="font-medium text-orange-700">{totalDuration} Semanas</span>
                                        </div>
                                    </div>

                                    {/* Timeline Table */}
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="border-b-2 border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
                                                <th className="py-2 pl-2">Etapa</th>
                                                <th className="py-2">Atividades / Descrição</th>
                                                <th className="py-2 text-center">Duração</th>
                                                <th className="py-2 text-right pr-2">Período</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {cronograma.map((phase, idx) => (
                                                <tr key={idx} className="break-inside-avoid">
                                                    <td className="py-3 pl-2 font-bold text-slate-900 align-top w-1/4">
                                                        {idx + 1}. {phase.name}
                                                    </td>
                                                    <td className="py-3 text-slate-600 align-top">
                                                        {phase.description}
                                                    </td>
                                                    <td className="py-3 text-center font-medium text-orange-700 align-top whitespace-nowrap">
                                                        {phase.durationWeeks} Semanas
                                                    </td>
                                                    <td className="py-3 text-right pr-2 text-slate-500 align-top whitespace-nowrap text-xs">
                                                        <div>{format(phase.startDate, "dd/MM")} a {format(phase.endDate, "dd/MM/yyyy")}</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Disclaimer */}
                                    <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400 text-justify">
                                        <p><strong>Nota Importante:</strong> Este cronograma é uma estimativa baseada em índices médios de produtividade da construção civil. Prazos reais podem variar devido a chuvas, atrasos na entrega de materiais, disponibilidade de mão de obra e imprevistos técnicos. Utilize este documento como referência inicial para seu planejamento.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Explicação Metodologia */}
                        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6 md:p-8 animate-fade-up print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                📊 Como este cronograma é calculado?
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    Este gerador utiliza índices de produtividade padrão da construção civil para estimar a duração de cada etapa.
                                </p>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-foreground">Fatores Considerados:</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Área total da construção (m²)</li>
                                            <li>Complexidade média (Residencial padrão)</li>
                                            <li>Equipe padrão (2 pedreiros + 2 ajudantes)</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-foreground">Etapas Incluídas:</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Planejamento e Fundação</li>
                                            <li>Alvenaria e Estrutura</li>
                                            <li>Instalações (Elétrica/Hidráulica)</li>
                                            <li>Acabamentos e Pintura</li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="text-xs italic border-t pt-4 mt-2">
                                    Nota: O tempo real pode variar dependendo das condições climáticas, disponibilidade de materiais e tamanho da equipe contratada. Use este cronograma como uma referência inicial.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="print:hidden"><Footer /></div>
        </div>
    );
};

// ... AlertBox remains mostly the same, just refined styling
const AlertBox = ({ duration }: { duration: number }) => (
    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl p-5 mb-8 flex items-start gap-4 shadow-sm print:border-gray-300 print:bg-white">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
            <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">Estimativa Total: {duration} Semanas (~{Math.round(duration / 4.3)} Meses)</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed mt-1">
                Este cronograma é uma previsão baseada em índices médios de produtividade. <br className="hidden md:inline" />
                Fatores como chuvas, atraso de entrega de material e equipe reduzida podem alterar o prazo final.
            </p>
        </div>
    </div>
);

export default CalculadoraCronograma;
