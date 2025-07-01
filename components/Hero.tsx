'use client'

import Image from 'next/image'
import AnimateSection from "@/components/AnimateSection";
import Link from 'next/link'
import { useEffect, useState } from 'react'

const images = [
  '/images/home_main1.png',
  '/images/home_main2.png',
  '/images/home_main3.png',
]

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimateSection>
<section className="relative isolate bg-[#FEFFD2] text-[#1D1D1D] overflow-hidden md:min-h-[80vh] min-h-[100vh] flex items-end">
      {/* Rotating Background Images */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Background ${index}`}
            fill
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FEFFD2]" />
      </div>

      {/* Content aligned to bottom */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20">
        <div className="max-w-4xl text-center lg:text-left">
          
          <h1 className="text-5xl md:text-7xl font-extrabold font-montserrat leading-tight tracking-tight text-[#1d1d1d] drop-shadow-lg max-w-3xl mx-auto lg:mx-0">
            Welcome to <span className="text-[#FF7D29]">PlayerDoge</span>
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-[#1D1D1D]/90 font-medium font-inter drop-shadow-md max-w-2xl mx-auto lg:mx-0">
          Every upgrade counts — buy game packs cheaper with PlayerDoge, your trusted top-up service for secure purchases, no ban risk, and real savings.
          </p>

{/* CTA Buttons */}
<div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
  <Link
    href="/games"
    className="px-8 py-4 bg-[#FF7D29] hover:bg-[#e96e1b] text-white font-bold font-montserrat rounded-xl shadow-lg text-lg transition-all"
  >
    Browse games
  </Link>
  <Link
    href="/login"
    className="px-8 py-4 bg-black text-white hover:bg-neutral-800 font-bold font-montserrat rounded-xl shadow-lg text-lg transition-all"
  >
    Login
  </Link>
</div>



        </div>

        {/* Carousel indicators */}
        <div className="mt-8 flex justify-center lg:justify-start">
          <div className="flex gap-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index
                    ? 'bg-[#FF7D29]'
                    : 'bg-[#FF7D29]/30'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </AnimateSection>

    
  )
}
