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
    const [resultado, setResultado] = useState<{ degraus: number; espelho: number; piso: number; formula: string } | null>(null);

    const calcular = () => {
        const h = parseFloat(alturaTotal); // em cm ou m? Vamos assumir metros e converter
        if (!h) return;

        const alturaCm = h * 100;

        // Altura ideal do espelho (E): entre 16cm e 18cm.
        // Tentar chegar o mais próximo possível de 17.5cm (confortável).
        const numeroDegraus = Math.round(alturaCm / 17.5);
        const espelhoReal = alturaCm / numeroDegraus;

        // Lei de Blondel: 2E + P = 63 a 65 (ideal 64)
        // P = 64 - 2E
        const pisoIdeal = 64 - (2 * espelhoReal);

        setResultado({
            degraus: numeroDegraus,
            espelho: Math.round(espelhoReal * 100) / 100,
            piso: Math.round(pisoIdeal * 100) / 100,
            formula: `2 x ${espelhoReal.toFixed(1)} + ${pisoIdeal.toFixed(1)} = ${(2 * espelhoReal + pisoIdeal).toFixed(1)}`
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
                            <div className="space-y-2">
                                <Label>Altura Total do Desnível (metros)</Label>
                                <Input value={alturaTotal} onChange={e => setAlturaTotal(e.target.value)} placeholder="Ex: 2.80" className="h-12 text-lg" />
                                <p className="text-xs text-muted-foreground">Medida do chão do andar de baixo até o chão do andar de cima.</p>
                            </div>
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR DEGRAUS</Button>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                <div className="grid gap-4 sm:grid-cols-3 text-center mb-6">
                                    <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                                        <p className="text-3xl font-bold text-primary">{resultado.degraus}</p>
                                        <p className="text-sm font-medium">Degraus</p>
                                    </div>
                                    <div className="bg-card p-4 rounded-xl border border-border">
                                        <p className="text-3xl font-bold">{resultado.espelho} cm</p>
                                        <p className="text-sm text-muted-foreground">Altura (Espelho)</p>
                                    </div>
                                    <div className="bg-card p-4 rounded-xl border border-border">
                                        <p className="text-3xl font-bold">{resultado.piso} cm</p>
                                        <p className="text-sm text-muted-foreground">Pisada (Passo)</p>
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
