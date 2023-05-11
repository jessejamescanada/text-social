'use client'
import { clientPusher } from '../pusher'
import { useState } from 'react'
import MessengerModal from './MessengerModal'

const Messenger = ({ session }) => {
  const [showModal, setShowModal] = useState(false)
  const [friendsBack, setFriendsBack] = useState(true)
  const [friendsName, setFriendsName] = useState('')

  const setMessengerName = () => {
    setShowModal((prev) => !prev)
    setFriendsName('Your Friends')
  }

  return (
    <div className=' pl-1 sm:pl-8'>
      <button
        onClick={setMessengerName}
        className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={!session}
      >
        Messages
      </button>
      {showModal ? (
        <MessengerModal
          session={session}
          showModal={showModal}
          setShowModal={setShowModal}
          friendsBack={friendsBack}
          setFriendsBack={setFriendsBack}
          friendsName={friendsName}
          setFriendsName={setFriendsName}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default Messenger
