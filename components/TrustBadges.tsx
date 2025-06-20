'use client'

import Image from 'next/image'

const badges = [
  {
    icon: '/images/trust1.png',
    title: 'Trust',
    desc: 'PlayerDoge delivers safe mobile game top-ups trusted by thousands of gamers across Android and iOS.',
  },
  {
    icon: '/images/trust2.png',
    title: 'Efficiency',
    desc: 'Fast and reliable top-up service for mobile games with secure payments and real in-game discounts.',
  },
  {
    icon: '/images/trust3.png',
    title: 'Customer First',
    desc: 'Real support for mobile gamers — quick replies, no bots, and service built fully around your needs.',
  },
]

export default function TrustBadges() {
  return (
    <section className="bg-[#FEFFD2] text-[#1D1D1D] py-12 px-4">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
    {badges.map((badge, index) => (
      <div key={index} className="flex flex-col items-center md:items-start gap-3">
        {/* Icon + Title Row */}
        <div className="flex items-center gap-3">
          <Image
            src={badge.icon}
            alt={badge.title}
            width={40}
            height={40}
            className="object-contain"
          />
          <h3 className="text-lg font-bold font-montserrat drop-shadow-[2px_2px_3px_rgba(0,0,0,0.5)]">
            {badge.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-md font-inter">{badge.desc}</p>
      </div>
    ))}
  </div>
</section>

  )
}
