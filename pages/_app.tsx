import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/context/AuthContext'
import Layout from '@/components/Layout'
import { Inter, Montserrat } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
import Script from "next/script";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${montserrat.variable}`}>
    <AuthProvider>
      <Layout>
        <>
          <Script
            src="https://code.tidio.co/mf6ykieouhpnn2yunnny6rud2q7p40nu.js"
            strategy="afterInteractive"
          />
          <Component {...pageProps} />
        </>
      </Layout>
    </AuthProvider>
    </div>
   
  )
}
