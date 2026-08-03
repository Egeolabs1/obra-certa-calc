import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Sobre = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <SEO
      title="Sobre, método e limites das calculadoras"
      description="Entenda o propósito, o método de cálculo, os limites e a política editorial do Sua Obra Certa."
      url="https://www.suaobracerta.com.br/sobre"
    />
    <Header />
    <main className="container max-w-4xl flex-1 py-12">
      <article className="prose prose-slate max-w-none dark:prose-invert">
        <h1>Sobre o Sua Obra Certa</h1>
        <p>O Sua Obra Certa reúne calculadoras gratuitas e conteúdo educativo para ajudar pessoas a organizar uma obra ou reforma. A proposta é tornar estimativas iniciais mais claras: transformar medidas fornecidas pelo usuário em quantidades aproximadas, listas de verificação e pontos de atenção.</p>

        <h2>Como as calculadoras funcionam</h2>
        <p>Cada ferramenta mostra os dados solicitados, a unidade usada e o resultado calculado. Quando há margem de perda, rendimento ou premissa padrão, ela deve aparecer na própria tela. Os resultados são estimativas para planejamento e compra preliminar; não substituem projeto, orçamento formal, vistoria ou responsabilidade técnica.</p>

        <h2>Limites importantes</h2>
        <ul>
          <li>Não dimensionamos estruturas, fundações, instalações elétricas, hidráulicas, gás, climatização ou segurança.</li>
          <li>Normas técnicas, exigências municipais, preços, disponibilidade e características de produtos podem mudar.</li>
          <li>Antes de executar uma obra, confirme as especificações com profissional habilitado, projeto e fabricante.</li>
        </ul>

        <h2>Política editorial</h2>
        <p>Publicamos conteúdo prático com linguagem clara e revisamos correções recebidas pelos leitores. Não atribuímos artigos a profissionais ou credenciais sem uma identificação pública e verificável. Quando um assunto exige decisão técnica, indicamos explicitamente o limite da informação e a necessidade de validação especializada.</p>

        <h2>Independência comercial</h2>
        <p>O site pode usar publicidade ou links de afiliados para custear sua manutenção. Isso não altera o resultado das calculadoras. Quando houver um link de afiliado, ele será identificado e a pessoa não paga valor adicional por isso. A utilidade das ferramentas não depende de anúncios.</p>

        <h2>Correções e contato</h2>
        <p>Encontrou um erro de cálculo, uma informação desatualizada ou quer sugerir uma ferramenta? Escreva para <a href="mailto:contato@suaobracerta.com.br">contato@suaobracerta.com.br</a> ou use a página de <a href="/contato">contato</a>.</p>
        <p className="text-sm text-muted-foreground">Última atualização: 3 de agosto de 2026.</p>
      </article>
    </main>
    <Footer />
  </div>
);

export default Sobre;
