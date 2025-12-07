import { useState } from "react";
import { Waves, Calculator, ShoppingCart, ArrowLeft, Droplet } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CalculadoraPiscina = () => {
    const [formato, setFormato] = useState("retangular");
    // Mensuras
    const [comprimento, setComprimento] = useState("");
    const [largura, setLargura] = useState("");
    const [profundidade, setProfundidade] = useState(""); // media
    const [diametro, setDiametro] = useState("");

    const [volume, setVolume] = useState<number | null>(null);

    const calcular = () => {
        let vol = 0;
        const prof = parseFloat(profundidade);
        if (!prof) return;

        if (formato === "retangular") {
            const c = parseFloat(comprimento);
            const l = parseFloat(largura);
            if (c && l) vol = c * l * prof;
        } else if (formato === "redonda") {
            const d = parseFloat(diametro);
            if (d) {
                const r = d / 2;
                vol = Math.PI * r * r * prof;
            }
        } else if (formato === "oval") {
            const c = parseFloat(comprimento);
            const l = parseFloat(largura);
            if (c && l) vol = c * l * prof * 0.85; // Aproximação comum para ovais
        }

        setVolume(Math.round(vol * 100) / 100);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container pt-6"><AdPlaceholder id="ad-piscina" className="max-w-3xl mx-auto" /></div>
                <div className="container py-8 md:py-12">
                    <div className="mx-auto max-w-2xl">
                        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Link>

                        <div className="mb-8 font-bold text-2xl flex items-center gap-3">
                            <div className="bg-blue-400 rounded-xl p-3 text-white"><Waves /></div>
                            <h1>Calculadora de Piscina</h1>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
                            <Tabs defaultValue="retangular" onValueChange={setFormato}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="retangular">Retangular</TabsTrigger>
                                    <TabsTrigger value="redonda">Redonda</TabsTrigger>
                                    <TabsTrigger value="oval">Oval</TabsTrigger>
                                </TabsList>

                                <div className="mt-4 space-y-4">
                                    {formato !== "redonda" && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Comprimento (m)</Label>
                                                <Input value={comprimento} onChange={e => setComprimento(e.target.value)} placeholder="Ex: 6.0" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Largura (m)</Label>
                                                <Input value={largura} onChange={e => setLargura(e.target.value)} placeholder="Ex: 3.0" />
                                            </div>
                                        </div>
                                    )}
                                    {formato === "redonda" && (
                                        <div className="space-y-2">
                                            <Label>Diâmetro (m)</Label>
                                            <Input value={diametro} onChange={e => setDiametro(e.target.value)} placeholder="Ex: 4.0" />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label>Profundidade Média (m)</Label>
                                        <Input value={profundidade} onChange={e => setProfundidade(e.target.value)} placeholder="Ex: 1.40" />
                                    </div>
                                </div>
                            </Tabs>
                            <Button onClick={calcular} size="xl" className="w-full">CALCULAR VOLUME</Button>
                        </div>

                        {volume !== null && (
                            <div className="mt-8 animate-scale-in">
                                <div className="bg-gradient-result p-8 rounded-xl border-2 border-primary text-center mb-6">
                                    <p className="text-xl">Sua piscina tem aprox.</p>
                                    <p className="text-5xl font-extrabold text-blue-600 my-3">{volume} m³</p>
                                    <p className="text-lg text-muted-foreground">({Math.round(volume * 1000).toLocaleString('pt-BR')} Litros)</p>
                                </div>

                                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Droplet className="text-blue-500" /> Dosagem Química Semanal</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <span>Cloro Granulado (4g/1000L)</span>
                                            <span className="font-bold">{(volume * 4).toFixed(0)}g</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <span>Algicida Manutenção (5ml/1000L)</span>
                                            <span className="font-bold">{(volume * 5).toFixed(0)}ml</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <span>Clarificante (4ml/1000L)</span>
                                            <span className="font-bold">{(volume * 4).toFixed(0)}ml</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Barrilha (Se pH baixo)</span>
                                            <span className="font-bold">{(volume * 16).toFixed(0)}g</span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <Button asChild variant="default" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                            <a href="#" target="_blank"><ShoppingCart className="mr-2" /> COMPRAR CLORO BARATO</a>
                                        </Button>
                                    </div>
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
export default CalculadoraPiscina;
