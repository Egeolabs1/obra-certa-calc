import { useState } from "react";
import { Scale, Calculator, ShoppingCart, ArrowLeft, Info, Printer, Layers } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";
import { ProductCard } from "@/components/ProductCard";

interface ResultadoCalculo {
    pesoTotal: number;
    pesoPorMetro?: number;
    descricao: string;
}

const CalculadoraPesoAluminio = () => {
    const { addItem } = useOrcamento();
    const [tipoPerfil, setTipoPerfil] = useState("chapa");

    // States for dimensions (all in mm unless specified)
    const [largura, setLargura] = useState("");
    const [altura, setAltura] = useState("");
    const [espessura, setEspessura] = useState("");
    const [diametro, setDiametro] = useState("");
    const [comprimento, setComprimento] = useState(""); // in meters
    const [quantidade, setQuantidade] = useState("1");

    const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
    const [erro, setErro] = useState("");

    const DENSIDADE_ALUMINIO = 2.71; // g/cm³

    const calcular = () => {
        setErro("");
        setResultado(null);

        const qtd = parseFloat(quantidade) || 1;
        const comp = parseFloat(comprimento);
        if (!comp || comp <= 0) {
            setErro("Por favor, informe o comprimento da peça.");
            return;
        }

        let volumeCm3 = 0; // Volume total da peça em cm³
        let areaSecaoCm2 = 0; // Área da seção transversal em cm²

        // Helper to parse inputs (mm to cm)
        const getCm = (val: string) => parseFloat(val) / 10;

        try {
            if (tipoPerfil === "chapa") {
                const larg = getCm(largura);
                const esp = getCm(espessura);
                if (!larg || !esp) throw new Error("Informe largura e espessura.");
                areaSecaoCm2 = larg * esp;
            }
            else if (tipoPerfil === "barra_chata") {
                const larg = getCm(largura);
                const esp = getCm(espessura);
                if (!larg || !esp) throw new Error("Informe largura e espessura.");
                areaSecaoCm2 = larg * esp;
            }
            else if (tipoPerfil === "barra_redonda") {
                const diam = getCm(diametro);
                if (!diam) throw new Error("Informe o diâmetro.");
                const raio = diam / 2;
                areaSecaoCm2 = Math.PI * Math.pow(raio, 2);
            }
            else if (tipoPerfil === "barra_quadrada") {
                const lado = getCm(largura); // Reusing largura as side
                if (!lado) throw new Error("Informe a medida do lado.");
                areaSecaoCm2 = lado * lado;
            }
            else if (tipoPerfil === "tubo_redondo") {
                const diamExt = getCm(diametro);
                const parede = getCm(espessura);
                if (!diamExt || !parede) throw new Error("Informe diâmetro e espessura da parede.");
                if (parede * 2 >= diamExt) throw new Error("A parede deve ser menor que o raio.");
                const raioExt = diamExt / 2;
                const raioInt = raioExt - parede;
                areaSecaoCm2 = (Math.PI * Math.pow(raioExt, 2)) - (Math.PI * Math.pow(raioInt, 2));
            }
            else if (tipoPerfil === "tubo_retangular") {
                const larg = getCm(largura);
                const alt = getCm(altura);
                const parede = getCm(espessura);
                if (!larg || !alt || !parede) throw new Error("Informe largura, altura e espessura.");
                // Simplified calculation: Outer Area - Inner Area
                const areaExt = larg * alt;
                const areaInt = (larg - (2 * parede)) * (alt - (2 * parede));
                if (areaInt < 0) throw new Error("Espessura muito grande para as dimensões.");
                areaSecaoCm2 = areaExt - areaInt;
            }
            else if (tipoPerfil === "cantoneira") {
                const aba = getCm(largura); // Assuming equal legs for simplicity or ask for both? Let's assume equal legs L-profile for now or use width/height
                const esp = getCm(espessura);
                if (!aba || !esp) throw new Error("Informe tamanho da aba e espessura.");
                // Area approx = (Aba * Esp) + ((Aba - Esp) * Esp)
                areaSecaoCm2 = (aba * esp) + ((aba - esp) * esp);
            }
            else {
                throw new Error("Perfil não selecionado.");
            }

            // Convert Length (m) to cm
            const compCm = comp * 100;
            volumeCm3 = areaSecaoCm2 * compCm;

            // Weight in grams = Volume * Density
            const pesoGramas = volumeCm3 * DENSIDADE_ALUMINIO;
            const pesoKg = pesoGramas / 1000;
            const pesoTotal = pesoKg * qtd;

            setResultado({
                pesoTotal: Math.round(pesoTotal * 100) / 100,
                pesoPorMetro: Math.round((pesoKg / comp) * 1000) / 1000,
                descricao: `${qtd}x ${formatarNomePerfil(tipoPerfil)}`
            });

        } catch (err: any) {
            setErro(err.message || "Verifique as medidas informadas.");
        }
    };

    const formatarNomePerfil = (tipo: string) => {
        return tipo.replace("_", " ").toUpperCase();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Peso de Alumínio | Perfis, Chapas e Tubos"
                description="Calcule o peso teórico de perfis de alumínio: chapas, barras, tubos e cantoneiras. Ideal para orçamentos e projetos de serralheira e engenharia."
                url="https://suaobracerta.com.br/calculadora-peso-aluminio"
                keywords="calculadora peso aluminio, densidade aluminio, peso chapa aluminio, peso barra chata, tabela peso aluminio, quanto pesa aluminio, perfil aluminio peso, serralheria calculo"
                schema={generateCalculatorSchema(
                    "Calculadora de Peso de Alumínio",
                    "Ferramenta para calcular peso de perfis de alumínio.",
                    "https://suaobracerta.com.br/calculadora-peso-aluminio"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>

            <main className="flex-1">
                <PrintHeader title="Calculadora de Peso - Alumínio" />
                <div className="container pt-6 print:hidden">
                    <AdPlaceholder id="ad-topo-aluminio" className="max-w-3xl mx-auto" />
                </div>

                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden">
                            <ArrowLeft className="h-4 w-4" /> Voltar
                        </Link>

                        <div className="mb-8 animate-fade-up print:hidden">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-600">
                                    <Scale className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                                    Calculadora Peso de Alumínio
                                </h1>
                            </div>
                            <p className="text-muted-foreground">
                                Estime o peso de materiais de alumínio para compras e projetos. Base de cálculo: 2,71 g/cm³.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-up print:hidden">
                            <div className="grid gap-5">

                                {/* Tipo de Perfil */}
                                <div className="space-y-2">
                                    <Label>Tipo de Perfil</Label>
                                    <Select value={tipoPerfil} onValueChange={setTipoPerfil}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="chapa">Chapa / Placa</SelectItem>
                                            <SelectItem value="barra_chata">Barra Chata</SelectItem>
                                            <SelectItem value="barra_redonda">Barra Redonda (Maciça)</SelectItem>
                                            <SelectItem value="barra_quadrada">Barra Quadrada (Maciça)</SelectItem>
                                            <SelectItem value="tubo_redondo">Tubo Redondo</SelectItem>
                                            <SelectItem value="tubo_retangular">Tubo Retangular / Quadrado</SelectItem>
                                            <SelectItem value="cantoneira">Cantoneira (Abas Iguais)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Inputs Dinâmicos */}
                                <div className="grid gap-4 sm:grid-cols-2">

                                    {/* Largura */}
                                    {(tipoPerfil === "chapa" || tipoPerfil === "barra_chata" || tipoPerfil === "barra_quadrada" || tipoPerfil === "tubo_retangular" || tipoPerfil === "cantoneira") && (
                                        <div className="space-y-2">
                                            <Label>
                                                {tipoPerfil === "barra_quadrada" || tipoPerfil === "tubo_retangular" ? "Lado / Largura (mm)" : "Largura (mm)"}
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder="Ex: 50"
                                                value={largura}
                                                onChange={e => setLargura(e.target.value)}
                                                className="h-12"
                                            />
                                        </div>
                                    )}

                                    {/* Altura */}
                                    {(tipoPerfil === "tubo_retangular") && (
                                        <div className="space-y-2">
                                            <Label>Altura (mm)</Label>
                                            <Input
                                                type="number"
                                                placeholder="Ex: 25"
                                                value={altura}
                                                onChange={e => setAltura(e.target.value)}
                                                className="h-12"
                                            />
                                        </div>
                                    )}

                                    {/* Diâmetro */}
                                    {(tipoPerfil === "barra_redonda" || tipoPerfil === "tubo_redondo") && (
                                        <div className="space-y-2">
                                            <Label>Diâmetro Externo (mm)</Label>
                                            <Input
                                                type="number"
                                                placeholder="Ex: 25.4"
                                                value={diametro}
                                                onChange={e => setDiametro(e.target.value)}
                                                className="h-12"
                                            />
                                        </div>
                                    )}

                                    {/* Espessura */}
                                    {(tipoPerfil === "chapa" || tipoPerfil === "barra_chata" || tipoPerfil === "tubo_redondo" || tipoPerfil === "tubo_retangular" || tipoPerfil === "cantoneira") && (
                                        <div className="space-y-2">
                                            <Label>
                                                {tipoPerfil.includes("tubo") ? "Espessura da Parede (mm)" : "Espessura (mm)"}
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder="Ex: 2"
                                                value={espessura}
                                                onChange={e => setEspessura(e.target.value)}
                                                className="h-12"
                                            />
                                        </div>
                                    )}

                                    {/* Comprimento */}
                                    <div className="space-y-2">
                                        <Label>Comprimento da Peça (metros)</Label>
                                        <Input
                                            type="number"
                                            placeholder="Ex: 6.00"
                                            value={comprimento}
                                            onChange={e => setComprimento(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>

                                    {/* Quantidade */}
                                    <div className="space-y-2">
                                        <Label>Quantidade (unidades)</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            placeholder="1"
                                            value={quantidade}
                                            onChange={e => setQuantidade(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                </div>

                                {erro && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                        {erro}
                                    </div>
                                )}

                                <Button onClick={calcular} size="xl" className="w-full mt-2 bg-slate-700 hover:bg-slate-800">
                                    <Calculator className="h-5 w-5 mr-2" />
                                    CALCULAR PESO
                                </Button>
                            </div>
                        </div>

                        {resultado && (
                            <div className="mt-8 animate-scale-in">
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-xl border-2 border-slate-200 text-center print:bg-white print:border-black print:text-left print:p-0">
                                    <p className="text-xl print:text-gray-600">Peso Total Estimado:</p>
                                    <p className="text-5xl font-extrabold text-slate-800 my-3 print:text-black">
                                        {resultado.pesoTotal.toLocaleString('pt-BR')} kg
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        {resultado.descricao} (Aprox. {resultado.pesoPorMetro?.toLocaleString('pt-BR')} kg/m)
                                    </p>

                                    <div className="grid gap-3 print:hidden">
                                        <Button
                                            onClick={() => {
                                                addItem({
                                                    id: crypto.randomUUID(),
                                                    name: `Alumínio - ${formatarNomePerfil(tipoPerfil)}`,
                                                    description: `${resultado.descricao} | ${resultado.pesoTotal}kg total`,
                                                    quantity: parseFloat(quantidade),
                                                    unit: "Unid",
                                                    category: "Serralheria",
                                                    estimatedPrice: resultado.pesoTotal * 35 // Estimativa R$35/kg
                                                });
                                            }}
                                            variant="outline"
                                            size="xl"
                                            className="w-full border-slate-200 hover:bg-slate-200 text-slate-700"
                                        >
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            Adicionar ao Orçamento
                                        </Button>
                                        <Button
                                            onClick={handlePrint}
                                            variant="ghost"
                                            className="w-full text-muted-foreground"
                                        >
                                            <Printer className="h-4 w-4 mr-2" />
                                            Imprimir Resultado
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 print:hidden">
                            <AdPlaceholder id="ad-meio-aluminio" />
                        </div>

                        {/* Explicações e FAQ */}
                        <div className="mt-12 space-y-8 print:hidden">
                            <div className="rounded-xl border border-border bg-muted/30 p-6">
                                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                                    <Layers className="h-5 w-5" />
                                    Como é calculado o peso do alumínio?
                                </h2>
                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <p>O cálculo baseia-se no volume da peça multiplicado pela densidade do material.</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li><strong>Densidade utilizada:</strong> 2,71 g/cm³ (média para ligas comuns como 6063).</li>
                                        <li><strong>Fórmula Geral:</strong> Peso = Área da Seção (cm²) × Comprimento (cm) × Densidade.</li>
                                    </ul>
                                    <p>Importante: O peso real pode variar ligeiramente de acordo com a liga específica (ex: 6061, 5052) e as tolerâncias de fabricação do perfil.</p>
                                </div>
                            </div>

                            <div className="mx-auto max-w-2xl">
                                <h2 className="mb-4 text-lg font-semibold">Perguntas Frequentes (FAQ)</h2>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Qual a densidade do alumínio usada no cálculo?</AccordionTrigger>
                                        <AccordionContent>
                                            Utilizamos 2,71 g/cm³, que é o padrão para alumínio puro e ligas comuns de extrusão como a 6063. Outras ligas podem variar entre 2,6 a 2,8 g/cm³.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>O que é liga 6063?</AccordionTrigger>
                                        <AccordionContent>
                                            É a liga mais comum para perfis arquitetônicos (janelas, portas, tubos), conhecida por boa resistência à corrosão e excelente acabamento superficial.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Como calcular peso de chapa xadrez?</AccordionTrigger>
                                        <AccordionContent>
                                            Para chapa xadrez (piso de ônibus/anti-derrapante), deve-se adicionar cerca de 10% a 15% ao peso da chapa lisa de mesma espessura devido aos relevos.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>Alumínio enferruja?</AccordionTrigger>
                                        <AccordionContent>
                                            Não enferruja como o ferro, mas sofre oxidação. Essa camada de óxido protege o material. Para ambientes marinhos, recomenda-se anodização ou pintura eletrostática.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>Qual a diferença entre anodização e pintura?</AccordionTrigger>
                                        <AccordionContent>
                                            Anodização é um processo eletroquímico que cria uma camada protetora dura e integrada ao metal (aspecto metálico). Pintura (eletrostática) é uma camada de tinta pó curada (cores sólidas e variadas).
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-6">
                                        <AccordionTrigger>O peso varia com a temperatura?</AccordionTrigger>
                                        <AccordionContent>
                                            O peso (massa) não muda, mas o volume sim (dilatação). Para fins de compra e venda (kg), a temperatura ambiente não afeta o resultado significativamente.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-7">
                                        <AccordionTrigger>Como converter milímetros para polegadas?</AccordionTrigger>
                                        <AccordionContent>
                                            Divida o valor em mm por 25,4. Exemplo: 25,4mm = 1 polegada; 12,7mm = 1/2 polegada.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-8">
                                        <AccordionTrigger>Alumínio é mais leve que aço?</AccordionTrigger>
                                        <AccordionContent>
                                            Sim, o alumínio é aproximadamente 1/3 do peso do aço. (Densidade Alumínio ~2,7 vs Aço ~7,85).
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-9">
                                        <AccordionTrigger>Para que serve a tempera (T4, T5, T6)?</AccordionTrigger>
                                        <AccordionContent>
                                            Indica o tratamento térmico. T5 é comum em perfis de janelas (resfriado após extrusão). T6 é mais resistente (tratamento de solubilização e envelhecimento), usado em bicicletas e estruturas.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-10">
                                        <AccordionTrigger>Posso soldar qualquer alumínio?</AccordionTrigger>
                                        <AccordionContent>
                                            A maioria das ligas é soldável (TIG/MIG), mas requer técnica e equipamento específico. Ligas da série 2000 e 7000 são mais difíceis ou não soldáveis.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-11">
                                        <AccordionTrigger>O que é 'bitola' do alumínio?</AccordionTrigger>
                                        <AccordionContent>
                                            Refere-se geralmente à espessura da parede do perfil ou diâmetro. Quanto maior a bitola, mais resistente e pesado é o perfil.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-12">
                                        <AccordionTrigger>Alumínio reciclável perde qualidade?</AccordionTrigger>
                                        <AccordionContent>
                                            Não. O alumínio pode ser reciclado infinitamente sem perder suas propriedades, economizando 95% da energia necessária para produzir alumínio novo (primário).
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-13">
                                        <AccordionTrigger>Qual a tolerância das medidas?</AccordionTrigger>
                                        <AccordionContent>
                                            Perfis comerciais têm pequenas variações (norma ABNT NBR 8116). O peso real pode variar +/- 10% dependendo da complexidade do perfil.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-14">
                                        <AccordionTrigger>Como limpar alumínio anodizado?</AccordionTrigger>
                                        <AccordionContent>
                                            Água, detergente neutro e esponja macia. Evite ácidos, sodas ou materiais abrasivos que risquem a camada anódica.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-15">
                                        <AccordionTrigger>Onde comprar perfis de alumínio?</AccordionTrigger>
                                        <AccordionContent>
                                            Em distribuidoras de metais, serralherias ou lojas de material de construção (para perfis simples). Para grandes quantidades, direto em extrusoras ou revendas especializadas.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>

                        {/* Affiliate Products */}
                        <div className="mt-8 mb-8 print:hidden">
                            <h3 className="font-bold text-sm mb-4 uppercase text-muted-foreground flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" /> Ferramentas para Serralheira
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ProductCard
                                    title="Esquadro de Alumínio Profissional"
                                    image="https://m.media-amazon.com/images/I/41D+9+a+K+L._AC._SR360,460.jpg"
                                    price="R$ 39,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="Medição"
                                />
                                <ProductCard
                                    title="Disco de Corte para Alumínio 12pol"
                                    image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                                    price="R$ 189,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="Corte"
                                />
                                <ProductCard
                                    title="Rebitadeira Manual Profissional"
                                    image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                                    price="R$ 55,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="Ferramentas"
                                />
                                <ProductCard
                                    title="Óculos de Proteção Incolor"
                                    image="https://m.media-amazon.com/images/I/51p+f+w+pJL._AC_SX679_.jpg"
                                    price="R$ 12,90"
                                    link="https://amzn.to/3VjQjOq"
                                    category="EPI"
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

export default CalculadoraPesoAluminio;
