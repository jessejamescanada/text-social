import prisma from '../../../prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    // make sure theyre logged in before making a post, if not then throw 401 error
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: 'Please sign in' })

    const commentId = req.query.commentId
    const userEmail = req.query.userEmail

    try {
      const result = await prisma.comment.delete({
        where: {
          id: commentId,
        },
      })
      res.status(200).json(result)
    } catch (error) {
      res.status(403).json({ err: 'Error has occured while deleting post' })
    }
  }
}
