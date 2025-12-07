import { useState } from "react";
import { Zap, Calculator, ShoppingCart, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Aparelho {
    id: number;
    nome: string;
    potencia: number; // Watts
    horasDia: number;
    diasMes: number;
}

const APARELHOS_COMUNS = [
    { nome: "Ar Condicionado 9000 BTU", potencia: 1000 },
    { nome: "Chuveiro Elétrico", potencia: 5500 },
    { nome: "Geladeira", potencia: 250 }, // Média compressor ligado
    { nome: "TV LED 50", potencia: 120 },
    { nome: "Computador / Notebook", potencia: 100 },
    { nome: "Lâmpada LED", potencia: 9 },
    { nome: "Máquina de Lavar", potencia: 500 },
    { nome: "Ferro de Passar", potencia: 1000 },
];

const CalculadoraEnergia = () => {
    const [lista, setLista] = useState<Aparelho[]>([]);
    const [custoKwh, setCustoKwh] = useState("0.85");
    const [aparelhoSelecionado, setAparelhoSelecionado] = useState(APARELHOS_COMUNS[0].nome);
    const [horas, setHoras] = useState("8");

    const adicionarItem = () => {
        const ref = APARELHOS_COMUNS.find(Ap => Ap.nome === aparelhoSelecionado);
        if (ref) {
            const novo: Aparelho = {
                id: Date.now(),
                nome: ref.nome,
                potencia: ref.potencia,
                horasDia: parseFloat(horas),
                diasMes: 30
            };
            setLista([...lista, novo]);
        }
    };

    const removerItem = (id: number) => {
        setLista(lista.filter(i => i.id !== id));
    };

    const calcularTotal = () => {
        let kwhTotal = 0;
        lista.forEach(item => {
            // (Watts * Horas * Dias) / 1000 = kWh
            kwhTotal += (item.potencia * item.horasDia * item.diasMes) / 1000;
        });
        const custo = kwhTotal * parseFloat(custoKwh);
        return { kwh: kwhTotal.toFixed(1), custo: custo.toFixed(2) };
    };

    const totais = calcularTotal();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-energia" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-3xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-yellow-500 rounded-xl p-3 text-white"><Zap /></div>
                            <h1>Simulador de Conta de Luz</h1>
                        </div>

                        {/* Adicionar Item */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
                            <h3 className="font-semibold mb-4">Adicionar Aparelho</h3>
                            <div className="grid gap-4 sm:grid-cols-3 items-end">
                                <div className="space-y-2 sm:col-span-1">
                                    <Label>Aparelho</Label>
                                    <Select value={aparelhoSelecionado} onValueChange={setAparelhoSelecionado}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {APARELHOS_COMUNS.map(ap => <SelectItem key={ap.nome} value={ap.nome}>{ap.nome}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Horas de Uso / Dia</Label>
                                    <Input type="number" value={horas} onChange={e => setHoras(e.target.value)} />
                                </div>
                                <Button onClick={adicionarItem} className="w-full"><Plus className="mr-2 h-4 w-4" /> Adicionar</Button>
                            </div>
                        </div>

                        {/* Lista */}
                        {lista.length > 0 && (
                            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm mb-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Aparelho</TableHead>
                                            <TableHead>Potência</TableHead>
                                            <TableHead>Uso/Dia</TableHead>
                                            <TableHead className="text-right">Ação</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lista.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.nome}</TableCell>
                                                <TableCell>{item.potencia}W</TableCell>
                                                <TableCell>{item.horasDia}h</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => removerItem(item.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Config Custo */}
                        <div className="flex items-center justify-end gap-3 mb-6">
                            <Label>Custo do kWh (R$)</Label>
                            <Input value={custoKwh} onChange={e => setCustoKwh(e.target.value)} className="w-24 text-right" />
                        </div>

                        {/* Resultado */}
                        <div className="bg-gradient-result p-6 rounded-xl border-2 border-primary text-center">
                            <p className="text-muted-foreground">Consumo Mensal Estimado</p>
                            <div className="flex justify-center flex-wrap gap-8 my-4">
                                <div>
                                    <p className="text-4xl font-bold">{totais.kwh} kWh</p>
                                </div>
                                <div className="border-l border-border pl-8">
                                    <p className="text-4xl font-bold text-primary">R$ {totais.custo}</p>
                                </div>
                            </div>
                            <Button variant="secondary" className="w-full mt-2"><ShoppingCart className="mr-2" /> VER PRODUTOS QUE ECONOMIZAM ENERGIA</Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default CalculadoraEnergia;
