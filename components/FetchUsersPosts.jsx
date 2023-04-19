'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchAllUserPosts = async (slug) => {
  const response = await axios.get(`/api/posts/${slug}`)
  return response.data
}

const FetchUsersPosts = ({ slug }) => {
  const { data, error, isLoading } = useQuery({
    queryFn: () => fetchAllUserPosts(slug),
    queryKey: ['all-userPosts'],
  })
  if (error) return 'Couldnt find'
  if (isLoading) return 'Loading...'

  return (
    <div className='w-full flex text-gray-700 '>
      <div className='w-full'>
        {data &&
          data.map((post) => (
            <p
              key={post.id}
              className='flex flex-col w-[90%] sm:w-full md:w-1/2 justify-center items-center mx-auto bg-gradient-to-br from-slate-900 to-slate-500 text-gray-300 mb-8 pt-4  pb-3 rounded-lg shadow-[0px_2px_4px_-2px_rgba(255,255,255,1)] px-3'
            >
              {post.title}
            </p>
          ))}
      </div>
    </div>
  )
}

export default FetchUsersPosts
