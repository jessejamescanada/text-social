import prisma from '../../../prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions)
    if (!session)
      return res.status(401).json({ message: 'Please sign in to make a post' })

    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    // console.log(prismaUser.id)
    try {
      const data = await prisma.post.findMany({
        where: {
          user: {
            id: prismaUser.id,
          },
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      res.status(200).json(data)
    } catch (error) {
      res.status(403).json({ err: 'Error fetching posts' })
    }
  }
}
