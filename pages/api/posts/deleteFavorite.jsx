import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    // make sure theyre logged in before making a post, if not then throw 401 error
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: 'Please sign in' })

    //   get user
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    const postId = req.query.postId
    const email = req.query.email

    try {
      const result = await prisma.favorites.deleteMany({
        where: {
          userId: email,
          postId: postId,
        },
      })
      res.status(200).json(result)
    } catch (error) {
      res.status(403).json({ err: 'Error has occured while deleting post' })
    }
  }
}
