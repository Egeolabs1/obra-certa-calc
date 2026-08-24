# Evidências para revisão do AdSense

## Evidências automatizadas locais

- `npm run build` gera HTML específico para cada rota aprovada.
- `node scripts/audit-rendered-seo.mjs` valida título, descrição, H1 e canonical.
- `npm run audit:routes` garante que sitemap e manifesto não divergem.
- `node scripts/test-production-status.mjs <URL>` valida páginas conhecidas e 404 real.

## Evidências que ainda precisam ser coletadas após deploy

- URL Inspection do Search Console para home, calculadora de tinta e blog.
- Respostas HTTP 200/404 do domínio de produção.
- Captura de rede comprovando bloqueio de Analytics/AdSense antes do consentimento.
- Lighthouse móvel (mediana de três execuções).
- Revisão manual das fontes dos artigos antes de reindexá-los.
