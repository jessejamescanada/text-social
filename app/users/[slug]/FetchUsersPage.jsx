'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import FetchUsersPosts from './FetchUsersPosts'
import userImage from '../../../public/userImage.png'
import toast from 'react-hot-toast'

const fetchUser = async (slug) => {
  const response = await axios.get(`/api/user/${slug}`)
  return response.data
}

const FetchUsersPage = ({ slug, session }) => {
  // fetch user details
  const { data, isLoading } = useQuery({
    queryKey: ['user-details'],
    queryFn: () => fetchUser(slug),
  })
  console.log(data)
  console.log(session)

  const addUserFriend = useMutation(
    async ({ slug }) => axios.put(`/api/user/addFriend`, { slug }),
    {
      onError: (error) => {
        console.log('Error adding friend')
        toast.error(`Sorry. Unable to add friend`)
      },
      onSuccess: (data) => {
        console.log('Success adding friend!')
        toast.success(`Added friend!`)
      },
    }
  )

  const handleAddFriend = (slug) => {
    // console.log(slug)
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
        console.log('Success adding friend!')
        toast.success(`Removed friend successfuly`)
      },
    }
  )

  const handleRemoveFriend = (slug) => {
    // console.log(slug)
    removeUserFriend.mutate(slug)
  }

  if (isLoading) return 'Loading...'
  return (
    <div className='w-full max-w-7xl flex flex-col items-center justify-center'>
      <div className='flex flex-col sm:flex-row w-full sm:w-1/2 justify-center items-center my-4'>
        <Image
          src={data.image ? data.image : userImage}
          height={80}
          width={80}
          alt='image'
          className='rounded-full'
        />

        <div className='flex flex-col sm:ml-5'>
          <div className='flex flex-col gap-4 items-center justify-center mb-2 p-4'>
            <h3>{data.name}</h3>
            <p>{data.bio || ''}</p>
            <div className='flex gap-4'>
              <button
                className='cursor-pointer bg-blue-500 font-semibold rounded-lg px-4 py-2'
                onClick={() => handleAddFriend(slug)}
              >
                Add Friend
              </button>
              <button
                className='cursor-pointer bg-red-500 font-semibold rounded-lg px-4 py-2'
                onClick={() => handleRemoveFriend(slug)}
              >
                Remove Friend
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
