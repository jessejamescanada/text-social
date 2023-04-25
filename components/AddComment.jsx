'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { RiDeleteBin6Line } from 'react-icons/ri'
import userImage from '../public/userImage.png'

const AddComment = ({ postId, comments, id, email, session }) => {
  const [title, setTitle] = useState('')
  const [addComment, setAddComment] = useState(true)
  const [error, setError] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const queryClient = useQueryClient()

  // add comment
  const { mutate, isLoading } = useMutation(
    async (data) => axios.post(`/api/posts/addComment`, { data }),
    {
      onSuccess: (data) =>
        Promise.all([
          setTitle(''),
          queryClient.invalidateQueries(['get-friends']),
          queryClient.invalidateQueries(['all-posts']),
          queryClient.invalidateQueries(['dashboard-posts']),
          queryClient.invalidateQueries(['user-details']),
          queryClient.invalidateQueries(['all-userPosts']),
        ]),
      onError: (error) => {
        console.log(error)
        if (!session) {
          toast.error(`Error! Please make sure you're logged in`)
        }
      },
    }
  )

  const submitComment = async (e) => {
    e.preventDefault()
    if (title.length === 0) {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 2000)
    }
    setShowComment(true)
    mutate({ title, postId })
  }

  // delete comment
  const deleteComment = useMutation(
    async ({ userEmail, commentId }) =>
      axios.delete('/api/posts/deleteComment', {
        params: { userEmail: userEmail, commentId: commentId },
      }),
    {
      onError: (error) => {
        toast.error(`Error deleting your comment`)
        console.log(error)
      },
      onSuccess: (data) =>
        Promise.all([
          toast.success(`Your comment was deleted`),
          queryClient.invalidateQueries(['get-friends']),
          queryClient.invalidateQueries(['all-posts']),
          queryClient.invalidateQueries(['dashboard-posts']),
          queryClient.invalidateQueries(['user-details']),
          queryClient.invalidateQueries(['all-userPosts']),
        ]),
    }
  )

  // delete comment
  const compareDelete = (val1, val2, val3) => {
    if (session.user.email === val1) {
      deleteComment.mutate({ userEmail: val1, commentId: val3 })
    } else {
      toast.error('Error deleting that comment')
    }
  }

  return (
    // comment form
    <div className='w-full px-2 lg:px-[70px] flex flex-col items-center justify-center'>
      {error ? (
        <p className='font-bold text-red-600'>
          Can`&apos;`t leave an empty comment
        </p>
      ) : (
        ''
      )}
      {session ? (
        <form
          onSubmit={submitComment}
          className='w-full'
        >
          {addComment ? (
            <div className='flex flex-col my-2'>
              <input
                type='text'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                name='title'
                placeholder='Add a comment...'
                className='px-4 py-2 text-lg rounded-md  mb-1 bg-slate-900 shadow-[0px_2px_4px_-2px_rgba(255,255,255,1)] focus:outline-none  focus:placeholder-transparent'
                maxLength={100}
              />
              {isLoading ? <div>Adding your comment</div> : ''}
              {deleteComment.isLoading ? <div>Deleting your comment</div> : ''}
              <div className='flex items-center justify-end '>
                <p
                  className={
                    title.length > 80
                      ? 'text-red-600  flex justify-end'
                      : 'text-gray-100  flex justify-end'
                  }
                >
                  {100 - title.length}/100
                </p>
              </div>
            </div>
          ) : (
            ''
          )}
        </form>
      ) : (
        ''
      )}
      {/* display comments */}
      <h2
        className='font-bold text-md cursor-pointer text-gray-100'
        onClick={() => setShowComment((prev) => !prev)}
      >
        {comments ? comments.length : '0'} Comments
      </h2>
      {showComment && comments
        ? comments.map((item) => (
            <div
              key={item.id}
              className='w-full  flex flex-col  my-2 bg-gray-200 text-gray-800 hover:bg-slate-300 px-4 py-2 rounded-lg shadow-[0px_2px_4px_-2px_rgba(255,255,255,1)] '
            >
              <div className='w-full justify-between flex items-center gap-2'>
                <Link
                  href={`/users/${item.userId}`}
                  className='flex'
                >
                  <Image
                    src={item.image ? item.image : userImage}
                    width={24}
                    height={24}
                    className='rounded-full mr-1'
                    alt={item.userId}
                  />
                  <p className='text-sm font-bold'>
                    {item.userName ? item.userName : item.email}
                  </p>
                </Link>
                <p
                  className='font-bold cursor-pointer'
                  onClick={() => compareDelete(item.email, id, item.id)}
                >
                  {/* show delete icon only for user who created comment */}
                  {session !== null ? (
                    item.email === session.user.email ? (
                      <RiDeleteBin6Line className='text-red-700' />
                    ) : (
                      ''
                    )
                  ) : (
                    ''
                  )}
                </p>
              </div>
              <p className='text-md mt-1 ml-2 break-normal'>{item.message}</p>
            </div>
          ))
        : ''}
    </div>
  )
}

export default AddComment
