'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative bg-[#FEFFD2] text-[#1D1D1D] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full h-full">
  <Image
    src="/images/home_main.png"
    alt="Hero Background"
    fill
    className="object-cover"
    priority
  />
</div>


      {/* Overlay content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left text block */}
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">
            Welcome to <span className="text-[#FF7D29]">PlayerDoge</span>
          </h1>
          <p className="mt-4 text-base md:text-lg font-medium drop-shadow-sm">
            Every upgrade counts — <br className="sm:hidden" />
            buy game packs cheaper with PlayerDoge, your trusted top-up service for secure purchases, no ban risk, and real savings.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link
              href="/games"
              className="px-6 py-3 bg-[#FF7D29] hover:bg-[#e96e1b] text-white font-semibold rounded-md shadow-md transition-colors"
            >
              Browse games
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-black text-white hover:bg-neutral-800 font-semibold rounded-md shadow-md transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Doge image */}
       
      </div>

      {/* Indicators (carousel-style dummy) */}
      <div className="relative z-10 flex justify-center mt-4 lg:mt-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-[#FF7D29] rounded-full"></div>
          <div className="w-3 h-3 bg-[#FF7D29]/30 rounded-full"></div>
          <div className="w-3 h-3 bg-[#FF7D29]/30 rounded-full"></div>
        </div>
      </div>
    </section>
  )
}
