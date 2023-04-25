'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

const Searchbar = ({ session }) => {
  const [postInput, setPostInput] = useState('')
  const [postTerm, setPostTerm] = useState('')
  const [error, setError] = useState(false)
  const [noSessionError, setNoSessionError] = useState(false)

  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(
    async (postInput) => await axios.post('/api/posts/addPost', { postInput }),
    {
      onError: (error) => {
        console.log(error)
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(['all-posts'])
        setPostInput('')
      },
    }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (postInput === '') {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 2000)
    } else if (session === null) {
      setNoSessionError(true)
      setTimeout(() => {
        setNoSessionError(false)
      }, 2000)
      setPostInput('')
    } else {
      setPostTerm(postInput)
      mutate(postInput)
    }
  }
  return (
    <div className='flex flex-col w-full py-4 mt-4 '>
      <div className='flex flex-col w-full mx-auto  items-center mb-8'>
        <form
          className='flex flex-col sm:flex-row w-3/4 sm:w-1/2 justify-center items-center'
          onSubmit={handleSubmit}
        >
          <input
            className='w-full sm:w-[80%] rounded-lg py-3  px-2 text-gray-800 focus:outline-none focus:placeholder-transparent'
            type='text'
            placeholder='Make a post'
            value={postInput}
            onChange={(e) => setPostInput(e.target.value)}
            maxLength={255}
          />
          <button className='w-1/2 sm:w-auto bg-teal-600 mt-2 sm:mt-0 sm:ml-2 text-white text-lg font-semibold py-2 px-6 cursor-pointer rounded-lg'>
            Post
          </button>
        </form>
        <div className={postInput.length > 235 ? 'text-red-600' : 'text-white'}>
          {isLoading ? (
            <div>Adding your comment</div>
          ) : (
            `${255 - postInput.length} Characters Left`
          )}
        </div>
      </div>
      {error ? (
        <p className='text-red-600 font-semibold text-center py-2'>
          Please enter a post!
        </p>
      ) : (
        ''
      )}
      {noSessionError ? (
        <p className='text-red-600 font-semibold text-center py-2'>
          Please login to post!
        </p>
      ) : (
        ''
      )}
    </div>
  )
}

export default Searchbar
