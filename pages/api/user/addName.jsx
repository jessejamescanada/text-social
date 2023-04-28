import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions)
    if (!session)
      return res.status(401).json({ message: 'Please sign in to make a post' })

    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    // create post
    try {
      const result = await prisma.user.update({
        where: {
          id: prismaUser.id,
        },
        data: {
          name: req.body.name,
        },
      })

      const updateNameOnPosts = await prisma.post.updateMany({
        where: {
          userId: prismaUser.id,
        },
        data: {
          name: req.body.name,
        },
      })

      res.status(200).json(result)
      console.log(result)
    } catch (error) {
      res.status(403).json({ error })
    }
  }
}
