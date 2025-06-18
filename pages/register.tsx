import { useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { useRouter } from 'next/router'
import { auth } from '@/lib/firebase'
import { updateProfile } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { serverTimestamp } from 'firebase/firestore'



export default function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  try {
  console.log('👤 Creating user...')
  const userCred = await createUserWithEmailAndPassword(auth, email, password)

  console.log('✅ User created:', userCred.user.uid)

  await updateProfile(userCred.user, {
    displayName: name,
  })
  console.log('📝 Profile updated')

  await setDoc(doc(db, 'users', userCred.user.uid), {
    coins: 100,
    name: name,
    email: email,
    createdAt: serverTimestamp()

  })
  console.log('💾 User document created')

  await userCred.user.reload()
  await sendEmailVerification(userCred.user)
  console.log('📧 Verification email sent')

  alert('Verifikacioni email je poslat. Proveri svoj inbox.')
  router.push('/login')
} catch (err) {
  console.error('❌ Error in register flow:', err)
  if (err instanceof Error) {
    alert(err.message)
  } else {
    alert('Unknown error')
  }
} finally {
  console.log('🧹 Finished. Removing loading state.')
  setLoading(false)
}

  }

  return (
    <div className="min-h-screen bg-[#FEFFD2] flex items-center justify-center px-4">
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
            <button
              type="submit"
              className="w-full h-14 bg-[#FF7D29] hover:bg-[#e96e1b] text-white font-semibold py-2 rounded-md font-montserrat"
              disabled={loading || !email || !password || !name}


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
