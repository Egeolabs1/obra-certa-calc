import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Mail, Tag, ChevronRight } from "lucide-react";
import { FaWhatsapp, FaTwitter } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getBlogPostBySlug, getAllBlogPosts } from "@/data/blogPosts";
import { generateArticleSchema } from "@/utils/schemas";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ArticleSources from "@/components/ArticleSources";
import { articleSources } from "@/data/articleSources";

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = slug ? getBlogPostBySlug(slug) : undefined;
    const allPosts = getAllBlogPosts();

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    const relatedPosts = allPosts
        .filter(p => p.id !== post.id && p.category === post.category)
        .slice(0, 3);

    const shareUrl = `https://www.suaobracerta.com.br/blog/${post.slug}`;
    const sources = articleSources[post.slug] ?? [];
    const shareTitle = post.title;

    const handleShare = (platform: string) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(shareTitle);

        const urls = {
            whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            email: `mailto:?subject=${encodedTitle}&body=Confira%20este%20artigo:%20${encodedUrl}`
        };

        window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title={`${post.title} | Blog Sua Obra Certa`}
                description={post.excerpt}
                url={shareUrl}
                image={post.featuredImage}
                noindex={sources.length < 2}
                schema={generateArticleSchema({
                    title: post.title,
                    description: post.excerpt,
                    url: shareUrl,
                    image: post.featuredImage,
                    publishedAt: post.publishedAt,
                    updatedAt: post.updatedAt,
                })}
            />

            <Header />

            <main className="flex-1">
                {/* Breadcrumbs */}
                <div className="border-b bg-muted/30">
                    <div className="container py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-foreground font-medium truncate">{post.title}</span>
                        </div>
                    </div>
                </div>

                {/* Article Header */}
                <article className="container py-8 md:py-12">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar ao Blog
                    </Link>

                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                            Este artigo está em revisão editorial. Enquanto as fontes e a data de revisão não forem confirmadas, ele não participa do índice de busca.
                        </div>
                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge>{post.category}</Badge>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                {post.readTimeMinutes} min de leitura
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                            {post.excerpt}
                        </p>

                        {/* Author */}
                        <div className="flex items-center justify-between mb-8 pb-8 border-b">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                                    {post.author.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">Equipe editorial Sua Obra Certa</p>
                                    <p className="text-sm text-muted-foreground">Conteúdo revisado para uso informativo</p>
                                </div>
                            </div>

                            {/* Share Buttons */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground mr-2 hidden sm:block">
                                    <Share2 className="h-4 w-4 inline mr-1" />
                                    Compartilhar:
                                </span>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleShare('whatsapp')}
                                    title="Compartilhar no WhatsApp"
                                    className="h-9 w-9"
                                >
                                    <FaWhatsapp className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleShare('facebook')}
                                    title="Compartilhar no Facebook"
                                    className="h-9 w-9"
                                >
                                    <Facebook className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleShare('twitter')}
                                    title="Compartilhar no Twitter"
                                    className="h-9 w-9"
                                >
                                    <FaTwitter className="h-4 w-4 text-sky-500" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleShare('email')}
                                    title="Compartilhar por Email"
                                    className="h-9 w-9"
                                >
                                    <Mail className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {post.featuredImage && (
                            <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
                                <img
                                    src={post.featuredImage}
                                    alt={post.title}
                                    className="w-full h-auto"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="prose prose-slate max-w-none prose-lg
              prose-headings:font-bold prose-headings:text-foreground
              prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
              prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10 prose-h2:border-b prose-h2:pb-2
              prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
              prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-6
              prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-bold
              prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-foreground prose-li:my-1
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:my-6
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-foreground
              prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
              prose-table:w-full prose-table:border-collapse prose-table:my-6
              prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold
              prose-td:border prose-td:border-border prose-td:p-3
              prose-img:rounded-lg prose-img:shadow-md"
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{ h1: ({ children }) => <h2>{children}</h2> }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        {sources.length >= 2 && <ArticleSources sources={sources} />}
                        <aside className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
                            <h2 className="mb-2 font-semibold">Limites e revisão</h2>
                            <p>Este material é educativo e complementa as calculadoras do site. Medidas, custos, normas e soluções construtivas variam conforme o projeto, o local e o fabricante. Para decisões estruturais, elétricas, hidráulicas, legais ou financeiras, consulte um profissional habilitado e a documentação técnica aplicável.</p>
                            <Link to="/sobre" className="mt-3 inline-block font-medium underline">Conheça o método editorial e as limitações das ferramentas</Link>
                        </aside>

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t">
                            <div className="flex flex-wrap items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                                {post.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </div>

                        {/* Share Again */}
                        <div className="mt-8 p-6 bg-muted/50 rounded-xl">
                            <p className="text-center text-sm text-muted-foreground mb-4">
                                Gostou do artigo? Compartilhe com quem também está construindo ou reformando!
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <Button onClick={() => handleShare('whatsapp')} className="gap-2">
                                    <FaWhatsapp className="h-4 w-4" />
                                    WhatsApp
                                </Button>
                                <Button onClick={() => handleShare('facebook')} variant="outline" className="gap-2">
                                    <Facebook className="h-4 w-4" />
                                    Facebook
                                </Button>
                                <Button onClick={() => handleShare('twitter')} variant="outline" className="gap-2">
                                    <FaTwitter className="h-4 w-4" />
                                    Twitter
                                </Button>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="bg-muted/30 py-12 md:py-16">
                        <div className="container">
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-2xl md:text-3xl font-bold mb-8">Artigos Relacionados</h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {relatedPosts.map((relatedPost) => (
                                        <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                                            {relatedPost.featuredImage && (
                                                <div className="h-40 bg-muted">
                                                    <img
                                                        src={relatedPost.featuredImage}
                                                        alt={relatedPost.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <CardHeader>
                                                <Badge variant="secondary" className="w-fit mb-2">
                                                    {relatedPost.category}
                                                </Badge>
                                                <CardTitle className="text-lg line-clamp-2">
                                                    <Link
                                                        to={`/blog/${relatedPost.slug}`}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {relatedPost.title}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {relatedPost.excerpt}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                                    <Clock className="h-3 w-3" />
                                                    {relatedPost.readTimeMinutes} min
                                                </div>
                                                <Button asChild variant="outline" size="sm" className="w-full">
                                                    <Link to={`/blog/${relatedPost.slug}`}>
                                                        Ler Artigo
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-12 md:py-16">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                Pronto para Calcular sua Obra?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Use nossas calculadoras gratuitas para economizar tempo e dinheiro no seu projeto.
                            </p>
                            <Button asChild size="lg" className="gap-2">
                                <Link to="/">
                                    Ver Todas as Calculadoras
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default BlogPost;
