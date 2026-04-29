import { HardHat } from "lucide-react";

interface PrintHeaderProps {
    title?: string;
}

const PrintHeader = ({ title }: PrintHeaderProps) => {
    return (
        <div className="hidden print:flex flex-col mb-8 border-b pb-4">
            <div className="flex flex-row items-center justify-between w-full mb-4">
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
            {title && (
                <div className="text-center w-full mt-2">
                    <h2 className="text-xl font-bold text-slate-900 print:text-black uppercase tracking-tight inline-block border-b-2 border-slate-900 pb-1">
                        {title}
                    </h2>
                </div>
            )}
        </div>
    );
};

export default PrintHeader;
