import Hero from '@/components/Hero'
import TrustBadges from '@/components/TrustBadges'
import Trending from "@/components/Trending";
import About from "@/components/About";
import HowItWorks from '@/components/HowItWorks';



export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBadges />
      <Trending />
      <About />
      <HowItWorks />

    </main>
  )
}
