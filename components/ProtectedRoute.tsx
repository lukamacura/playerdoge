import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) return <p className="text-center p-8">Loading...</p>

  return <>{children}</>
}
