import { HardHat } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <HardHat className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">
              Sua<span className="text-accent">Obra</span>Certa
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Início
            </Link>
            <Link to="/calculadora-tinta" className="text-muted-foreground hover:text-foreground transition-colors">
              Calculadora de Tinta
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/calculadora-churrasco" className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors bg-red-50 px-3 py-1 rounded-full">
              🔥 Churrasco (Bônus)
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SuaObraCerta. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
