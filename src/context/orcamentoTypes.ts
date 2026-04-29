export interface BudgetItem {
    id: string;
    name: string;      // e.g. "Tinta Acrílica"
    description: string; // e.g. "Suvinil Fosco Completo - Branco Neve"
    quantity: number;
    unit: string;      // e.g. "L", "Latas", "m²"
    category: string;  // e.g. "Pintura", "Estrutura"
    estimatedPrice?: number; // Optional price estimate
}

export interface OrcamentoContextType {
    items: BudgetItem[];
    addItem: (item: BudgetItem) => void;
    removeItem: (id: string) => void;
    clearBudget: () => void;
    totalItems: number;
    totalEstimatedValue: number;
}
