import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const TermosDeUso = () => {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Termos de Uso - Sua Obra Certa"
                description="Leia os Termos de Uso da plataforma Sua Obra Certa. Regras e condições para utilização das nossas calculadoras e conteúdos."
                url="https://suaobracerta.com.br/termos-de-uso"
                keywords="termos de uso, regras, condições, legislação, aviso legal"
            />
            <Header />
            <main className="flex-1 container py-12 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                    <p className="mb-4">
                        Bem-vindo ao <strong>Sua Obra Certa</strong>. Ao acessar e utilizar este site, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, por favor, não utilize nosso site.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">1. Uso das Calculadoras</h2>
                    <p className="mb-4">
                        As calculadoras e ferramentas fornecidas neste site são apenas para fins de <strong>estimativa e planejamento preliminar</strong>.
                        Embora nos esforcemos para manter as fórmulas e preços atualizados com base no mercado da construção civil, não garantimos a exatidão absoluta dos resultados.
                        <br /><br />
                        <strong>Aviso Importante:</strong> Os valores apresentados são estimativas médias. O custo real da sua obra pode variar dependendo da região, da qualidade dos materiais escolhidos, da mão de obra contratada e de condições imprevistas no local da obra. Sempre consulte um profissional qualificado (Engenheiro ou Arquiteto) antes de iniciar qualquer construção ou reforma.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">2. Propriedade Intelectual</h2>
                    <p className="mb-4">
                        Todo o conteúdo deste site, incluindo textos, gráficos, logotipos, ícones, imagens e software, é de propriedade do Sua Obra Certa ou de seus fornecedores de conteúdo e está protegido pelas leis de direitos autorais internacionais e do Brasil.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">3. Links para Terceiros e Afiliados</h2>
                    <p className="mb-4">
                        Este site pode conter links para sites de terceiros (como Amazon, lojas de construção, etc.). Esses links são fornecidos para sua conveniência. Não temos controle sobre o conteúdo desses sites e não assumimos responsabilidade por eles.
                        <br />
                        Participamos de programas de afiliados e podemos receber uma comissão se você fizer uma compra através de nossos links, sem nenhum custo adicional para você. Isso ajuda a manter a ferramenta gratuita.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">4. Isenção de Responsabilidade</h2>
                    <p className="mb-4">
                        Em nenhuma circunstância o Sua Obra Certa será responsável por quaisquer danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso ou da incapacidade de usar as ferramentas deste site, ou por qualquer erro no cálculo de materiais que possa resultar em sobra ou falta de insumos.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">5. Alterações</h2>
                    <p className="mb-4">
                        Reservamo-nos o direito de revisar estes termos de uso a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses Termos de Uso.
                    </p>

                    <p className="text-sm text-muted-foreground mt-12 py-4 border-t">
                        Última atualização: Dezembro de 2025.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermosDeUso;
