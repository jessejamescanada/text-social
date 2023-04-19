'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import FetchUsersPosts from '../../../components/FetchUsersPosts'

const fetchUser = async (slug) => {
  const response = await axios.get(`/api/user/${slug}`)
  return response.data
}

const UsersPage = ({ params: { slug } }) => {
  // fetch user details
  const { data, isLoading } = useQuery({
    queryKey: ['user-details'],
    queryFn: () => fetchUser(slug),
  })
  if (isLoading) return 'Loading...'

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className='flex flex-col sm:flex-row w-full sm:w-1/2 justify-center items-center my-4'>
        <Image
          src={data.image}
          height={80}
          width={80}
          alt='image'
          className='rounded-md'
        />
        <div className='flex flex-col ml-5'>
          <div className='flex flex-row gap-4 items-center mb-2'>
            <h3>{data.name}</h3>
          </div>

          <p>{data.bio || ''}</p>
        </div>
      </div>
      <h2 className='mt-2 mb-4'> Previous Posts</h2>
      <FetchUsersPosts slug={slug} />
    </div>
  )
}

export default UsersPage
