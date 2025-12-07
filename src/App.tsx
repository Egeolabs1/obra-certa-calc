import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import CalculadoraTinta from "./pages/CalculadoraTinta";
import CalculadoraPisos from "./pages/CalculadoraPisos";
import CalculadoraTijolos from "./pages/CalculadoraTijolos";
import CalculadoraConcreto from "./pages/CalculadoraConcreto";
import CalculadoraArCondicionado from "./pages/CalculadoraArCondicionado";
import CalculadoraDrywall from "./pages/CalculadoraDrywall";
import CalculadoraRejunte from "./pages/CalculadoraRejunte";
import CalculadoraTelhado from "./pages/CalculadoraTelhado";
import CalculadoraIluminacao from "./pages/CalculadoraIluminacao";
import CalculadoraCaixaAgua from "./pages/CalculadoraCaixaAgua";
// Level 2
import CalculadoraGrama from "./pages/CalculadoraGrama";
import CalculadoraPavers from "./pages/CalculadoraPavers";
import CalculadoraPiscina from "./pages/CalculadoraPiscina";
import CalculadoraPapelParede from "./pages/CalculadoraPapelParede";
import CalculadoraCortinas from "./pages/CalculadoraCortinas";
import CalculadoraEnergia from "./pages/CalculadoraEnergia";
import CalculadoraChurrasco from "./pages/CalculadoraChurrasco";
// Level 3 (Final)
import CalculadoraEscada from "./pages/CalculadoraEscada";
import CalculadoraRampa from "./pages/CalculadoraRampa";
import CalculadoraVidro from "./pages/CalculadoraVidro";
import CalculadoraFios from "./pages/CalculadoraFios";
import CalculadoraDeck from "./pages/CalculadoraDeck";
import CalculadoraRodape from "./pages/CalculadoraRodape";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Acabamento */}
            <Route path="/calculadora-tinta" element={<CalculadoraTinta />} />
            <Route path="/calculadora-pisos" element={<CalculadoraPisos />} />
            <Route path="/calculadora-drywall" element={<CalculadoraDrywall />} />
            <Route path="/calculadora-rejunte" element={<CalculadoraRejunte />} />
            <Route path="/calculadora-rodape" element={<CalculadoraRodape />} />
            <Route path="/calculadora-deck" element={<CalculadoraDeck />} />

            {/* Estrutura & Técnico */}
            <Route path="/calculadora-tijolos" element={<CalculadoraTijolos />} />
            <Route path="/calculadora-concreto" element={<CalculadoraConcreto />} />
            <Route path="/calculadora-telhado" element={<CalculadoraTelhado />} />
            <Route path="/calculadora-escada" element={<CalculadoraEscada />} />
            <Route path="/calculadora-rampa" element={<CalculadoraRampa />} />
            <Route path="/calculadora-vidro" element={<CalculadoraVidro />} />

            {/* Instalações & Conforto */}
            <Route path="/calculadora-ar-condicionado" element={<CalculadoraArCondicionado />} />
            <Route path="/calculadora-iluminacao" element={<CalculadoraIluminacao />} />
            <Route path="/calculadora-energia" element={<CalculadoraEnergia />} />
            <Route path="/calculadora-fios" element={<CalculadoraFios />} />
            <Route path="/calculadora-caixa-agua" element={<CalculadoraCaixaAgua />} />

            {/* Jardim & Lazer */}
            <Route path="/calculadora-grama" element={<CalculadoraGrama />} />
            <Route path="/calculadora-pavers" element={<CalculadoraPavers />} />
            <Route path="/calculadora-piscina" element={<CalculadoraPiscina />} />
            <Route path="/calculadora-churrasco" element={<CalculadoraChurrasco />} />

            {/* Decoração */}
            <Route path="/calculadora-papel-parede" element={<CalculadoraPapelParede />} />
            <Route path="/calculadora-cortinas" element={<CalculadoraCortinas />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
