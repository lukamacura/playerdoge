'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative isolate bg-[#FEFFD2] text-[#1D1D1D] overflow-hidden min-h-[75vh] flex items-end">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="/images/home_main.png"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* Blur gradient to fade bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FEFFD2]"></div>
      </div>

      {/* Content aligned to bottom */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20">
        <div className="max-w-4xl text-center lg:text-left">
          
          <h1 className="text-4xl md:text-6xl font-black leading-tight font-montserrat drop-shadow-lg">
            Welcome to <span className="text-[#FF7D29]">PlayerDoge</span>
          </h1>
          <p className="mt-4 text-base md:text-xl font-medium font-inter drop-shadow-lg">
            Every upgrade counts —{' '}
            <br className="sm:hidden" />
            buy game packs cheaper with PlayerDoge, your trusted top-up service for secure purchases, no ban risk, and real savings.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link
              href="/games"
              className="px-6 py-3 bg-[#FF7D29] hover:bg-[#e96e1b] text-white font-bold font-montserrat rounded-md shadow-md transition-all"
            >
              Browse games
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-black text-white hover:bg-neutral-800 font-bold font-montserrat rounded-md shadow-md transition-all"
            >
              Login
            </Link>
          </div>
        </div>
        

        {/* Carousel indicators */}
        <div className="mt-8 flex justify-center lg:justify-start">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-[#FF7D29] rounded-full"></div>
            <div className="w-3 h-3 bg-[#FF7D29]/30 rounded-full"></div>
            <div className="w-3 h-3 bg-[#FF7D29]/30 rounded-full"></div>
          </div>
        </div>
      </div>
      
    </section>

    
  )
}
