import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/context/AuthContext'
import Layout from '@/components/Layout'
import { Inter, Montserrat } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${montserrat.variable}`}>
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
    </div>
   
  )
}
