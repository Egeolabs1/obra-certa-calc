# Gates externos restantes

O código local já bloqueia publicidade até consentimento, gera HTML prerenderizado e valida SEO. Ainda dependem do ambiente publicado:

- cadastrar e configurar um CMP certificado no painel Google Funding Choices;
- publicar no Vercel e confirmar HTTP 200/404 com `test-production-status.mjs`;
- executar Lighthouse móvel três vezes e registrar a mediana;
- executar inspeção ao vivo das URLs no Search Console;
- capturar requests reais antes/depois do consentimento;
- aguardar novo crawl antes da revisão AdSense.
