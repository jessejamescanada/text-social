import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // make sure theyre logged in before making a post, if not then throw 401 error
    const session = await getServerSession(req, res, authOptions)
    if (!session)
      return res.status(401).json({ message: 'Please sign in to make a post' })

    // GET USER
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    console.log('GET FRIEND')
    console.log(prismaUser.id)

    // create post
    try {
      const getFriends = await prisma.user.findUnique({
        where: {
          id: prismaUser.id,
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
      res.status(201).json(getFriends)
    } catch (error) {
      res.status(422).json({ message: error })
      return
    }
  }
}
