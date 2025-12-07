import { Paintbrush, LayoutGrid, Boxes, Container, Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalculatorCard from "@/components/CalculatorCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-primary animate-fade-up">
                <Calculator className="h-4 w-4" />
                Ferramentas gratuitas para sua obra
              </div>
              
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-card md:text-5xl lg:text-6xl animate-fade-up" style={{ animationDelay: "100ms" }}>
                Calcule sua Reforma{" "}
                <span className="text-primary">sem Desperdício</span>
              </h1>
              
              <p className="mb-8 text-lg text-card/80 md:text-xl animate-fade-up" style={{ animationDelay: "200ms" }}>
                Ferramentas precisas e gratuitas para calcular materiais de construção. 
                Economize dinheiro e evite sobras ou faltas na sua obra.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
                <Button asChild variant="hero" size="lg">
                  <Link to="/calculadora-tinta">
                    Calcular Tinta Agora
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-card/30 text-card hover:bg-card hover:text-foreground">
                  <a href="#calculadoras">
                    Ver Todas as Ferramentas
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Grid Section */}
        <section id="calculadoras" className="py-16 md:py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Nossas Calculadoras
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Escolha a ferramenta ideal para calcular os materiais da sua obra. 
                Resultados precisos em segundos.
              </p>
            </div>
            
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <CalculatorCard
                icon={Paintbrush}
                title="Calculadora de Tinta"
                description="Descubra quantos litros de tinta você precisa para pintar paredes."
                href="/calculadora-tinta"
                delay={0}
              />
              <CalculatorCard
                icon={LayoutGrid}
                title="Calculadora de Pisos"
                description="Calcule cerâmica e porcelanato com margem de corte inclusa."
                href="/calculadora-pisos"
                delay={100}
              />
              <CalculatorCard
                icon={Boxes}
                title="Calculadora de Tijolos"
                description="Tijolos e argamassa para erguer suas paredes."
                href="/calculadora-tijolos"
                delay={200}
              />
              <CalculatorCard
                icon={Container}
                title="Calculadora de Concreto"
                description="Cimento, areia, brita e água para fundações e lajes."
                href="/calculadora-concreto"
                delay={300}
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-y border-border bg-muted/30 py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center animate-fade-up">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Economize Dinheiro</h3>
                <p className="text-sm text-muted-foreground">
                  Compre apenas o necessário, sem desperdício de material
                </p>
              </div>
              <div className="text-center animate-fade-up" style={{ animationDelay: "100ms" }}>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Resultado Instantâneo</h3>
                <p className="text-sm text-muted-foreground">
                  Cálculos precisos em segundos, direto no seu navegador
                </p>
              </div>
              <div className="text-center animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="mb-2 font-semibold text-foreground">100% Gratuito</h3>
                <p className="text-sm text-muted-foreground">
                  Use no celular ou computador, sem cadastro necessário
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Placeholder */}
        <div className="container py-8">
          <AdPlaceholder id="ad-home-footer" className="max-w-3xl mx-auto" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
