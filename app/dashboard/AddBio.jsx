'use client'
import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const getBio = async () => {
  const response = await axios.get('/api/user/getBio')
  return response.data
}

const AddBio = () => {
  const [bio, setBio] = useState('')
  const [name, setName] = useState('')
  const [editBio, setEditBio] = useState(false)
  const [changeName, setChangeName] = useState(false)
  const queryClient = useQueryClient()

  // fetch bio
  const { data, error, isLoading } = useQuery({
    queryFn: getBio,
    queryKey: ['getBio'],
  })

  //   create/update bio
  const { mutate } = useMutation(
    async (bio) => await axios.put('/api/user/addBio', { bio }),
    {
      onError: (error) => {
        console.log('OOPS bio didnt work')
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(['getBio'])
        setBio('')
      },
    }
  )

  const handleBio = (e) => {
    e.preventDefault()
    mutate(bio)
    setEditBio(false)
  }

  // name
  const editName = useMutation(
    async (name) => await axios.put('/api/user/addName', { name }),
    {
      onError: (error) => {
        console.log('OOPS bio didnt work')
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(['getBio'])
        setName('')
      },
    }
  )

  const handleName = (e) => {
    e.preventDefault()
    console.log(name)
    editName.mutate(name)
    setChangeName(false)
  }

  return (
    <div className='w-1/2 flex flex-col items-center'>
      {data ? (
        <div className='flex flex-col text-center'>
          <p className='font-bold text-lg'>
            {data.name ? data.name : data.email}
          </p>
          {editBio ? '' : <p>{data.bio}</p>}
        </div>
      ) : (
        ''
      )}
      <div className='flex gap-2'>
        <button
          onClick={() => setEditBio((prev) => !prev)}
          className={` ${
            changeName
              ? 'hidden'
              : 'flex justify-start my-2 mb-2  py-1 px-3 rounded-lg text-white bg-teal-500'
          } `}
        >
          {editBio ? 'Cancel' : 'Edit Bio'}
        </button>
        <button
          onClick={() => setChangeName((prev) => !prev)}
          className={` ${
            editBio
              ? 'hidden'
              : 'flex justify-start my-2 mb-2  py-1 px-3 rounded-lg text-white bg-teal-500'
          } `}
        >
          {changeName ? 'Cancel' : 'Edit Name'}
        </button>
      </div>
      {editBio ? (
        <form
          onSubmit={handleBio}
          className='flex flex-col justify-center'
        >
          <textarea
            placeholder='Enter your bio...'
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={100}
            className='w-full rounded-lg py-2 mb-2 px-1 text-gray-800'
          ></textarea>
          <button
            type='submit'
            className='bg-teal-500  text-white text-lg font-semibold py-1 px-5 cursor-pointer rounded-lg'
          >
            Submit
          </button>
        </form>
      ) : (
        ''
      )}
      {changeName ? (
        <form
          onSubmit={handleName}
          className='flex flex-col justify-center'
        >
          <input
            placeholder='Your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={25}
            className='w-full rounded-lg py-2 mb-2 px-1 text-gray-800'
          ></input>
          <button
            type='submit'
            className='bg-teal-500  text-white text-lg font-semibold py-1 px-5 cursor-pointer rounded-lg'
          >
            Submit
          </button>
        </form>
      ) : (
        ''
      )}
    </div>
  )
}

export default AddBio
