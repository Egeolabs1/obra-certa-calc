export default function ArticleSources({ sources }: { sources: { label: string; url: string; publisher: string }[] }) {
  return <section className="mt-10 rounded-xl border border-border bg-muted/30 p-6" aria-labelledby="fontes-artigo">
    <h2 id="fontes-artigo" className="mb-3 text-xl font-semibold">Fontes e revisão</h2>
    <p className="mb-3 text-sm text-muted-foreground">Fontes institucionais consultadas para conferir afirmações do artigo. Valores e regras podem mudar; consulte a publicação vigente.</p>
    <ul className="space-y-2 text-sm">{sources.map((source) => <li key={source.url}><a className="underline" href={source.url} target="_blank" rel="noreferrer">{source.label} — {source.publisher}</a></li>)}</ul>
  </section>;
}
