import { serverPusher } from '../../../pusher'
import redis from '../../../redis'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ body: 'Method not allowed' })
    return
  }
  const { message } = req.body

  const newMessage = {
    ...message,
    created_at: Date.now(),
  }
  console.log('hey')
  console.log(message)

  //   push to redis db
  await redis.hset(message.uniqueId, message.id, JSON.stringify(newMessage))
  serverPusher.trigger(message.uniqueId, 'new-message', newMessage)

  res.status(200).json({ message: newMessage })
}
