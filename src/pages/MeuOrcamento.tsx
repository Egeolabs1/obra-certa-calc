import { useOrcamento } from "@/context/OrcamentoContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, FileDown, ShoppingCart, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MeuOrcamento = () => {
    const { items, removeItem, clearBudget, totalEstimatedValue } = useOrcamento();

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Meu Orçamento - Sua Obra Certa',
                text: `Estou planejando minha obra! Total estimado: R$ ${totalEstimatedValue.toFixed(2)}`,
                url: window.location.href,
            }).catch(console.error);
        }
    };

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof items>);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 print:bg-white">
            <SEO
                title="Meu Orçamento de Obra"
                description="Visualize e gerencie sua lista de materiais e serviços para a obra."
                url="https://suaobracerta.com.br/meu-orcamento"
                schema={generateCalculatorSchema(
                    "Meu Orçamento de Obra",
                    "Ferramenta de orçamento para visualizar e gerenciar custos de materiais de construção.",
                    "https://suaobracerta.com.br/meu-orcamento",
                    "https://suaobracerta.com.br/og-image.png",
                    "UtilitiesApplication"
                )}
            />
            <div className="print:hidden"><Header /></div>

            <main className="flex-1 container py-8 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8 print:hidden">
                        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Voltar
                        </Link>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={clearBudget} disabled={items.length === 0} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="h-4 w-4 mr-2" /> Limpar
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleShare}>
                                <Share2 className="h-4 w-4 mr-2" /> Compartilhar
                            </Button>
                            <Button size="sm" onClick={handlePrint}>
                                <FileDown className="h-4 w-4 mr-2" /> Salvar PDF
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-primary/10 p-4 rounded-full text-primary print:hidden"><ShoppingCart className="h-8 w-8" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Meu Orçamento</h1>
                            <p className="text-muted-foreground">Lista de materiais e serviços estimados</p>
                        </div>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <ShoppingCart className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Seu orçamento está vazio</h2>
                            <p className="text-muted-foreground mb-6">Utilize nossas calculadoras para adicionar itens à sua lista.</p>
                            <Button asChild>
                                <Link to="/">Ver Calculadoras</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-up">
                            {Object.entries(groupedItems).map(([category, categoryItems]) => (
                                <Card key={category} className="overflow-hidden border-none shadow-sm print:shadow-none print:border">
                                    <CardHeader className="bg-slate-100 dark:bg-slate-800 py-3 px-6">
                                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            {category}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {categoryItems.map((item, idx) => (
                                            <div key={item.id} className="group flex items-start sm:items-center justify-between p-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-b last:border-0 border-slate-100 dark:border-slate-800">
                                                <div className="flex-1 mr-4">
                                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</h3>
                                                    <p className="text-sm text-slate-500">{item.description}</p>
                                                </div>
                                                <div className="flex items-center gap-6 sm:gap-12 text-right">
                                                    <div className="min-w-[80px]">
                                                        <span className="text-2xl font-bold tabular-nums">{item.quantity}</span>
                                                        <span className="text-xs text-muted-foreground font-medium ml-1 uppercase">{item.unit}</span>
                                                    </div>
                                                    {item.estimatedPrice && item.estimatedPrice > 0 && (
                                                        <div className="min-w-[100px] hidden sm:block">
                                                            <p className="text-xs text-muted-foreground">Valor Estimado</p>
                                                            <p className="font-medium text-emerald-600">R$ {item.estimatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                        </div>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 print:hidden"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}

                            <div className="flex justify-end mt-8">
                                <div className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 p-6 rounded-xl shadow-xl min-w-[300px]">
                                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mb-1">Total Geral Estimado</p>
                                    <p className="text-4xl font-bold">
                                        R$ {totalEstimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-xs opacity-50 mt-2">* Valores aproximados de mercado</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <div className="print:hidden"><Footer /></div>
        </div>
    );
};

export default MeuOrcamento;
