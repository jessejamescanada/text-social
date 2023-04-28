import prisma from '../../../prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: 'Please sign in' })

    const postId = req.query

    try {
      const result = await prisma.post.delete({
        where: {
          id: postId.data,
        },
      })
      res.status(200).json(result)
    } catch (error) {
      res.status(403).json({ err: 'Error has occured while deleting post' })
    }
  }
}
