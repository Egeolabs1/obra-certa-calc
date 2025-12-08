import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    url?: string;
    image?: string;
    type?: string;
    keywords?: string;
    schema?: object; // JSON-LD Structured Data
}

const SEO = ({
    title,
    description,
    url = window.location.href,
    image = "/og-image.png", // Assuming a default image exists or we will create one placeholder
    type = "website",
    keywords,
    schema
}: SEOProps) => {
    const siteTitle = "Sua Obra Certa - Calculadoras de Construção";

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{`${title} | ${siteTitle}`}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data (JSON-LD) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
