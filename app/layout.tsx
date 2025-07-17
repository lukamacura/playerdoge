import "../styles/globals.css";
import { Inter, Montserrat } from "next/font/google";
import Script from "next/script";
import { Providers } from "./providers";
import TidioSessionManager from "@/components/TidioSessionManager";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata = {
  title: {
    default: "PlayerDoge",
    template: "%s | PlayerDoge",
  },
  description: "Buy safe and discounted mobile game top-ups with PlayerDoge. 50+ supported games. Instant delivery. No bans.",
  keywords: [
    "buy game packs",
    "discounted top-ups",
    "mobile game recharge",
    "King of Avalon",
    "Sea of Conquest",
    "Guns of Glory",
  ],
  metadataBase: new URL("https://www.playerdoge.com"),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "PlayerDoge | Safe Game Top-Ups",
    description: "Buy discounted and secure game packs for 50+ mobile titles. Trusted by gamers worldwide.",
    type: "website",
    url: "https://www.playerdoge.com",
    images: [
      {
        url: "https://www.playerdoge.com/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "PlayerDoge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayerDoge | Cheaper Mobile Game Top-Ups",
    description: "Top up mobile games like King of Avalon and State of Survival cheaper and safely through PlayerDoge.",
    images: ["https://www.playerdoge.com/images/og-default.jpg"],
  },
  icons: {
    icon: "/images/preloader.png",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="bg-[#FEFFD2] text-[#1D1D1D]">
        <Providers>
          <TidioSessionManager />
          <ClientLayout>{children}</ClientLayout>
        </Providers>

        {/* ✅ External scripts (OK) */}
        <Script
          src="https://code.tidio.co/mf6ykieouhpnn2yunnny6rud2q7p40nu.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
