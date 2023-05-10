import { serverPusher } from '../../../pusher'
import redis from '../../../redis'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ body: 'Method not allowed' })
    return
  }

  try {
    const { message } = req.body
    if (!message.message.length) {
      return res.status(401).json({ message: 'Please enter something' })
    }

    const newMessage = {
      ...message,
      created_at: Date.now(),
    }
    console.log('hey')
    console.log(message)

    //   push to redis db
    await redis.hset(message.uniqueId, message.id, JSON.stringify(newMessage))
    await serverPusher.trigger(message.uniqueId, 'new-message', newMessage)

    res.status(200).json({ message: newMessage })
  } catch (error) {
    res.status(403).json({ err: 'Error adding your message' })
  }
}
