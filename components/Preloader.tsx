'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const slogans = [
  "🎮 Did you know? You can save up to 30% with PlayerDoge!",
  "🕹️ Thousands of gamers already top-up cheaper using PlayerDoge!",
  "⏱️ Most orders are delivered in less than 30 minutes!",
]

export default function Preloader() {
  const [loading, setLoading] = useState(true)
  const [sloganIndex, setSloganIndex] = useState(0)

  useEffect(() => {
    const sloganInterval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length)
    }, 2000)

    const fakeLoading = setTimeout(() => {
      setLoading(false)
    }, 3000) // preload duration

    return () => {
      clearInterval(sloganInterval)
      clearTimeout(fakeLoading)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-[#FEFFD2] text-[#1d1d1d] z-50 flex flex-col justify-center items-center transition-opacity duration-500">
      <div className="animate-spin-slow mb-6">
        <Image
          src="/images/preloader.png" // putanja iz public/
          alt="PlayerDoge logo"
          width={100}
          height={100}
          className="object-contain"
        />

      </div>
<p className="text-lg font-semibold font-montserrat px-6 text-center animate-slide-fade">
  {slogans[sloganIndex]}
</p>
    </div>
  )
}
