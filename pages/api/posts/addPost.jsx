import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // make sure theyre logged in before making a post, if not then throw 401 error
    const session = await getServerSession(req, res, authOptions)
    if (!session)
      return res.status(401).json({ message: 'Please sign in to make a post' })

    const title = req.body.postInput

    // GET USER
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    // check post length
    if (title.length > 255)
      return res.status(403).json({ message: 'Please write a shorter post' })
    if (!title.length)
      return res.status(403).json({ message: "Please don't leave this empty" })

    // create post
    try {
      const result = await prisma.post.create({
        data: {
          title,
          userId: prismaUser.id,
          name: prismaUser.name,
          image: prismaUser.image,
          email: prismaUser.email,
        },
      })
      res.status(200).json(result)
    } catch (error) {
      res.status(403).json({ err: 'Error has occurred while making post' })
    }
  }
}
