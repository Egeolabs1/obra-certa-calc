import { useState } from "react";
import { Flame, Calculator, ShoppingCart, ArrowLeft, Beer, Share2 } from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const texto = `🔥 *Churrasco 3.0 - Sua Obra Certa*\n` +
    `💰 *RATEIO: R$ ${resultado.financeiro.porPessoa},00 / pessoa*\n` +
    `(Total Estimado: R$ ${resultado.financeiro.total},00)\n\n` +
    `🥩 *CARNES (${resultado.carneTotal}kg)*\n` +
    `   • Bovina: ${resultado.picanha} kg\n` +
    `   • Linguiça: ${resultado.linguica} kg\n` +
    `   • Frango: ${resultado.frango} kg\n` +
    (resultado.queijo > 0 ? `   • 🧀 Veggie/Queijo: ${resultado.queijo} kg\n` : '') +
    `\n🍺 *BEBIDAS*\n` +
    `   • Cerveja: ${resultado.latasCerveja} latas (${resultado.cerveja}L)\n` +
    `   • Refri/Água: ${resultado.refri} L\n\n` +
    `🛒 *EXTRAS*\n` +
    `   • Pão de Alho: ${resultado.paoAlho} un.\n` +
    `   • Carvão: ${resultado.carvao} kg\n` +
    `   • Gelo: ${resultado.gelo} kg\n`;

const link = `https://wa.me/?text=${encodeURIComponent(texto)}`;
window.open(link, '_blank');
    };

return (
    <div className="flex min-h-screen flex-col bg-background">
        <SEO
            title="Calculadora de Churrasco e Rateio"
            description="Calcule carne, cerveja e o valor do rateio por pessoa. Inclui opção para vegetarianos."
            url="https://suaobracerta.com.br/calculadora-churrasco"
        />
        <Header />
        <main className="flex-1">
            <div className="container pt-6"><AdPlaceholder id="ad-churras" className="max-w-3xl mx-auto" /></div>
            <div className="container py-8 md:py-12">
                <div className="mx-auto max-w-2xl">
                    <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                    <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-3 text-white shadow-lg"><Flame /></div>
                        <div>
                            <h1 className="leading-none">Calculadora de Churrasco</h1>
                            <span className="text-sm font-normal text-muted-foreground">Versão 3.0 (Com Rateio)</span>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-6">
                        {/* Pessoas */}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Quem vai?</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Homens</Label>
                                    <Input type="number" value={homens} onChange={e => setHomens(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Mulheres</Label>
                                    <Input type="number" value={mulheres} onChange={e => setMulheres(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Crianças</Label>
                                    <Input type="number" value={criancas} onChange={e => setCriancas(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-green-600">Vegetarianos</Label>
                                    <Input type="number" value={vegetarianos} onChange={e => setVegetarianos(e.target.value)} className="border-green-200 focus-visible:ring-green-500" />
                                </div>
                            </div>
                        </div>

                        {/* Configs */}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Estilo do Evento</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant={duracaoLonga ? "default" : "outline"}
                                    onClick={() => setDuracaoLonga(!duracaoLonga)}
                                    className={duracaoLonga ? "bg-orange-500 hover:bg-orange-600" : ""}
                                >
                                    {duracaoLonga ? "🕒 Longa (6h+)" : "🕒 Padrão (4h)"}
                                </Button>
                                <Button
                                    variant={comiloes ? "default" : "outline"}
                                    onClick={() => setComiloes(!comiloes)}
                                    className={comiloes ? "bg-red-500 hover:bg-red-600" : ""}
                                    {resultado && (
                                        <div className="mt-8 animate-scale-in">
                                            {/* Nota Fiscal UI */}
                                            <div className="bg-[#fff9c4] dark:bg-card text-card-foreground p-6 rounded-sm shadow-xl border-t-8 border-green-600 relative font-mono text-sm">

                                                <div className="text-center mb-6">
                                                    <h2 className="text-3xl font-black text-green-700 dark:text-green-500">R$ {resultado.financeiro.porPessoa},00</h2>
                                                    <p className="text-muted-foreground font-sans font-medium uppercase tracking-widest text-xs">Valor por Pessoa (Rateio)</p>
                                                    <p className="text-[10px] text-muted-foreground mt-1">Total Estimado do Evento: R$ {resultado.financeiro.total},00</p>
                                                </div>

                                                <div className="border-t-2 border-dashed border-gray-400 my-4"></div>

                                                <h3 className="font-bold text-base mb-2">🥩 LISTA DE COMPRAS</h3>

                                                <div className="space-y-1 text-card-foreground/80">
                                                    <div className="flex justify-between"><span>Picanha/Contra (50%)</span> <span>{resultado.picanha} kg</span></div>
                                                    <div className="flex justify-between"><span>Linguiça (25%)</span> <span>{resultado.linguica} kg</span></div>
                                                    <div className="flex justify-between"><span>Frango (25%)</span> <span>{resultado.frango} kg</span></div>
                                                    {resultado.queijo > 0 && (
                                                        <div className="flex justify-between font-bold text-green-700"><span>Queijo/Veggie</span> <span>{resultado.queijo} kg</span></div>
                                                    )}
                                                    <div className="flex justify-between"><span>Sal Grosso</span> <span>{resultado.sal} kg</span></div>
                                                </div>

                                                <div className="mt-8 text-center text-xs text-muted-foreground opacity-70">
                                                    *Preços estimados. A variação pode ocorrer dependendo da região e marca.
                                                    <br />Calculado por SuaObraCerta.com.br
                                                </div>
                                            </div>

                                            <div className="mt-6 space-y-3">
                                                <Button onClick={compartilharWhatsApp} size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-md hover:shadow-xl transition-all">
                                                    <Share2 className="mr-2 h-5 w-5" /> ENVIAR NO GRUPO
                                                </Button>
                                                <Button asChild variant="outline" className="w-full"><a href="#" className="flex gap-2 justify-center items-center"><Beer className="h-4 w-4" /> COMPRAR BEBIDAS AGORA</a></Button>
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
                export default CalculadoraChurrasco;
