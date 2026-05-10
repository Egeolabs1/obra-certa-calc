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

const BASE_URL = "https://www.suaobracerta.com.br";

const SEO = ({
    title,
    description,
    url,
    image = "/og-image.jpg", // Assuming a default image exists or we will create one placeholder
    type = "website",
    keywords,
    schema,
    noindex = false
}: SEOProps) => {
    const siteTitle = "Sua Obra Certa - Calculadoras de Construção";

    // Build canonical URL deterministically from the prop, NOT from window.location
    // This avoids issues where window.location might be non-www or have query params
    let canonicalUrl: string;
    if (url) {
        // Normalize to always use www
        canonicalUrl = url.includes("suaobracerta.com.br") && !url.includes("www.suaobracerta.com.br")
            ? url.replace("suaobracerta.com.br", "www.suaobracerta.com.br")
            : url;
    } else {
        // Fallback: derive from current path, but always use the canonical base
        const path = typeof window !== 'undefined' ? window.location.pathname : '/';
        canonicalUrl = `${BASE_URL}${path}`;
    }

    // Strip trailing slash except for root
    if (canonicalUrl !== `${BASE_URL}/` && canonicalUrl.endsWith('/')) {
        canonicalUrl = canonicalUrl.slice(0, -1);
    }

    // Ensure image is absolute URL
    const absoluteImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

    // Truncate description to ~160 chars for SEO best practices
    const safeDescription = description.length > 160
        ? description.substring(0, 157) + '...'
        : description;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
            <meta name="description" content={safeDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={canonicalUrl} />
            <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={safeDescription} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:site_name" content="SuaObraCerta" />
            <meta property="og:locale" content="pt_BR" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={safeDescription} />
            <meta property="twitter:image" content={absoluteImage} />

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
