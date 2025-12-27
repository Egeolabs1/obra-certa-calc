import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertCircle, HelpCircle, Save, Trash2, Printer, ClipboardCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { toast } from "sonner";

// Data Structure
type Status = "ok" | "issue" | "na" | "pending";

interface ChecklistItem {
    id: string;
    category: string;
    label: string;
    status: Status;
    note: string;
}

const INITIAL_DATA: ChecklistItem[] = [
    // Elétrica
    { id: "el_1", category: "Elétrica", label: "Testar todas as tomadas com equipamento (voltagem correta?)", status: "pending", note: "" },
    { id: "el_2", category: "Elétrica", label: "Acender e apagar todas as luzes", status: "pending", note: "" },
    { id: "el_3", category: "Elétrica", label: "Verificar quadro de disjuntores (identificado e limpo?)", status: "pending", note: "" },
    { id: "el_4", category: "Elétrica", label: "Testar campainha e interfone", status: "pending", note: "" },
    { id: "el_5", category: "Elétrica", label: "Pontos de TV e Internet (passa-fio desobstruído?)", status: "pending", note: "" },

    // Hidráulica
    { id: "hi_1", category: "Hidráulica", label: "Abrir todas as torneiras (fluxo normal e cor da água)", status: "pending", note: "" },
    { id: "hi_2", category: "Hidráulica", label: "Acionar descargas (vazão, retorno e barulho)", status: "pending", note: "" },
    { id: "hi_3", category: "Hidráulica", label: "Verificar vazamentos sob pias (sifão seco?)", status: "pending", note: "" },
    { id: "hi_4", category: "Hidráulica", label: "Testar chuveiros (água quente e fria)", status: "pending", note: "" },
    { id: "hi_5", category: "Hidráulica", label: "Verificar escoamento do ralo do box e sacada", status: "pending", note: "" },
    { id: "hi_6", category: "Hidráulica", label: "Registros gerais abrem e fecham suavemente?", status: "pending", note: "" },

    // Pisos e Revestimentos
    { id: "pi_1", category: "Pisos e Paredes", label: "Peças quebradas, trincadas ou lascadas", status: "pending", note: "" },
    { id: "pi_2", category: "Pisos e Paredes", label: "Batidas de 'oco' nos pisos e azulejos", status: "pending", note: "" },
    { id: "pi_3", category: "Pisos e Paredes", label: "Rejunte uniforme e sem falhas/buracos", status: "pending", note: "" },
    { id: "pi_4", category: "Pisos e Paredes", label: "Nivelamento do piso (poças de água?)", status: "pending", note: "" },
    { id: "pi_5", category: "Pisos e Paredes", label: "Soleiras e baguetes (riscos ou manchas)", status: "pending", note: "" },

    // Pintura
    { id: "pt_1", category: "Pintura", label: "Manchas, bolhas ou descascados nas paredes", status: "pending", note: "" },
    { id: "pt_2", category: "Pintura", label: "Acabamento no teto e sancas", status: "pending", note: "" },
    { id: "pt_3", category: "Pintura", label: "Recortes em volta de tomadas e portais", status: "pending", note: "" },
    { id: "pt_4", category: "Pintura", label: "Portas pintadas uniformemente (topo e base)", status: "pending", note: "" },

    // Portas e Janelas
    { id: "po_1", category: "Portas e Janelas", label: "Abrir e fechar todas as portas (chaves funcionam?)", status: "pending", note: "" },
    { id: "po_2", category: "Portas e Janelas", label: "Portas raspando no chão ou batente?", status: "pending", note: "" },
    { id: "po_3", category: "Portas e Janelas", label: "Janelas correm suavemente nos trilhos?", status: "pending", note: "" },
    { id: "po_4", category: "Portas e Janelas", label: "Vidros riscados, trincados ou manchados", status: "pending", note: "" },
    { id: "po_5", category: "Portas e Janelas", label: "Borrachas de vedação e escovas", status: "pending", note: "" },

    // Louças e Metais
    { id: "lm_1", category: "Louças e Metais", label: "Torneiras e registros riscados ou oxidados", status: "pending", note: "" },
    { id: "lm_2", category: "Louças e Metais", label: "Cubas e vasos sanitários (trincas)", status: "pending", note: "" },
    { id: "lm_3", category: "Louças e Metais", label: "Assentos sanitários fixados corretamente", status: "pending", note: "" },

    // Áreas Externas
    { id: "ex_1", category: "Outros", label: "Vaga de Garagem (localização e pintura)", status: "pending", note: "" },
    { id: "ex_2", category: "Outros", label: "Controle Portão Eletrônico e Tags", status: "pending", note: "" },
    { id: "ex_3", category: "Outros", label: "Área de serviço e tanque", status: "pending", note: "" },
];

const CATEGORIES = ["Elétrica", "Hidráulica", "Pisos e Paredes", "Pintura", "Portas e Janelas", "Louças e Metais", "Outros"];

const ChecklistVistoria = () => {
    const [items, setItems] = useState<ChecklistItem[]>(INITIAL_DATA);
    const [progress, setProgress] = useState(0);
    const [showOnlyIssues, setShowOnlyIssues] = useState(false);

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem("checklist_vistoria");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Erro ao carregar checklist", e);
            }
        }
    }, []);

    // Save to LocalStorage & Update Progress
    useEffect(() => {
        localStorage.setItem("checklist_vistoria", JSON.stringify(items));

        const total = items.length;
        const completed = items.filter(i => i.status !== "pending").length;
        setProgress(Math.round((completed / total) * 100));
    }, [items]);

    const updateStatus = (id: string, newStatus: Status) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, status: newStatus } : item
        ));
    };

    const updateNote = (id: string, note: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, note } : item
        ));
    };

    const resetChecklist = () => {
        if (confirm("Tem certeza? Isso apagará todas as suas anotações.")) {
            setItems(INITIAL_DATA);
            toast.success("Checklist reiniciado!");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusColor = (status: Status) => {
        switch (status) {
            case "ok": return "bg-green-100 text-green-700 border-green-200";
            case "issue": return "bg-red-100 text-red-700 border-red-200";
            case "na": return "bg-gray-100 text-gray-700 border-gray-200";
            default: return "bg-background border-border text-muted-foreground";
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background print:bg-white">
            <SEO
                title="Checklist de Vistoria de Imóvel - Grátis"
                description="Vai receber as chaves? Use nosso checklist interativo para vistoria de apartamento novo ou usado. Não deixe passar nenhum defeito!"
                url="https://suaobracerta.com.br/checklist-vistoria"
                keywords="checklist vistoria, vistoria apartamento, recebimento de chaves, vistoria imóvel novo, checklist obra"
                schema={generateCalculatorSchema(
                    "Checklist de Vistoria de Imóvel",
                    "Checklist interativo e completo para vistoria de recebimento de chaves de apartamento e casa.",
                    "https://suaobracerta.com.br/checklist-vistoria",
                    "https://suaobracerta.com.br/og-image.png",
                    "UtilitiesApplication"
                )}
            />
            <div className="print:hidden"><Header /></div>

            <main className="flex-1">
                {/* ------------------- INTERACTIVE MODE (Screen) ------------------- */}
                <div className="print:hidden">
                    <div className="container pt-6"><AdPlaceholder id="ad-checklist-top" className="max-w-3xl mx-auto" /></div>

                    <div className="container py-8 md:py-12">
                        <div className="mx-auto max-w-4xl">
                            <div className="mb-6 flex items-center justify-between">
                                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
                                <Button variant="outline" size="sm" onClick={resetChecklist} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Limpar Tudo</Button>
                            </div>

                            <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                                <div className="bg-blue-600 rounded-xl p-3 text-white shadow-lg"><ClipboardCheck className="h-8 w-8" /></div>
                                <div>
                                    <h1 className="leading-none text-3xl md:text-4xl text-foreground">Checklist de Vistoria</h1>
                                    <p className="text-sm font-normal text-muted-foreground mt-1">Analise cada detalhe antes de aceitar as chaves</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-8">
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span>Progresso da Vistoria</span>
                                    <span>{progress}% Concluído</span>
                                </div>
                                <Progress value={progress} className="h-3" />
                            </div>

                            {/* Stats & Tools */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border text-center">
                                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{items.length}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total</div>
                                </div>
                                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-xl border border-red-100 dark:border-red-900/50 text-center">
                                    <div className="text-2xl font-bold text-red-600 font-mono">{items.filter(i => i.status === 'issue').length}</div>
                                    <div className="text-xs text-red-600/70 uppercase tracking-wider font-bold">Problemas</div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-xl border border-green-100 dark:border-green-900/50 text-center">
                                    <div className="text-2xl font-bold text-green-600 font-mono">{items.filter(i => i.status === 'ok').length}</div>
                                    <div className="text-xs text-green-600/70 uppercase tracking-wider font-bold">Aprovados</div>
                                </div>
                                <div className="flex items-center justify-center p-4 bg-muted/30 rounded-xl border">
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor="show-issues" className="text-sm font-medium leading-none cursor-pointer">
                                            Ap. Problemas
                                        </label>
                                        <Button
                                            size="sm"
                                            variant={showOnlyIssues ? "destructive" : "outline"}
                                            onClick={() => setShowOnlyIssues(!showOnlyIssues)}
                                            className="h-8"
                                        >
                                            {showOnlyIssues ? "Ativado" : "Desativado"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* List */}
                            <div className="space-y-6">
                                <Accordion type="multiple" defaultValue={CATEGORIES} className="space-y-4">
                                    {CATEGORIES.map(category => {
                                        const categoryItems = items.filter(i => {
                                            const matchesCategory = i.category === category;
                                            const matchesFilter = showOnlyIssues ? i.status === 'issue' : true;
                                            return matchesCategory && matchesFilter;
                                        });

                                        if (categoryItems.length === 0) return null;

                                        return (
                                            <AccordionItem key={category} value={category} className="border rounded-xl bg-card px-4 shadow-sm">
                                                <AccordionTrigger className="hover:no-underline text-lg font-semibold py-4">
                                                    {category}
                                                    <span className="text-xs font-normal text-muted-foreground ml-2">
                                                        ({categoryItems.filter(i => i.status !== "pending").length}/{categoryItems.length})
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent className="pb-4 space-y-4">
                                                    {categoryItems.map(item => (
                                                        <div key={item.id} className={`p-4 rounded-lg border transition-colors ${getStatusColor(item.status)}`}>
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                <span className="font-medium text-base">{item.label}</span>

                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant={item.status === 'ok' ? 'default' : 'outline'}
                                                                        className={item.status === 'ok' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                                        onClick={() => updateStatus(item.id, 'ok')}
                                                                    >
                                                                        <CheckCircle2 className="h-4 w-4 mr-1" /> OK
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant={item.status === 'issue' ? 'destructive' : 'outline'}
                                                                        onClick={() => updateStatus(item.id, 'issue')}
                                                                    >
                                                                        <AlertCircle className="h-4 w-4 mr-1" /> Problema
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant={item.status === 'na' ? 'secondary' : 'outline'}
                                                                        onClick={() => updateStatus(item.id, 'na')}
                                                                    >
                                                                        <HelpCircle className="h-4 w-4 mr-1" /> N/A
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {/* Note Area */}
                                                            {(item.status === 'issue' || item.note) && (
                                                                <div className="mt-3 animate-fade-down">
                                                                    <Textarea
                                                                        placeholder="Descreva o problema encontrado..."
                                                                        value={item.note}
                                                                        onChange={(e) => updateNote(item.id, e.target.value)}
                                                                        className="bg-background/50 resize-y min-h-[60px]"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Button onClick={handlePrint} size="lg" className="gap-2">
                                    <Printer className="h-5 w-5" /> Imprimir Relatório / Salvar PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ------------------- PRINT MODE (PDF) ------------------- */}
                {/* Simplified, dense, no interactivity */}
                <div className="hidden print:block p-8 max-w-[210mm] mx-auto bg-white text-black">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900">Relatório de Vistoria de Imóvel</h1>
                            <p className="text-sm text-slate-500">Gerado via SuaObraCerta.com.br</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium">Data: {new Date().toLocaleDateString()}</p>
                            <p className="text-xs text-slate-400">ID: {crypto.randomUUID().slice(0, 8).toUpperCase()}</p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
                        <div className="p-3 bg-slate-100 rounded border border-slate-200">
                            <span className="block text-slate-500 text-xs uppercase font-bold">Itens Totais</span>
                            <span className="text-xl font-bold">{items.length}</span>
                        </div>
                        <div className="p-3 bg-green-50 rounded border border-green-200">
                            <span className="block text-green-700 text-xs uppercase font-bold">Aprovados</span>
                            <span className="text-xl font-bold text-green-700">{items.filter(i => i.status === 'ok').length}</span>
                        </div>
                        <div className="p-3 bg-red-50 rounded border border-red-200">
                            <span className="block text-red-700 text-xs uppercase font-bold">Problemas</span>
                            <span className="text-xl font-bold text-red-600">{items.filter(i => i.status === 'issue').length}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded border border-slate-200">
                            <span className="block text-slate-500 text-xs uppercase font-bold">Pendentes/NA</span>
                            <span className="text-xl font-bold">{items.filter(i => i.status === 'pending' || i.status === 'na').length}</span>
                        </div>
                    </div>

                    {/* Report Content */}
                    <div className="space-y-6">
                        {CATEGORIES.map(category => {
                            const categoryItems = items.filter(i => i.category === category);
                            if (categoryItems.length === 0) return null;

                            return (
                                <div key={category} className="break-inside-avoid">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 border-b border-slate-300 mb-3 pb-1">
                                        {category}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {categoryItems.map(item => (
                                            <div key={item.id} className={`flex items-start p-2 rounded text-sm border ${item.status === 'issue' ? 'border-red-200 bg-red-50' : 'border-transparent'}`}>
                                                {/* Status Icon/Text */}
                                                <div className="w-24 shrink-0 font-bold text-xs uppercase pt-0.5">
                                                    {item.status === 'ok' && <span className="text-green-700 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> OK</span>}
                                                    {item.status === 'issue' && <span className="text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> DEFEITO</span>}
                                                    {item.status === 'na' && <span className="text-slate-400">N/A</span>}
                                                    {item.status === 'pending' && <span className="text-slate-300">___</span>}
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1">
                                                    <span className={`block font-medium ${item.status === 'issue' ? 'text-red-900' : 'text-slate-700'}`}>
                                                        {item.label}
                                                    </span>
                                                    {item.note && (
                                                        <div className="mt-1 text-xs text-slate-600 italic bg-white/50 p-1 rounded">
                                                            Nota: {item.note}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-300 text-center text-xs text-slate-400">
                        <p>Este documento foi gerado pela ferramenta gratuita de Checklist de Vistoria do SuaObraCerta.com.br</p>
                    </div>
                </div>
            </main>
            <div className="print:hidden"><Footer /></div>
        </div>
    );
};

export default ChecklistVistoria;
