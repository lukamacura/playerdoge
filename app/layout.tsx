import "../styles/globals.css";
import { Inter, Montserrat } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import Script from "next/script";
import TidioSessionManager from "@/components/TidioSessionManager";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata = {
  title: "PlayerDoge",
  description: "Buy safe and affordable in-game top-ups with PlayerDoge.",
  metadataBase: new URL("https://www.playerdoge.com"),
  openGraph: {
    title: "PlayerDoge",
    description: "Best in-game top-ups.",
    url: "https://www.playerdoge.com",
    siteName: "PlayerDoge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayerDoge",
    description: "Best in-game top-ups.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} bg-[#FEFFD2] text-[#1D1D1D]`}>
        <Providers>
          <TidioSessionManager />
          <Navbar />
          {children}
          <Footer />
        </Providers>
        <Script
          src="https://code.tidio.co/mf6ykieouhpnn2yunnny6rud2q7p40nu.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
