import { ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

interface ProductCardProps {
    image: string;
    title: string;
    price?: string;
    link: string;
    storeName?: string;
    category?: string;
}

export const ProductCard = ({ image, title, price, link, storeName = "Amazon", category }: ProductCardProps) => {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50">
            <div className="aspect-square w-full overflow-hidden bg-muted/20 p-4 flex items-center justify-center">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
                    loading="lazy"
                />
                {category && (
                    <span className="absolute top-2 left-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur-sm border border-border">
                        {category}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-1">{storeName}</p>
                    <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground">Melhor Preço</span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-500">
                            {price || "Ver Oferta"}
                        </span>
                    </div>
                    <Button asChild size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-sm">
                        <a href={link} target="_blank" rel="noopener noreferrer">
                            Ver <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
};
