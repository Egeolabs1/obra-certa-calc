import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const PoliticaPrivacidade = () => {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Política de Privacidade - Sua Obra Certa"
                description="Entenda como coletamos e protegemos seus dados. Política de Privacidade em conformidade com a LGPD."
                url="https://suaobracerta.com.br/politica-de-privacidade"
                keywords="privacidade, dados, lgpd, cookies, segurança"
            />
            <Header />
            <main className="flex-1 container py-12 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                    <p className="mb-4">
                        A sua privacidade é importante para nós. É política do <strong>Sua Obra Certa</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">1. Coleta de Informações</h2>
                    <p className="mb-4">
                        Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço (exemplo: salvar seu orçamento). Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
                        <br /><br />
                        Nós não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">2. Uso de Cookies</h2>
                    <p className="mb-4">
                        Utilizamos cookies para melhorar a experiência de navegação e para veicular anúncios personalizados (Google AdSense).
                        <br />
                        O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios. O uso do cookie DART permite que o Google veicule anúncios para nossos usuários com base em sua visita ao nosso site e a outros sites na Internet. Você pode optar por não usar o cookie DART visitando a Política de privacidade da rede de conteúdo e anúncios do Google.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">3. Armazenamento Local (LocalStorage)</h2>
                    <p className="mb-4">
                        Para o funcionamento das calculadoras e do recurso "Meu Orçamento", armazenamos dados diretamente no navegador do seu dispositivo (LocalStorage). Esses dados não são enviados para nossos servidores e permanecem sob seu controle, podendo ser limpos a qualquer momento através das configurações do seu navegador ou do botão "Limpar" na página de orçamento.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">4. Compromisso do Usuário</h2>
                    <p className="mb-4">
                        O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Sua Obra Certa oferece no site e com caráter enunciativo, mas não limitativo:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
                        <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
                        <li>C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Sua Obra Certa, de seus fornecedores ou terceiros.</li>
                    </ul>

                    <p className="text-sm text-muted-foreground mt-12 py-4 border-t">
                        Esta política é efetiva a partir de Dezembro de 2025.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PoliticaPrivacidade;
