
export const generateWebSiteSchema = () => {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Sua Obra Certa",
        "url": "https://www.suaobracerta.com.br"
    };
};

export const generateArticleSchema = (article: {
    title: string;
    description: string;
    url: string;
    image?: string;
    publishedAt: string;
    updatedAt?: string;
}) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "mainEntityOfPage": article.url,
    "image": article.image,
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt ?? article.publishedAt,
    "author": { "@type": "Organization", "name": "Equipe editorial Sua Obra Certa" },
    "publisher": { "@type": "Organization", "name": "Sua Obra Certa", "url": "https://www.suaobracerta.com.br" },
    "inLanguage": "pt-BR"
});

export const generateCalculatorSchema = (
    name: string,
    description: string,
    url: string,
    image: string = "https://www.suaobracerta.com.br/og-image.png",
    category: string = "CalculatorApplication"
) => {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": name,
        "description": description,
        "url": url,
        "applicationCategory": category,
        "operatingSystem": "Web",
        "image": image,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "BRL"
        },
        "author": {
            "@type": "Organization",
            "name": "Sua Obra Certa"
        }
    };
};

export const generateFAQSchema = (
    faqs: Array<{ question: string; answer: string }>
) => {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
};
