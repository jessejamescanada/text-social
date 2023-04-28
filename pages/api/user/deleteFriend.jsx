import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions)
    if (!session)
      return res.status(401).json({ message: 'Please sign in to make a post' })

    // GET USER
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    const slug = req.query.slug

    try {
      if (prismaUser.id === slug) {
        res.status(422).json({ message: 'Cant delete yourself' })
        return
      }

      const removeUser = await prisma.user.update({
        where: {
          id: prismaUser.id,
        },
        data: {
          friends: {
            disconnect: {
              id: slug,
            },
          },
        },
      })
      res.status(201).json({ message: 'Removed contact' })
    } catch (error) {
      res.status(422).json({ message: error })
      return
    }
  }
}
