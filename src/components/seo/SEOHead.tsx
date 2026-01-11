import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export const SEOHead = ({
    title = "AyScroll - Learn by Scrolling | Knowledge Micro-Learning Platform",
    description = "AyScroll is the future of micro-learning. Save interesting snippets, build your personal library, and access your wisdom offline anywhere. Join the knowledge revolution.",
    keywords = "AyScroll, nfks, Ayscroll nfks, nfks affiliate, mayank jha, mayankjha kumar jha, micro-learning, education, scroll learning, knowledge base, Ayscroll app, learn via scrolling, educational snippets",
    image = "/images/dashboard.png",
    url = "https://ayscroll.com"
}: SEOHeadProps) => {
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
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

            {/* Canonical */}
            <link rel="canonical" href={url} />
        </Helmet>
    );
};
