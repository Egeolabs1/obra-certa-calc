import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { appRoutes } from "@/config/routes";
import { getAllBlogPosts } from "@/data/blogPosts";

const MapaDoSite = () => {
  const blogPosts = getAllBlogPosts();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title="Mapa do site"
        description="Navegue por todas as páginas, calculadoras e artigos da Sua Obra Certa."
        url="https://www.suaobracerta.com.br/mapa-do-site"
      />
      <Header />

      <main className="container flex-1 py-10">
        <h1 className="mb-3 text-3xl font-bold">Mapa do site</h1>
        <p className="mb-8 text-muted-foreground">
          Links internos para facilitar navegação e descoberta das páginas pelo Google.
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Páginas principais</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/meu-orcamento">Meu orçamento</Link></li>
            <li><Link to="/contato">Contato</Link></li>
            <li><Link to="/politica-de-privacidade">Política de privacidade</Link></li>
            <li><Link to="/termos-de-uso">Termos de uso</Link></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Calculadoras</h2>
          <ul className="grid list-disc gap-2 pl-6 md:grid-cols-2">
            {appRoutes.map((route) => (
              <li key={route.path}>
                <Link to={route.path}>{route.title}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Artigos do blog</h2>
          <ul className="list-disc space-y-2 pl-6">
            {blogPosts.map((post) => (
              <li key={post.id}>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MapaDoSite;
