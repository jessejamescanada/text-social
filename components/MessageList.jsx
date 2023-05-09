'use client'
import { useEffect } from 'react'
import { clientPusher } from '../pusher'
import useSWR from 'swr'
import fetcher from '../utils/fetchMessages'
import MessageComponent from './MessageComponent'
import ModalBackButton from './ModalBackButton'

const MessageList = ({
  session,
  uniqueId,
  clickedFriend,
  setClickedFriend,
  friendsName,
  setFriendsName,
}) => {
  console.log(uniqueId)
  const {
    data: messages,
    error,
    mutate,
  } = useSWR(['/api/messages/getMessages', uniqueId], ([url, uniqueId]) =>
    fetcher(url, uniqueId)
  )

  useEffect(() => {
    const channel = clientPusher.subscribe(uniqueId)

    channel.bind('new-message', async (data) => {
      // dont update cache for user who sent message
      if (messages?.find((message) => message.id === data.id)) return
      if (!messages) {
        mutate()
      } else {
        mutate()
      }
    })

    return () => {
      channel.unbind()
      channel.unsubscribe()
    }
  }, [messages, mutate, clientPusher])

  //   console.log(messages)
  if (error) return <div>failed to load</div>
  if (!messages) return <div>loading...</div>

  return (
    <div className='overflow-y-auto z-50 space-y-2 px-2  pb-10 w-full max-w-2xl xl:max-w-4xl mx-auto rounded-b-lg'>
      <ModalBackButton
        setClickedFriend={setClickedFriend}
        friendsName={friendsName}
        setFriendsName={setFriendsName}
      />
      {/* {session ? ( */}
      {messages ? (
        messages.map((message) => (
          <MessageComponent
            key={message.id}
            message={message}
            session={session}
          />
        ))
      ) : (
        <p className='text-center'>Sign in to see the chat!</p>
      )}
    </div>
  )
}

export default MessageList

// need a way to get initial messages to populate the chat when it loads
