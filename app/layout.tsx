import '../styles/globals.css'
import { Inter, Montserrat } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Providers } from "./providers"; // 👈 novi import
import Preloader from '@/components/Preloader'


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })


export const metadata = {
  title: 'PlayerDoge',
  description: 'Buy safe and affordable in-game top-ups with PlayerDoge.',
  metadataBase: new URL('https://www.playerdoge.com'),
  openGraph: {
    title: 'PlayerDoge',
    description: 'Best in-game top-ups.',
    url: 'https://www.playerdoge.com',
    siteName: 'PlayerDoge',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlayerDoge',
    description: 'Best in-game top-ups.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} bg-[#FEFFD2] text-[#1D1D1D]`}>
        <Preloader /> {/* Ovde ga ubaci */}
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
