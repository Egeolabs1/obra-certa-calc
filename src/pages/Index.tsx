import { Paintbrush, LayoutGrid, Boxes, Container, Calculator, ArrowRight, Wind, Layers, Grid3X3, Home, Lightbulb, Droplets, Flower2, LayoutDashboard, Waves, Scroll, Blinds, Zap, Flame, ArrowUpFromLine, TrendingUp, AppWindow, Hammer, AlignHorizontalJustifyStart, Plug, ClipboardCheck, CalendarDays, HardHat, Cctv, Armchair, Landmark, Component, Scale, Weight, BrickWall } from "lucide-react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalculatorCard from "@/components/CalculatorCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";
import { generateWebSiteSchema } from "@/utils/schemas";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title="Sua Obra Certa - Ferramentas para Construção"
        description="mais de 20 calculadoras gratuitas para sua obra. Tijolos, Tinta, Telhado, Concreto e muito mais."
        url="https://suaobracerta.com.br/"
        schema={generateWebSiteSchema()}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-primary animate-fade-up">
                <Calculator className="h-4 w-4" />
                Mais de 25 Ferramentas Gratuitas
              </div>

              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-card md:text-5xl lg:text-6xl animate-fade-up">
                O Guia Definitivo para <br />
                <span className="text-primary">Sua Obra Certa</span>
              </h1>

              <p className="mb-8 text-lg text-card/80 md:text-xl animate-fade-up">
                Ferramentas profissionais para Arquitetos, Pedreiros e Você. Do fio elétrico ao churrasco da inauguração.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
                <Button asChild variant="hero" size="lg">
                  <Link to="/calculadora-escada">
                    <ArrowUpFromLine className="h-5 w-5 mr-2" />
                    Calcular Escada
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-card/30 text-card hover:bg-card hover:text-foreground">
                  <Link to="/calculadora-fios">
                    <Zap className="h-5 w-5 mr-2" />
                    Calcular Fios
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>



        {/* FASE 0: GESTÃO & PLANEJAMENTO (New Phase 2) */}
        <section id="gestao" className="py-12 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/30">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold text-foreground border-l-4 border-indigo-500 pl-4 flex items-center gap-2">
              📋 Gestão e Planejamento <span className="text-xs font-normal text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full uppercase tracking-wider">Novo</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <CalculatorCard
                icon={ClipboardCheck}
                title="Checklist de Vistoria"
                description="Vai receber as chaves? Use nosso checklist interativo para não perder nada."
                href="/checklist-vistoria"
                badge="Novo"
              />
              <CalculatorCard
                icon={CalendarDays}
                title="Cronograma de Obra"
                description="Estimativa de tempo e etapas (Construção ou Reforma)."
                href="/calculadora-cronograma"
                badge="Novo"
              />
              <CalculatorCard
                icon={HardHat}
                title="Mão de Obra"
                description="Quanto custa o pedreiro? Estimativa de piso, pintura e mais."
                href="/calculadora-mao-de-obra"
                badge="Beta"
              />
            </div>
          </div>
        </section>

        {/* FASE 1: ESTRUTURA */}
        <section id="estrutura" className="py-12 bg-muted/20">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold text-foreground border-l-4 border-primary pl-4">
              🏗️ Estrutura e Técnico
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <CalculatorCard
                icon={ArrowUpFromLine}
                title="Escada (Blondel)"
                description="Calcule altura e pisada dos degraus (Lei de Blondel)."
                href="/calculadora-escada"
                badge="Pro"
              />
              <CalculatorCard
                icon={TrendingUp}
                title="Rampa Acessível"
                description="Inclinação e comprimento correto (NBR 9050)."
                href="/calculadora-rampa"
              />
              <CalculatorCard
                icon={Boxes}
                title="Tijolos e Blocos"
                description="Quantidade de milheiros para subir paredes."
                href="/calculadora-tijolos"
              />
              <CalculatorCard
                icon={BrickWall}
                title="Muro e Arrimo"
                description="Blocos p/ Muro Simples ou de Arrimo."
                href="/calculadora-muro"
                badge="Completo"
              />
              <CalculatorCard
                icon={Container}
                title="Concreto e Cimento"
                description="Traço e volume para lajes e fundações."
                href="/calculadora-concreto"
              />
              <CalculatorCard
                icon={Home}
                title="Telhado"
                description="Quantidade de telhas e inclinação."
                href="/calculadora-telhado"
              />
              <CalculatorCard
                icon={Hammer}
                title="Peso Telhado (Carga)"
                description="Estimativa de peso da estrutura e telhas."
                href="/calculadora-peso-estrutura-telhado"
                badge="Novo"
              />
              <CalculatorCard
                icon={Scale}
                title="Peso de Alumínio"
                description="Peso de chapas, barras e perfis."
                href="/calculadora-peso-aluminio"
                badge="Novo"
              />
              <CalculatorCard
                icon={AppWindow}
                title="Peso de Vidro"
                description="Peso para roldanas e custo estimado."
                href="/calculadora-vidro"
              />
            </div>
          </div>
        </section>

        {/* FASE 2: ACABAMENTO */}
        <section id="acabamento" className="py-12">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold text-foreground border-l-4 border-blue-500 pl-4">
              🎨 Acabamento
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <CalculatorCard
                icon={Paintbrush}
                title="Tinta"
                description="Litros de tinta para paredes e teto."
                href="/calculadora-tinta"
              />
              <CalculatorCard
                icon={LayoutGrid}
                title="Pisos"
                description="Caixas de piso com margem de segurança."
                href="/calculadora-pisos"
              />
              <CalculatorCard
                icon={Grid3X3}
                title="Azulejos"
                description="Quantidade de peças e m² para parede/chão."
                href="/calculadora-azulejos"
                badge="Novo"
              />
              <CalculatorCard
                icon={AlignHorizontalJustifyStart}
                title="Rodapé"
                description="Quantidade de barras e cola por metro."
                href="/calculadora-rodape"
              />
              <CalculatorCard
                icon={Layers}
                title="Drywall"
                description="Placas e estruturas para forro e parede."
                href="/calculadora-drywall"
              />
              <CalculatorCard
                icon={Grid3X3}
                title="Rejunte"
                description="Quilos de rejunte para o assentamento."
                href="/calculadora-rejunte"
              />
            </div>
          </div>
        </section>

        {/* INSTALAÇÕES */}
        <section id="instalacoes" className="py-12 bg-yellow-50/50 dark:bg-yellow-950/20">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold text-foreground border-l-4 border-yellow-500 pl-4">
              ⚡ Instalações e Conforto
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <CalculatorCard
                icon={Plug}
                title="Fios Elétricos"
                description="Bitola do fio e disjuntor ideal para chuveiros etc."
                href="/calculadora-fios"
                badge="Importante"
              />
              <CalculatorCard
                icon={Wind}
                title="Ar Condicionado"
                description="Cálculo de BTUs por ambiente."
                href="/calculadora-ar-condicionado"
              />
              <CalculatorCard
                icon={Lightbulb}
                title="Iluminação"
                description="Lúmens e quantidade de lâmpadas."
                href="/calculadora-iluminacao"
              />
              <CalculatorCard
                icon={Droplets}
                title="Caixa D'água"
                description="Dimensionamento de reserva de água."
                href="/calculadora-caixa-agua"
              />
              <CalculatorCard
                icon={Zap}
                title="Energia Solar"
                description="Simule painéis e economia."
                href="/calculadora-energia"
                badge="Novo"
              />
            </div>
          </div>
        </section>

        {/* JARDIM & EXTERNA */}
        <section id="jardim" className="py-12 bg-green-50/50 dark:bg-green-950/20">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold text-foreground border-l-4 border-green-500 pl-4">
              🌿 Área Externa
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <CalculatorCard
                icon={Flower2}
                title="Grama"
                description="Rolos ou placas para jardim."
                href="/calculadora-grama"
              />
              <CalculatorCard
                icon={Component}
                title="Cerca"
                description="Mourões, arame farpado e tela."
                href="/calculadora-cerca"
                badge="Novo"
              />
              <CalculatorCard
                icon={Hammer}
                title="Deck de Madeira"
                description="Réguas, barrotes e parafusos para deck."
                href="/calculadora-deck"
              />
              <CalculatorCard
                icon={LayoutDashboard}
                title="Pavers"
                description="Bloquetes para calçada."
                href="/calculadora-pavers"
              />
              <CalculatorCard
                icon={Waves}
                title="Piscina"
                description="Volume e tratamento químico."
                href="/calculadora-piscina"
              />
            </div>
          </div>
        </section>

        {/* DECORAÇÃO */}
        <section id="decoracao" className="py-12">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold text-foreground border-l-4 border-purple-500 pl-4">
              ✨ Decoração
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <CalculatorCard
                icon={Scroll}
                title="Papel de Parede"
                description="Rolos com cálculo de rapport."
                href="/calculadora-papel-parede"
              />
              <CalculatorCard
                icon={Blinds}
                title="Cortinas"
                description="Tecido para cortinas sob medida."
                href="/calculadora-cortinas"
              />
            </div>
          </div>
        </section>

        {/* FASE 3: SERVIÇOS & TECNOLOGIA (Premium - High Value) */}
        <section id="servicos-premium" className="py-12 bg-slate-900 border-b border-slate-800">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold text-white border-l-4 border-emerald-500 pl-4 flex items-center gap-2">
              💎 Financeiro & Segurança <span className="text-xs font-normal text-slate-900 bg-emerald-400 px-2 py-1 rounded-full uppercase tracking-wider">Premium</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <CalculatorCard
                icon={Landmark}
                title="Simulador de Financiamento"
                description="Simule parcelas de Construcard ou Home Equity para reformar."
                href="/calculadora-financiamento"
                badge="Hot"
              />
              <CalculatorCard
                icon={Cctv}
                title="Projeto de Câmeras (CFTV)"
                description="Quantas câmeras e qual HD você precisa para seu negócio?"
                href="/calculadora-cftv"
                badge="Novo"
              />
              <CalculatorCard
                icon={Armchair}
                title="Móveis Planejados"
                description="Estimativa de custo para Cozinha e Quartos sob medida."
                href="/calculadora-moveis-planejados"
                badge="Novo"
              />
            </div>
          </div>
        </section>

        {/* BÔNUS */}
        <section id="bonus" className="py-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-y border-red-100 dark:border-red-900/30">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold text-foreground border-l-4 border-red-500 pl-4 flex items-center gap-2">
              🎁 Ferramentas Bônus <span className="text-sm font-normal text-muted-foreground">(Viral)</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <CalculatorCard
                icon={Flame}
                title="Calculadora de Churrasco"
                description="Vai fazer uma festa? Calcule carne, cerveja e carvão para a galera. Inclui lista para WhatsApp!"
                href="/calculadora-churrasco"
                badge="Bônus"
              />
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
