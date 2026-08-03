import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const PoliticaPrivacidade = () => {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Política de Privacidade - Sua Obra Certa"
                description="Entenda como coletamos e protegemos seus dados. Política de Privacidade em conformidade com a LGPD."
                url="https://www.suaobracerta.com.br/politica-de-privacidade"
                keywords="privacidade, dados, lgpd, cookies, segurança"
            />
            <Header />
            <main className="flex-1 container py-12 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                    <p className="mb-4">Esta política explica como o <strong>Sua Obra Certa</strong> trata dados ao oferecer calculadoras, orçamento local, contato e medição de audiência. Ela não substitui os avisos dos serviços de terceiros eventualmente usados no site.</p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">1. Coleta de Informações</h2>
                    <p className="mb-4">
                        As calculadoras funcionam sem cadastro. Se você nos escrever por e-mail, receberemos os dados incluídos na sua mensagem para responder ao contato. O recurso “Meu Orçamento” guarda itens no navegador do seu dispositivo; ele não cria uma conta no site.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">2. Uso de Cookies</h2>
                    <p className="mb-4">
                        O site usa o Google Analytics para medir uso agregado. Caso anúncios do Google sejam ativados, o Google poderá usar cookies ou tecnologias semelhantes conforme suas próprias políticas e as escolhas de consentimento aplicáveis. Você pode gerenciar preferências de anúncios na sua <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer">Central de anúncios do Google</a> e conhecer o tratamento de dados na <a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noreferrer">Política de Privacidade do Google</a>.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">3. Armazenamento Local (LocalStorage)</h2>
                    <p className="mb-4">
                        Para o funcionamento das calculadoras e do recurso "Meu Orçamento", armazenamos dados diretamente no navegador do seu dispositivo (LocalStorage). Esses dados não são enviados para nossos servidores e permanecem sob seu controle, podendo ser limpos a qualquer momento através das configurações do seu navegador ou do botão "Limpar" na página de orçamento.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">4. Compartilhamento e segurança</h2>
                    <p className="mb-4">
                        Não vendemos dados pessoais. Dados podem ser processados por fornecedores necessários para hospedagem, segurança, medição de audiência e anúncios, quando aplicável. Podemos divulgar dados apenas quando houver obrigação legal ou para proteger direitos e a segurança do serviço.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">5. Seus direitos e contato</h2>
                    <p className="mb-4">Para dúvidas sobre privacidade ou para solicitar informações relacionadas a uma mensagem que você nos enviou, fale com <a href="mailto:contato@suaobracerta.com.br">contato@suaobracerta.com.br</a>. Você também pode apagar os dados locais do orçamento usando o botão “Limpar” ou as configurações do navegador.</p>

                    <p className="text-sm text-muted-foreground mt-12 py-4 border-t">
                        Última atualização: 3 de agosto de 2026.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PoliticaPrivacidade;
