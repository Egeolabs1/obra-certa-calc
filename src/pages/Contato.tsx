import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MessageSquare, Send, ThumbsUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Contato = () => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [assunto, setAssunto] = useState("sugestao");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !email || !mensagem) {
            toast.error("Por favor, preencha todos os campos.");
            return;
        }

        // In a real app, you would send this to an API (Formspree, EmailJS, etc.)
        // For now, we'll simulate success and open mailto

        const subjectText = `[SuaObraCerta] ${assunto.toUpperCase()}: ${nome}`;
        const bodyText = `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`;

        window.location.href = `mailto:contato@suaobracerta.com.br?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

        toast.success("Redirecionando para seu aplicativo de e-mail...");
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Fale Conosco - Sua Obra Certa"
                description="Entre em contato para enviar sugestões, críticas ou propostas de parceria."
                url="https://suaobracerta.com.br/contato"
                keywords="contato, fale conosco, sugestões, suporte, email"
            />
            <Header />
            <main className="flex-1 container py-12 max-w-4xl">
                <div className="grid md:grid-cols-2 gap-12">

                    {/* Info Side */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-4">Fale Conosco</h1>
                            <p className="text-muted-foreground text-lg">
                                Sua opinião é fundamental para construirmos a melhor ferramenta de obras do Brasil.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                        <ThumbsUp className="h-5 w-5" /> Sugestões
                                    </div>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Tem ideia de uma nova calculadora? Viu algo que podemos melhorar? Adoramos ouvir novas ideias!
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2 text-orange-500 font-semibold">
                                        <AlertTriangle className="h-5 w-5" /> Críticas e Erros
                                    </div>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Encontrou algum cálculo errado ou bug? Por favor, nos avise para corrigirmos o mais rápido possível.
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Contato Direto
                            </h3>
                            <p className="text-muted-foreground mb-4">Se preferir, envie um e-mail diretamente para:</p>
                            <a href="mailto:contato@suaobracerta.com.br" className="text-primary hover:underline font-medium text-lg">
                                contato@suaobracerta.com.br
                            </a>
                        </div>
                    </div>

                    {/* Form Side */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Envie sua Mensagem</CardTitle>
                            <CardDescription>Preencha o formulário abaixo.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome</Label>
                                    <Input
                                        id="nome"
                                        placeholder="Seu nome"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="assunto">Assunto</Label>
                                    <Select value={assunto} onValueChange={setAssunto}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o assunto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sugestao">Sugestão</SelectItem>
                                            <SelectItem value="critica">Crítica / Reportar Erro</SelectItem>
                                            <SelectItem value="parceria">Parceria Comercial</SelectItem>
                                            <SelectItem value="outro">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mensagem">Mensagem</Label>
                                    <Textarea
                                        id="mensagem"
                                        placeholder="Escreva sua mensagem aqui..."
                                        className="min-h-[150px]"
                                        value={mensagem}
                                        onChange={(e) => setMensagem(e.target.value)}
                                    />
                                </div>

                                <Button type="submit" size="lg" className="w-full font-bold">
                                    <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contato;
