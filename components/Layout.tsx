import Navbar from './Navbar'
import Footer from './Footer'
import type { ReactNode } from 'react'
import Preloader from '@/components/Preloader'



export default function Layout({ children }: { children: ReactNode }) {
  return (
    
    <>
      <Preloader />
      <Navbar />
      <main className="pt-">{children}</main>
      <Footer />
    </>
  )
}
