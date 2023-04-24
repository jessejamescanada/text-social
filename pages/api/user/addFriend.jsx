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
    const slug = req.body.slug

    console.log(slug)

    try {
      // const checkFriend = await prisma.user.findUnique({
      //   where: {
      //     id: prismaUser.id,
      //   },
      //   include: {
      //     friends: true,
      //   },
      // })
      // console.log(checkFriend)
      // if (checkFriend.friends[0].id === slug) {
      //   res.status(400).json({ message: 'Already friends!' })
      //   return
      // }

      // check so user doesnt add themselves
      // if (prismaUser.id === slug) {

      //   console.log('Same user')
      //   res.status(422).json({ message: 'Cant add yourself' })
      //   return
      // }

      const addUser = await prisma.user.update({
        where: {
          id: prismaUser.id,
        },
        data: {
          friends: {
            connect: {
              id: slug,
            },
          },
        },
      })
      res.status(201).json({ message: 'Added contact' })
    } catch (error) {
      res.status(422).json({ message: error })
      return
    }
  }
}
