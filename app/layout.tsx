import "../styles/globals.css";
import { Inter, Montserrat } from "next/font/google";
import Script from "next/script";
import { Providers } from "./providers";
import TidioSessionManager from "@/components/TidioSessionManager";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata = {
  title: "PlayerDoge",
  description: "Buy safe and affordable in-game top-ups.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} bg-[#FEFFD2] text-[#1D1D1D]`}>
        <Providers>
          <TidioSessionManager />
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
        <Script
          src="https://code.tidio.co/mf6ykieouhpnn2yunnny6rud2q7p40nu.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
