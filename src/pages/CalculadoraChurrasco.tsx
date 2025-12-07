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

const CalculadoraChurrasco = () => {
    const [homens, setHomens] = useState("5");
    const [mulheres, setMulheres] = useState("5");
    const [criancas, setCriancas] = useState("2");
    const [duracaoLonga, setDuracaoLonga] = useState(false);
    const [comiloes, setComiloes] = useState(false);

    const [resultado, setResultado] = useState<{
        carneTotal: number,
        picanha: number,
        linguica: number,
        frango: number,
        cerveja: number,
        refri: number,
        carvao: number,
        paoAlho: number,
        gelo: number,
        sal: number
    } | null>(null);

    const calcular = () => {
        const h = parseInt(homens) || 0;
        const m = parseInt(mulheres) || 0;
        const c = parseInt(criancas) || 0;

        // Fatores de Consumo Base (4 horas)
        // H: 400g carne, 1500ml cerveja
        // M: 300g carne, 800ml cerveja
        // C: 200g carne, 500ml refri
        let fatorCarneH = 0.4;
        let fatorCarneM = 0.3;
        let fatorCarneC = 0.2;
        let fatorCervejaH = 1.5;
        let fatorCervejaM = 0.8;
        let fatorRefri = 0.4; // Média geral

        // Ajustes
        if (duracaoLonga) {
            fatorCarneH *= 1.3;
            fatorCarneM *= 1.3;
            fatorCarneC *= 1.3;
            fatorCervejaH *= 1.5;
            fatorCervejaM *= 1.5;
            fatorRefri *= 1.3;
        }

        if (comiloes) {
            fatorCarneH *= 1.2;
            fatorCarneM *= 1.2;
        }

        const carneTotal = (h * fatorCarneH) + (m * fatorCarneM) + (c * fatorCarneC);

        // Distribuição de Carnes (Assumindo proporção popular)
        const picanha = carneTotal * 0.5; // 50% Carne Bovina
        const linguica = carneTotal * 0.25; // 25% Linguiça
        const frango = carneTotal * 0.25; // 25% Frango/Porco

        const cerveja = (h * fatorCervejaH) + (m * fatorCervejaM);
        const refri = ((h + m) * 0.2) + (c * 0.6); // Adultos tomam um pouco, crianças muito
        const carvao = Math.ceil(carneTotal); // 1kg por kg de carne
        const paoAlho = Math.ceil((h + m + c) * 2); // 2 pães por pessoa (unidade, não pacote)
        const gelo = Math.ceil((h + m + c) / 5) * 5; // 5kg a cada 5 pessoas aprox
        const sal = Math.ceil(carneTotal * 0.05); // 50g por kg

        setResultado({
            carneTotal: parseFloat(carneTotal.toFixed(1)),
            picanha: parseFloat(picanha.toFixed(1)),
            linguica: parseFloat(linguica.toFixed(1)),
            frango: parseFloat(frango.toFixed(1)),
            cerveja: Math.ceil(cerveja),
            refri: Math.ceil(refri),
            carvao,
            paoAlho: Math.ceil(paoAlho / 5), // Convertendo para pacotes de 5 unid aprox? Vamos deixar em UNIDADES por enquanto e explicar
            gelo, // kg
            sal // kg
        });
    };

    const compartilharWhatsApp = () => {
        if (!resultado) return;

        const texto = `🔥 *Lista do Churrasco - Sua Obra Certa*\n` +
            `🗓️ _${duracaoLonga ? 'Duração Longa (+6h)' : 'Padrão (4h)'}_\n\n` +
            `🥩 *CARNES (${resultado.carneTotal}kg total)*\n` +
            `   • Bovina (Picanha/Contra): ${resultado.picanha} kg\n` +
            `   • Linguiça: ${resultado.linguica} kg\n` +
            `   • Frango: ${resultado.frango} kg\n\n` +
            `🍺 *BEBIDAS*\n` +
            `   • Cerveja: ${resultado.cerveja} L (aprox. ${Math.ceil(resultado.cerveja * 2.8)} latas)\n` +
            `   • Refri/Água: ${resultado.refri} L\n\n` +
            `🛒 *EXTRAS*\n` +
            `   • Pão de Alho: ${resultado.paoAlho} unidades\n` +
            `   • Carvão: ${resultado.carvao} kg\n` +
            `   • Gelo: ${resultado.gelo} kg\n\n` +
            `Calculado em: https://suaobracerta.com.br/calculadora-churrasco`;

        const link = `https://wa.me/?text=${encodeURIComponent(texto)}`;
        window.open(link, '_blank');
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Churrasco Completa"
                description="Lista de compras para churrasco com carne, cerveja e acompanhamentos. Calcule picanha, linguiça e bebidas."
                url="https://suaobracerta.com.br/calculadora-churrasco"
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-churras" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-red-600 rounded-xl p-3 text-white"><Flame /></div>
                            <h1>Calculadora de Churrasco 2.0</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Homens</Label>
                                    <Input type="number" value={homens} onChange={e => setHomens(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mulheres</Label>
                                    <Input type="number" value={mulheres} onChange={e => setMulheres(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Crianças</Label>
                                    <Input type="number" value={criancas} onChange={e => setCriancas(e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <Button
                                    variant={duracaoLonga ? "default" : "outline"}
                                    onClick={() => setDuracaoLonga(!duracaoLonga)}
                                    className={duracaoLonga ? "bg-orange-500 hover:bg-orange-600" : ""}
                                >
                                    {duracaoLonga ? "🕒 Duração Longa (6h+)" : "🕒 Duração Padrão (4h)"}
                                </Button>
                                <Button
                                    variant={comiloes ? "default" : "outline"}
                                    onClick={() => setComiloes(!comiloes)}
                                    className={comiloes ? "bg-red-500 hover:bg-red-600" : ""}
                                >
                                    {comiloes ? "🍗 Turma Comilona!" : "🍽️ Turma Normal"}
                                </Button>
                            </div>

                            <Button onClick={calcular} size="xl" className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg transform active:scale-95 transition-all">
                                GERAR LISTA DE COMPRAS
                            </Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                {/* Nota Fiscal UI */}
                                <div className="bg-[#fff9c4] dark:bg-card text-card-foreground p-6 rounded-sm shadow-lg border-t-8 border-red-500 relative font-mono text-sm">
                                    <div className="absolute top-0 right-0 p-2 opacity-10"><ShoppingCart className="w-24 h-24" /></div>

                                    <h3 className="text-center font-bold text-xl border-b-2 border-dashed border-gray-400 pb-4 mb-4 uppercase">
                                        Lista do Churrasco
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between font-bold text-base">
                                            <span>CARNE TOTAL</span>
                                            <span>{resultado.carneTotal} kg</span>
                                        </div>
                                        <div className="pl-4 text-muted-foreground space-y-1">
                                            <div className="flex justify-between"><span>• Picanha/Contra</span> <span>{resultado.picanha} kg</span></div>
                                            <div className="flex justify-between"><span>• Linguiça</span> <span>{resultado.linguica} kg</span></div>
                                            <div className="flex justify-between"><span>• Frango/Porco</span> <span>{resultado.frango} kg</span></div>
                                        </div>

                                        <div className="border-t border-dashed border-gray-400 my-2"></div>

                                        <div className="flex justify-between font-bold text-base">
                                            <span>BEBIDAS</span>
                                            <span></span>
                                        </div>
                                        <div className="pl-4 space-y-1">
                                            <div className="flex justify-between"><span>🍺 Cerveja</span> <span>{resultado.cerveja} L (~{Math.ceil(resultado.cerveja * 2.8)} latas)</span></div>
                                            <div className="flex justify-between"><span>🥤 Refri/Água</span> <span>{resultado.refri} L</span></div>
                                        </div>

                                        <div className="border-t border-dashed border-gray-400 my-2"></div>

                                        <div className="flex justify-between font-bold text-base">
                                            <span>ACOMPANHAMENTOS</span>
                                            <span></span>
                                        </div>
                                        <div className="pl-4 space-y-1">
                                            <div className="flex justify-between"><span>🥖 Pão de Alho</span> <span>{resultado.paoAlho} unid.</span></div>
                                            <div className="flex justify-between"><span>🔥 Carvão</span> <span>{resultado.carvao} kg</span></div>
                                            <div className="flex justify-between"><span>❄️ Gelo</span> <span>{resultado.gelo} kg</span></div>
                                            <div className="flex justify-between"><span>🧂 Sal Grosso</span> <span>{resultado.sal} kg</span></div>
                                        </div>
                                    </div>

                                    <div className="mt-6 text-center text-xs text-muted-foreground">
                                        Calculado por SuaObraCerta.com.br
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <Button onClick={compartilharWhatsApp} size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-md hover:shadow-xl transition-all">
                                        <Share2 className="mr-2 h-5 w-5" /> ENVIAR NO GRUPO
                                    </Button>
                                    <Button asChild variant="outline" className="w-full"><a href="#" className="flex gap-2 justify-center items-center"><Beer className="h-4 w-4" /> COMPRAR BEBIDAS AGORA</a></Button>
                                    <p className="text-center text-xs text-muted-foreground mt-2">Valores estimados. Pode variar conforme o "apetite" da turma!</p>
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
