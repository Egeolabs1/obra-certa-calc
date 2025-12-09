import { useState } from "react";
import { Copy, Calculator, ShoppingCart, ExternalLink, ArrowLeft, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { affiliateLinks } from "@/config/affiliateLinks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SEO from "@/components/SEO";
import { generateCalculatorSchema } from "@/utils/schemas";

interface MateriaisDrywall {
    placas: number;
    montantes: number;
    guias: number;
    parafusosPlaca: number;
    parafusosEstrutura: number;
    fita: number; // metros
    massa: number; // kg
}

const CalculadoraDrywall = () => {
    const [altura, setAltura] = useState("");
    const [comprimento, setComprimento] = useState("");
    const [tipo, setTipo] = useState("simples"); // simples (1 chapa cada lado) ou dupla (2 chapas cada lado - raramente usado em calculadoras simples, melhor focar em Parede (2 faces) ou Forro (1 face))
    // Melhor: Parede (Divisória) ou Forro (Teto)? 
    // O usuário pediu "Calculadora de Drywall (Gesso) - divisória". Então assumirei Divisória Standard (Parede).
    // Divisória tem 2 faces. Forro tem 1 face.
    const [estrutura, setEstrutura] = useState("parede"); // parede | forro

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

        if (h <= 0 || l <= 0) {
            setErro("Informe altura e comprimento válidos.");
            return;
        }

        const area = h * l;

        // Parâmetros baseados em manuais (Knauf/Placo)
        // Placa ST 1.20 x 1.80 = 2.16m² (ou 1.20 x 2.40 = 2.88m²)
        // Vamos usar a área padrão da placa 1.20x2.40 (mais comum para pé direito padrão) = 2.88m²
        // Se for parede: área * 2 (duas faces). Se for forro: área * 1.

        // Fatores de consumo aproximados por m² de parede pronta (2 faces) ou forro
        // Estrutura 600mm distância montantes

        let placas = 0;
        let montantes = 0;
        let guias = 0;
        let parafusosPlaca = 0; // GN25
        let parafusosEstrutura = 0; // TRPF 13 (Metal-Metal)
        let fita = 0;
        let massa = 0;

        // Margem de perda 5%
        const margem = 1.05;

        if (estrutura === "parede") {
            // PAREDE (Divisória W111 - Estrutura Simples, 1 Chapa cada lado)
            // Placas: 2m² de placa por m² de parede (lados A e B) * 1.05
            placas = (area * 2 * margem) / 2.88;

            // Montantes (a cada 60cm): (Comprimento / 0.60) * Fator
            // Estimativa por m²: ~2.2 m linear / m² parede? Ou melhor calcular peças.
            // Peças de montante (3m altura padrão): A cada 60cm + 1 final.
            const numMontantes = Math.ceil(l / 0.60) + 1;
            // Se altura parede > 3m, precisa emendar (não vamos complicar tanto, assumir pé direito até 3m ou peças de montante equivalentes)
            montantes = numMontantes; // Unidades de 3m

            // Guias: Teto e Chão. Comprimento * 2. 
            // Peças de guia (3m padrão): (Comprimento * 2) / 3
            guias = (l * 2) / 3;

            // Parafusos
            parafusosPlaca = area * 25; // ~25 a 30 por m² de parede
            parafusosEstrutura = area * 5; // Metal Metal

            // Tratamento juntas
            fita = area * 3.5; // ~3 a 3.5m por m² de parede
            massa = area * 1.5; // ~1 kg por m² (apenas tratamento de juntas, não massa corrida total)

        } else {
            // FORRO (F47)
            // Placas: 1 face
            placas = (area * margem) / 2.88;

            // Perfis F530 (Canaleta) a cada 50cm
            montantes = (l / 0.50) * (h / 3); // Aproximação grosseira para perfil F530 3m. 
            // OBS: "Montante" no forro vira Perfil. Vamos manter o nome genérico "Perfis/Montantes".

            // Tabica/Cantoneira (Perímetro)
            guias = (2 * (h + l)) / 3;

            parafusosPlaca = area * 15;
            parafusosEstrutura = area * 5; // Tirante/Regulador
            fita = area * 1.8;
            massa = area * 0.6;
        }

        setResultado({
            placas: Math.ceil(placas),
            montantes: Math.ceil(montantes),
            guias: Math.ceil(guias),
            parafusosPlaca: Math.ceil(parafusosPlaca / 50) * 50, // Caixa de 50 ou 100? Arredondar para cima.
            parafusosEstrutura: Math.ceil(parafusosEstrutura / 50) * 50,
            fita: Math.ceil(fita),
            massa: Math.ceil(massa)
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Calculadora de Drywall e Forros"
                description="Calcule quantidade de chapas, montantes, guias e parafusos para Drywall."
                url="https://suaobracerta.com.br/calculadora-drywall"
                schema={generateCalculatorSchema(
                    "Calculadora de Drywall",
                    "Ferramenta para cálculo de materiais para paredes e forros de Drywall.",
                    "https://suaobracerta.com.br/calculadora-drywall"
                )}
            />
            <Header />
            <main className="flex-1">
                <div className="container pt-6">
                    <AdPlaceholder id="ad-drywall" className="max-w-3xl mx-auto" />
                </div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 animate-fade-up">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-600">
                                    <Layers className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-foreground md:text-3xl">Calculadora de Drywall</h1>
                            </div>
                            <p className="text-muted-foreground">Calcule materiais para divisórias e forros de gesso acartonado.</p>
                        </div>

                        {/* Form */}
                        <div className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-up">
                            <div className="grid gap-5">
                                <div className="space-y-2">
                                    <Label>Tipo de Instalação</Label>
                                    <Select value={estrutura} onValueChange={setEstrutura}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="parede">Divisória (Parede)</SelectItem>
                                            <SelectItem value="forro">Forro (Teto)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Altura (m)</Label>
                                        <Input value={altura} onChange={e => setAltura(e.target.value)} placeholder="Ex: 2.80" className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Comprimento Total (m)</Label>
                                        <Input value={comprimento} onChange={e => setComprimento(e.target.value)} placeholder="Ex: 5.00" className="h-12" />
                                    </div>
                                </div>

                                {erro && <div className="text-destructive text-sm">{erro}</div>}

                                <Button onClick={calcular} size="xl" className="w-full mt-2"><Calculator className="mr-2 h-5 w-5" /> Calcular Materiais</Button>
                            </div>
                        </div>

                        {/* Resultado */}
                        {resultado && (
                            <div className="mt-8 animate-fade-up space-y-6">
                                <div className="rounded-xl border border-border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Material</TableHead>
                                                <TableHead className="text-right">Quantidade Estimada</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-medium">Chapas Drywall (1.20 x 2.40m)</TableCell>
                                                <TableCell className="text-right font-bold text-lg">{resultado.placas} un</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Montantes / Perfis (3m)</TableCell>
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
                                                <TableCell>Parafusos Metal-Metal</TableCell>
                                                <TableCell className="text-right">~{resultado.parafusosEstrutura} un</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Fita de Papel</TableCell>
                                                <TableCell className="text-right">{resultado.fita} m</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Massa para Juntas</TableCell>
                                                <TableCell className="text-right">{resultado.massa} kg</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 text-sm text-yellow-600 dark:text-yellow-400">
                                    ⚠️ <strong>Atenção:</strong> Os valores são estimativas baseadas em instalação padrão. Perdas por cortes podem variar. Sempre consulte um instalador profissional.
                                </div>

                                <Button asChild variant="success" size="xl" className="w-full">
                                    <a href={affiliateLinks.structural.drywall} target="_blank" rel="noopener noreferrer"><ShoppingCart className="mr-2 h-5 w-5" /> ORÇAR MATERIAIS ONLINE</a>
                                </Button>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
                            <h2 className="mb-4 text-lg font-semibold text-foreground">
                                🏗️ Detalhes dos Materiais
                            </h2>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <p><strong>Placas (Chapas):</strong> Consideramos o tamanho padrão de 1.20 x 2.40m (2.88m²). Para paredes, calculamos chapeamento duplo (ambos os lados).</p>
                                <p><strong>Montantes:</strong> Perfis verticais instalados a cada 60cm de distância (padrão).</p>
                                <p><strong>Guias:</strong> Perfis horizontais fixados no teto e no chão para sustentar os montantes.</p>
                                <p><strong>Parafusos:</strong> Inclui parafusos GN25 (para fixar a placa no metal) e Metal-Metal (para fixar a estrutura).</p>
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-xs">
                                    💡 <strong>Dica:</strong> Para áreas úmidas (banheiros, cozinhas), lembre-se de comprar a <strong>Chapa Verde (RU)</strong> que é resistente à umidade.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CalculadoraDrywall;
