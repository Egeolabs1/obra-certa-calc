import { useState } from "react";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { Zap, Calculator, ShoppingCart, ArrowLeft, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CalculadoraFios = () => {
    const [potencia, setPotencia] = useState("");
    const [tensao, setTensao] = useState("220");
    const [distancia, setDistancia] = useState("");

    const [resultado, setResultado] = useState<{ fio: string; disjuntor: string; amperagem: number } | null>(null);

    const calcular = () => {
        const w = parseFloat(potencia);
        const v = parseFloat(tensao);
        // Distância impacta na queda de tensão, simplificaremos por segurança recomendando um fio acima se > 20m.
        const dist = parseFloat(distancia) || 0;

        if (!w || !v) return;

        const amperes = w / v;

        // Tabela NBR 5410 (Simplificada para uso doméstico em eletroduto embutido - B1)
        // Amperagem Máxima do cabo:
        // 1.5mm -> 15.5A
        // 2.5mm -> 21A
        // 4.0mm -> 28A
        // 6.0mm -> 36A
        // 10mm -> 50A
        // 16mm -> 68A

        let fio = "2.5mm²";
        let disjuntor = "20A";

        // Lógica Fio
        if (amperes <= 15.5) { fio = "1.5mm² (Iluminação)"; disjuntor = "16A"; }
        else if (amperes <= 21) { fio = "2.5mm² (Tomadas)"; disjuntor = "20A"; }
        else if (amperes <= 28) { fio = "4.0mm² (Chuveiro peq.)"; disjuntor = "25A ou 32A"; }
        else if (amperes <= 36) { fio = "6.0mm² (Chuveiro std)"; disjuntor = "40A"; }
        else if (amperes <= 50) { fio = "10.0mm² (Chuveiro top)"; disjuntor = "50A"; }
        else { fio = "16.0mm² ou superior"; disjuntor = "63A+"; }

        // Queda de tensão
        if (dist > 25) {
            fio = `${fio} (Atenção: Aumente a bitola devido à distância!)`;
        }

        setResultado({
            fio,
            disjuntor,
            amperagem: Math.ceil(amperes * 10) / 10
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Fios Elétricos"
                description="Descubra a bitola de fio e o disjuntor ideal para chuveiros e tomadas. Cálculo baseado na NBR 5410."
                url="https://suaobracerta.com.br/calculadora-fios"
                schema={generateCalculatorSchema(
                    "Calculadora de Fios",
                    "Calcule a bitola de fios elétricos e disjuntores para sua instalação.",
                    "https://suaobracerta.com.br/calculadora-fios"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-fios" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-yellow-600 rounded-xl p-3 text-white"><Zap /></div>
                            <h1>Calculadora de Bitola de Fio</h1>
                        </div>

                        <div className="mb-6 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-1" />
                                <div className="text-sm text-justify">
                                    <strong>Aviso de Segurança:</strong> Esta calculadora fornece uma estimativa baseada em tabelas padrão (NBR 5410). Instalações elétricas variam muito (tipo de eletroduto, temperatura, agrupamento). <br />
                                    <strong>Sempre contrate um eletricista profissional</strong> para validar e executar o serviço. Risco de incêndio se mal dimensionado.
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="space-y-2">
                                <Label>Potência do Aparelho (Watts)</Label>
                                <Input type="number" value={potencia} onChange={e => setPotencia(e.target.value)} placeholder="Ex: 5500 (Chuveiro)" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tensão (Volts)</Label>
                                    <Select value={tensao} onValueChange={setTensao}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="127">127V (110V)</SelectItem>
                                            <SelectItem value="220">220V</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Distância Aprox. (m)</Label>
                                    <Input type="number" value={distancia} onChange={e => setDistancia(e.target.value)} placeholder="Do quadro até o aparelho" />
                                </div>
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR BITOLA</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="bg-gradient-result p-6 rounded-xl border-2 border-primary text-center">
                                        <p className="text-sm font-medium">Fio Recomendado</p>
                                        <p className="text-3xl font-extrabold text-primary my-2">{resultado.fio}</p>
                                        <p className="text-xs text-muted-foreground">Cabo Flexível 750V</p>
                                    </div>
                                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                                        <p className="text-sm font-medium">Disjuntor Sugerido</p>
                                        <p className="text-3xl font-extrabold text-foreground my-2">{resultado.disjuntor}</p>
                                        <p className="text-xs text-muted-foreground">Corrente calculada: {resultado.amperagem}A</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Button asChild variant="secondary" className="w-full" size="lg"><a href={affiliateLinks.electrical.wires} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2" /> COMPRAR FIOS SIL/CORFIO</a></Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                ⚡ Tabela de Referência (Simplificada)
                            </h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Baseado na capacidade de condução de corrente para cabos de cobre isolados em PVC (Eletroduto embutido).
                            </p>
                            <div className="rounded-lg border border-border overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-muted-foreground font-medium">
                                        <tr>
                                            <th className="p-3">Bitola (mm²)</th>
                                            <th className="p-3">Capacidade Aprox.</th>
                                            <th className="p-3">Uso Comum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        <tr className="bg-card"><td className="p-3">1.5mm²</td><td className="p-3">15.5A</td><td className="p-3">Iluminação</td></tr>
                                        <tr className="bg-card"><td className="p-3">2.5mm²</td><td className="p-3">21A</td><td className="p-3">Tomadas de uso geral</td></tr>
                                        <tr className="bg-card"><td className="p-3">4.0mm²</td><td className="p-3">28A</td><td className="p-3">Chuveiros (até 5500W/220V)</td></tr>
                                        <tr className="bg-card"><td className="p-3">6.0mm²</td><td className="p-3">36A</td><td className="p-3">Chuveiros Potentes</td></tr>
                                        <tr className="bg-card"><td className="p-3">10.0mm²</td><td className="p-3">50A</td><td className="p-3">Entrada de Energia</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-xs">
                                🛑 <strong>Importante:</strong> Esta tabela é apenas para referência rápida. Fatores como temperatura, agrupamento de cabos e distância influenciam o dimensionamento correto. Consulte sempre um eletricista.
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default CalculadoraFios;
