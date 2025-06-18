import { useState } from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'next/router'
import { auth } from '@/lib/firebase'
import Image from 'next/image'
import Link from 'next/link'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      if (!user.emailVerified) {
        alert('Verifikuj email adresu pre prijave.')
        return
      }
      router.push('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert('Unknown error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) return alert('Unesi email za reset lozinke.')
    await sendPasswordResetEmail(auth, email)
    alert('Poslat je email za reset lozinke.')
  }

  return (
    <div className="min-h-screen bg-[#FEFFD2] flex items-center justify-center px-4">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center justify-between gap-8">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-[#FF7D29]/10 rounded-3xl shadow-xl p-8 text-[#1D1D1D]"
        >
          <h1 className="text-2xl font-bold mb-4 text-center font-montserrat">Login</h1>

          <div className="space-y-4">
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
            <button
              type="submit"
              className="w-full h-14 bg-[#FF7D29] hover:bg-[#e96e1b] text-white font-semibold py-2 rounded-md font-montserrat"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <p className="text-sm text-center mt-4 text-[#1D1D1D]/70">
            Forgot your password?{' '}
            <button type="button" onClick={handleResetPassword} className="text-[#FF7D29] font-semibold underline" >
              Reset
            </button>
          </p>
          <p className="text-sm text-center mt-2 text-[#1D1D1D]">
            Don’t have an account?{' '}
            <Link href="/register" className="text-[#FF7D29] font-semibold">
              Register
            </Link>
          </p>
        </form>

        <div className="w-full max-w-md flex justify-center">
          <Image
            src="/images/login.png"
            alt="Doge login"
            width={400}
            height={400}
            priority
          />
        </div>
      </div>
    </div>
  )
}
