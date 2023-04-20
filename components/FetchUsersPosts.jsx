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
            <div className='flex flex-col w-full md:w-1/2 justify-center items-center mx-auto bg-gradient-to-br from-slate-900 to-slate-500 text-gray-300 mb-8 pt-4  pb-10 rounded-lg shadow-[0px_2px_4px_-2px_rgba(255,255,255,1)] '>
              <div className=' my-8  h-[220px] lg:h-[180px] w-full px-2 lg:px-[70px]'>
                <div className='bg-gray-950 flex items-center justify-center  h-full w-full p-3 sm:p-5 rounded-lg'>
                  <p
                    key={post.id}
                    className='break-normal  text-center font-semibold text-lg tracking-wide'
                  >
                    {post.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default FetchUsersPosts
