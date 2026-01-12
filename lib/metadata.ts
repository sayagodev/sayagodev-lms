import { Metadata } from "next";
import { env } from "./env";

export interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  keywords?: string[];
}

/**
 * Genera metadatos completos para una página
 * Incluye Open Graph y Twitter Cards automáticamente
 */
export function generateMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  noindex = false,
  keywords = [],
}: MetadataProps): Metadata {
  const siteName = env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const siteDescription = env.NEXT_PUBLIC_SITE_DESCRIPTION;
  const twitterHandle = env.NEXT_PUBLIC_TWITTER_HANDLE;

  // Construir título completo
  const fullTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} - ${siteDescription}`;

  // Construir URL completa
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

  // Imagen por defecto o la proporcionada
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/og-image.png`; // Imagen por defecto para OG

  return {
    title: fullTitle,
    description: description || siteDescription,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: noindex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type,
      locale: "es_MX",
      url: fullUrl,
      siteName,
      title: title || siteName,
      description: description || siteDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title || siteName,
      description: description || siteDescription,
      images: [ogImage],
      ...(twitterHandle && { creator: twitterHandle }),
    },
    alternates: {
      canonical: fullUrl,
    },
    metadataBase: new URL(siteUrl),
  };
}
