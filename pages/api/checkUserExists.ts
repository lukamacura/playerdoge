// pages/api/checkUserExists.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from 'firebase-admin/auth'
import { firebaseAdmin } from '../../lib/firebaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    await getAuth(firebaseAdmin).getUserByEmail(email)
    return res.status(200).json({ exists: true })
  } catch {
  return res.status(200).json({ exists: false })
}

}
