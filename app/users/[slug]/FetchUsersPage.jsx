'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import FetchUsersPosts from './FetchUsersPosts'
import userImage from '../../../public/userImage.png'
import toast from 'react-hot-toast'
import { FaTimes, FaPlus, FaCheck } from 'react-icons/fa'

// get user and get users friends
const fetchUser = async (slug) => {
  const response = await axios.get(`/api/user/${slug}`)
  return response.data
}
const getFriends = async () => {
  const response = await axios.get(`/api/user/getFriend`)
  return response.data
}

const FetchUsersPage = ({ slug, session }) => {
  const queryClient = useQueryClient()
  // fetch user details
  const { data, isLoading } = useQuery({
    queryKey: ['user-details'],
    queryFn: () => fetchUser(slug),
  })

  const addUserFriend = useMutation(
    async ({ slug }) => axios.put(`/api/user/addFriend`, { slug }),
    {
      onError: (error) => {
        console.log(error)
        toast.error(error.response.data.message)
      },
      onSuccess: (data) => {
        Promise.all([
          queryClient.invalidateQueries(['user-details']),
          queryClient.invalidateQueries(['getting-friends']),
        ]),
          toast.success(`Added friend!`)
      },
    }
  )

  const { data: userData } = useQuery({
    queryFn: () => getFriends(),
    queryKey: ['getting-friends'],
  })

  const handleAddFriend = (slug) => {
    addUserFriend.mutate({ slug })
  }

  const removeUserFriend = useMutation(
    async (slug) =>
      axios.delete(`/api/user/deleteFriend`, { params: { slug } }),
    {
      onError: (error) => {
        console.log('Error removing friend')
        toast.error(`Sorry. Unable to delete friend`)
      },
      onSuccess: (data) => {
        Promise.all([
          queryClient.invalidateQueries(['user-details']),
          queryClient.invalidateQueries(['getting-friends']),
        ]),
          console.log('Success adding friend!')
        toast.success(`Removed friend successfuly`)
      },
    }
  )

  const handleRemoveFriend = (slug) => {
    removeUserFriend.mutate(slug)
  }

  if (isLoading) return 'Loading...'
  return (
    <div className='w-full max-w-7xl flex flex-col items-center justify-center'>
      <div className='flex flex-col sm:flex-row w-full sm:w-1/2 justify-center items-center my-4'>
        <Image
          src={data && data.image ? data.image : userImage}
          height={80}
          width={80}
          alt='image'
          className='rounded-full'
        />

        <div className='flex flex-col sm:ml-5'>
          <div className='flex flex-col gap-4 items-center justify-center mb-2 p-4'>
            <h3>{data && data.name}</h3>
            <p>{(data && data.bio) || ''}</p>
            <div className='flex gap-4'>
              <div
                className='cursor-pointer flex gap-1 items-center bg-blue-500 font-semibold rounded-lg  disabled:opacity-50 disabled:cursor-default'
                disabled={!session}
                onClick={() => handleAddFriend(slug)}
              >
                {/* how to render 'Add Friend' Button or disable it */}
                {userData && data ? (
                  userData.friends.some((friend) => {
                    if (friend.email === data.email) {
                      return true // return true if they are friends
                    } else {
                      return false // return false if they are not friends
                    }
                  }) ? (
                    <button
                      className='flex items-center gap-1 px-4 py-2 disabled:opacity-75 disabled:text-white disabled:cursor-default'
                      disabled={true}
                    >
                      <FaCheck /> Friends
                    </button> // if at least one friend matches, display 'Friends'
                  ) : (
                    <span className='flex items-center gap-1 px-4 py-2'>
                      <FaPlus /> Friend
                    </span>
                  ) // if no friends match, display '+Friends'
                ) : (
                  <button
                    className='flex items-center gap-1 px-4 py-2 disabled:opacity-50 disabled:text-white disabled:cursor-default'
                    disabled={true}
                  >
                    <FaPlus /> Friends
                  </button>
                )}
              </div>
              <button
                className='cursor-pointer flex gap-1 items-center bg-red-500 font-semibold rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-default'
                disabled={!session}
                onClick={() => handleRemoveFriend(slug)}
              >
                <FaTimes />
                Friend
              </button>
            </div>
          </div>
        </div>
      </div>
      <h2 className='mt-2 mb-4'> Previous Posts</h2>
      <FetchUsersPosts
        slug={slug}
        data={data}
        session={session}
      />
    </div>
  )
}

export default FetchUsersPage
