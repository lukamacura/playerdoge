import Hero from '@/components/Hero'
import TrustBadges from '@/components/TrustBadges'
import Trending from "@/components/Trending";
import About from "@/components/About";
import HowItWorks from '@/components/HowItWorks';
import WhyKinged from '@/components/WhyKinged'
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Team from "@/components/Team";



export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBadges />
      <Trending />
      <About />
      <HowItWorks />
      <WhyKinged />
      <Faq />
      <Reviews />
      <Team />


    </main>
  )
}
