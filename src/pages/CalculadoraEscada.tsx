import { useState } from "react";
import { ArrowUpFromLine, Calculator, ShoppingCart, ArrowLeft, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";

const CalculadoraEscada = () => {
    const { addItem } = useOrcamento();
    const [alturaTotal, setAlturaTotal] = useState("");
    const [largura, setLargura] = useState("");
    const [resultado, setResultado] = useState<{ degraus: number; espelho: number; piso: number; formula: string; comprimentoTotal: number; volumeConcreto?: number; compCorrimao?: number } | null>(null);

    const calcular = () => {
        const h = parseFloat(alturaTotal); // metros
        const l = parseFloat(largura); // metros (opcional)
        if (!h) return;

        const alturaCm = h * 100;

        // Altura ideal do espelho (E): entre 16cm e 18cm.
        // Tentar chegar o mais próximo possível de 17.5cm (confortável).
        const numeroDegraus = Math.round(alturaCm / 17.5);
        const espelhoReal = alturaCm / numeroDegraus;

        // Lei de Blondel: 2E + P = 63 a 65 (ideal 64)
        // P = 64 - 2E
        const pisoIdeal = 64 - (2 * espelhoReal);

        // Comprimento Total (Projeção Horizontal)
        // É a soma das pisadas. O último degrau geralmente é o próprio patamar/laje superior, 
        // mas para cálculo de espaço ocupado considera-se (N-1) pisadas se o último espelho "chegar" na laje.
        // Porem, vamos simplificar: Comprimento = NumDegraus * Piso (considerando que o ultimo degrau também tem piso antes do patamar ou é o patamar).
        // Ajuste fino: Se a escada "morre" na laje, o comprimento é (N-1)*P. Se o ultimo degrau é um degrau abaixo da laje, (N-1)*P + nariz.
        // Padrão mais comum: (NumDegraus - 1) * Piso (o ultimo espelho sobe para o piso superior).
        const comprimentoTotalCm = (numeroDegraus - 1) * pisoIdeal;
        const comprimentoTotalM = comprimentoTotalCm / 100;

        // Volume de Concreto Estimado
        // 1. Volume dos degraus (prismas triangulares): AreaTriangulo * Largura * NumDegraus
        // AreaTriangulo = (Piso * Espelho) / 2
        // VolumeDegraus = ((Piso/100 * Espelho/100) / 2) * Largura * NumDegraus
        // 2. Volume da "cinta" ou laje inclinada (waist). Espessura média ~10-12cm.
        // ComprimentoInclinado = Raiz(ComprimentoTotal^2 + AlturaTotal^2)
        // VolumeCinta = ComprimentoInclinado * Largura * 0.12 (espessura)

        let volumeConcreto = 0;
        if (l) {
            const areaDegrau = ((pisoIdeal / 100) * (espelhoReal / 100)) / 2;
            const volDegraus = areaDegrau * l * numeroDegraus;

            const comprimentoInclinado = Math.sqrt(Math.pow(comprimentoTotalM, 2) + Math.pow(h, 2));
            const volCinta = comprimentoInclinado * l * 0.12; // 12cm de espessura média

            volumeConcreto = volDegraus + volCinta;
        }

        // Estimativa de Corrimão (NBR 9050)
        // 2 alturas (0.92m e 0.70m) em ambos os lados = 4 linhas
        // + Extensões de 30cm no inicio e fim.
        // Comprimento da escada (inclinado)
        const hypotenusa = Math.sqrt(Math.pow(comprimentoTotalM, 2) + Math.pow(h, 2));
        const compCorrimao = (hypotenusa + 0.60) * 4;

        setResultado({
            degraus: numeroDegraus,
            espelho: Math.round(espelhoReal * 100) / 100,
            piso: Math.round(pisoIdeal * 100) / 100,
            formula: `2 x ${espelhoReal.toFixed(1)} + ${pisoIdeal.toFixed(1)} = ${(2 * espelhoReal + pisoIdeal).toFixed(1)}`,
            comprimentoTotal: Math.round(comprimentoTotalM * 100) / 100,
            volumeConcreto: volumeConcreto ? Math.ceil(volumeConcreto * 100) / 100 : undefined,
            compCorrimao: Math.ceil(compCorrimao * 100) / 100
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Escada Blondel | Degraus e Espelho"
                description="Calcule escadas perfeitas usando a Lei de Blondel. Descubra altura do espelho, profundidade do degrau e quantidade de degraus."
                url="https://suaobracerta.com.br/calculadora-escada"
                keywords="calculadora de escada, lei de blondel, calcular degraus, tamanho do degrau, altura espelho escada, profundidade pisada escada, escada nbr 9050, calculo escada reta, calculo escada u, calculo escada l, projeto escada"
                schema={generateCalculatorSchema(
                    "Calculadora de Escada",
                    "Calcule o conforto e dimensões de escadas usando a Lei de Blondel.",
                    "https://suaobracerta.com.br/calculadora-escada"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-escada" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-orange-600 rounded-xl p-3 text-white"><ArrowUpFromLine /></div>
                            <h1>Calculadora de Escada (Blondel)</h1>
                        </div>

                        <div className="mb-8 text-muted-foreground">
                            <p>
                                A Calculadora de Escada utiliza a <strong className="text-foreground">Lei de Blondel</strong> para garantir que sua escada seja ergonômica, segura e confortável. Uma escada mal dimensionada pode causar acidentes e cansaço excessivo. Nossa ferramenta calcula automaticamente a altura ideal do degrau (espelho) e a profundidade onde se pisa (pisada).
                            </p>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label>Altura Total do Desnível (metros)</Label>
                                    <Input value={alturaTotal} onChange={e => setAlturaTotal(e.target.value)} placeholder="Ex: 2.80" className="h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Largura da Escada (metros) <span className="text-muted-foreground font-normal text-xs">(Opcional)</span></Label>
                                    <Input value={largura} onChange={e => setLargura(e.target.value)} placeholder="Ex: 1.00" className="h-12" />
                                </div>
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR DEGRAUS</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                <div className="bg-gradient-result p-8 rounded-xl border-2 border-primary/20 mb-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                        <div>
                                            <p className="text-lg text-muted-foreground">Sua escada terá:</p>
                                            <p className="text-5xl font-extrabold text-primary my-3">{resultado.degraus} Degraus</p>

                                            <div className="space-y-2 mt-4 text-sm font-medium text-foreground/80">
                                                <div className="flex justify-between border-b pb-1">
                                                    <span>Altura (Espelho):</span>
                                                    <span>{resultado.espelho} cm</span>
                                                </div>
                                                <div className="flex justify-between border-b pb-1">
                                                    <span>Pisada (Passo):</span>
                                                    <span>{resultado.piso} cm</span>
                                                </div>
                                                <div className="flex justify-between border-b pb-1">
                                                    <span>Comprimento Total (Chão):</span>
                                                    <span>{resultado.comprimentoTotal} m</span>
                                                </div>
                                                {resultado.volumeConcreto && (
                                                    <div className="flex justify-between border-b pb-1 text-emerald-600">
                                                        <span>Volume Concreto (Est.):</span>
                                                        <span>{resultado.volumeConcreto} m³</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-indigo-600">
                                                    <span>Corrimão (Est.):</span>
                                                    <span>{resultado.compCorrimao} m</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Visual Diagram - SVG */}
                                        <div className="relative h-48 border border-border bg-white/50 rounded-lg p-4 print:hidden flex items-center justify-center overflow-hidden">
                                            <svg width="300" height="160" viewBox="0 0 300 160" className="w-full h-full text-primary">
                                                {/* Draw steps using path */}
                                                <path
                                                    d={`
                                                        M 10,150 
                                                        ${[...Array(Math.min(resultado.degraus, 6))].map((_, i) => {
                                                        const stepWidth = 40;
                                                        const stepHeight = 20;
                                                        const x = 10 + (i * stepWidth);
                                                        const y = 150 - ((i + 1) * stepHeight);
                                                        return `L ${x},${y + stepHeight} L ${x},${y} L ${x + stepWidth},${y}`;
                                                    }).join(" ")}
                                                        L ${10 + (Math.min(resultado.degraus, 6) * 40)},150 Z
                                                    `}
                                                    fill="currentColor"
                                                    fillOpacity="0.2"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                />

                                                {/* Labels */}
                                                <g transform="translate(20, 130)">
                                                    <text x="5" y="-10" fontSize="10" fill="#666" fontWeight="bold">E = {resultado.espelho}cm</text>
                                                    <line x1="0" y1="0" x2="0" y2="-20" stroke="#666" strokeWidth="1" markerEnd="url(#arrow)" />
                                                </g>

                                                <g transform="translate(60, 155)">
                                                    <text x="0" y="0" fontSize="10" fill="#666" fontWeight="bold">P = {resultado.piso}cm</text>
                                                    <line x1="-10" y1="-5" x2="30" y2="-5" stroke="#666" strokeWidth="1" />
                                                </g>

                                                <text x="150" y="150" fontSize="10" fill="#999" textAnchor="end">... {resultado.degraus} degraus total</text>
                                            </svg>
                                        </div>
                                    </div>
                                </div>


                                <div className="bg-muted/30 rounded-xl p-6 border border-border">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Ruler className="h-4 w-4" /> Conferência (Lei de Blondel)</h3>
                                    <p className="text-sm text-muted-foreground">
                                        A fórmula de conforto é 2E + P = ~64cm.
                                        <br />
                                        Seu cálculo: <strong>{resultado.formula}</strong> (Está dentro do padrão!)
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <Button asChild variant="outline" className="w-full"><a href={affiliateLinks.structural.stairs} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2" /> VER PROTETORES DE DEGRAU</a></Button>

                                    <Button
                                        onClick={() => {
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Projeto Escada (${resultado.degraus} Degraus)`,
                                                description: `Blondel: ${resultado.degraus} degraus de ${resultado.espelho}cm x ${resultado.piso}cm`,
                                                quantity: 1,
                                                unit: "Projeto",
                                                category: "Projetos",
                                                estimatedPrice: 0 // Apenas projeto
                                            });
                                        }}
                                        variant="default"
                                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white print:hidden"
                                    >
                                        <ArrowUpFromLine className="mr-2 h-4 w-4" /> Salvar no Orçamento
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SEO Content Section */}
                    <div className="mx-auto max-w-2xl mt-12 prose dark:prose-invert text-sm">
                        <div className="mb-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up">
                            <h2 className="text-lg font-bold mb-4 text-foreground">Como usar a Lei de Blondel</h2>
                            <p className="text-muted-foreground mb-4">
                                A regra de ouro para escadas confortáveis é:
                                <br />
                                <strong className="text-foreground">2 Espelhos + 1 Pisada = 63cm a 65cm</strong>
                            </p>
                            <p className="text-muted-foreground">
                                Se o resultado fugir muito desse intervalo, a escada ficará cansativa (passo curto) ou perigosa (passo longo).
                                Além disso, a <strong className="text-foreground">norma NBR 9050</strong> para acessibilidade recomenda degraus com espelho entre 16cm e 18cm e pisada entre 28cm e 32cm para locais públicos.
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto max-w-2xl mt-8">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">Perguntas Frequentes (FAQ)</h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>O que é a Lei de Blondel?</AccordionTrigger>
                                <AccordionContent>
                                    É uma fórmula arquitetônica desenvolvida por Nicolas-François Blondel em 1675 para determinar as dimensões ideais de uma escada. Ela relaciona a altura do degrau com a profundidade da pisada para se adequar ao passo humano natural.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Qual a altura e profundidade ideal para um degrau?</AccordionTrigger>
                                <AccordionContent>
                                    O ideal é que o espelho (altura) tenha entre 16cm e 18cm, e a pisada (profundidade) tenha entre 25cm e 30cm (idealmente 28cm). Essas medidas garantem conforto e segurança para a maioria das pessoas.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Qual a largura mínima de uma escada?</AccordionTrigger>
                                <AccordionContent>
                                    Para residências unifamiliares, a largura mínima recomendada é de 80cm. Para áreas comuns de prédios ou locais públicos, a norma exige largura mínima de 1,20m para permitir a passagem simultânea de duas pessoas.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>Como calcular o número de degraus?</AccordionTrigger>
                                <AccordionContent>
                                    Divide-se a altura total do desnível (em cm) pela altura desejada do espelho (ex: 17,5cm). O resultado, arredondado, é o número de degraus. Depois, recalcula-se o espelho exato dividindo a altura total pelo número de degraus encontrado.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger>O que é espelho e pisada?</AccordionTrigger>
                                <AccordionContent>
                                    Espelho é a parte vertical do degrau, a altura que você sobe. Pisada (ou passo) é a parte horizontal onde você apoia o pé.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger>Quais as regras de segurança para escadas?</AccordionTrigger>
                                <AccordionContent>
                                    Escadas devem ter corrimão contínuo (de preferência em ambos os lados), piso antiderrapante, iluminação adequada e degraus uniformes (todos com a mesma altura). Em locais públicos, exige-se também sinalização podotátil.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-7">
                                <AccordionTrigger>Quais os tipos de escada mais comuns?</AccordionTrigger>
                                <AccordionContent>
                                    Escada Reta (mais simples e segura), Escada em L (com patamar de giro), Escada em U (retorna na direção oposta) e Escada Caracol ou Helicoidal (ocupa menos espaço, mas é menos confortável).
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-8">
                                <AccordionTrigger>Como calcular escada caracol?</AccordionTrigger>
                                <AccordionContent>
                                    O cálculo da altura dos degraus segue a mesma lógica, mas a pisada é variável (estreita no eixo e larga na borda). A pisada útil deve ser medida na "linha de passo", geralmente a 30-50cm do eixo central.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-9">
                                <AccordionTrigger>Quando é necessário um patamar?</AccordionTrigger>
                                <AccordionContent>
                                    Patamares são obrigatórios sempre que há mudança de direção na escada. Em lances retos, recomenda-se um patamar de descanso a cada 2,90m de altura vencida ou no máximo a cada 16-18 degraus.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-10">
                                <AccordionTrigger>Qual o melhor revestimento para escada?</AccordionTrigger>
                                <AccordionContent>
                                    Materiais antiderrapantes e resistentes ao tráfego são ideais. Granito levigado ou flameado, madeira maciça tratada e porcelanatos com acabamento acetinado ou rústico são boas opções. Evite pisos polidos escorregadios.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-11">
                                <AccordionTrigger>Como iluminar uma escada?</AccordionTrigger>
                                <AccordionContent>
                                    A iluminação deve evitar sombras nos degraus. Arandelas de parede, balizadores de rodapé ou fitas de LED embutidas sob o nariz do degrau são excelentes para segurança e estética.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-12">
                                <AccordionTrigger>Posso fazer uma escada sem espelho (vazada)?</AccordionTrigger>
                                <AccordionContent>
                                    Sim, escadas vazadas são leves e modernas. Porém, é preciso cuidado com a segurança de crianças pequenas e animais, para que não caiam entre os degraus. A norma limita o vão livre para evitar acidentes.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-13">
                                <AccordionTrigger>A fórmula de Blondel é exata?</AccordionTrigger>
                                <AccordionContent>
                                    Ela oferece um intervalo de conforto (63-65cm). Nem sempre é possível cravar o valor exato devido à altura do pé-direito, mas manter-se dentro dessa margem garante que a escada não será desconfortável.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-14">
                                <AccordionTrigger>Quanto espaço ocupa uma escada?</AccordionTrigger>
                                <AccordionContent>
                                    O comprimento horizontal da escada é igual a: (Número de Degraus - 1) x Tamanho da Pisada. Uma escada reta com 16 degraus de 28cm ocupará cerca de 4,20m de comprimento no chão (+ patamares se houver).
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-15">
                                <AccordionTrigger>Qual a diferença de escada interna e externa?</AccordionTrigger>
                                <AccordionContent>
                                    Escadas externas devem ter caimento para escoar água da chuva e exigem pisos com maior coeficiente de atrito (antiderrapantes). As dimensões de conforto são as mesmas, mas a durabilidade do material é crítica.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};
export default CalculadoraEscada;
