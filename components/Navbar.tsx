'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()

  return (
<header
  className="fixed top-0 left-0 w-full z-50 bg-cover bg-center bg-no-repeat transition-shadow duration-300"
  style={{ backgroundImage: 'url(/images/nav-bg.png)' }}
>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#1D1D1D] font-montserrat">
          PlayerDoge
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-[#1D1D1D] font-montserrat">
    <Link href="/" className="hover:text-[#FF7D29] transition-colors duration-200">Home</Link>
    <Link href="/about" className="hover:text-[#FF7D29] transition-colors duration-200">About</Link>
    <Link href="/games" className="hover:text-[#FF7D29] transition-colors duration-200">Games</Link>
    <Link href="/contact" className="hover:text-[#FF7D29] transition-colors duration-200">Contact</Link>
    <Link href="/dashboard" className="hover:text-[#FF7D29] transition-colors duration-200">Dashboard</Link>


          {user && (
            <div className="ml-4 flex items-center gap-2">
              <span className="font-bold">Hi, {user.displayName || 'User'}</span>
              <Image src="/images/usa.png" alt="USA Flag" width={24} height={16} />
              <Link
                href="/register"
                className="ml-2 bg-[#FF7D29] hover:bg-[#e96e1b] text-white px-6 py-2 rounded-md font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          <Image src="/images/hamburger.png" alt="Menu" width={50} height={50} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
<div className="md:hidden flex flex-col items-center px-4 pb-4 space-y-2 text-[#1D1D1D] bg-[#FEFFD2] font-montserrat animate-fade-in-down">
<Link href="/" className="block" onClick={() => setMenuOpen(false)}>Home</Link>
<Link href="/about" className="block" onClick={() => setMenuOpen(false)}>About</Link>
<Link href="/games" className="block" onClick={() => setMenuOpen(false)}>Games</Link>
<Link href="/contact" className="block" onClick={() => setMenuOpen(false)}>Contact</Link>
<Link href="/dashboard" className="block" onClick={() => setMenuOpen(false)}>Dashboard</Link>


    {user && (
      <p className="text-sm text-[#1D1D1D] mt-2">Hi, {user.displayName || 'User'} 🇺🇸</p>
    )}

    <Link
      href="/register"
       onClick={() => setMenuOpen(false)}
      className="inline-block mt-2 bg-[#FF7D29] text-white px-6 py-2 rounded-md font-semibold"
    >
      Register
    </Link>
  </div>
)}

    </header>
  )
}
