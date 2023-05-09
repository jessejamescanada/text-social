import Pusher from 'pusher'
import ClientPusher from 'pusher-js'

export const serverPusher = new Pusher({
  appId: process.env.app_id,
  key: process.env.key,
  secret: process.env.secret,
  cluster: 'us2',
  useTLS: true,
})

export const clientPusher = new ClientPusher('aa5edd9947f41f04ef52', {
  cluster: 'us2',
  forceTLS: true,
})
