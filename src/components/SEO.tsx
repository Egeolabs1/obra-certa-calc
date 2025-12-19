import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description: string;
    url?: string;
    image?: string;
    type?: string;
    keywords?: string;
    schema?: object; // JSON-LD Structured Data
}

// Função para normalizar URLs canônicas
const normalizeCanonicalUrl = (url: string): string => {
    try {
        // Se a URL já é absoluta e começa com http, usar diretamente
        if (url.startsWith('http://') || url.startsWith('https://')) {
            const urlObj = new URL(url);
            // Normalizar: sempre usar www, remover trailing slash (exceto raiz), remover query params e hash
            const pathname = urlObj.pathname === '/' ? '/' : urlObj.pathname.replace(/\/$/, '');
            return `https://www.suaobracerta.com.br${pathname}`;
        }
        
        // Se for uma URL relativa, construir a URL completa
        const baseUrl = 'https://www.suaobracerta.com.br';
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        const normalizedPath = cleanPath === '/' ? '/' : cleanPath.replace(/\/$/, '');
        return `${baseUrl}${normalizedPath}`;
    } catch (error) {
        // Fallback: usar window.location se houver erro
        const currentUrl = typeof window !== 'undefined' ? window.location : { pathname: '/' };
        const pathname = currentUrl.pathname === '/' ? '/' : currentUrl.pathname.replace(/\/$/, '');
        return `https://www.suaobracerta.com.br${pathname}`;
    }
};

const SEO = ({
    title,
    description,
    url,
    image = "https://www.suaobracerta.com.br/og-image.png",
    type = "website",
    keywords,
    schema
}: SEOProps) => {
    const siteTitle = "Sua Obra Certa - Calculadoras de Construção";
    const location = useLocation();
    
    // Determinar a URL canônica
    let canonicalUrl: string;
    if (url) {
        canonicalUrl = normalizeCanonicalUrl(url);
    } else {
        // Se não foi fornecida, usar a rota atual
        const pathname = location.pathname === '/' ? '/' : location.pathname.replace(/\/$/, '');
        canonicalUrl = `https://www.suaobracerta.com.br${pathname}`;
    }
    
    // Normalizar a imagem também
    const normalizedImage = image.startsWith('http') 
        ? image 
        : image.startsWith('/') 
            ? `https://www.suaobracerta.com.br${image}`
            : `https://www.suaobracerta.com.br/${image}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={canonicalUrl} />
            <meta name="robots" content="index, follow" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={normalizedImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={normalizedImage} />

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
