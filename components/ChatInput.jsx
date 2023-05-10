'use client'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useSWR from 'swr'
import fetcher from '../utils/fetchMessages'

const ChatInput = ({ session, uniqueId }) => {
  const [input, setInput] = useState('')
  const {
    data: messages,
    error,
    mutate,
  } = useSWR(['/api/messages/getMessages', uniqueId], ([url, uniqueId]) =>
    fetcher(url, uniqueId)
  )

  const addMessage = async (e) => {
    e.preventDefault()
    if (!input) return

    const messageToSend = input

    setInput('')

    const id = uuidv4()

    const message = {
      id,
      message: messageToSend,
      created_at: Date.now(),
      username: session?.user.name,
      //   profilePic: session?.user.image,
      email: session?.user.email,
      uniqueId,
    }

    const uploadMessagetoUpstash = async () => {
      const data = await fetch(`/api/messages/addMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
        }),
      }).then((res) => res.json())

      return [data.message, ...messages]
    }
    await mutate(uploadMessagetoUpstash, {
      optimisticData: [message, ...messages],
      rollbackOnError: true,
    })
  }
  if (error) return <div>failed to load</div>
  if (!messages) return <div>loading...</div>
  return (
    <form
      onSubmit={addMessage}
      className='relative bottom-0 left-0 px-2  z-50 bg-white w-full flex  py-3 space-x-2 border-t border-gray-200 rounded-b-lg'
    >
      <input
        type='text'
        className='flex-1 w-full rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs text-gray-500'
        placeholder='Enter a message...'
        value={input}
        disabled={!session}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type='submit'
        disabled={!input}
        className='bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Send
      </button>
    </form>
  )
}

export default ChatInput
