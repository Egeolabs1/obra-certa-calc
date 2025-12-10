import { useState, useRef } from "react";
import { Flame, Calculator, ShoppingCart, ArrowLeft, Beer, Share2, Printer } from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraChurrasco = () => {
    const resultRef = useRef<HTMLDivElement>(null);
    const { addItem } = useOrcamento();
    const [homens, setHomens] = useState("5");
    const [mulheres, setMulheres] = useState("5");
    const [criancas, setCriancas] = useState("2");
    const [vegetarianos, setVegetarianos] = useState("0");

    // Configurações
    const [duracaoLonga, setDuracaoLonga] = useState(false);
    const [comiloes, setComiloes] = useState(false);

    // Financeiro
    const [precoCarne, setPrecoCarne] = useState("59.90"); // Picanha/Contra
    const [precoLinguica, setPrecoLinguica] = useState("25.90");
    const [precoFrango, setPrecoFrango] = useState("19.90");
    const [precoCerveja, setPrecoCerveja] = useState("4.49");
    const [precoRefri, setPrecoRefri] = useState("8.00"); // 2 Litros

    const [resultado, setResultado] = useState<{
        carneTotal: number,
        picanha: number,
        linguica: number,
        frango: number,
        queijo: number,
        cerveja: number,
        latasCerveja: number,
        refri: number,
        garrafasRefri: number,
        carvao: number,
        paoAlho: number,
        gelo: number,
        sal: number,
        financeiro: {
            total: number,
            porPessoa: number,
            detalhe: string
        }
    } | null>(null);

    const calcular = () => {
        const h = parseInt(homens) || 0;
        const m = parseInt(mulheres) || 0;
        const c = parseInt(criancas) || 0;
        const v = parseInt(vegetarianos) || 0;

        // Preços
        const pCarne = parseFloat(precoCarne) || 0;
        const pLinguica = parseFloat(precoLinguica) || 0;
        const pFrango = parseFloat(precoFrango) || 0;
        const pCerveja = parseFloat(precoCerveja) || 0;
        const pRefri = parseFloat(precoRefri) || 0;

        // Fatores Base (4h)
        let fCarneH = 0.45;
        let fCarneM = 0.3;
        let fCarneC = 0.2;
        let fCervejaH = 1.8;
        let fCervejaM = 1.0;
        let fCervejaV = 1.5;
        let fRefri = 0.5;

        // Ajustes
        if (duracaoLonga) {
            fCarneH *= 1.3; fCarneM *= 1.3; fCarneC *= 1.3;
            fCervejaH *= 1.4; fCervejaM *= 1.4; fCervejaV *= 1.4;
            fRefri *= 1.2;
        }
        if (comiloes) {
            fCarneH *= 1.25; fCarneM *= 1.25;
        }

        // Cálculos Volumes
        const carneTotal = (h * fCarneH) + (m * fCarneM) + (c * fCarneC);

        const picanha = parseFloat((carneTotal * 0.5).toFixed(1));
        const linguica = parseFloat((carneTotal * 0.25).toFixed(1));
        const frango = parseFloat((carneTotal * 0.25).toFixed(1));

        const queijo = v * 0.3;

        const cervejaLitros = (h * fCervejaH) + (m * fCervejaM) + (v * fCervejaV);
        const latasCerveja = Math.ceil(cervejaLitros * 2.86); // 350ml
        const refriLitros = ((h + m + v + c) * fRefri);
        const garrafasRefri = Math.ceil(refriLitros / 2);

        // Extras
        const totalPessoas = h + m + c + v;
        const carvao = Math.ceil(carneTotal + queijo);
        const paoAlho = Math.ceil(totalPessoas * 2.5);
        const gelo = Math.ceil(totalPessoas / 4) * 5;
        const sal = Math.ceil(carneTotal * 0.04);

        // Financeiro Detalhado
        const custoPicanha = picanha * pCarne;
        const custoLinguica = linguica * pLinguica;
        const custoFrango = frango * pFrango;
        const custoQueijo = queijo * 55; // Est. R$55/kg
        const custoCerveja = latasCerveja * pCerveja;
        const custoRefri = garrafasRefri * pRefri;

        // Extras Estimados
        const custoCarvao = carvao * 12; // R$12/kg
        const custoPao = (paoAlho / 5) * 20; // R$20 pct
        const custoGelo = (gelo / 5) * 15; // R$15 pct 5kg
        const custoSal = sal * 5; // R$5

        const custoTotal = custoPicanha + custoLinguica + custoFrango + custoQueijo + custoCerveja + custoRefri + custoCarvao + custoPao + custoGelo + custoSal;

        const pagantes = h + m + v;
        const porPessoa = pagantes > 0 ? custoTotal / pagantes : 0;

        setResultado({
            carneTotal: parseFloat(carneTotal.toFixed(1)),
            picanha,
            linguica,
            frango,
            queijo: parseFloat(queijo.toFixed(1)),
            cerveja: Math.ceil(cervejaLitros),
            latasCerveja,
            refri: Math.ceil(refriLitros),
            garrafasRefri,
            carvao,
            paoAlho,
            gelo,
            sal,
            financeiro: {
                total: Math.ceil(custoTotal),
                porPessoa: Math.ceil(porPessoa),
                detalhe: `Carnes: R$${Math.ceil(custoPicanha + custoLinguica + custoFrango)} | Bebidas: R$${Math.ceil(custoCerveja + custoRefri)} | Extras: R$${Math.ceil(custoCarvao + custoPao + custoGelo + custoSal)}`
            }
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const compartilharWhatsApp = () => {
        if (!resultado) return;

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
            `   • Refri/Água: ${resultado.garrafasRefri} garrafas 2L (${resultado.refri}L)\n\n` +
            `🛒 *EXTRAS*\n` +
            `   • Pão de Alho: ${resultado.paoAlho} un.\n` +
            `   • Carvão: ${resultado.carvao} kg\n` +
            `   • Gelo: ${resultado.gelo} kg\n\n` +
            `Calculado em: https://suaobracerta.com.br/calculadora-churrasco`;

        const link = `https://wa.me/?text=${encodeURIComponent(texto)}`;
        window.open(link, '_blank');
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Churrasco e Rateio Estimado"
                description="Calcule carne, cerveja e o valor do rateio por pessoa (carne, frango, linguiça). Inclui opção para vegetarianos."
                url="https://suaobracerta.com.br/calculadora-churrasco"
                schema={generateCalculatorSchema(
                    "Calculadora de Churrasco",
                    "Calcule a quantidade exata de carne e bebidas para seu churrasco, com divisão de custos.",
                    "https://suaobracerta.com.br/calculadora-churrasco"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-churrasco-top" className="max-w-3xl mx-auto print:hidden" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3 print:hidden">
                            <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-3 text-white shadow-lg"><Flame /></div>
                            <div>
                                <h1 className="leading-none">Calculadora de Churrasco</h1>
                                <span className="text-sm font-normal text-muted-foreground">Versão 3.0 (Com Rateio)</span>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8 space-y-6 print:hidden">
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
                                    >
                                        {comiloes ? "🍗 Comilões" : "🍽️ Normal"}
                                    </Button>
                                </div>
                            </div>

                            {/* Financeiro */}
                            <div className="bg-muted/30 p-4 rounded-lg border border-border">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4" /> Cotação (Para Rateio)
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Bovina (kg)</Label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-2.5 text-muted-foreground text-xs">R$</span>
                                            <Input className="pl-7 h-9 text-sm" type="number" value={precoCarne} onChange={e => setPrecoCarne(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Linguiça (kg)</Label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-2.5 text-muted-foreground text-xs">R$</span>
                                            <Input className="pl-7 h-9 text-sm" type="number" value={precoLinguica} onChange={e => setPrecoLinguica(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Frango (kg)</Label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-2.5 text-muted-foreground text-xs">R$</span>
                                            <Input className="pl-7 h-9 text-sm" type="number" value={precoFrango} onChange={e => setPrecoFrango(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Cerveja (Lata)</Label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-2.5 text-muted-foreground text-xs">R$</span>
                                            <Input className="pl-7 h-9 text-sm" type="number" value={precoCerveja} onChange={e => setPrecoCerveja(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Refri (2L)</Label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-2.5 text-muted-foreground text-xs">R$</span>
                                            <Input className="pl-7 h-9 text-sm" type="number" value={precoRefri} onChange={e => setPrecoRefri(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={calcular} size="xl" className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg transform active:scale-95 transition-all font-bold text-lg">
                                CALCULAR TUDO
                            </Button>
                        </div>

                        {
                            resultado && (
                                <div ref={resultRef} className="mt-8 animate-scale-in">
                                    <PrintHeader />
                                    {/* Print Summary of Inputs */}
                                    <div className="hidden print:block mb-4 p-4 border rounded-lg bg-gray-50 border-gray-200">
                                        <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Detalhes do Evento</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="block text-gray-500">Convidados:</span>
                                                <span className="font-medium">
                                                    {homens} Homens, {mulheres} Mulheres, {criancas} Crianças
                                                    {parseInt(vegetarianos) > 0 ? `, ${vegetarianos} Veg` : ''}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-gray-500">Perfil:</span>
                                                <span className="font-medium">
                                                    {duracaoLonga ? "Longa Duração (6h+)" : "Duração Padrão (4h)"} • {comiloes ? "Comilões" : "Consumo Normal"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nota Fiscal UI */}
                                    <div className="bg-[#fff9c4] dark:bg-card text-card-foreground p-6 rounded-sm shadow-xl border-t-8 border-green-600 relative font-mono text-sm print:shadow-none print:border-green-600">

                                        <div className="text-center mb-6">
                                            <h2 className="text-3xl font-black text-green-700 dark:text-green-500">R$ {resultado.financeiro.porPessoa},00</h2>
                                            <p className="text-muted-foreground font-sans font-medium uppercase tracking-widest text-xs">Valor por Pessoa ({homens != "0" && mulheres != "0" && vegetarianos != "0" ? 'H + M + V' : 'Pagantes'})</p>
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
                                            <div className="flex justify-between border-t border-dotted border-gray-400 pt-1 mt-1 font-bold">
                                                <span>TOTAL CARNES</span> <span>{resultado.carneTotal} kg</span>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-base mt-4 mb-2">🍺 BEBIDAS</h3>
                                        <div className="space-y-1 text-card-foreground/80">
                                            <div className="flex justify-between"><span>Cerveja ({resultado.latasCerveja} latas)</span> <span>{resultado.cerveja} L</span></div>
                                            <div className="flex justify-between"><span>Refri/Água ({resultado.garrafasRefri} garrafas 2L)</span> <span>{resultado.refri} L</span></div>
                                        </div>

                                        <h3 className="font-bold text-base mt-4 mb-2">🛒 EXTRAS</h3>
                                        <div className="space-y-1 text-card-foreground/80">
                                            <div className="flex justify-between"><span>Pão de Alho</span> <span>{resultado.paoAlho} un.</span></div>
                                            <div className="flex justify-between"><span>Carvão</span> <span>{resultado.carvao} kg</span></div>
                                            <div className="flex justify-between"><span>Gelo</span> <span>{resultado.gelo} kg</span></div>
                                            <div className="flex justify-between"><span>Sal Grosso</span> <span>{resultado.sal} kg</span></div>
                                        </div>

                                        <div className="mt-8 text-center text-xs text-muted-foreground opacity-70">
                                            *Preços estimados. A variação pode ocorrer dependendo da região e marca.
                                            <br />Calculado por SuaObraCerta.com.br
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3 print:hidden">
                                        <Button onClick={compartilharWhatsApp} size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-md hover:shadow-xl transition-all">
                                            <Share2 className="mr-2 h-5 w-5" /> ENVIAR NO GRUPO
                                        </Button>
                                        <Button asChild variant="outline" className="w-full"><a href={affiliateLinks.bbq.general} className="flex gap-2 justify-center items-center" target="_blank" rel="noopener noreferrer"><Beer className="h-4 w-4" /> COMPRAR BEBIDAS AGORA</a></Button>

                                        <Button
                                            onClick={() => {
                                                const itemsToAdd = [
                                                    { name: 'Picanha/Contra', qtd: resultado.picanha, unit: 'kg', cat: 'Eventos - Churrasco', price: parseFloat(precoCarne) },
                                                    { name: 'Linguiça', qtd: resultado.linguica, unit: 'kg', cat: 'Eventos - Churrasco', price: parseFloat(precoLinguica) },
                                                    { name: 'Frango', qtd: resultado.frango, unit: 'kg', cat: 'Eventos - Churrasco', price: parseFloat(precoFrango) },
                                                    { name: 'Queijo Coalho', qtd: resultado.queijo, unit: 'kg', cat: 'Eventos - Churrasco', price: 55 },
                                                    { name: 'Cerveja (Latas)', qtd: resultado.latasCerveja, unit: 'Latas', cat: 'Eventos - Churrasco', price: parseFloat(precoCerveja) },
                                                    { name: 'Refrigerante (2L)', qtd: resultado.garrafasRefri, unit: 'Garrafas', cat: 'Eventos - Churrasco', price: parseFloat(precoRefri) },
                                                    { name: 'Carvão', qtd: resultado.carvao, unit: 'kg', cat: 'Eventos - Churrasco', price: 12 },
                                                    { name: 'Gelo', qtd: resultado.gelo, unit: 'kg', cat: 'Eventos - Churrasco', price: 3 }, // 15/5
                                                    { name: 'Pão de Alho', qtd: resultado.paoAlho, unit: 'Unidades', cat: 'Eventos - Churrasco', price: 4 } // 20/5
                                                ];

                                                itemsToAdd.forEach(item => {
                                                    if (item.qtd > 0) {
                                                        addItem({
                                                            id: crypto.randomUUID(),
                                                            name: item.name,
                                                            description: `Para ${homens}H ${mulheres}M ${criancas}C`,
                                                            quantity: item.qtd,
                                                            unit: item.unit,
                                                            category: item.cat,
                                                            estimatedPrice: item.qtd * item.price
                                                        });
                                                    }
                                                });
                                                alert("Itens adicionados ao orçamento!");
                                            }}
                                            variant="secondary"
                                            className="w-full border-2 border-orange-200 text-orange-800 hover:bg-orange-50"
                                        >
                                            <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar Tudo ao Orçamento
                                        </Button>
                                        <Button
                                            onClick={handlePrint}
                                            variant="outline"
                                            size="xl"
                                            className="w-full mt-4 border-2 hover:bg-red-50 text-red-900 print:hidden"
                                        >
                                            <Printer className="mr-2 h-5 w-5" /> Salvar Lista em PDF
                                        </Button>
                                    </div>
                                </div>
                            )
                        }

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                🥩 Entenda o Cálculo do Churrasco
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    Nosso algoritmo considera o perfil dos convidados e a duração do evento para evitar que falte comida ou bebida.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Consumo Base (Carne)</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Homens: 450g</li>
                                            <li>Mulheres: 300g</li>
                                            <li>Crianças: 200g</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Fatores de Ajuste</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li><strong>Duração Longa (6h+):</strong> +30% em carnes e +40% em cerveja.</li>
                                            <li><strong>Turma Comilona:</strong> +25% em carnes.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="print:hidden">
                <Footer />
            </div>
        </div >
    );
};
export default CalculadoraChurrasco;
