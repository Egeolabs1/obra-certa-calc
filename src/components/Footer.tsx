import { HardHat, Facebook, Instagram, Youtube, Mail, MapPin, Calculator, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg shadow-amber-900/20">
                <HardHat className="h-6 w-6 text-slate-900" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Sua<span className="text-yellow-500">Obra</span>Certa
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              A plataforma mais completa de calculadoras e ferramentas para construção civil. Planeje, calcule e economize na sua obra.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" aria-label="Instagram" className="hover:text-yellow-400 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-yellow-400 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-yellow-400 transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Calculators Column */}
          <div>
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-yellow-500" /> Calculadoras Populares
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/calculadora-tinta" className="hover:text-yellow-400 transition-colors">Calculadora de Tinta</Link></li>
              <li><Link to="/calculadora-pisos" className="hover:text-yellow-400 transition-colors">Pisos e Revestimentos</Link></li>
              <li><Link to="/calculadora-tijolos" className="hover:text-yellow-400 transition-colors">Tijolos e Blocos</Link></li>
              <li><Link to="/calculadora-concreto" className="hover:text-yellow-400 transition-colors">Concreto e Cimento</Link></li>
              <li><Link to="/calculadora-telhado" className="hover:text-yellow-400 transition-colors">Telhados</Link></li>
              <li><Link to="/checklist-vistoria" className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors">Checklist de Vistoria</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-yellow-500" /> Institucional
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-yellow-400 transition-colors">Início</Link></li>
              <li><Link to="/meu-orcamento" className="hover:text-yellow-400 transition-colors">Meu Orçamento</Link></li>
              <li><Link to="/contato" className="hover:text-yellow-400 transition-colors">Fale Conosco</Link></li>
              <li><Link to="/politica-de-privacidade" className="hover:text-yellow-400 transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos-de-uso" className="hover:text-yellow-400 transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-white mb-4">Fique por dentro</h3>
            <p className="text-sm text-slate-400">Receba dicas de economia e checklists para sua obra.</p>
            <div className="flex gap-2">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold h-10">
                Inscrever-se
              </Button>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6">
              <Link to="/calculadora-churrasco" className="flex items-center gap-3 group">
                <span className="text-2xl group-hover:scale-110 transition-transform">🍖</span>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Acabou a obra?</p>
                  <p className="text-sm text-white font-bold group-hover:text-yellow-400 transition-colors">Calcule o Churrasco!</p>
                </div>
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {currentYear} Sua Obra Certa. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> São Paulo, SP</span>
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> contato@suaobracerta.com.br</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
