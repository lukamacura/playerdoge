'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()

  const handleLogout = () => {
    signOut(auth)
    setMenuOpen(false)
  }

  return (
<header className="fixed top-0 left-0 w-full z-50 bg-[#FEFFD2]/60 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold text-[#1D1D1D] font-montserrat">
          PlayerDoge
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-[#1D1D1D] font-montserrat">
          <Link href="/" className="hover:text-[#FF7D29] transition-colors duration-200">Home</Link>
          <Link href="/#about" className="hover:text-[#FF7D29] transition-colors duration-200">About</Link>
          <Link href="/#contact" className="hover:text-[#FF7D29] transition-colors duration-200">Contact</Link>
          <Link href="/games" className="hover:text-[#FF7D29] transition-colors duration-200">Games</Link>
          <Link href="/buycoins" className="hover:text-[#FF7D29] transition-colors duration-200">Buy coins</Link>
          <Link href="/dashboard" className="hover:text-[#FF7D29] transition-colors duration-200">Dashboard</Link>

          {!user ? (
            <>
              <Link href="/login" className="ml-4 text-sm font-medium hover:underline">
                Login
              </Link>
              <Link
                href="/register"
                className="ml-2 bg-[#FF7D29] hover:bg-[#e96e1b] text-white px-6 py-2 rounded-md font-bold font-montserrat"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="ml-4 flex items-center gap-3">
              <span className="font-bold">Hi, {user.displayName || 'User'}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold border border-[#FF7D29] text-[#FF7D29] px-4 py-1.5 rounded hover:bg-[#fff1e6] transition"
              >
                Sign out
              </button>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center group"
          aria-label="Toggle menu"
        >
          {/* Top line */}
          <span
            className={`absolute w-6 h-[2.5px] bg-[#FF7D29] rounded transition-all duration-300 ease-in-out
              ${menuOpen ? 'rotate-45 top-1/2 translate-y-[-50%]' : 'top-[30%]'}
            `}
          />

          {/* Middle line */}
          <span
            className={`absolute w-4 h-[2.5px] bg-[#FF7D29] rounded transition-all duration-300 ease-in-out
              ${menuOpen ? 'opacity-0' : 'top-1/2 translate-y-[-50%]'}
            `}
          />

          {/* Bottom line */}
          <span
            className={`absolute w-6 h-[2.5px] bg-[#FF7D29] rounded transition-all duration-300 ease-in-out
              ${menuOpen ? '-rotate-45 top-1/2 translate-y-[-50%]' : 'top-[70%]'}
            `}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center px-4 pb-4 space-y-2 text-[#1D1D1D] bg-[#FEFFD2] font-montserrat animate-fade-in-down">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/#about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/#contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/games" onClick={() => setMenuOpen(false)}>Games</Link>
          <Link href="/buycoins" onClick={() => setMenuOpen(false)}>Buy coins</Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>

          {!user ? (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 text-sm font-medium hover:underline"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="inline-block bg-[#FF7D29] text-white px-6 py-2 rounded-md font-semibold"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm mt-2">Hi, {user.displayName || 'User'}</p>
              <button
                onClick={handleLogout}
                className="border border-[#FF7D29] text-[#FF7D29] px-4 py-1.5 rounded hover:bg-[#fff1e6] transition"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
