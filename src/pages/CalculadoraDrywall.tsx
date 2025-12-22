import { useState } from "react";
import { Calculator, ShoppingCart, ArrowLeft, Layers, Printer, Info, Ruler, Wrench, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import PrintHeader from "@/components/PrintHeader";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";
import { useOrcamento } from "@/context/OrcamentoContext";

interface MateriaisDrywall {
    placas: number;
    montantes: number;
    guias: number;
    parafusosPlaca: number;
    parafusosEstrutura: number;
    fita: number; // metros
    massa: number; // kg
    isolamento?: number; // m² (opcional)
    custoEstimado: number; // R$
}

const CalculadoraDrywall = () => {
    const { addItem } = useOrcamento();
    const [altura, setAltura] = useState("");
    const [comprimento, setComprimento] = useState("");
    const [estrutura, setEstrutura] = useState("parede"); // parede | forro
    const [tipoChapa, setTipoChapa] = useState("standard"); // standard | ru (resistente umidade) | rf (resistente fogo)
    const [espacamentoMontantes, setEspacamentoMontantes] = useState("60"); // 40, 50, 60 cm
    const [incluirIsolamento, setIncluirIsolamento] = useState(false);

    const [resultado, setResultado] = useState<MateriaisDrywall | null>(null);
    const [erro, setErro] = useState("");

    const parseNumero = (valor: string): number => {
        const valorLimpo = valor.replace(",", ".").trim();
        const numero = parseFloat(valorLimpo);
        return isNaN(numero) ? 0 : numero;
    };

    const calcular = () => {
        setErro("");
        setResultado(null);

        const h = parseNumero(altura);
        const l = parseNumero(comprimento);
        const espacamento = parseNumero(espacamentoMontantes) / 100; // converter cm para m

        if (h <= 0 || l <= 0) {
            setErro("Informe altura e comprimento válidos.");
            return;
        }

        if (h > 4.5) {
            setErro("Altura máxima recomendada: 4.5m. Para alturas maiores, consulte um profissional.");
            return;
        }

        const area = h * l;

        // Dimensões padrão da placa (1.20 x 2.40m = 2.88m²)
        const AREA_PLACA = 2.88; // m²
        const LARGURA_PLACA = 1.20; // m
        const ALTURA_PLACA = 2.40; // m
        const COMPRIMENTO_PERFIL = 3.0; // m (montantes e guias padrão)

        // Margem de perda por cortes (5-8%)
        const margemPerda = 1.07;

        let placas = 0;
        let montantes = 0;
        let guias = 0;
        let parafusosPlaca = 0;
        let parafusosEstrutura = 0;
        let fita = 0;
        let massa = 0;
        let isolamento = 0;

        if (estrutura === "parede") {
            // PAREDE (Divisória - 2 faces)
            // Cálculo de placas: área total das duas faces
            const areaTotal = area * 2;
            placas = Math.ceil((areaTotal * margemPerda) / AREA_PLACA);

            // Montantes: espaçamento configurável (40, 50 ou 60cm)
            // Número de montantes = (comprimento / espaçamento) + 1 (montante final)
            const numMontantes = Math.ceil(l / espacamento) + 1;
            // Se altura > 2.40m, pode precisar emendar (considerar 1 peça por montante até 3m)
            montantes = numMontantes * Math.ceil(h / COMPRIMENTO_PERFIL);

            // Guias: 2 guias (teto e chão) com comprimento igual ao comprimento da parede
            guias = Math.ceil((l * 2) / COMPRIMENTO_PERFIL);

            // Parafusos GN25 (placa-metal): ~25-30 por m² de parede
            parafusosPlaca = Math.ceil(areaTotal * 28);

            // Parafusos Metal-Metal (estrutura): ~4-6 por m²
            parafusosEstrutura = Math.ceil(area * 5);

            // Fita de papel: ~3.5m por m² de parede (juntas horizontais e verticais)
            fita = Math.ceil(areaTotal * 3.5);

            // Massa para juntas: ~1.2-1.5 kg por m²
            massa = Math.ceil(areaTotal * 1.3);

            // Isolamento acústico/térmico (opcional)
            if (incluirIsolamento) {
                isolamento = area; // 1 m² de isolamento por m² de parede
            }

        } else {
            // FORRO (Teto - 1 face)
            placas = Math.ceil((area * margemPerda) / AREA_PLACA);

            // Perfis principais (F530): espaçamento de 50cm (padrão forro)
            const espacamentoForro = 0.50;
            const numPerfis = Math.ceil(l / espacamentoForro) + 1;
            montantes = numPerfis * Math.ceil(h / COMPRIMENTO_PERFIL);

            // Tabicas/Cantoneiras: perímetro
            const perimetro = 2 * (h + l);
            guias = Math.ceil(perimetro / COMPRIMENTO_PERFIL);

            // Parafusos para forro: menos que parede
            parafusosPlaca = Math.ceil(area * 18);
            parafusosEstrutura = Math.ceil(area * 4); // Tirantes/Reguladores

            fita = Math.ceil(area * 2.0);
            massa = Math.ceil(area * 0.8);

            if (incluirIsolamento) {
                isolamento = area;
            }
        }

        // Cálculo de custo estimado (valores médios de mercado)
        const precos = {
            placa: tipoChapa === "ru" ? 55 : tipoChapa === "rf" ? 65 : 45, // R$/chapa
            montante: 25, // R$/peça
            guia: 20, // R$/peça
            parafusoPlaca: 0.15, // R$/un
            parafusoEstrutura: 0.12, // R$/un
            fita: 0.50, // R$/m
            massa: 8.00, // R$/kg
            isolamento: 25.00 // R$/m²
        };

        const custoEstimado = 
            (placas * precos.placa) +
            (montantes * precos.montante) +
            (guias * precos.guia) +
            (parafusosPlaca * precos.parafusoPlaca) +
            (parafusosEstrutura * precos.parafusoEstrutura) +
            (fita * precos.fita) +
            (massa * precos.massa) +
            (incluirIsolamento ? isolamento * precos.isolamento : 0);

        setResultado({
            placas: Math.ceil(placas),
            montantes: Math.ceil(montantes),
            guias: Math.ceil(guias),
            parafusosPlaca: Math.ceil(parafusosPlaca / 100) * 100, // Arredondar para caixas de 100
            parafusosEstrutura: Math.ceil(parafusosEstrutura / 50) * 50, // Caixas de 50
            fita: Math.ceil(fita),
            massa: Math.ceil(massa),
            isolamento: incluirIsolamento ? Math.ceil(isolamento) : undefined,
            custoEstimado: Math.round(custoEstimado)
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Drywall e Forros - Gesso Acartonado"
                description="Calcule quantidade de chapas, montantes, guias, parafusos e custos para Drywall. Ferramenta gratuita para divisórias e forros."
                url="https://www.suaobracerta.com.br/calculadora-drywall"
                keywords="calculadora drywall, gesso acartonado, chapas drywall, montantes, guias, forro gesso, parede drywall, orçamento drywall, materiais drywall, placa gesso"
                schema={generateCalculatorSchema(
                    "Calculadora de Drywall",
                    "Ferramenta para cálculo de materiais e custos para paredes e forros de Drywall.",
                    "https://www.suaobracerta.com.br/calculadora-drywall"
                )}
            />
            <div className="print:hidden">
                <Header />
            </div>
            <main className="flex-1">
                <PrintHeader title="Orçamento de Drywall" />
                <div className="container pt-6 print:hidden">
                    <AdPlaceholder id="ad-drywall" className="max-w-3xl mx-auto" />
                </div>
                <div className="container py-8 md:py-12 print:py-0">
                    <div className="mx-auto max-w-2xl print:max-w-full">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground print:hidden"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 animate-fade-up">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-600 print:bg-white print:border print:border-gray-200">
                                    <Layers className="h-6 w-6 text-white print:text-gray-900" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground md:text-3xl print:text-xl">Calculadora de Drywall</h1>
                                    <p className="text-sm text-muted-foreground mt-1 print:hidden">Gesso Acartonado - Divisórias e Forros</p>
                                </div>
                            </div>
                            <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-blue-800 dark:text-blue-200 print:hidden">
                                <p className="flex items-start gap-2">
                                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>Calcule a quantidade exata de materiais necessários para sua obra de Drywall. Considere margem de perda de 7% para cortes.</span>
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-card animate-fade-up print:shadow-none print:border-none print:p-0">
                            <div className="grid gap-6 print:hidden">
                                <div className="space-y-2">
                                    <Label className="text-base font-semibold">Tipo de Instalação</Label>
                                    <Select value={estrutura} onValueChange={setEstrutura}>
                                        <SelectTrigger className="h-12 text-lg"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="parede">🏠 Divisória (Parede) - 2 faces</SelectItem>
                                            <SelectItem value="forro">⬆️ Forro (Teto) - 1 face</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-base">Altura (m)</Label>
                                        <Input 
                                            value={altura} 
                                            onChange={e => setAltura(e.target.value)} 
                                            placeholder="Ex: 2.80" 
                                            className="h-12 text-lg"
                                            type="number"
                                            step="0.01"
                                        />
                                        <p className="text-xs text-muted-foreground">Altura da parede ou forro</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base">Comprimento Total (m)</Label>
                                        <Input 
                                            value={comprimento} 
                                            onChange={e => setComprimento(e.target.value)} 
                                            placeholder="Ex: 5.00" 
                                            className="h-12 text-lg"
                                            type="number"
                                            step="0.01"
                                        />
                                        <p className="text-xs text-muted-foreground">Comprimento linear da parede/forro</p>
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-base flex items-center gap-2">
                                            Tipo de Chapa
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>ST: Standard (áreas secas)<br/>RU: Resistente Umidade (banheiros)<br/>RF: Resistente Fogo</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </Label>
                                        <Select value={tipoChapa} onValueChange={setTipoChapa}>
                                            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="standard">ST - Standard (áreas secas)</SelectItem>
                                                <SelectItem value="ru">RU - Resistente à Umidade (banheiros/cozinhas)</SelectItem>
                                                <SelectItem value="rf">RF - Resistente ao Fogo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base flex items-center gap-2">
                                            Espaçamento dos Montantes
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>60cm: Padrão (mais comum)<br/>50cm: Maior resistência<br/>40cm: Máxima resistência</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </Label>
                                        <Select value={espacamentoMontantes} onValueChange={setEspacamentoMontantes}>
                                            <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="40">40 cm (máxima resistência)</SelectItem>
                                                <SelectItem value="50">50 cm (alta resistência)</SelectItem>
                                                <SelectItem value="60">60 cm (padrão - mais comum)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="isolamento"
                                            checked={incluirIsolamento}
                                            onChange={(e) => setIncluirIsolamento(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="isolamento" className="text-base cursor-pointer">
                                            Incluir isolamento acústico/térmico (lã de vidro ou rocha)
                                        </Label>
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-6">Recomendado para melhorar isolamento acústico e térmico</p>
                                </div>

                                {erro && (
                                    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-800 dark:text-red-200">
                                        ⚠️ {erro}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <Button onClick={calcular} size="xl" className="w-full text-lg font-bold h-14">
                                        <Calculator className="mr-2 h-5 w-5" /> Calcular Materiais
                                    </Button>
                                    {resultado && (
                                        <Button onClick={handlePrint} variant="outline" size="xl" className="w-full border-2 h-14">
                                            <Printer className="mr-2 h-5 w-5" /> Salvar em PDF
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Show inputs summary for print only */}
                            <div className="hidden print:block mb-6 p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-sm mb-2 uppercase text-gray-500">Parâmetros do Cálculo</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">Tipo:</span>
                                        <span className="font-medium">{estrutura === 'parede' ? 'Divisória (Parede)' : 'Forro (Teto)'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Altura:</span>
                                        <span className="font-medium">{altura} m</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Comprimento:</span>
                                        <span className="font-medium">{comprimento} m</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Chapa:</span>
                                        <span className="font-medium">{tipoChapa === "ru" ? "RU" : tipoChapa === "rf" ? "RF" : "ST"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Espaçamento:</span>
                                        <span className="font-medium">{espacamentoMontantes} cm</span>
                                    </div>
                                    {incluirIsolamento && (
                                        <div>
                                            <span className="block text-gray-500">Isolamento:</span>
                                            <span className="font-medium">Sim</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Resultado */}
                        {resultado && (
                            <div className="mt-8 animate-fade-up space-y-6">
                                {/* Card de Custo Estimado */}
                                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 print:bg-white print:border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400 print:text-gray-800">
                                            <DollarSign className="h-5 w-5" />
                                            Custo Estimado dos Materiais
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-black text-green-600 dark:text-green-400 print:text-gray-900">
                                            R$ {resultado.custoEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            *Valores baseados em preços médios de mercado. Consulte fornecedores locais para valores atualizados.
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Tabela de Materiais */}
                                <div className="rounded-xl border border-border overflow-hidden print:border-gray-200 shadow-sm">
                                    <div className="bg-muted/50 px-6 py-3 border-b print:bg-gray-100">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <Wrench className="h-5 w-5" />
                                            Lista de Materiais
                                        </h3>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="print:bg-gray-100">
                                                <TableHead className="print:text-black font-bold">Material</TableHead>
                                                <TableHead className="text-right print:text-black font-bold">Quantidade</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow className="font-medium">
                                                <TableCell>
                                                    Chapas Drywall {tipoChapa === "ru" ? "RU" : tipoChapa === "rf" ? "RF" : "ST"} (1.20 x 2.40m)
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-lg">{resultado.placas} un</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Montantes / Perfis (3m) - Espaçamento {espacamentoMontantes}cm</TableCell>
                                                <TableCell className="text-right">{resultado.montantes} un</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Guias / Tabicas (3m)</TableCell>
                                                <TableCell className="text-right">{resultado.guias} un</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Parafusos GN25 (Placa-Metal)</TableCell>
                                                <TableCell className="text-right">~{resultado.parafusosPlaca} un</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Parafusos Metal-Metal (TRPF 13)</TableCell>
                                                <TableCell className="text-right">~{resultado.parafusosEstrutura} un</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Fita de Papel para Juntas</TableCell>
                                                <TableCell className="text-right">{resultado.fita} m</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Massa para Juntas (PVA ou Gesso)</TableCell>
                                                <TableCell className="text-right">{resultado.massa} kg</TableCell>
                                            </TableRow>
                                            {resultado.isolamento && (
                                                <TableRow className="bg-blue-50 dark:bg-blue-900/20">
                                                    <TableCell className="font-medium">Isolamento Acústico/Térmico</TableCell>
                                                    <TableCell className="text-right font-medium">{resultado.isolamento} m²</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Informações e Avisos */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 text-sm text-yellow-800 dark:text-yellow-200 print:bg-white print:border-yellow-200">
                                        <p className="font-semibold mb-2 flex items-center gap-2">
                                            <Info className="h-4 w-4" />
                                            Importante
                                        </p>
                                        <p>Os valores são estimativas baseadas em instalação padrão. Perdas por cortes podem variar. Consulte um instalador profissional para projetos complexos.</p>
                                    </div>
                                    <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 text-sm text-blue-800 dark:text-blue-200 print:bg-white print:border-blue-200">
                                        <p className="font-semibold mb-2 flex items-center gap-2">
                                            <Ruler className="h-4 w-4" />
                                            Dicas
                                        </p>
                                        <p>Para áreas úmidas, use chapa RU. Para áreas com risco de incêndio, use chapa RF. Espaçamento menor aumenta a resistência.</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 print:hidden">
                                    <Button asChild size="xl" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14">
                                        <a href={affiliateLinks.structural.drywall} target="_blank" rel="noopener noreferrer">
                                            <ShoppingCart className="mr-2 h-5 w-5" /> Ver Materiais na Amazon
                                        </a>
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            const precos = {
                                                placa: tipoChapa === "ru" ? 55 : tipoChapa === "rf" ? 65 : 45,
                                                montante: 25,
                                                guia: 20,
                                                massa: 8,
                                                isolamento: 25
                                            };

                                            // Placas
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Chapas Drywall ${tipoChapa === "ru" ? "RU" : tipoChapa === "rf" ? "RF" : "ST"} (1.20x2.40)`,
                                                description: `${estrutura === 'parede' ? 'Parede' : 'Forro'} ${altura}m x ${comprimento}m`,
                                                quantity: resultado.placas,
                                                unit: "Chapas",
                                                category: "Construção Seca - Drywall",
                                                estimatedPrice: resultado.placas * precos.placa
                                            });
                                            // Montantes
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Montantes/Perfis (3m) - ${espacamentoMontantes}cm`,
                                                description: `Estrutura vertical - Espaçamento ${espacamentoMontantes}cm`,
                                                quantity: resultado.montantes,
                                                unit: "Peças",
                                                category: "Construção Seca - Drywall",
                                                estimatedPrice: resultado.montantes * precos.montante
                                            });
                                            // Guias
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Guias/Tabicas (3m)`,
                                                description: `Estrutura horizontal/perímetro`,
                                                quantity: resultado.guias,
                                                unit: "Peças",
                                                category: "Construção Seca - Drywall",
                                                estimatedPrice: resultado.guias * 20
                                            });
                                            // Massa
                                            addItem({
                                                id: crypto.randomUUID(),
                                                name: `Massa para Juntas`,
                                                description: `Tratamento de juntas`,
                                                quantity: resultado.massa,
                                                unit: "kg",
                                                category: "Construção Seca - Drywall",
                                                estimatedPrice: resultado.massa * precos.massa
                                            });
                                            // Isolamento (se incluído)
                                            if (resultado.isolamento) {
                                                addItem({
                                                    id: crypto.randomUUID(),
                                                    name: `Isolamento Acústico/Térmico`,
                                                    description: `Lã de vidro ou rocha`,
                                                    quantity: resultado.isolamento,
                                                    unit: "m²",
                                                    category: "Construção Seca - Drywall",
                                                    estimatedPrice: resultado.isolamento * precos.isolamento
                                                });
                                            }
                                        }}
                                        variant="outline"
                                        size="xl"
                                        className="w-full border-2 hover:bg-green-50 text-green-700 border-green-200 h-14"
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Orçamento
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Seção de Informações */}
                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 md:p-8 animate-fade-up print:hidden">
                            <h2 className="mb-6 text-xl font-bold text-foreground flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Informações sobre os Materiais
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">📦 Placas (Chapas)</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Tamanho padrão: 1.20 x 2.40m (2.88m²). Para paredes, calculamos chapeamento duplo (ambos os lados). 
                                            <strong className="text-foreground"> ST</strong> (Standard) para áreas secas, 
                                            <strong className="text-foreground"> RU</strong> (Verde) para áreas úmidas, 
                                            <strong className="text-foreground"> RF</strong> (Rosa) para áreas com risco de fogo.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">🔧 Montantes</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Perfis verticais instalados com espaçamento configurável (40, 50 ou 60cm). 
                                            Espaçamento menor aumenta a resistência da estrutura. Padrão de 3m de comprimento.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">📐 Guias</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Perfis horizontais fixados no teto e no chão (paredes) ou no perímetro (forros) 
                                            para sustentar os montantes. Padrão de 3m de comprimento.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">⚙️ Parafusos</h3>
                                        <p className="text-sm text-muted-foreground">
                                            <strong className="text-foreground">GN25:</strong> Para fixar a placa na estrutura metálica. 
                                            <strong className="text-foreground"> TRPF 13:</strong> Para fixar a estrutura (metal-metal). 
                                            Quantidades incluem margem de segurança.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">🎨 Acabamento</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Fita de papel e massa para tratamento de juntas. Quantidade calculada para juntas horizontais e verticais.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-900 dark:text-blue-200">
                                    💡 <strong>Dica Profissional:</strong> Para áreas úmidas (banheiros, cozinhas), sempre use 
                                    <strong> Chapa RU (Verde)</strong>. Para áreas com risco de incêndio, use 
                                    <strong> Chapa RF (Rosa)</strong>. O isolamento acústico/térmico melhora significativamente o conforto.
                                </p>
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

export default CalculadoraDrywall;
