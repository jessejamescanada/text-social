'use client'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import userImage from '../../public/userImage.png'

const getFriends = async () => {
  const response = await axios.get(`/api/user/getFriend`)
  return response.data
}

const DisplayAddedFriends = () => {
  const queryClient = useQueryClient()
  const { data, error, isLoading } = useQuery({
    queryFn: getFriends,
    queryKey: ['get-friends', 'all-posts'],
  })
  // if (error) return error
  // if (isLoading) return 'Loading...'
  console.log(data)
  return (
    <div className='w-full flex justify-center'>
      <div className='w-full sm:w-1/2 flex flex-col justify-center'>
        <h2 className='flex  justify-center items-center font-semibold text-lg mb-2'>
          Friends
        </h2>
        <div className='w-full gap-2 flex items-center justify-center bg-gray-100 px-4 py-10 sm:px-8 sm:py-8 rounded-lg'>
          {data
            ? data.friends.map((friend) => (
                <div key={friend.id}>
                  <Link
                    href={`/users/${friend.id}`}
                    className='group flex relative'
                  >
                    <span
                      className=' group-hover:opacity-100 transition-opacity w-[125px] text-center bg-gray-300 p-2 text-sm text-gray-500 rounded-md absolute left-1/2 top-0
                    -translate-x-1/2 -translate-y-[60px] opacity-0 m-4 truncate'
                    >
                      {friend.name ? friend.name : friend.email}
                    </span>
                    <Image
                      src={friend.image ? friend.image : userImage}
                      height={24}
                      width={24}
                      alt='profile-image'
                      className='rounded-full'
                    />
                  </Link>
                </div>
              ))
            : ''}
        </div>
      </div>
    </div>
  )
}

export default DisplayAddedFriends
