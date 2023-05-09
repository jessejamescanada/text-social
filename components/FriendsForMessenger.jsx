'use client'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import userImage from '../public/userImage.png'
import ChatInput from './ChatInput'
import MessageList from './MessageList'

const getFriends = async () => {
  const response = await axios.get(`/api/user/getFriend`)
  return response.data
}

const FriendsForMessenger = ({ session, friendsName, setFriendsName }) => {
  const [clickedFriend, setClickedFriend] = useState(false)
  const [uniqueId, setUniqueId] = useState('')

  const queryClient = useQueryClient()
  const { data, error, isLoading } = useQuery({
    queryFn: getFriends,
    queryKey: ['get-friends', 'all-posts'],
  })
  if (error) return error
  if (isLoading) return 'Loading...'

  const assignedFriendAndId = (email, name) => {
    setClickedFriend((prev) => !prev)
    const sortIds = [email, session.user.email]
    const sortedIdAndEmail = sortIds.sort()
    const joinedIdandEmail = sortedIdAndEmail.join()
    setUniqueId(joinedIdandEmail)
    setFriendsName(name)
    // console.log('friendId: ' + email)
    // console.log('sessionId: ' + session.user.email)
  }

  return (
    <div className='overflow-y-auto h-[90%] sm:h-[370px] w-full flex justify-start '>
      <div className='w-full  flex flex-col justify-start pt-2 px-2'>
        {clickedFriend ? (
          <>
            <MessageList
              session={session}
              uniqueId={uniqueId}
              setClickedFriend={setClickedFriend}
              friendsName={friendsName}
              setFriendsName={setFriendsName}
            />
            <ChatInput
              session={session}
              uniqueId={uniqueId}
            />
          </>
        ) : (
          ''
        )}
        {data && !clickedFriend
          ? data.friends.map((friend) => (
              <div
                key={friend.id}
                className='mt-[5px]'
              >
                <Link
                  href={``}
                  //   href={`/users/${friend.id}`}
                  className='group flex relative gap-2'
                  onClick={() => assignedFriendAndId(friend.email, friend.name)}
                  //   onClick={() => setClickedFriend((prev) => !prev)}
                >
                  <Image
                    src={friend.image ? friend.image : userImage}
                    height={24}
                    width={24}
                    alt='profile-image'
                    className='rounded-full'
                  />
                  <p className='text-gray-800 truncate'>
                    {friend.name ? friend.name : friend.email}
                  </p>
                </Link>
              </div>
            ))
          : ''}
      </div>
    </div>
  )
}

export default FriendsForMessenger

// try making a new component that takes unique id from here and get rid of the other 2. In that new component do an api call to get old messages and call those other 2 componenets from there
