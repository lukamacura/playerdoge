"use client";

import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from '@/lib/firebase'
import Image from 'next/image'
import Link from 'next/link'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

const handleReset = async (e: React.FormEvent) => {
  e.preventDefault()
  setMessage('')
  setError('')
  setLoading(true)

  try {
    // Prvo proveri da li korisnik postoji
    const res = await fetch('/api/checkUserExists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()

    if (!data.exists) {
      setError('No account found with this email.')
      return
    }

    // Ako postoji, šalji reset link
    await sendPasswordResetEmail(auth, email)
    setMessage('Password reset email sent. Check your inbox. 📬')
  } catch (err: unknown) {
    if (err instanceof FirebaseError) {
      const code = err.code
      if (code === 'auth/invalid-email') setError('No account found with this email.')
      else setError('Something went wrong. Please try again.')
    } else {
      setError('Unexpected error occurred.')
    }
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="min-h-screen bg-[#FEFFD2] flex items-center justify-center px-4 pt-[10vh]">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center justify-between gap-8">
        <form
          onSubmit={handleReset}
          className="w-full max-w-md bg-[#FF7D29]/10 rounded-3xl shadow-xl p-8 text-[#1D1D1D]"
        >
          <h1 className="text-2xl font-bold mb-4 text-center font-montserrat">Reset Password</h1>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="✉️ Your E-mail"
              className="w-full bg-[#FEFFD2] placeholder:text-black/50 border border-[#FF7D29]/30 p-3 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            {message && <p className="text-green-600 text-sm mt-1">{message}</p>}

            <button
              type="submit"
              className="w-full h-14 bg-[#FF7D29] hover:bg-[#e96e1b] text-white font-bold font-montserrat py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>

          <p className="text-sm text-center mt-4 text-[#1D1D1D]">
            Remembered your password?{' '}
            <Link href="/login" className="text-[#FF7D29] font-semibold">
              Login
            </Link>
          </p>
        </form>

        <div className="w-full max-w-md flex justify-center">
          <Image
            src="/images/reset.png"
            alt="Reset password"
            width={400}
            height={400}
            priority
          />
        </div>
      </div>
    </div>
  )
}
