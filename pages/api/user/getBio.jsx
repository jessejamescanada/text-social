import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions)
    if (!session)
      return res.status(401).json({ message: 'Please sign in to make a post' })

    try {
      const data = await prisma.user.findUnique({
        where: { email: session.user.email },
      })
      res.status(200).json(data)
    } catch (error) {
      res.status(403).json({ err: 'Error fetching posts' })
    }
  }
}
