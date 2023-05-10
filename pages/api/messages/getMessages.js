import redis from '../../../redis'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ body: 'Method not allowed' })
    return
  }
  try {
    const chatId = req.query.id

    // console.log('CHAT ID: ' + chatId)

    const messagesResponse = await redis.hvals(chatId)

    const messages = messagesResponse
      .map((message) => JSON.parse(message))
      .sort((a, b) => b.created_at - a.created_at)

    res.status(200).json({ messages })
  } catch (error) {
    res.status(403).json({ err: 'Error fetching messages' })
  }
}
