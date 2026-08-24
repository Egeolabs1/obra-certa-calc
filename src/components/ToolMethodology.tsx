import { ExternalLink } from "lucide-react";
import type { ToolQualityRecord } from "@/content/toolQuality";

export default function ToolMethodology({ record }: { record: ToolQualityRecord }) {
  return <section className="mt-8 rounded-xl border border-border bg-muted/30 p-6" aria-labelledby="metodologia-titulo">
    <h2 id="metodologia-titulo" className="mb-4 text-lg font-semibold">Como este cálculo funciona</h2>
    <p className="text-sm text-muted-foreground">Última revisão: {record.reviewedAt} · {record.reviewer}</p>
    <div className="mt-4 grid gap-6 md:grid-cols-2 text-sm">
      <div><h3 className="font-semibold mb-2">Premissas</h3><ul className="list-disc pl-5 space-y-1">{record.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div><h3 className="font-semibold mb-2">Limitações</h3><ul className="list-disc pl-5 space-y-1">{record.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </div>
    <div className="mt-5"><h3 className="font-semibold mb-2 text-sm">Fontes consultadas</h3><ul className="space-y-1 text-sm">{record.sources.map((source) => <li key={source.url}><a className="inline-flex items-center gap-1 underline" href={source.url} target="_blank" rel="noreferrer">{source.label} ({source.publisher}) <ExternalLink className="h-3 w-3" /></a></li>)}</ul></div>
  </section>;
}
