import { Link } from "react-router-dom";
import { HardHat, Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrcamento } from "@/context/OrcamentoContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useOrcamento();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <HardHat className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Sua<span className="text-yellow-500">Obra</span>Certa
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Início
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
              Calculadoras <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 overflow-y-auto max-h-[80vh]">
              <DropdownMenuLabel>Estrutura & Alvenaria</DropdownMenuLabel>
              <DropdownMenuItem asChild><Link to="/calculadora-tijolos">Tijolos</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-concreto">Concreto</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-telhado">Telhado</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-escada">Escada (Blondel)</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-rampa">Rampa</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-vidro">Vidro (Peso)</Link></DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Acabamento & Pintura</DropdownMenuLabel>
              <DropdownMenuItem asChild><Link to="/calculadora-tinta">Tinta</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-pisos">Pisos</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-rodape">Rodapé</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-drywall">Drywall</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-rejunte">Rejunte</Link></DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Jardim & Área Externa</DropdownMenuLabel>
              <DropdownMenuItem asChild><Link to="/calculadora-grama">Grama</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-deck">Deck de Madeira</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-pavers">Pavers (Calçada)</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-piscina">Piscina</Link></DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Decoração</DropdownMenuLabel>
              <DropdownMenuItem asChild><Link to="/calculadora-papel-parede">Papel de Parede</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-cortinas">Cortinas</Link></DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Conforto & Instalações</DropdownMenuLabel>
              <DropdownMenuItem asChild><Link to="/calculadora-fios">Fios Elétricos</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-ar-condicionado">Ar Condicionado</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-iluminacao">Iluminação</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-energia">Conta de Luz</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-caixa-agua">Caixa D'água</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-churrasco">Churrasco 🍖</Link></DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Gestão</DropdownMenuLabel>
              <DropdownMenuItem asChild><Link to="/checklist-vistoria">Checklist Vistoria</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-cronograma">Cronograma</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/calculadora-mao-de-obra">Mão de Obra</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild size="sm" variant={totalItems > 0 ? "default" : "outline"} className="gap-2 relative">
            <Link to="/meu-orcamento">
              <ShoppingCart className="h-4 w-4" />
              Meu Orçamento
              {totalItems > 0 && (
                <span className="bg-red-500 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full absolute -top-2 -right-2 font-bold shadow-sm animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/meu-orcamento">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="bg-red-500 text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full absolute top-0 right-0 font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto pb-8">
          <div className="container py-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-bold text-lg">Início</Link>

            <Link to="/meu-orcamento" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 font-bold text-primary py-2 px-2 bg-primary/10 rounded">
              <ShoppingCart className="h-4 w-4" /> Meu Orçamento ({totalItems})
            </Link>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estrutura</p>
              <Link to="/calculadora-tijolos" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Tijolos</Link>
              <Link to="/calculadora-concreto" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Concreto</Link>
              <Link to="/calculadora-telhado" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Telhado</Link>
              <Link to="/calculadora-escada" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Escada</Link>
              <Link to="/calculadora-rampa" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Rampa</Link>
              <Link to="/calculadora-vidro" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Vidro</Link>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acabamento</p>
              <Link to="/calculadora-tinta" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Tinta</Link>
              <Link to="/calculadora-pisos" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Pisos</Link>
              <Link to="/calculadora-rodape" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Rodapé</Link>
              <Link to="/calculadora-drywall" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Drywall</Link>
              <Link to="/calculadora-rejunte" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Rejunte</Link>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jardim</p>
              <Link to="/calculadora-grama" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Grama</Link>
              <Link to="/calculadora-pavers" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Pavers</Link>
              <Link to="/calculadora-deck" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Deck</Link>
              <Link to="/calculadora-piscina" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Piscina</Link>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Instalações</p>
              <Link to="/calculadora-fios" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Fios Elétricos</Link>
              <Link to="/calculadora-ar-condicionado" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Ar Condicionado</Link>
              <Link to="/calculadora-iluminacao" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Iluminação</Link>
              <Link to="/calculadora-caixa-agua" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Caixa D'água</Link>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gestão</p>
              <Link to="/checklist-vistoria" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Checklist</Link>
              <Link to="/calculadora-cronograma" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Cronograma</Link>
              <Link to="/calculadora-mao-de-obra" onClick={() => setIsMenuOpen(false)} className="block py-2 px-2 hover:bg-muted rounded">Mão de Obra</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
