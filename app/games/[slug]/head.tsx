// app/games/[slug]/head.tsx
export const dynamic = "force-dynamic";

import { gameData } from "@/lib/gameData";
import type { Metadata } from "next";


export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const game = gameData.find((g) => g.slug === params.slug);

  if (!game) {
    console.warn("⚠️ Game not found for slug:", params.slug);
    return {
      title: "Game not found | Kinged",
      description: "This game does not exist or is not available at the moment.",
      keywords: ["game not found", "Kinged"],
      authors: [{ name: "Kinged Team" }],
      alternates: {
        canonical: "https://www.kinged.com/games/not-found",
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `https://www.kinged.com/games/${game.slug}`;
  const imageUrl = `https://www.kinged.com${game.image}`;

  return {
    title: `${game.name} TopUp | Buy Cheap & Safe Packs | Kinged`,
    description: `Get the best deals for ${game.name} packs on Kinged. Secure, fast delivery and unbeatable prices.`,
    keywords: [
      `${game.name} top up`,
      `buy ${game.name} packs`,
      `${game.name} recharge`,
      `${game.name} mobile`,
      "Kinged",
      "safe topup service",
    ],
    authors: [{ name: "Kinged Team" }],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${game.name} TopUp | Kinged`,
      description: `Buy ${game.name} packs safely and affordably. Trusted and verified top-up service.`,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${game.name} TopUp`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} TopUp | Kinged`,
      description: `Buy ${game.name} packs safely and affordably.`,
      images: [imageUrl],
    },
    other: {
      "script:ld+json": JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${game.name} TopUp`,
          description: `Buy ${game.name} packs securely and affordably.`,
          image: imageUrl,
          brand: {
            "@type": "Brand",
            name: "Kinged",
          },
          offers: {
            "@type": "AggregateOffer",
            url: canonicalUrl,
            priceCurrency: "USD",
            lowPrice: "4.99",
            highPrice: "99.99",
            offerCount: "5",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.kinged.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Games",
              item: "https://www.kinged.com/games",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: `${game.name}`,
              item: canonicalUrl,
            },
          ],
        },
      ]),
    },
  };
}
