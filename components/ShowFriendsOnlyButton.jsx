'use client'
import { useState } from 'react'
import GetUserFriends from './GetUserFriends'
import GetPosts from './GetPosts'

const ShowFriendsOnlyButton = ({ session }) => {
  const [showAllPosts, setShowAllPosts] = useState(true)
  const [showFriends, setShowFriends] = useState(false)

  const showOnlyFriendsPosts = () => {
    console.log('friends')
    setShowFriends(true)
    setShowAllPosts(false)
  }

  const showAllUsersPosts = () => {
    console.log('all')
    setShowFriends(false)
    setShowAllPosts(true)
  }

  return (
    <div className='w-full '>
      <div className='flex justify-center  gap-5 mb-5'>
        <button
          className={`${
            showFriends ? 'border-b-2 border-white font-bold' : ''
          } text-gray-100 text-lg `}
          onClick={showOnlyFriendsPosts}
        >
          Friends Posts
        </button>
        <button
          className={`${
            showAllPosts ? 'border-b-2 border-white font-bold' : ''
          } text-gray-100 text-lg`}
          onClick={showAllUsersPosts}
        >
          All Posts
        </button>
      </div>

      {showFriends ? (
        <GetUserFriends session={session} />
      ) : (
        <GetPosts session={session} />
      )}
    </div>
  )
}

export default ShowFriendsOnlyButton
