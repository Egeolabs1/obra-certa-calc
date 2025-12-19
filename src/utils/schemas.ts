
export const generateWebSiteSchema = () => {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Sua Obra Certa",
        "url": "https://www.suaobracerta.com.br",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.suaobracerta.com.br/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
};

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
