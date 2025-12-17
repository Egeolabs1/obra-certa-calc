import { useState } from "react";
import { Hammer, Calculator, ShoppingCart, ArrowLeft, Home, Printer, Info } from "lucide-react";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";
import { ProductCard } from "@/components/ProductCard";

interface ResultadoCalculo {
    pesoEstrutura: number;
    pesoTelhas: number;
    pesoTotal: number;
    cargaPorM2: number;
}

const CalculadoraPesoEstruturaTelhado = () => {
    const { addItem } = useOrcamento();

    const [area, setArea] = useState("");
    const [material, setMaterial] = useState("madeira_lei");
    const [telha, setTelha] = useState("ceramica");

    const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
    const [erro, setErro] = useState("");

    // Estimativas de Peso (Carga Permanente)
    // Valores Aproximados baseados em NBR 6120 e páticas de mercado
    const PESO_ESTRUTURA: Record<string, number> = {
        madeira_lei: 20, // kg/m² (Vigas + Caibros + Ripas - Madeira Pesada)
        madeira_tratada: 12, // kg/m² (Pinus/Eucalipto tratado)
        metalica: 10, // kg/m² (Perfis leves / Steel Frame)
    };

    const PESO_TELHA: Record<string, number> = {
        ceramica: 42, // kg/m² (Telha Colonial/Portuguesa úmida)
        concreto: 52, // kg/m²
        fibrocimento: 18, // kg/m² (Telha 6mm)
        metalica_sanduiche: 12, // kg/m² (Telha Termoacústica)
        metalica_simples: 5, // kg/m²
        shingle: 10, // kg/m² (Base OSB não inclusa aqui, mas shingle é leve)
    };

    const calcular = () => {
        setErro("");
        setResultado(null);

        const areaNum = parseFloat(area.replace(",", "."));

        if (!areaNum || areaNum <= 0) {
            setErro("Por favor, informe a área da projeção do telhado.");
            return;
        }

        const cargaEstruturaUnit = PESO_ESTRUTURA[material] || 0;
        const cargaTelhaUnit = PESO_TELHA[telha] || 0;

        const pesoEstruturaTotal = areaNum * cargaEstruturaUnit;
        const pesoTelhaTotal = areaNum * cargaTelhaUnit;
        const pesoTotal = pesoEstruturaTotal + pesoTelhaTotal;
        const cargaPorM2 = cargaEstruturaUnit + cargaTelhaUnit;

        setResultado({
            pesoEstrutura: Math.round(pesoEstruturaTotal),
            pesoTelhas: Math.round(pesoTelhaTotal),
            pesoTotal: Math.round(pesoTotal),
            cargaPorM2: Math.round(cargaPorM2)
        });
    };

    const formatarNome = (str: string) => {
        return str.replace("_", " ").toUpperCase();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Peso de Telhado | Estrutura e Telhas"
                description="Calcule a carga total do seu telhado (estrutura + telhas). Saiba o peso por metro quadrado para dimensionar vigas e pilares com segurança."
                url="https://suaobracerta.com.br/calculadora-peso-estrutura-telhado"
                keywords="calculo peso telhado, carga telhado nbr 6120, peso telha ceramica, peso estrutura madeira, peso estrutura metalica, carga permanente telhado, dimensionamento telhado"
                schema={generateCalculatorSchema(
                    "Calculadora de Peso de Telhado",
                    "Ferramenta para estimar a carga (peso) de estruturas de telhado e coberturas.",
                    "https://suaobracerta.com.br/calculadora-peso-estrutura-telhado"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>

            <main className="flex-1">
                <PrintHeader title="Calculadora de Carga de Telhado" />
                <div className="container pt-6 print:hidden">
                    <AdPlaceholder id="ad-topo-telhado-peso" className="max-w-3xl mx-auto" />
                </div>

                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden">
                            <ArrowLeft className="h-4 w-4" /> Voltar
                        </Link>

                        <div className="mb-8 animate-fade-up print:hidden">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-700">
                                    <Hammer className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                                    Calculadora de Peso do Telhado
                                </h1>
                            </div>
                            <p className="text-muted-foreground">
                                Estime a sobrecarga que seu telhado exercerá sobre a casa. Essencial para verificar se paredes e vigas suportam o peso.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-up print:hidden">
                            <div className="grid gap-5">

                                {/* Área */}
                                <div className="space-y-2">
                                    <Label>Área do Telhado (m²)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Ex: 80"
                                        value={area}
                                        onChange={e => setArea(e.target.value)}
                                        className="h-12"
                                    />
                                    <p className="text-xs text-muted-foreground">Considerar a área inclinada (não a área de piso).</p>
                                </div>

                                {/* Material da Estrutura */}
                                <div className="space-y-2">
                                    <Label>Material da Estrutura</Label>
                                    <Select value={material} onValueChange={setMaterial}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="madeira_lei">Madeira de Lei (Peroba, Ipê) - Mais pesada</SelectItem>
                                            <SelectItem value="madeira_tratada">Madeira Tratada (Pinus/Eucalipto) - Mais leve</SelectItem>
                                            <SelectItem value="metalica">Estrutura Metálica (Aço Galvanizado)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Tipo de Telha */}
                                <div className="space-y-2">
                                    <Label>Tipo de Telha</Label>
                                    <Select value={telha} onValueChange={setTelha}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ceramica">Cerâmica (Barro) - Tradicional</SelectItem>
                                            <SelectItem value="concreto">Concreto - Muito pesada</SelectItem>
                                            <SelectItem value="fibrocimento">Fibrocimento (Eternit) - Leve</SelectItem>
                                            <SelectItem value="metalica_sanduiche">Metálica Termoacústica (Sanduíche)</SelectItem>
                                            <SelectItem value="metalica_simples">Metálica Simples (Zinco)</SelectItem>
                                            <SelectItem value="shingle">Shingle (Manta asfáltica)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {erro && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                        {erro}
                                    </div>
                                )}

                                <Button onClick={calcular} size="xl" className="w-full mt-2 bg-amber-700 hover:bg-amber-800">
                                    <Calculator className="h-5 w-5 mr-2" />
                                    CALCULAR CARGA TOTAL
                                </Button>
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl border-2 border-amber-200 text-center print:bg-white print:border-black print:text-left print:p-0">
                                    <p className="text-xl print:text-gray-600">Peso Total Estimado:</p>
                                    <p className="text-5xl font-extrabold text-amber-900 my-3 print:text-black">
                                        {resultado.pesoTotal.toLocaleString('pt-BR')} kg
                                    </p>

                                    <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
                                        <div className="p-2 bg-white/50 rounded border border-amber-100">
                                            <span className="block text-muted-foreground text-xs">Carga/m²</span>
                                            <span className="font-bold text-amber-900 text-lg">{resultado.cargaPorM2} kg/m²</span>
                                        </div>
                                        <div className="p-2 bg-white/50 rounded border border-amber-100">
                                            <span className="block text-muted-foreground text-xs">Peso Estrutura</span>
                                            <span className="font-bold text-amber-900 text-lg">{resultado.pesoEstrutura} kg</span>
                                        </div>
                                        <div className="p-2 bg-white/50 rounded border border-amber-100">
                                            <span className="block text-muted-foreground text-xs">Peso Telhas</span>
                                            <span className="font-bold text-amber-900 text-lg">{resultado.pesoTelhas} kg</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 mt-6 print:hidden">
                                        <Button
                                            onClick={() => {
                                                addItem({
                                                    id: crypto.randomUUID(),
                                                    name: `Estrutura Telhado (${formatarNome(material)})`,
                                                    description: `Área: ${area}m² | Telha: ${formatarNome(telha)} | Carga: ${resultado.pesoTotal}kg`,
                                                    quantity: 1,
                                                    unit: "Projeto",
                                                    category: "Estrutura",
                                                    estimatedPrice: 0 // Difícil estimar preço só pelo peso
                                                });
                                            }}
                                            variant="outline"
                                            size="xl"
                                            className="w-full border-amber-200 hover:bg-amber-100 text-amber-900"
                                        >
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            Guardar no Orçamento
                                        </Button>
                                        <Button
                                            onClick={handlePrint}
                                            variant="ghost"
                                            className="w-full text-muted-foreground"
                                        >
                                            <Printer className="h-4 w-4 mr-2" />
                                            Imprimir Relatório
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 print:hidden">
                            <AdPlaceholder id="ad-meio-telhado-peso" />
                        </div>

                        {/* Texto Explicativo */}
                        <div className="mt-12 space-y-8 print:hidden">
                            <div className="rounded-xl border border-border bg-muted/30 p-6">
                                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                                    <Home className="h-5 w-5" />
                                    Entendendo as Cargas do Telhado
                                </h2>
                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <p>
                                        O cálculo de peso ("Carga Permanente") é crucial para que o engenheiro dimensione corretamente as vigas, colunas e fundações.
                                    </p>
                                    <p>
                                        <strong>Como é composto o peso?</strong>
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li><strong>Peso Próprio da Estrutura:</strong> Vigas, caibros, ripas (madeira) ou perfis (aço).</li>
                                        <li><strong>Peso das Telhas:</strong> Varia drasticamente. Telhas de concreto pesam quase 3x mais que fibrocimento.</li>
                                        <li><strong>Outras Cargas (não calculadas aqui):</strong> Caixa d'água, forro, manta térmica, painéis solares e vento.</li>
                                    </ul>
                                    <p className="mt-2 font-medium text-foreground">Atenção: Esta calculadora fornece uma estimativa de pré-projeto. O cálculo estrutural final deve ser feito por um engenheiro civil.</p>
                                </div>
                            </div>

                            {/* FAQ */}
                            <div className="mx-auto max-w-2xl">
                                <h2 className="mb-4 text-lg font-semibold">Perguntas Frequentes (FAQ)</h2>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Qual telha é a mais pesada?</AccordionTrigger>
                                        <AccordionContent>
                                            A telha de Concreto é a mais pesada (aprox. 50-55 kg/m²), seguida pela Cerâmica (40-45 kg/m²). Elas exigem uma estrutura (madeiramento) muito mais robusta.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Estrutura metálica é mais leve que madeira?</AccordionTrigger>
                                        <AccordionContent>
                                            Sim. O aço é mais denso, mas as peças são mais finas. Uma estrutura metálica pesa cerca de 8 a 12 kg/m², enquanto madeira de lei pode passar de 20 kg/m².
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>O peso muda se molhar?</AccordionTrigger>
                                        <AccordionContent>
                                            Sim! Telhas cerâmicas e de concreto absorvem água da chuva, aumentando o peso em até 10-15%. O cálculo estrutural (e nossa calculadora) já considera uma margem para isso (telha saturada).
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>Posso trocar telha de barro por concreto?</AccordionTrigger>
                                        <AccordionContent>
                                            Cuidado. Como a de concreto é mais pesada, verifique se seu madeiramento aguenta. Pode ser necessário reforçar vigas e colocar mais apoios.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>Quantos kg/m² pesa o telhado colonial?</AccordionTrigger>
                                        <AccordionContent>
                                            Considere entre 60 a 70 kg/m² no total (aprox. 20kg de madeira + 45kg de telha cerâmica).
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-6">
                                        <AccordionTrigger>E o telhado de fibrocimento?</AccordionTrigger>
                                        <AccordionContent>
                                            É bem leve. Totaliza cerca de 30 a 35 kg/m² (aprox. 15kg de estrutura simples + 18kg de telha).
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-7">
                                        <AccordionTrigger>Preciso incluir a caixa d'água no peso?</AccordionTrigger>
                                        <AccordionContent>
                                            A caixa d'água é uma "Carga Concentrada". Ela não entra na média por m² da calculadora. O local onde ela apoia precisa de reforço extra muito forte (1000L = 1 tonelada!).
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-8">
                                        <AccordionTrigger>O que é Carga Acidental?</AccordionTrigger>
                                        <AccordionContent>
                                            É o peso de pessoas andando no telhado para manutenção ou força do vento. A norma NBR 6120 exige prever uma carga extra para isso além do peso próprio.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-9">
                                        <AccordionTrigger>Madeira Pinus aguenta telha de barro?</AccordionTrigger>
                                        <AccordionContent>
                                            Sim, se bem dimensionada e tratada (autoclavada). O Pinus é menos resistente que a Peroba, então as peças precisam ser mais grossas ou próximas umas das outras.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-10">
                                        <AccordionTrigger>Como calcular a área inclinada?</AccordionTrigger>
                                        <AccordionContent>
                                            Multiplique a área do piso pelo Fator de Inclinação. Ex: para 30%, multiplique por 1.044. Para 40%, por 1.077.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-11">
                                        <AccordionTrigger>Painel Solar pesa muito?</AccordionTrigger>
                                        <AccordionContent>
                                            Variam de 15 a 25 kg por placa. Adicionam cerca de 10 a 15 kg/m² na área onde são instalados. É vital verificar se o telhado aguenta antes de instalar.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-12">
                                        <AccordionTrigger>Telha Sanduíche precisa de estrutura forte?</AccordionTrigger>
                                        <AccordionContent>
                                            Não. Ela é leve e rígida, permitindo apoios (terças) bem distantes uns dos outros (até 2 ou 3 metros), economizando muito na estrutura.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-13">
                                        <AccordionTrigger>O que é Steel Frame?</AccordionTrigger>
                                        <AccordionContent>
                                            É um sistema construtivo com perfis de aço galvanizado leve. Muito usado hoje por ser rápido, leve e imune a cupins.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-14">
                                        <AccordionTrigger>Quanto pesa um telhado de 100m²?</AccordionTrigger>
                                        <AccordionContent>
                                            Se for Colonial: ~7.000 kg (7 toneladas). Se for Fibrocimento: ~3.000 kg (3 toneladas). A diferença é enorme!
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-15">
                                        <AccordionTrigger>Devo contratar engenheiro?</AccordionTrigger>
                                        <AccordionContent>
                                            Sempre. Um telhado mal dimensionado pode ceder ("embarrigar") ou até colapsar com vento forte. Esta calculadora serve apenas para estimativas iniciais.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>

                        {/* Affiliate Products */}
                        <div className="mt-8 mb-8 print:hidden">
                            <h3 className="font-bold text-sm mb-4 uppercase text-muted-foreground flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" /> Itens para seu Telhado
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ProductCard
                                    title="Manta Térmica Subcobertura 50m²"
                                    image="https://m.media-amazon.com/images/I/41D+9+a+K+L._AC._SR360,460.jpg"
                                    price="R$ 189,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="Isolamento"
                                />
                                <ProductCard
                                    title="Parafusadeira Dewalt Impacto"
                                    image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                                    price="R$ 899,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="Ferramentas"
                                />
                                <ProductCard
                                    title="Passarinheira Universal (Kit 50)"
                                    image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                                    price="R$ 45,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="Acabamento"
                                />
                                <ProductCard
                                    title="Impermeabilizante Telha 18L"
                                    image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                                    price="R$ 259,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="Proteção"
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

export default CalculadoraPesoEstruturaTelhado;
