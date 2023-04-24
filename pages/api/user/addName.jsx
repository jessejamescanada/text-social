import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    // make sure theyre logged in before making a post, if not then throw 401 error
    const session = await getServerSession(req, res, authOptions)
    if (!session)
      return res.status(401).json({ message: 'Please sign in to make a post' })

    // console.log(req.body.name)
    // GET USER
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    // console.log(prismaUser)

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
      // console.log(updateNameOnPosts)

      res.status(200).json(result)
      console.log(result)
    } catch (error) {
      res.status(403).json({ error })
    }
  }
}
