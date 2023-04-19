'use client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import DisplayDashboardPost from './DisplayDashboardPost'

const dashboardPosts = async () => {
  const response = await axios.get(`/api/posts/getDashboardPosts`)
  return response.data
}

const GetDashboardPosts = () => {
  const { data, error, isLoading } = useQuery({
    queryFn: dashboardPosts,
    queryKey: ['dashboard-posts'],
  })
  if (error) return error
  if (isLoading) return 'Loading...'
  // console.log(data)
  return (
    <div className='w-full'>
      {data
        ? data.map((post) => (
            <DisplayDashboardPost
              key={post.id}
              id={post.id}
              title={post.title}
            />
          ))
        : ''}
    </div>
  )
}

export default GetDashboardPosts
