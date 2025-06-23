import Hero from '@/components/Hero'
import TrustBadges from '@/components/TrustBadges'
import Trending from "@/components/Trending";
import About from "@/components/About";
import HowItWorks from '@/components/HowItWorks';
import WhyPlayerDoge from '@/components/WhyPlayerDoge'
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Team from "@/components/Team";



export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBadges />
      <Trending />
      <About />
      <HowItWorks />
      <WhyPlayerDoge />
      <Faq />
      <Reviews />
      <Contact />
      <Team />


    </main>
  )
}
