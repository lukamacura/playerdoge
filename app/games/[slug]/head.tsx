import { gameData } from "@/lib/gameData";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const game = gameData.find((g) => g.slug === params.slug);

  if (!game) {
    return {
      title: "Game not found | PlayerDoge",
      description: "This game does not exist or is not available at the moment.",
      alternates: {
        canonical: "https://www.playerdoge.com/games/not-found",
      },
    };
  }

  const canonicalUrl = `https://www.playerdoge.com/games/${game.slug}`;
  const imageUrl = `https://www.playerdoge.com${game.image}`;

  return {
    title: `${game.name} TopUp | Buy Cheap & Safe Packs | PlayerDoge`,
    description: `Get the best deals for ${game.name} packs on PlayerDoge. Secure, fast delivery and unbeatable prices.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${game.name} TopUp | PlayerDoge`,
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
      title: `${game.name} TopUp | PlayerDoge`,
      description: `Buy ${game.name} packs safely and affordably.`,
      images: [imageUrl],
    },
    // 👇 Structured Data
    other: {
      "script:ld+json": JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": `${game.name} TopUp`,
          "description": `Buy ${game.name} packs securely and affordably.`,
          "image": imageUrl,
          "brand": {
            "@type": "Brand",
            "name": "PlayerDoge"
          },
          "offers": {
            "@type": "AggregateOffer",
            "url": canonicalUrl,
            "priceCurrency": "USD",
            "lowPrice": "4.99",
            "highPrice": "99.99",
            "offerCount": "5"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.playerdoge.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Games",
              "item": "https://www.playerdoge.com/games"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": `${game.name}`,
              "item": canonicalUrl
            }
          ]
        }
      ])
    }
  };
}
