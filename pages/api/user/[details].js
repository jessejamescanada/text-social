import prisma from '../../../prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions)
    if (!session)
      return res.status(401).json({ message: 'Please sign in to make a post' })

    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    try {
      const data = await prisma.user.findUnique({
        where: {
          id: req.query.details,
        },

        include: {
          friends: {
            include: {
              posts: {
                include: {
                  comments: true,
                  favoritedBy: true,
                },
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      })

      res.status(200).json(data)
    } catch (error) {
      res.status(403).json({ err: 'Error has occured while getting user' })
    }
  }
}
