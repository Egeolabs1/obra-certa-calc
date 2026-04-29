import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, Clock, Search, Tag, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllBlogPosts } from "@/data/blogPosts";
import { generateWebSiteSchema } from "@/utils/schemas";

const Blog = () => {
    const allPosts = getAllBlogPosts();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = allPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const categories = Array.from(new Set(allPosts.map(post => post.category)));
    const popularTags = ["Construção", "Reforma", "Economia", "NBR", "Materiais"];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SEO
                title="Blog de Construção Civil | Guias e Dicas - Sua Obra Certa"
                description="Aprenda tudo sobre construção e reforma com nossos guias completos. Dicas de profissionais, normas técnicas, economia e muito mais."
                url="https://www.suaobracerta.com.br/blog"
                schema={generateWebSiteSchema()}
            />

            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-20">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-up">
                                <BookOpen className="h-4 w-4" />
                                Guias e Artigos Profissionais
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-up">
                                Blog <span className="text-yellow-500">Sua Obra Certa</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-300 mb-8 animate-fade-up">
                                Aprenda com guias completos, dicas de profissionais e as melhores práticas de construção civil.
                            </p>

                            {/* Search */}
                            <div className="max-w-xl mx-auto animate-fade-up">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder="Pesquisar artigos..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container py-12">
                    <div className="grid lg:grid-cols-[1fr_300px] gap-8">
                        {/* Main Content */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Artigos"}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {filteredPosts.length} {filteredPosts.length === 1 ? 'artigo' : 'artigos'}
                                </p>
                            </div>

                            {/* Blog Posts Grid */}
                            <div className="grid gap-6">
                                {filteredPosts.length === 0 ? (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-12">
                                            <Search className="h-12 w-12 text-muted-foreground mb-4" />
                                            <p className="text-lg font-medium text-muted-foreground mb-2">
                                                Nenhum artigo encontrado
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Tente pesquisar por outros termos
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    filteredPosts.map((post) => (
                                        <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="md:flex">
                                                {post.featuredImage && (
                                                    <div className="md:w-64 h-48 md:h-auto bg-muted flex-shrink-0">
                                                        <img
                                                            src={post.featuredImage}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <CardHeader>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                            <Badge variant="secondary">{post.category}</Badge>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                                                                    day: '2-digit',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {post.readTimeMinutes} min
                                                            </span>
                                                        </div>

                                                        <CardTitle className="text-xl md:text-2xl mb-2">
                                                            <Link
                                                                to={`/blog/${post.slug}`}
                                                                className="hover:text-primary transition-colors"
                                                            >
                                                                {post.title}
                                                            </Link>
                                                        </CardTitle>

                                                        <CardDescription className="text-base">
                                                            {post.excerpt}
                                                        </CardDescription>
                                                    </CardHeader>

                                                    <CardContent>
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {post.tags.slice(0, 3).map((tag) => (
                                                                <Badge key={tag} variant="outline" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                                                    {post.author.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-foreground">{post.author.name}</p>
                                                                    <p className="text-xs">{post.author.role}</p>
                                                                </div>
                                                            </div>

                                                            <Button asChild variant="outline">
                                                                <Link to={`/blog/${post.slug}`}>
                                                                    Ler Artigo
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* Categories */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Tag className="h-5 w-5" />
                                        Categorias
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm"
                                            >
                                                {category}
                                                <span className="float-right text-muted-foreground">
                                                    {allPosts.filter(p => p.category === category).length}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Popular Tags */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Tags Populares
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {popularTags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                                onClick={() => setSearchQuery(tag)}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Newsletter */}
                            <Card className="bg-gradient-to-br from-primary/10 to-yellow-500/10 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-lg">📬 Newsletter</CardTitle>
                                    <CardDescription>
                                        Receba novos artigos e dicas direto no seu email
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Input placeholder="Seu melhor email" type="email" />
                                    <Button className="w-full">Inscrever-se</Button>
                                    <p className="text-xs text-muted-foreground text-center">
                                        Sem spam. Apenas conteúdo de qualidade.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* CTA for Calculators */}
                            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-lg">🧮 Ferramentas Grátis</CardTitle>
                                    <CardDescription className="text-slate-300">
                                        Mais de 25 calculadoras profissionais
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild variant="secondary" className="w-full">
                                        <Link to="/">
                                            Ver Calculadoras
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
