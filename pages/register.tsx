import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { useRouter } from 'next/router'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)

      await updateProfile(userCred.user, { displayName: name })

      await setDoc(doc(db, 'users', userCred.user.uid), {
        coins: 100,
        name,
        email,
        createdAt: serverTimestamp()
      })

      await sendEmailVerification(userCred.user)

      alert('Verification email sent! Please check your inbox.')
      router.push('/login')
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        const code = err.code
        if (code === 'auth/email-already-in-use') {
          setError('This email is already registered.')
        } else if (code === 'auth/weak-password') {
          setError('Password should be at least 6 characters.')
        } else if (code === 'auth/invalid-email') {
          setError('Invalid email address format.')
        } else {
          setError('Something went wrong. Please try again.')
        }
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
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#FF7D29]/10 rounded-3xl shadow-xl p-8 text-[#1D1D1D]"
        >
          <h1 className="text-2xl font-bold mb-4 text-center font-montserrat">Registration</h1>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="👤 Name"
              className="w-full bg-[#FEFFD2] placeholder:text-black/50 border border-[#FF7D29]/30 p-3 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="✉️ E-mail"
              className="w-full bg-[#FEFFD2] placeholder:text-black/50 border border-[#FF7D29]/30 p-3 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="🔒 Password"
              className="w-full bg-[#FEFFD2] placeholder:text-black/50 border border-[#FF7D29]/30 p-3 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

            <button
              type="submit"
              className="w-full h-14 bg-[#FF7D29] hover:bg-[#e96e1b] text-white py-2 rounded-md font-bold font-montserrat"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <p className="text-sm text-center mt-4 text-[#1D1D1D]/70">
            Get <span className="font-bold text-[#1D1D1D]">100 free coins</span> when you register!
          </p>
          <p className="text-sm text-center mt-2 text-[#1D1D1D]">
            Have an account?{' '}
            <Link href="/login" className="text-[#FF7D29] font-semibold">
              Login
            </Link>
          </p>
        </form>

        <div className="w-full max-w-md flex justify-center">
          <Image
            src="/images/register.png"
            alt="Doge registering"
            width={400}
            height={400}
            priority
          />
        </div>
      </div>
    </div>
  )
}
