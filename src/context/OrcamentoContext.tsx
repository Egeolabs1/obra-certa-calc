import { createContext, useContext } from "react";
import { OrcamentoContextType } from "./orcamentoTypes";

export const OrcamentoContext = createContext<OrcamentoContextType | undefined>(undefined);

export const useOrcamento = () => {
    const context = useContext(OrcamentoContext);
    if (!context) {
        throw new Error("useOrcamento must be used within an OrcamentoProvider");
    }
    return context;
};
