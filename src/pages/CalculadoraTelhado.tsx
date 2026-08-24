import { useState } from "react";
import { Home, Calculator, ShoppingCart, ArrowLeft, Printer } from "lucide-react";
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
import SEO from "@/components/SEO";
import { generateCalculatorSchema, generateFAQSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraTelhado = () => {
    const { addItem } = useOrcamento();
    const [area, setArea] = useState("");
    const [tipoTelha, setTipoTelha] = useState("romana"); // romana, portuguesa, americana
    const [inclinacao, setInclinacao] = useState("30"); // %
    const [resultado, setResultado] = useState<number | null>(null);
    const faqItems = [
        {
            question: "Quantas telhas por metro quadrado?",
            answer: "Varia conforme o modelo. Em media: romana 16 por m2, portuguesa 17 por m2 e americana 12,5 por m2."
        },
        {
            question: "Como calcular telhas com inclinacao?",
            answer: "Use a area plana da cobertura e aplique o fator de inclinacao para obter a area real. Depois multiplique pelo consumo da telha e adicione margem de perdas."
        },
        {
            question: "Qual margem de perda usar para telhas?",
            answer: "Na pratica, usar entre 5 e 10 por cento e uma margem segura para quebras, recortes e manutencao futura."
        }
    ];

    const calcular = () => {
        const a = parseFloat(area);
        const i = parseFloat(inclinacao) / 100;

        if (!a) return;

        // Fator de inclinação (Hipotenusa)
        // Se a projeção horizontal é 1, a altura é i. A hipotenusa é sqrt(1 + i²).
        const fatorIncl = Math.sqrt(1 + (i * i));
        const areaReal = a * fatorIncl;

        // Consumo médio p/ m²
        // Romana: ~16, Portuguesa: ~17, Americana: ~12.5, Francesa: ~16, Colonial: ~24
        let consumo = 16;
        if (tipoTelha === "portuguesa") consumo = 17;
        if (tipoTelha === "americana") consumo = 12.5;

        // Margem de Perda (5% - quebra, recortes)
        const margemPerda = 1.05;

        const total = Math.ceil(areaReal * consumo * margemPerda);
        setResultado(total);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Telhas | Quantidade por m² e Custo"
                description="Calcule a quantidade exata de telhas (Romana, Portuguesa, Americana) para seu telhado. Evite desperdícios e economize na obra."
                url="https://www.suaobracerta.com.br/calculadora-telhado"
                noindex
                keywords="calculadora de telhas, quantidade de telhas por metro quadrado, telha romana, telha portuguesa, telha americana, inclinação telhado, calculo de telhado 2 aguas, calculo de telhado 4 aguas, custo telhado"
                schema={[
                    generateCalculatorSchema(
                        "Calculadora de Telhas",
                        "Calcule a quantidade de telhas necessárias para a cobertura do seu telhado.",
                        "https://www.suaobracerta.com.br/calculadora-telhado"
                    ),
                    generateFAQSchema(faqItems)
                ]}
            />
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <PrintHeader title="Orçamento de Telhas" />
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-telhado" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-red-700 rounded-xl p-3 text-white print:bg-white print:text-red-700 print:border print:border-red-200 print:shadow-none"><Home /></div>
                            <h1 className="print:text-2xl">Calculadora de Telhas</h1>
                        </div>

                        <div className="mb-8 text-muted-foreground print:hidden">
                            <p>
                                A Calculadora de Telhas é uma ferramenta essencial para quem está construindo ou reformando a cobertura da casa. Ela ajuda a estimar a quantidade correta de material, evitando compras excessivas (que geram prejuízo) ou a falta de telhas no meio da obra (que causa atrasos). O cálculo leva em conta não apenas a área plana, mas, fundamentalmente, a inclinação do telhado, que aumenta a área real de cobertura.
                            </p>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5 print:shadow-none print:border-none print:p-0 print:mb-6">
                            <div className="print:hidden space-y-5">
                                <div className="space-y-2">
                                    <Label>Área de Cobertura (m²) - Projeção Plana</Label>
                                    <Input value={area} onChange={e => setArea(e.target.value)} placeholder="Ex: 80" className="h-12" />
                                    <span className="text-xs text-muted-foreground">Área do chão (laje) + beirais, sem considerar a subida/inclinação.</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tipo de Telha</Label>
                                        <Select value={tipoTelha} onValueChange={setTipoTelha}>
                                            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="romana">Romana (16/m²)</SelectItem>
                                                <SelectItem value="portuguesa">Portuguesa (17/m²)</SelectItem>
                                                <SelectItem value="americana">Americana (12.5/m²)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Inclinação (%)</Label>
                                        <Input value={inclinacao} onChange={e => setInclinacao(e.target.value)} placeholder="30" className="h-12" />
                                        <span className="text-xs text-muted-foreground">Padrão: 30% a 35%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Print Summary */}
                            <div className="hidden print:block mb-4 p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Cálculo</h3>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">Área (Plana):</span>
                                        <span className="font-medium">{area} m²</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Tipo de Telha:</span>
                                        <span className="font-medium">
                                            {tipoTelha === 'romana' && 'Romana'}
                                            {tipoTelha === 'portuguesa' && 'Portuguesa'}
                                            {tipoTelha === 'americana' && 'Americana'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Inclinação:</span>
                                        <span className="font-medium">{inclinacao}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="print:hidden grid grid-cols-1 gap-4">
                                <Button onClick={calcular} size="xl" className="w-full">CALCULAR QUANTIDADE</Button>
                                {resultado && (
                                    <Button onClick={handlePrint} variant="outline" size="xl" className="w-full border-2">
                                        <Printer className="mr-2 h-5 w-5" /> Salvar em PDF
                                    </Button>
                                )}
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 text-center bg-gradient-result p-8 rounded-xl border-2 border-primary animate-scale-in print:bg-white print:border-black print:p-0 print:text-left print:mt-4">
                                <p className="text-lg print:text-gray-600">Você precisa de aproximadamente:</p>
                                <p className="text-5xl font-extrabold text-primary my-2 print:text-black">{resultado} Telhas</p>
                                <p className="text-sm text-muted-foreground mb-4">*Já incluso margem de perda técnica de 5%.</p>

                                <div className="mt-6 space-y-3 print:hidden">
                                    <Button
                                        onClick={() => {
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Telhas (${tipoTelha.charAt(0).toUpperCase() + tipoTelha.slice(1)})`,
                                                description: `Área: ${area}m² | Inclinação: ${inclinacao}%`,
                                                quantity: resultado,
                                                unit: "Unidades",
                                                category: "Cobertura - Telhado",
                                                estimatedPrice: resultado * (tipoTelha === "americana" ? 2.5 : 1.8) // Estimativa R$2.50 ou R$1.80
                                            });
                                        }}
                                        variant="outline"
                                        size="xl"
                                        className="w-full border-2 hover:bg-slate-50 text-slate-700"
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Adicionar ao Orçamento
                                    </Button>

                                    <Button className="w-full" variant="success" size="lg"><ShoppingCart className="mr-2" /> COTAR TELHAS ONLINE</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Informações extras */}
                    <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">
                            🏠 Detalhes do Cálculo
                        </h2>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <div className="space-y-2">
                                <p><strong className="text-foreground">1. Fator de Correção:</strong></p>
                                <p>
                                    Um telhado inclinado tem uma área de superfície maior do que a laje que ele cobre. Quanto maior a inclinação, maior a área real. O cálculo usa a inclinação (%) para encontrar o "Fator de Inclinação" (hipotenusa) e multiplicar pela área plana informada.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p><strong className="text-foreground">2. Rendimento das Telhas (Peças/m²):</strong></p>
                                <ul className="list-disc list-inside space-y-1 ml-1">
                                    <li><strong>Telha Romana:</strong> Média de 16 peças/m². É a mais popular no Brasil.</li>
                                    <li><strong>Telha Portuguesa:</strong> Média de 17 peças/m². Tem um design clássico e boa estabilidade.</li>
                                    <li><strong>Telha Americana:</strong> Média de 12.5 peças/m². São maiores e mais leves, rendendo mais na instalação.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 print:hidden">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">Perguntas Frequentes (FAQ)</h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Qual a diferença entre telha Romana, Portuguesa e Americana?</AccordionTrigger>
                                <AccordionContent>
                                    A principal diferença está no formato e no rendimento. A telha Romana é quadrada e plana, a Portuguesa tem uma ondulação característica e a Americana é maior e mais leve, cobrindo mais área com menos peças.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Por que a inclinação do telhado é importante?</AccordionTrigger>
                                <AccordionContent>
                                    A inclinação garante o escoamento da água da chuva, evitando vazamentos e infiltrações. Se a inclinação for menor que o recomendado pelo fabricante, a água pode "retornar" e entrar no telhado.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Como calcular a área do telhado?</AccordionTrigger>
                                <AccordionContent>
                                    A área do telhado não é igual à área da casa. Você deve medir a área da laje (projecão horizontal) e somar os beirais. Depois, é necessário aplicar o fator de correção da inclinação para achar a área real inclinada.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>O que é o "Fator de Inclinação"?</AccordionTrigger>
                                <AccordionContent>
                                    É um número multiplicador que corrige a área plana para a área inclinada. Por exemplo, para 30% de inclinação, o fator é aproximadamente 1.044. Multiplica-se a área plana por esse fator.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger>Devo comprar telhas a mais para perdas?</AccordionTrigger>
                                <AccordionContent>
                                    Sim, é fundamental considerar uma margem de segurança para quebras no transporte, recortes nos cantos (espigões e águas-furtadas) e manutenções futuras. Recomendamos adicionar 5% a 10%.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger>O que são os beirais e devo incluí-los?</AccordionTrigger>
                                <AccordionContent>
                                    Beirais são as partes do telhado que passam além das paredes da casa, protegendo-as da chuva. Sim, a área dos beirais deve ser SOMADA à área da laje antes de fazer o cálculo das telhas.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-7">
                                <AccordionTrigger>O peso das telhas afeta a estrutura?</AccordionTrigger>
                                <AccordionContent>
                                    Muito. Telhas de cerâmica absorvem água e ficam mais pesadas quando molhadas ("peso saturado"). A estrutura de madeira ou aço deve ser dimensionada para suportar esse peso extra, além do peso da própria telha seca.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-8">
                                <AccordionTrigger>As telhas precisam de impermeabilização?</AccordionTrigger>
                                <AccordionContent>
                                    Telhas cerâmicas naturais absorvem água e podem escurecer com o tempo. A impermeabilização (resina ou hidrofugante) prolonga a vida útil, mantém a estética e evita que o peso do telhado aumente com a chuva.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-9">
                                <AccordionTrigger>Telha esmaltada vale a pena?</AccordionTrigger>
                                <AccordionContent>
                                    Sim. Apesar de serem mais caras, as telhas esmaltadas já vêm impermeabilizadas de fábrica, não acumulam sujeira facilmente, não escurecem e têm maior resistência mecânica.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-10">
                                <AccordionTrigger>Qual a manutenção necessária para o telhado?</AccordionTrigger>
                                <AccordionContent>
                                    Recomenda-se uma lavagem anual para remover fungos e sujeira, reaplicação de resina a cada 2 ou 3 anos (para telhas naturais) e verificação de peças quebradas ou deslocadas.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-11">
                                <AccordionTrigger>Para que servem as telhas de vidro?</AccordionTrigger>
                                <AccordionContent>
                                    As telhas de vidro têm o mesmo formato das cerâmicas, mas permitem a passagem de luz natural. São usadas para criar pontos de iluminação no sótão ou área de serviço, economizando energia elétrica.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-12">
                                <AccordionTrigger>Qual telha é mais barata?</AccordionTrigger>
                                <AccordionContent>
                                    Geralmente a telha Romana é a mais acessível em termos de preço unitário e disponibilidade. Porém, deve-se considerar o custo total por m² (incluindo ripamento e mão de obra), onde a telha de fibrocimento costuma ser a campeã de economia.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-13">
                                <AccordionTrigger>Telhas de concreto são boas?</AccordionTrigger>
                                <AccordionContent>
                                    Sim, são muito resistentes e têm encaixes perfeitos, exigindo menos ripas. Porém, são mais pesadas que as cerâmicas, exigindo uma estrutura de telhado mais reforçada.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-14">
                                <AccordionTrigger>O que é telha Shingle?</AccordionTrigger>
                                <AccordionContent>
                                    É um tipo de telha asfáltica muito comum nos EUA. É leve, estética e flexível, permitindo telhados com curvaturas. Exige uma base contínua de compensado (OSB) para instalação.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-15">
                                <AccordionTrigger>Como descartar telhas velhas?</AccordionTrigger>
                                <AccordionContent>
                                    Telhas cerâmicas e de concreto são entulhos de construção classe A (recicláveis). Devem ser enviadas para empresas de caçamba licenciadas que as encaminham para usinas de reciclagem de agregados (para fazer brita, areia reciclada, etc.).
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </main>
            <div className="print:hidden">
                <Footer />
            </div>
        </div>
    );
};
export default CalculadoraTelhado;
