import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    // make sure theyre logged in before making a post, if not then throw 401 error
    const session = await getServerSession(req, res, authOptions)
    if (!session)
      return res.status(401).json({ message: 'Please sign in to make a post' })

    // GET USER
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    // check title
    // if (bio.length > 300)
    //   return res.status(403).json({ message: 'Please write a shorter post' })
    // if (!bio.length)
    //   return res.status(403).json({ message: "Please don't leave this empty" })

    // create post
    try {
      const result = await prisma.user.update({
        where: {
          id: prismaUser.id,
        },
        data: {
          bio: req.body.bio,
        },
      })
      res.status(200).json(result)
    } catch (error) {
      res.status(403).json({ error })
    }
  }
}
