import { useState } from "react";
import { BrickWall, Calculator, ShoppingCart, ArrowLeft, ShieldAlert, Ruler, Construction, Printer, Info } from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";
import { ProductCard } from "@/components/ProductCard";

interface ResultadoMuro {
    tipo: "normal" | "arrimo";
    blocos: number;
    cimentoSacos: number;
    areiaMetros: number;
    pilares?: number; // Para muro normal
    grauteMetros?: number; // Para muro de arrimo
    acoKg?: number; // Para muro de arrimo
    descricao: string;
}

const CalculadoraMuro = () => {
    const { addItem } = useOrcamento();
    const [tipoMuro, setTipoMuro] = useState<"normal" | "arrimo">("normal");

    // Inputs
    const [comprimento, setComprimento] = useState("");
    const [altura, setAltura] = useState("");

    // Normal Wall Specific
    const [tipoBloco, setTipoBloco] = useState("ceramico_9h"); // 9x19x19 (8 furos)

    // Retaining Wall Specific
    const [tipoEstrutura, setTipoEstrutura] = useState("bloco_estrutural"); // Bloco de Concreto Estrutural

    const [resultado, setResultado] = useState<ResultadoMuro | null>(null);
    const [erro, setErro] = useState("");

    const calcular = () => {
        setErro("");
        setResultado(null);

        const comp = parseFloat(comprimento.replace(",", "."));
        const alt = parseFloat(altura.replace(",", "."));

        if (!comp || !alt || comp <= 0 || alt <= 0) {
            setErro("Informe o comprimento e altura válidos.");
            return;
        }

        const area = comp * alt;
        // Margem de perda padrão 10%
        const margem = 1.10;

        if (tipoMuro === "normal") {
            // Muro Normal (Divisa)

            // Quantidade de Blocos por m² (com argamassa)
            // Cerâmico 9x19x19: ~25 unid/m²
            // Concreto 14x19x39: ~12.5 unid/m²
            // Tijolo Baiano 11x19x29: ~17 unid/m²

            let blocosPorM2 = 25;
            if (tipoBloco === "concreto_14") blocosPorM2 = 12.5;
            if (tipoBloco === "baiano") blocosPorM2 = 17;

            const qtdBlocos = Math.ceil(area * blocosPorM2 * margem);

            // Argamassa de Assentamento (Estimativa)
            // Média: 15-20 litros de argamassa por m² de muro de tijolo 9x19x19
            // Traço 1:3 (Cimento:Areia)
            // 1 saco cimento (50kg) rende ~36 litros de nata/argamassa rica, mas com areia vira uns 60-70L de massa.
            // Vamos usar estimativa simplificada: 
            // 1 m² gasta ~5kg de cimento e ~0.02m³ de areia.

            const cimentoKg = area * 5;
            const areiaM3 = area * 0.02;

            // Pilares: 1 a cada 2.5m + 1 no final
            const numPilares = Math.ceil(comp / 2.5) + 1;

            setResultado({
                tipo: "normal",
                blocos: qtdBlocos,
                cimentoSacos: Math.ceil(cimentoKg / 50),
                areiaMetros: Math.ceil(areiaM3 * 10) / 10,
                pilares: numPilares,
                descricao: `${area.toFixed(2)}m² de Muro de Divisa`
            });

        } else {
            // Muro de Arrimo
            // Apenas estimativa de materiais para bloco estrutural preenchido (grauteado)
            // Bloco Estrutural 14x19x39: ~12.5 un/m²

            const blocosPorM2 = 12.5;
            const qtdBlocos = Math.ceil(area * blocosPorM2 * margem);

            // Graute (Preenchimento dos vazios + cintas)
            // Estimativa: 0.08 m³ de graute por m² de muro (preenchendo a cada x furos + cintas)
            const grauteM3 = area * 0.08;

            // Cimento e Areia para Assentamento + Graute
            // Vamos converter tudo para Sacos de Cimento e Areia genérico para compra
            // Graute consome muito cimento (Traço rico). 1m³ concreto = 7 sacos cimento.
            // 1m² de muro usa ~0.08m³ graute -> 0.08 * 7 = 0.56 sacos/m² só pro graute!
            // + Assentamento (0.1 sacos/m²). Total ~0.7 sacos/m².

            const cimentoSacos = Math.ceil(area * 0.7);
            const areiaM3 = Math.ceil(area * 0.06 * 10) / 10; // Areia e Brita (vamos simplificar na areia/concreto)

            // Aço (Vergalhão)
            // Arrimo consome muito aço. Estimativa 8 a 12 kg/m² para muros baixos (<3m).
            // Muros altos precisam de projeto específico.
            const acoKg = Math.ceil(area * 10);

            setResultado({
                tipo: "arrimo",
                blocos: qtdBlocos,
                cimentoSacos: cimentoSacos,
                areiaMetros: areiaM3,
                grauteMetros: Math.ceil(grauteM3 * 10) / 10,
                acoKg: acoKg,
                descricao: `${area.toFixed(2)}m² de Muro de Arrimo`
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Muro | Divisa e Arrimo (Materiais)"
                description="Calcule quantidade de tijolos, blocos, cimento e areia para construir muros de divisa ou muros de arrimo (contenção). Estimativa completa de materiais."
                url="https://suaobracerta.com.br/calculadora-muro"
                keywords="calculadora muro, tijolos por metro quadrado, muro de arrimo calculo, quantidade blocos muro, lista materiais muro, como calcular muro"
                schema={generateCalculatorSchema(
                    "Calculadora de Muro",
                    "Calculadora de materiais para construção de muros residenciais e de contenção.",
                    "https://suaobracerta.com.br/calculadora-muro"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>

            <main className="flex-1">
                <PrintHeader title="Calculadora de Materiais para Muro" />
                <div className="container pt-6 print:hidden">
                    <AdPlaceholder id="ad-topo-muro" className="max-w-3xl mx-auto" />
                </div>

                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden">
                            <ArrowLeft className="h-4 w-4" /> Voltar
                        </Link>

                        <div className="mb-8 animate-fade-up print:hidden">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
                                    <BrickWall className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                                    Calculadora de Muro
                                </h1>
                            </div>
                            <p className="text-muted-foreground">
                                Estime tijolos, cimento e outros materiais para construir seu muro. Escolha entre Muro Simples (Divisa) ou Muro de Arrimo (Contenção).
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-up print:hidden">

                            <Tabs defaultValue="normal" value={tipoMuro} onValueChange={(v) => setTipoMuro(v as "normal" | "arrimo")} className="w-full mb-6">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="normal">Muro de Divisa (Simples)</TabsTrigger>
                                    <TabsTrigger value="arrimo">Muro de Arrimo (Forte)</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="grid gap-5">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Comprimento do Muro (m)</Label>
                                        <Input
                                            type="number"
                                            placeholder="Ex: 10"
                                            value={comprimento}
                                            onChange={e => setComprimento(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Altura do Muro (m)</Label>
                                        <Input
                                            type="number"
                                            placeholder="Ex: 2.00"
                                            value={altura}
                                            onChange={e => setAltura(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                </div>

                                {tipoMuro === "normal" ? (
                                    <div className="space-y-2 animate-fade-in">
                                        <Label>Tipo de Bloco / Tijolo</Label>
                                        <Select value={tipoBloco} onValueChange={setTipoBloco}>
                                            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ceramico_9h">Bloco Cerâmico 9x19x19 (8 furos)</SelectItem>
                                                <SelectItem value="concreto_14">Bloco de Concreto 14x19x39</SelectItem>
                                                <SelectItem value="baiano">Tijolo Baiano 11x19x29</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <div className="space-y-2 animate-fade-in">
                                        <Label>Método Construtivo</Label>
                                        <Select value={tipoEstrutura} onValueChange={setTipoEstrutura}>
                                            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bloco_estrutural">Bloco de Concreto Estrutural (Armado)</SelectItem>
                                                {/* Future: Pedra de Mão logic */}
                                            </SelectContent>
                                        </Select>
                                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex gap-2">
                                            <ShieldAlert className="h-5 w-5 shrink-0" />
                                            <p>Atenção: Muros de arrimo exigem cálculo estrutural de um engenheiro. O cálculo abaixo é apenas uma estimativa de compra de materiais.</p>
                                        </div>
                                    </div>
                                )}

                                {erro && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                        {erro}
                                    </div>
                                )}

                                <Button onClick={calcular} size="xl" className="w-full mt-2 bg-orange-600 hover:bg-orange-700">
                                    <Calculator className="h-5 w-5 mr-2" />
                                    CALCULAR MATERIAIS
                                </Button>
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-xl border-2 border-orange-200 text-center print:bg-white print:border-black print:text-left print:p-0">
                                    <h3 className="text-xl font-bold text-orange-900 mb-4 print:text-black">Lista de Materiais Estimada</h3>
                                    <p className="text-sm text-muted-foreground mb-6">{resultado.descricao}</p>

                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div className="p-3 bg-white/60 rounded-lg border border-orange-100">
                                            <span className="text-xs text-muted-foreground block uppercase">Blocos/Tijolos</span>
                                            <span className="text-2xl font-bold text-orange-800">{resultado.blocos} un</span>
                                        </div>
                                        <div className="p-3 bg-white/60 rounded-lg border border-orange-100">
                                            <span className="text-xs text-muted-foreground block uppercase">Cimento (50kg)</span>
                                            <span className="text-2xl font-bold text-orange-800">{resultado.cimentoSacos} sacos</span>
                                        </div>
                                        <div className="p-3 bg-white/60 rounded-lg border border-orange-100">
                                            <span className="text-xs text-muted-foreground block uppercase">Areia Média</span>
                                            <span className="text-2xl font-bold text-orange-800">{resultado.areiaMetros} m³</span>
                                        </div>

                                        {resultado.tipo === "normal" && (
                                            <div className="p-3 bg-white/60 rounded-lg border border-orange-100">
                                                <span className="text-xs text-muted-foreground block uppercase">Pilares (Estimado)</span>
                                                <span className="text-2xl font-bold text-orange-800">{resultado.pilares} unid</span>
                                                <span className="text-xs text-muted-foreground block mt-1">(A cada 2.5m)</span>
                                            </div>
                                        )}

                                        {resultado.tipo === "arrimo" && (
                                            <>
                                                <div className="p-3 bg-white/60 rounded-lg border border-orange-100">
                                                    <span className="text-xs text-muted-foreground block uppercase">Aço (Vergalhão)</span>
                                                    <span className="text-2xl font-bold text-orange-800">~{resultado.acoKg} kg</span>
                                                </div>
                                                <div className="p-3 bg-white/60 rounded-lg border border-orange-100">
                                                    <span className="text-xs text-muted-foreground block uppercase">Graute (Líquido)</span>
                                                    <span className="text-2xl font-bold text-orange-800">{resultado.grauteMetros} m³</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-6 print:hidden">
                                        <Button
                                            onClick={() => {
                                                addItem({
                                                    id: crypto.randomUUID(),
                                                    name: `Muro ${resultado.tipo === "arrimo" ? "Arrimo" : "Simples"}`,
                                                    description: `${resultado.blocos} blocos, ${resultado.cimentoSacos} cimento, ${resultado.areiaMetros} areia`,
                                                    quantity: 1,
                                                    unit: "Lista",
                                                    category: "Estrutura",
                                                    estimatedPrice: resultado.blocos * 2 + resultado.cimentoSacos * 35 // Preço grosseiro
                                                });
                                            }}
                                            variant="outline"
                                            size="xl"
                                            className="w-full border-orange-200 hover:bg-orange-100 text-orange-900"
                                        >
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            Salvar Lista
                                        </Button>
                                        <Button
                                            onClick={handlePrint}
                                            variant="ghost"
                                            className="w-full text-muted-foreground mt-2"
                                        >
                                            <Printer className="h-4 w-4 mr-2" />
                                            Imprimir
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 print:hidden">
                            <AdPlaceholder id="ad-meio-muro" />
                        </div>

                        {/* Informações e FAQ */}
                        <div className="mt-12 space-y-8 print:hidden">
                            <div className="rounded-xl border border-border bg-muted/30 p-6">
                                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                                    <Construction className="h-5 w-5" />
                                    Diferença: Muro de Divisa vs Arrimo
                                </h2>
                                <div className="space-y-4 text-sm text-muted-foreground">
                                    <div>
                                        <strong className="text-foreground">Muro de Divisa (Simples):</strong>
                                        <p>Serve apenas para fechar o terreno e garantir privacidade. Ele suporta apenas o próprio peso e o vento. Usa-se blocos cerâmicos ou de concreto simples, com pilares espaçados.</p>
                                    </div>
                                    <div>
                                        <strong className="text-foreground">Muro de Arrimo (Contenção):</strong>
                                        <p>Feito para "segurar" terra (um barranco ou desnível). Ele sofre uma pressão lateral enorme. Se for feito como muro simples, <strong>ELE VAI CAIR</strong>. Exige blocos estruturais cheios de concreto (graute), muito aço e fundação profunda, além de drenagem para a água da chuva sair.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mx-auto max-w-2xl">
                                <h2 className="mb-4 text-lg font-semibold">Perguntas Frequentes (FAQ)</h2>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Qual a profundidade da fundação do muro?</AccordionTrigger>
                                        <AccordionContent>
                                            Para muros simples de até 2m, brocas de 1,5m a 2m costumam bastar. Para arrimo, a fundação precisa de cálculo de engenheiro (sapatas grandes ou estacas profundas).
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>O que é "choradeira" ou dreno?</AccordionTrigger>
                                        <AccordionContent>
                                            São tubos colocados na parte baixa do muro de arrimo para a água da terra sair. Sem eles, a água acumula atrás do muro, aumenta o peso e derruba a estrutura.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Posso usar tijolo baiano em muro de arrimo?</AccordionTrigger>
                                        <AccordionContent>
                                            <strong>Não!</strong> O tijolo baiano é frágil e oco. Ele esmaga com a pressão da terra. Use bloco de concreto estrutural ou pedra.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>Quantos blocos 9x19x19 cabem em 1m²?</AccordionTrigger>
                                        <AccordionContent>
                                            Considerando a argamassa, usa-se cerca de 25 peças por metro quadrado. Sem argamassa daria 27, mas a massa ocupa espaço.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>Qual o traço da argamassa para muro?</AccordionTrigger>
                                        <AccordionContent>
                                            Um traço comum é 1:3 (1 parte de cimento para 3 de areia média) ou 1:4. Pode-se usar cal ou aditivos plasticantes para melhorar a "liga".
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-6">
                                        <AccordionTrigger>Preciso impermeabilizar o muro de arrimo?</AccordionTrigger>
                                        <AccordionContent>
                                            Sim, obrigatoriamente do lado da terra (costas do muro). Use tinta asfáltica (piche) e manta drenante para evitar que a umidade perpasse para a frente do muro.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-7">
                                        <AccordionTrigger>Qual a distância máxima entre pilares?</AccordionTrigger>
                                        <AccordionContent>
                                            Para muros de divisa, recomenda-se pilares a cada 2,5m ou 3,0m. Vãos maiores deixam o muro "mole" e suscetível a trincas ou queda com vento.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-8">
                                        <AccordionTrigger>Muro de pedra é bom para arrimo?</AccordionTrigger>
                                        <AccordionContent>
                                            Sim, muros de "pedra de mão" funcionam por gravidade (são muito pesados). São ótimos se tiver espaço, pois a base precisa ser larga (ex: base com 40-50% da altura).
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-9">
                                        <AccordionTrigger>O que é cinta de amarração?</AccordionTrigger>
                                        <AccordionContent>
                                            É uma viga de concreto feita no topo do muro (e as vezes no meio) que "amarra" todos os pilares, evitando que eles abram ou fechem.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-10">
                                        <AccordionTrigger>Preciso chapiscar o muro?</AccordionTrigger>
                                        <AccordionContent>
                                            O chapisco garante aderência do reboco. Sem chapisco, o reboco pode desplacar (cair) com o tempo.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-11">
                                        <AccordionTrigger>Qual a altura máxima de um muro sem engenheiro?</AccordionTrigger>
                                        <AccordionContent>
                                            Geralmente até 2 metros é considerado baixo risco, mas qualquer obra deve ter responsável técnico. Muros de arrimo, mesmo baixos (1m), podem cair e machucar; consulte um profissional.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-12">
                                        <AccordionTrigger>Como calcular a quantidade de areia?</AccordionTrigger>
                                        <AccordionContent>
                                            Multiplique o volume de argamassa necessário pela proporção de areia do traço. Nossa calculadora já faz essa estimativa média para você.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-13">
                                        <AccordionTrigger>Muro pré-moldado vale a pena?</AccordionTrigger>
                                        <AccordionContent>
                                            É mais rápido e geralmente mais barato, mas esteticamente mais simples. Para segurança, verifique a qualidade dos pilares pré-fabricados.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-14">
                                        <AccordionTrigger>Posso fazer muro de arrimo com bloco cerâmico estrutural?</AccordionTrigger>
                                        <AccordionContent>
                                            Existem blocos cerâmicos estruturais potentes, mas é menos comum para arrimo que o concreto. Só use se o fabricante garantir a resistência (MPa) necessária no projeto.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-15">
                                        <AccordionTrigger>O que é pingadeira?</AccordionTrigger>
                                        <AccordionContent>
                                            É o acabamento (pedra, concreto ou metal) em cima do muro que evita que a chuva escorra sujando a parede ou infiltrando por cima.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                        {/* Affiliate Products */}
                        <div className="mt-8 mb-8 print:hidden">
                            <h3 className="font-bold text-sm mb-4 uppercase text-muted-foreground flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" /> Ofertas para sua Obra
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ProductCard
                                    title="Colher de Pedreiro 8 Pol"
                                    image="https://m.media-amazon.com/images/I/41D+9+a+K+L._AC._SR360,460.jpg"
                                    price="R$ 29,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="Ferramentas"
                                />
                                <ProductCard
                                    title="Prumo de Parede Profissional"
                                    image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                                    price="R$ 45,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="Medição"
                                />
                                <ProductCard
                                    title="Aditivo Impermeabilizante 18L"
                                    image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                                    price="R$ 89,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="Químicos"
                                />
                                <ProductCard
                                    title="Nível de Mão 3 Bolhas"
                                    image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                                    price="R$ 35,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="Ferramentas"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <div className="print:hidden">
                <Footer />
            </div>
        </div>
    );
};

export default CalculadoraMuro;
