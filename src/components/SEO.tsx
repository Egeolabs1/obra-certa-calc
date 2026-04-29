import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    url?: string;
    image?: string;
    type?: string;
    keywords?: string;
    schema?: object | object[]; // JSON-LD Structured Data
    noindex?: boolean;
}

const SEO = ({
    title,
    description,
    url = window.location.href,
    image = "/og-image.jpg", // Assuming a default image exists or we will create one placeholder
    type = "website",
    keywords,
    schema,
    noindex = false
}: SEOProps) => {
    const siteTitle = "Sua Obra Certa - Calculadoras de Construção";

    // Normalize URL to enforce www if it's the production domain
    // This fixes "Page with redirect" errors in GSC where sitemap/canonical used non-www but server redirected to www
    let finalUrl = url;
    if (finalUrl.includes("suaobracerta.com.br") && !finalUrl.includes("www.suaobracerta.com.br")) {
        finalUrl = finalUrl.replace("suaobracerta.com.br", "www.suaobracerta.com.br");
    }

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={finalUrl} />
            <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={finalUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data (JSON-LD) */}
            {schema && (
                Array.isArray(schema) ? (
                    schema.map((item, index) => (
                        <script key={index} type="application/ld+json">
                            {JSON.stringify(item)}
                        </script>
                    ))
                ) : (
                    <script type="application/ld+json">
                        {JSON.stringify(schema)}
                    </script>
                )
            )}
        </Helmet>
    );
};

export default SEO;
