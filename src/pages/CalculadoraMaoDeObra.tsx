import { useState, useRef, useEffect } from "react";
import { HardHat, ArrowLeft, Wallet, AlertTriangle, Hammer, Briefcase, Info, Plus, Trash2, Paintbrush, BrickWall, Plug, Droplets, LayoutTemplate } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { toast } from "sonner";
import { useOrcamento } from "@/context/OrcamentoContext";

// --- Data & Types ---

type Unit = "m²" | "unid" | "ml";

interface ServiceItem {
    id: string;
    label: string;
    unit: Unit;
    priceMin: number;
    priceMax: number;
    description?: string;
}

interface ServiceCategory {
    id: string;
    label: string;
    icon: React.ElementType;
    items: ServiceItem[];
}

interface BudgetLineItem extends ServiceItem {
    quantity: number;
    totalMin: number;
    totalMax: number;
}

const CATEGORIES: ServiceCategory[] = [
    {
        id: "alvenaria",
        label: "Alvenaria e Estrutura",
        icon: BrickWall,
        items: [
            { id: "demolicao_piso", label: "Demolição de Piso", unit: "m²", priceMin: 20, priceMax: 35 },
            { id: "demolicao_parede", label: "Demolição de Parede", unit: "m²", priceMin: 30, priceMax: 50 },
            { id: "alvenaria_bloco", label: "Levantar Parede (Bloco)", unit: "m²", priceMin: 50, priceMax: 80 },
            { id: "contrapiso", label: "Contrapiso (Regularização)", unit: "m²", priceMin: 30, priceMax: 55 },
            { id: "reboco", label: "Reboco Completo", unit: "m²", priceMin: 40, priceMax: 65 },
        ]
    },
    {
        id: "acabamentos",
        label: "Pisos e Revestimentos",
        icon: LayoutTemplate,
        items: [
            { id: "ceramica", label: "Piso Cerâmico Comum", unit: "m²", priceMin: 45, priceMax: 70 },
            { id: "porcelanato", label: "Porcelanato (até 80cm)", unit: "m²", priceMin: 70, priceMax: 100 },
            { id: "porcelanato_g", label: "Porcelanato Grande (>80cm)", unit: "m²", priceMin: 100, priceMax: 160 },
            { id: "azulejo", label: "Azulejo de Parede", unit: "m²", priceMin: 50, priceMax: 80 },
            { id: "rodape", label: "Rodapé (Instalação)", unit: "ml", priceMin: 15, priceMax: 25 },
        ]
    },
    {
        id: "pintura",
        label: "Pintura",
        icon: Paintbrush,
        items: [
            { id: "pintura_parede", label: "Pintura Parede (2 demãos)", unit: "m²", priceMin: 20, priceMax: 35 },
            { id: "massa", label: "Massa Corrida (Aplicação)", unit: "m²", priceMin: 20, priceMax: 35 },
            { id: "pintura_teto", label: "Pintura Teto", unit: "m²", priceMin: 25, priceMax: 45 },
            { id: "pintura_porta", label: "Pintura Porta/Janela", unit: "unid", priceMin: 80, priceMax: 150 },
        ]
    },
    {
        id: "eletrica",
        label: "Elétrica e Hidráulica",
        icon: Plug,
        items: [
            { id: "ponto_eletrica", label: "Ponto Elétrico (Tomada/Luz)", unit: "unid", priceMin: 50, priceMax: 90 },
            { id: "quadro", label: "Instalação Quadro Disjuntores", unit: "unid", priceMin: 300, priceMax: 600 },
            { id: "luminaria", label: "Instalação Luminária/Lustre", unit: "unid", priceMin: 40, priceMax: 120 },
            { id: "ponto_hidraulica", label: "Ponto Hidráulico (Água/Esgoto)", unit: "unid", priceMin: 80, priceMax: 150 },
            { id: "loucas", label: "Instalação Vaso/Pia", unit: "unid", priceMin: 100, priceMax: 200 },
        ]
    }
];

const CalculadoraMaoDeObra = () => {
    const { addItem } = useOrcamento();
    // Multipliers
    const [finishLevel, setFinishLevel] = useState("1.0"); // 1.0 = Standard, 1.4 = High 
    const [region, setRegion] = useState("1.0"); // 1.0 = Capital, 0.85 = Interior, 1.1 = Coastal

    // Listing
    const [budgetList, setBudgetList] = useState<BudgetLineItem[]>([]);

    // Form Inputs
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[1].id); // Default to Pisos
    const [quantity, setQuantity] = useState("");
    const [selectedServiceId, setSelectedServiceId] = useState("");

    const resultRef = useRef<HTMLDivElement>(null);

    // Initial load check
    useEffect(() => {
        // Load from local storage? For MVP maybe not needed, but good for UX.
    }, []);

    const addToBudget = () => {
        const qtyNum = parseFloat(quantity);
        if (!qtyNum || qtyNum <= 0) {
            toast.error("Digite uma quantidade válida");
            return;
        }

        const category = CATEGORIES.find(c => c.items.some(i => i.id === selectedServiceId));
        const service = category?.items.find(i => i.id === selectedServiceId);

        if (!service) return;

        // Apply Multipliers
        const multiplier = parseFloat(finishLevel) * parseFloat(region);

        const adjustedMin = service.priceMin * multiplier;
        const adjustedMax = service.priceMax * multiplier;

        const newItem: BudgetLineItem = {
            ...service,
            priceMin: adjustedMin,
            priceMax: adjustedMax,
            quantity: qtyNum,
            totalMin: adjustedMin * qtyNum,
            totalMax: adjustedMax * qtyNum
        };

        setBudgetList(prev => [...prev, newItem]);
        setQuantity("");
        toast.success("Item adicionado ao orçamento!");

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    };

    const removeItem = (index: number) => {
        setBudgetList(prev => prev.filter((_, i) => i !== index));
    };

    const grandTotalMin = budgetList.reduce((acc, item) => acc + item.totalMin, 0);
    const grandTotalMax = budgetList.reduce((acc, item) => acc + item.totalMax, 0);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Mão de Obra e Pedreiro (2025)"
                description="Orçamento completo de mão de obra para construção e reforma. Preços atualizados de pedreiro, pintor, eletricista e encanador."
                url="https://suaobracerta.com.br/calculadora-mao-de-obra"
                keywords="preço mão de obra, tabela sinapi 2025, diaria pedreiro, custo reforma banheiro, orçamento obra online"
                schema={generateCalculatorSchema(
                    "Calculadora de Mão de Obra",
                    "Orçamento detalhado para serviços de construção civil.",
                    "https://suaobracerta.com.br/calculadora-mao-de-obra"
                )}
            />
            <Header />

            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-labor-top" className="max-w-3xl mx-auto" /></div>

                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-5xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-slate-800 rounded-xl p-3 text-white shadow-lg"><HardHat className="h-8 w-8" /></div>
                            <div>
                                <h1 className="leading-none text-3xl md:text-4xl text-foreground">Calculadora de Mão de Obra</h1>
                                <p className="text-sm font-normal text-muted-foreground mt-1">Crie um orçamento completo para sua reforma</p>
                            </div>
                        </div>

                        {/* Settings & Add Section */}
                        <div className="grid gap-8 lg:grid-cols-3 mb-12">
                            {/* Left Column: Config & Selection */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* 1. Settings */}
                                <Card>
                                    <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><Briefcase className="h-4 w-4" /> Configuração da Obra</CardTitle></CardHeader>
                                    <CardContent className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Padrão de Acabamento</Label>
                                            <Select value={finishLevel} onValueChange={setFinishLevel}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1.0">Padrão / Popular</SelectItem>
                                                    <SelectItem value="1.4">Alto Padrão (Porcelanato/Detalhes)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Região</Label>
                                            <Select value={region} onValueChange={setRegion}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1.0">Capital / Metropolitana</SelectItem>
                                                    <SelectItem value="0.85">Interior / Cidade Pequena</SelectItem>
                                                    <SelectItem value="1.15">Litoral / Turística</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 2. Service Selection */}
                                <Card className="border-slate-300 dark:border-slate-700 shadow-md">
                                    <CardHeader>
                                        <CardTitle>Adicionar Serviços</CardTitle>
                                        <CardDescription>Escolha a categoria e o serviço para adicionar à lista.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                                            <TabsList className="grid grid-cols-4 w-full h-auto">
                                                {CATEGORIES.map(cat => (
                                                    <TabsTrigger key={cat.id} value={cat.id} className="flex flex-col gap-1 py-3 text-xs md:text-sm">
                                                        <cat.icon className="h-5 w-5 mb-1" />
                                                        <span className="hidden md:inline">{cat.label}</span>
                                                        <span className="md:hidden">{cat.label.split(' ')[0]}</span>
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>

                                            {CATEGORIES.map(cat => (
                                                <TabsContent key={cat.id} value={cat.id} className="mt-4 animate-in fade-in slide-in-from-left-2">
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        {cat.items.map(item => (
                                                            <div
                                                                key={item.id}
                                                                onClick={() => setSelectedServiceId(item.id)}
                                                                className={`cursor-pointer rounded-lg border p-4 transition-all hover:bg-muted ${selectedServiceId === item.id ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-border'}`}
                                                            >
                                                                <div className="font-semibold">{item.label}</div>
                                                                <div className="text-sm text-muted-foreground mt-1 flex justify-between">
                                                                    <span>Preço Base:</span>
                                                                    <Badge variant="secondary" className="font-normal">R$ {item.priceMin} - {item.priceMax} / {item.unit}</Badge>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TabsContent>
                                            ))}
                                        </Tabs>

                                        <div className="flex items-end gap-4 border-t pt-6">
                                            <div className="flex-1 space-y-2">
                                                <Label>Quantidade</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        value={quantity}
                                                        onChange={e => setQuantity(e.target.value)}
                                                        className="h-12 text-lg"
                                                    />
                                                    <div className="absolute right-3 top-3 text-sm text-muted-foreground font-medium uppercase">
                                                        {CATEGORIES.flatMap(c => c.items).find(i => i.id === selectedServiceId)?.unit || 'UNID'}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={addToBudget}
                                                disabled={!selectedServiceId}
                                                size="lg"
                                                className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8"
                                            >
                                                <Plus className="mr-2 h-5 w-5" /> Adicionar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column: Calculations Summary (Sticky) */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 space-y-6">
                                    {/* Grand Total Card */}
                                    <Card className="bg-slate-900 border-slate-800 text-white shadow-xl overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-3 opacity-10"><Wallet className="h-24 w-24" /></div>
                                        <CardHeader>
                                            <CardDescription className="text-slate-300">Estimativa Total (Mão de Obra)</CardDescription>
                                            <CardTitle className="text-3xl font-bold tracking-tight text-white mb-1">
                                                R$ {grandTotalMin.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} a {grandTotalMax.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                            </CardTitle>
                                            <div className="text-xs text-slate-400 font-medium bg-slate-800/50 p-2 rounded inline-block">
                                                {budgetList.length} itens adicionados
                                            </div>
                                        </CardHeader>
                                    </Card>

                                    <div className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-xl text-sm border border-yellow-200 dark:border-yellow-900 shadow-sm">
                                        <div className="flex gap-2 items-start font-medium mb-2"><AlertTriangle className="h-4 w-4 mt-0.5" /> Importante</div>
                                        Valores estimados para referência. Sempre solicite 3 orçamentos reais. Materiais não inclusos.
                                    </div>

                                    <Button variant="outline" className="w-full h-12 border-blue-200 text-blue-700 hover:bg-blue-50" asChild>
                                        <a href={affiliateLinks.services.findProfessional} target="_blank" rel="noopener noreferrer">
                                            <Briefcase className="mr-2 h-4 w-4" /> Encontrar Profissionais
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* List Results Table */}
                        {budgetList.length > 0 && (
                            <div ref={resultRef} className="animate-fade-up bg-card rounded-xl border shadow-sm overflow-hidden">
                                <div className="p-6 border-b bg-muted/30 flex justify-between items-center">
                                    <h2 className="font-bold text-xl flex items-center gap-2"><Hammer className="h-5 w-5" /> Lista de Serviços</h2>
                                    <Button
                                        onClick={() => {
                                            budgetList.forEach(item => {
                                                addItem({
                                                    id: crypto.randomUUID(),
                                                    name: item.label,
                                                    description: `Mão de Obra: ${item.quantity} ${item.unit} (${item.priceMin}-${item.priceMax}/${item.unit})`,
                                                    quantity: item.quantity,
                                                    unit: item.unit,
                                                    category: "Mão de Obra",
                                                    estimatedPrice: (item.totalMin + item.totalMax) / 2
                                                });
                                            });
                                            toast.success("Todos os itens foram adicionados ao seu Orçamento Geral!");
                                        }}
                                        variant="default"
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                    >
                                        <Wallet className="mr-2 h-4 w-4" /> Enviar para Orçamento Geral
                                    </Button>
                                </div>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[40%]">Serviço</TableHead>
                                                <TableHead>Qtd.</TableHead>
                                                <TableHead>Unitário (Médio)</TableHead>
                                                <TableHead>Total Estimado</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {budgetList.map((item, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="font-medium">
                                                        {item.label}
                                                        <div className="text-xs text-muted-foreground mt-0.5 md:hidden">
                                                            {item.quantity} {item.unit}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {item.quantity} <span className="text-xs text-muted-foreground">{item.unit}</span>
                                                    </TableCell>
                                                    <TableCell className="md:table-cell hidden text-sm text-muted-foreground">
                                                        R$ {Math.round((item.priceMin + item.priceMax) / 2).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="font-bold text-slate-700 dark:text-slate-300">
                                                        R$ {item.totalMin.toLocaleString()} - {item.totalMax.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="bg-muted/50 font-bold">
                                                <TableCell colSpan={3} className="text-right uppercase text-xs tracking-wider">Total Estimado</TableCell>
                                                <TableCell className="text-lg text-emerald-600">
                                                    R$ {grandTotalMin.toLocaleString()} - {grandTotalMax.toLocaleString()}
                                                </TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}

                        <div ref={resultRef}>{/* Scroll Anchor if list is empty, though logic puts it above if full */}</div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CalculadoraMaoDeObra;
