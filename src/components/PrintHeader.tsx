import { HardHat } from "lucide-react";

const PrintHeader = () => {
    return (
        <div className="hidden print:flex flex-row items-center justify-between mb-8 border-b pb-4">
            <div className="flex items-center gap-3">
                {/* Use transparent bg and black text for print to ensure visibility */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-900 bg-slate-900 print:bg-transparent print:border-black">
                    <HardHat className="h-6 w-6 text-white print:text-black" />
                </div>
                <div>
                    <span className="text-xl font-bold text-slate-900 print:text-black block leading-none">
                        SuaObraCerta
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest print:text-gray-600 block mt-1">
                        Ferramentas de Construção
                    </span>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold text-slate-900 print:text-black">
                    suaobracerta.com.br
                </p>
                <p className="text-xs text-slate-500 print:text-gray-500">
                    {new Date().toLocaleDateString('pt-BR')}
                </p>
            </div>
        </div>
    );
};

export default PrintHeader;
