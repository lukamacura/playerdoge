import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#FEFFD2] border-t border-[#FF7D29]/30 py-10 px-6">
<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: Company info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#FF7D29]">PlayerDoge LLC</h2>
          <p className="text-[#1D1D1D]">© 2025 PlayerDoge. All rights reserved.</p>
          <p className="text-sm leading-5 text-[#1D1D1D]">
            300 Colonial Center<br />
            Parkway STE 100N,<br />
            Roswell, GA, 30076<br />
            United States
          </p>
          <p className="text-xs text-[#888]">
            Made by{' '}
            <a href="https://macura-design.com" target="_blank" rel="noopener noreferrer" className="underline font-medium text-[#1D1D1D]">
              Macura Design
            </a>
          </p>
        </div>

        {/* Right: nav + icons */}
<div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
          {/* Nav links */}
<nav className="hidden md:flex flex-wrap gap-4 items-center justify-end text-[#1D1D1D] font-montserrat text-md">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/games">Games</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/register" className="bg-[#FF7D29] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#e96e1b]">
              Register
            </Link>
          </nav>

          {/* Payment icons */}
<div className="flex flex-wrap justify-center md:justify-end gap-4 mt-2">
            {[
              'paypal', 'wise', 'paysend', 'remitly', 'zelle',
              'visa', 'master', 'moneygram'
            ].map((name) => (
           <Image
          key={name}
          src={`/images/${name}.png`}
          alt={name}
          width={60}
          height={32}
          className="w-auto h-10 object-contain"
        />


            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
