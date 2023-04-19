import prisma from '../../../prisma/client'

export default async (req, res) => {
  if (req.method === 'GET') {
    const limit = 5
    const cursor = req.query.cursor ?? ''
    const cursorObj = cursor === '' ? undefined : { id: cursor }

    const posts = await prisma.post.findMany({
      skip: cursor !== '' ? 1 : 0,
      cursor: cursorObj,
      take: limit,
      include: {
        user: true,
        comments: true,
        favoritedBy: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return res.json({
      posts,
      nextId: posts.length === limit ? posts[limit - 1].id : undefined,
    })
  }
}
