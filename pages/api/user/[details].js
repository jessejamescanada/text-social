import prisma from '../../../prisma/client'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await prisma.user.findUnique({
        where: {
          id: req.query.details,
        },
        select: {
          name: true,
          image: true,
          bio: true,
          id: true,
        },
      })

      res.status(200).json(data)
    } catch (error) {
      res.status(403).json({ err: 'Error has occured while making post' })
    }
  }
}
