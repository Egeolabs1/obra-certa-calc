import { useState } from "react";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { TrendingUp, Calculator, ArrowLeft, Accessibility, Printer } from "lucide-react";
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

const CalculadoraRampa = () => {
    const [altura, setAltura] = useState("");
    const [largura, setLargura] = useState("");
    const [tipo, setTipo] = useState("acessibilidade");
    const [resultado, setResultado] = useState<{ comprimento: number; inclinacao: number; volume?: number; alertaPatamar?: boolean; numPatamares?: number; compCorrimao?: number } | null>(null);

    const calcular = () => {
        const h = parseFloat(altura); // metros
        const l = parseFloat(largura); // metros (opcional para volume)
        if (!h) return;

        // Inclinacao Maxina:
        // Acessibilidade (NBR 9050): 8.33% (1:12)
        // Carros (Garagem): 20% a 25% (confortavel 20%)

        let inclinacaoMax = 8.33;
        if (tipo === "carro") inclinacaoMax = 20;
        if (tipo === "moto") inclinacaoMax = 25; // Motos sobem mais, mas vamos deixar safe

        // Inclinação (%) = (Altura / Comprimento) * 100
        // Comprimento = (Altura * 100) / Inclinação

        const comprimentoNecessario = (h * 100) / inclinacaoMax;

        let volume = 0;
        if (l) {
            // Volume aproximado = (Area da base triangular * largura)
            // Area triangulo lateral = (comprimento * altura) / 2
            volume = (comprimentoNecessario * h * l) / 2;
        }

        // Verifica necessidade de patamar (NBR 9050)
        // Se h > 1.50m (para 8.33%) ou comprimento > 50m (mas 1.5m @ 8.33% dá ~18m, então altura é o limitante geralmente em rampa única)
        // Max desnivel por segmento: 1.50m (NBR 9050 para inclinações até 8.33%)

        let numPatamares = 0;
        if (tipo === "acessibilidade") {
            const maxDesnivelPorSegmento = 1.50;
            const numSegmentos = Math.ceil(h / maxDesnivelPorSegmento);
            numPatamares = Math.max(0, numSegmentos - 1);
        }

        // Calculo Estimado de Corrimão (NBR 9050)
        // 2 alturas (0.92m e 0.70m) em ambos os lados = 4 linhas de corrimão
        // Extensão de 30cm no início e no fim de cada corrimão.
        // Total = (Comprimento + 0.30 + 0.30) * 4
        // Se houver patamares, o corrimão geralmente continua. Vamos estimar pelo comprimento total da rampa.

        let compCorrimao = 0;
        if (tipo === "acessibilidade") {
            compCorrimao = (comprimentoNecessario + 0.60) * 4;
            // Adicionar comprimento dos patamares? Patamar tem no min 1.20m.
            // Se houver patamares, o corrimão passa por eles.
            // Estimativa simples: (ComprimentoRampa + (NumPatamares * 1.20) + 0.60) * 4
            const compPatamares = numPatamares * 1.20;
            compCorrimao = (comprimentoNecessario + compPatamares + 0.60) * 4;
        }

        const alertaPatamar = (tipo === "acessibilidade" && numPatamares > 0);

        setResultado({
            comprimento: Math.ceil(comprimentoNecessario * 100) / 100,
            inclinacao: inclinacaoMax,
            volume: volume ? Math.ceil(volume * 100) / 100 : undefined,
            alertaPatamar,
            numPatamares,
            compCorrimao: compCorrimao ? Math.ceil(compCorrimao * 100) / 100 : undefined
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Rampa Acessível | NBR 9050 e Garagem"
                description="Calcule inclinação, comprimento, volume de concreto e corrimão de rampas conforme NBR 9050. Ideal para acessibilidade e garagens."
                url="https://www.suaobracerta.com.br/calculadora-rampa"
                keywords="calculadora de rampa, inclinação rampa, rampa acessibilidade, rampa nbr 9050, rampa garagem, calculo rampa, comprimento rampa, rampa cadeirante, volume concreto rampa, corrimão rampa"
                schema={generateCalculatorSchema(
                    "Calculadora de Rampa",
                    "Calcule a inclinação e comprimento de rampas acessíveis.",
                    "https://www.suaobracerta.com.br/calculadora-rampa"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <PrintHeader title="Calculadora de Rampa" />
                <div className="container pt-6 print:hidden"><AdPlaceholder id="ad-rampa" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-teal-600 rounded-xl p-3 text-white print:bg-white print:text-teal-600 print:shadow-none print:border print:border-teal-200"><TrendingUp /></div>
                            <div>
                                <h1 className="print:text-2xl">Calculadora de Rampa</h1>
                            </div>
                        </div>

                        <div className="mb-8 text-muted-foreground print:hidden">
                            <p>
                                A Calculadora de Rampa ajuda você a projetar rampas seguras e funcionais, seja para garantir acessibilidade conforme a norma NBR 9050 ou para facilitar o acesso de veículos em garagens. O cálculo correto da inclinação é fundamental para evitar acidentes e garantir que cadeirantes ou carros consigam subir sem dificuldades.
                            </p>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5 print:shadow-none print:border-none print:p-0 print:mb-6">
                            <div className="print:hidden space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label>Altura do Desnível (metros)</Label>
                                        <Input value={altura} onChange={e => setAltura(e.target.value)} placeholder="Ex: 0.50" className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Largura da Rampa (metros) <span className="text-muted-foreground font-normal text-xs">(Opcional)</span></Label>
                                        <Input value={largura} onChange={e => setLargura(e.target.value)} placeholder="Ex: 1.20" className="h-12" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Finalidade da Rampa</Label>
                                    <Select value={tipo} onValueChange={setTipo}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="acessibilidade">Cadeirantes / Acessibilidade (Norma NBR 9050)</SelectItem>
                                            <SelectItem value="carro">Carros (Garagem)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={calcular} size="xl" className="w-full">CALCULAR COMPRIMENTO</Button>
                            </div>

                            {/* Print Summary */}
                            <div className="hidden print:block mb-6 p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Cálculo</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">Altura do Desnível:</span>
                                        <span className="font-medium">{altura} m</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Largura:</span>
                                        <span className="font-medium">{largura ? largura + " m" : "-"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Finalidade:</span>
                                        <span className="font-medium capitalize">{tipo === "acessibilidade" ? "Acessibilidade (NBR 9050)" : "Carros"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                {resultado.alertaPatamar && (
                                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex gap-3 print:hidden">
                                        <TrendingUp className="h-5 w-5 shrink-0" />
                                        <div>
                                            <p className="font-semibold mb-1">Atenção: Necessidade de Patamares</p>
                                            <p>Devido ao desnível de {altura}m, a norma NBR 9050 exige a divisão em segmentos.</p>
                                            <p className="mt-1">
                                                Recomendação: <strong>{resultado.numPatamares} patamar(es)</strong> de descanso (min 1.20m de comprimento cada).
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-gradient-result p-8 rounded-xl border-2 border-primary text-center print:bg-white print:border-black print:text-left print:p-0 print:mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                        <div>
                                            <p className="text-xl print:text-gray-600">Comprimento da Rampa:</p>
                                            <p className="text-5xl font-extrabold text-primary my-3 print:text-black">{resultado.comprimento} metros</p>

                                            <div className="flex flex-col gap-2 items-center print:items-start text-sm mt-4">
                                                <div className="inline-flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full print:bg-gray-100 print:text-gray-800">
                                                    {tipo === "acessibilidade" && <Accessibility className="h-4 w-4" />}
                                                    <span>Inclinação calculada: {resultado.inclinacao}%</span>
                                                </div>

                                                {resultado.volume && (
                                                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 font-medium">
                                                        <span>Volume Concreto: {resultado.volume} m³</span>
                                                    </div>
                                                )}

                                                {resultado.compCorrimao && (
                                                    <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full text-emerald-700 font-medium">
                                                        <span>Corrimão (Est.): {resultado.compCorrimao} m</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Visual Diagram */}
                                        <div className="relative h-40 border-l border-b border-gray-400 bg-white/50 rounded-tr-lg p-2 print:hidden">
                                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-800"></div> {/* Chão */}
                                            <div className="absolute left-0 bottom-0 h-full w-[2px] bg-gray-800"></div> {/* Parede/Altura */}

                                            {/* Triângulo (Rampa) */}
                                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <polygon points="0,0 100,100 0,100" fill="currentColor" className="text-primary/20" />
                                                <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" className="text-primary" strokeDasharray="4" />
                                            </svg>

                                            <div className="absolute top-2 left-2 bg-white px-1 text-xs font-bold text-gray-600 border rounded">h = {altura}m</div>
                                            <div className="absolute bottom-2 right-2 bg-white px-1 text-xs font-bold text-gray-600 border rounded">c = {resultado.comprimento}m</div>
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-1 text-xs text-primary font-bold border rounded">{resultado.inclinacao}%</div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-center text-sm text-muted-foreground print:hidden">
                                    *Este é o comprimento da rampa em projeção horizontal. O volume considera preenchimento maciço. Estimativa de corrimão inclui 4 linhas + excessos e patamares.
                                </p>

                                <div className="print:hidden mt-6">
                                    <Button
                                        onClick={handlePrint}
                                        variant="outline"
                                        size="xl"
                                        className="w-full border-2 border-slate-200 bg-white text-slate-800 hover:bg-gray-100"
                                    >
                                        <Printer className="mr-2 h-5 w-5" /> Salvar em PDF
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                📐 Normas de Inclinação
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    Uma rampa muito íngreme é perigosa e inutilizável para cadeirantes.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">NBR 9050 (Acessibilidade)</p>
                                        <p>A inclinação máxima permitida é <strong>8.33% (1:12)</strong>. Ou seja, para cada 1m de altura, precisa de 12m de comprimento.</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-card border border-border">
                                        <p className="font-medium text-foreground mb-1">Rampas de Garagem</p>
                                        <p>Carros conseguem subir rampas mais íngremes, geralmente entre <strong>20% e 25%</strong>. Acima disso, o carro pode raspar embaixo.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 print:hidden">
                            <h2 className="mb-4 text-lg font-semibold text-foreground">Perguntas Frequentes (FAQ)</h2>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Como calcular rampa de acessibilidade?</AccordionTrigger>
                                    <AccordionContent>
                                        Para calcular uma rampa de acessibilidade, você deve usar a fórmula: Inclinação = (Altura / Comprimento) x 100. Segundo a NBR 9050, a inclinação máxima recomendada é de 8,33%. Isso significa que para cada 1 metro de altura, são necessários 12 metros de comprimento horizontal.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Qual a inclinação máxima para rampa de cadeirante?</AccordionTrigger>
                                    <AccordionContent>
                                        A inclinação máxima permitida pela norma NBR 9050 para rampas novas é de 8,33% (proporção 1:12). Em reformas onde não é possível atingir essa inclinação, existem tolerâncias para percursos menores, podendo chegar a até 10% ou 12.5% em casos muito específicos e curtos.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Qual a inclinação ideal para rampa de garagem?</AccordionTrigger>
                                    <AccordionContent>
                                        Para rampas de garagem, a inclinação ideal varia entre 20% e 25%. Rampas acima de 25% podem fazer com que automóveis baixos raspem o fundo ou tenham dificuldade de tração.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>O que diz a NBR 9050 sobre rampas?</AccordionTrigger>
                                    <AccordionContent>
                                        A NBR 9050 estabelece critérios para acessibilidade, definindo inclinação máxima de 8,33%, largura mínima de 1,20m, necessidade de patamares de descanso a cada 50m de extensão ou a cada mudança de direção, além de corrimãos em duas alturas e piso tátil.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger>Como calcular o comprimento da rampa?</AccordionTrigger>
                                    <AccordionContent>
                                        O comprimento é calculado dividindo a altura (h) pela inclinação (i) desejada e multiplicando por 100. Fórmula: C = (h x 100) / i. Por exemplo, para vencer 1m de altura com inclinação de 8,33%: C = (1 x 100) / 8,33 ≈ 12 metros.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-6">
                                    <AccordionTrigger>Qual a largura mínima de uma rampa acessível?</AccordionTrigger>
                                    <AccordionContent>
                                        A largura mínima recomendável para rampas acessíveis é de 1,20m. Em reformas ou situações excepcionais, a norma admite largura mínima de 0,90m para fluxos baixos.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-7">
                                    <AccordionTrigger>Preciso de corrimão na rampa?</AccordionTrigger>
                                    <AccordionContent>
                                        Sim, para rampas de acessibilidade é obrigatório o uso de corrimãos em duas alturas (0,70m e 0,92m do piso) e em ambos os lados, além de guias de balizamento se não houver parede lateral.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-8">
                                    <AccordionTrigger>O que é rampa com patamar de descanso?</AccordionTrigger>
                                    <AccordionContent>
                                        Patamares são áreas planas horizontais inseridas no percurso da rampa para permitir o descanso de quem sobe. São obrigatórios quando a rampa é muito longa (necessário a cada 50m de comprimento pela NBR 9050) ou quando há mudança de direção.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-9">
                                    <AccordionTrigger>Posso fazer rampa curva?</AccordionTrigger>
                                    <AccordionContent>
                                        Sim, rampas curvas são permitidas, mas a inclinação máxima (8,33%) deve ser medida no arco interno da curva (raio menor), o que exige um cálculo cuidadoso para garantir que a parte interna não fique muito íngreme.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-10">
                                    <AccordionTrigger>Qual o piso ideal para rampa?</AccordionTrigger>
                                    <AccordionContent>
                                        O piso deve ser firme, regular, estável e, principalmente, antiderrapante, tanto em condições secas quanto molhadas, para evitar escorregões.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-11">
                                    <AccordionTrigger>Rampa para carros precisa de piso antiderrapante?</AccordionTrigger>
                                    <AccordionContent>
                                        Sim. Principalmente em dias de chuva, rampas de garagem precisam de alta aderência (como concreto ranhurado ou pedras ásperas) para que os pneus não patinem na subida ou deslizem na descida.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-12">
                                    <AccordionTrigger>Qual a diferença entre rampa de pedestre e de carro?</AccordionTrigger>
                                    <AccordionContent>
                                        A principal diferença é a inclinação: pedestres (especialmente cadeirantes) precisam de inclinação suave (máx 8,33%), enquanto carros suportam inclinações maiores (20-25%). A largura e o tipo de acabamento também podem variar.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-13">
                                    <AccordionTrigger>Como calcular inclinação em porcentagem?</AccordionTrigger>
                                    <AccordionContent>
                                        A inclinação em porcentagem é a razão entre a altura e o comprimento multiplicada por 100. Exemplo: subir 10cm em 100cm de comprimento = (10/100)*100 = 10% de inclinação.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-14">
                                    <AccordionTrigger>Rampa muito inclinada estraga o carro?</AccordionTrigger>
                                    <AccordionContent>
                                        Rampas muito íngremes ou com transições bruscas (ângulo de ataque/saída ruim) podem fazer o para-choque ou o fundo do carro raspar, causando danos físicos ao veículo.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-15">
                                    <AccordionTrigger>Existe altura máxima para uma rampa única?</AccordionTrigger>
                                    <AccordionContent>
                                        Para acessibilidade, um único lance de rampa não pode vencer um desnível maior que 1,50m sem um patamar de descanso intermediário. Se o desnível for maior, é preciso dividir a rampa em segmentos.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
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
export default CalculadoraRampa;
