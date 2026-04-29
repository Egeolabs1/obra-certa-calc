import React, { useEffect, useState } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { appRoutes } from "@/config/routes";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

export function CommandSearch() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 text-muted-foreground"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">Buscar ferramentas...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">Ctrl</span>K
                </kbd>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <DialogTitle className="sr-only">Buscar Calculadoras</DialogTitle>
                <CommandInput placeholder="Digite para buscar..." />
                <CommandList>
                    <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

                    {Object.entries(
                        appRoutes.reduce((acc, route) => {
                            const cat = route.category || "Outros";
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(route);
                            return acc;
                        }, {} as Record<string, typeof appRoutes>)
                    ).map(([category, routes]) => (
                        <React.Fragment key={category}>
                            <CommandGroup heading={category}>
                                {routes.map((route) => (
                                    <CommandItem
                                        key={route.path}
                                        value={`${route.title} ${route.keywords?.join(" ")}`}
                                        onSelect={() => {
                                            runCommand(() => navigate(route.path));
                                        }}
                                    >
                                        <route.icon className="mr-2 h-4 w-4" />
                                        <span>{route.title}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                        </React.Fragment>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    );
}
