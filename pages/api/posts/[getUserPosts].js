import prisma from '../../../prisma/client'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await prisma.post.findMany({
        where: {
          userId: req.query.getUserPosts,
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
