import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LucideIcon } from "lucide-react";

interface CalculatorCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  comingSoon?: boolean;
  delay?: number;
  badge?: string;
}

const CalculatorCard = ({
  icon: Icon,
  title,
  description,
  href,
  comingSoon = false,
  delay = 0,
  badge
}: CalculatorCardProps) => {
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border bg-gradient-card p-6 shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-up"
    >
      {/* Decorative corner */}
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-150" />

      {badge && (
        <span className="absolute top-4 right-4 z-10 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
          {badge}
        </span>
      )}

      <div className="relative">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary">
          <Icon className="h-7 w-7 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
        </div>

        <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{description}</p>

        {comingSoon ? (
          <Button variant="disabled" size="sm" className="w-full" disabled>
            Em Breve
          </Button>
        ) : (
          <Button asChild size="sm" className="w-full">
            <Link to={href || "#"}>Calcular Agora</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CalculatorCard;
