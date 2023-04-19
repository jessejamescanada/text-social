'use client'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { RiDeleteBin6Line } from 'react-icons/Ri'

const DisplayDashboardPost = ({ id, title }) => {
  const queryClient = useQueryClient()
  // delete post
  const { mutate, isLoading } = useMutation(
    async (id) =>
      await axios.delete('/api/posts/deletePost', { params: { data: id } }),
    {
      onError: (error) => {
        toast.error('Error deleting that post')
        console.log(error)
      },
      onSuccess: (data) => {
        console.log(data)
        toast.success('Post has been deleted')
        queryClient.invalidateQueries(['dashboard-posts'])
        queryClient.invalidateQueries(['all-posts'])
      },
    }
  )

  const deletePost = () => {
    mutate(id)
  }
  return (
    <div className='w-full flex flex-col text-gray-700 '>
      {isLoading ? <div className='text-gray-200'>Deleting your post</div> : ''}
      <div className='flex flex-col w-full justify-center items-center mx-auto bg-gradient-to-br from-slate-900 to-slate-500 text-gray-300 mb-8 pt-4 pr-1 pb-8 rounded-lg shadow-[0px_2px_4px_-2px_rgba(255,255,255,1)]'>
        <div className='flex w-full items-end justify-end'>
          <button onClick={deletePost}>
            {' '}
            <RiDeleteBin6Line className='text-gray-200' />
          </button>
        </div>
        <p className=' px-5 break-all'>{title}</p>
      </div>
    </div>
  )
}

export default DisplayDashboardPost
