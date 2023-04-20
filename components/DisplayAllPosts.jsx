'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import AddComment from './AddComment'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import userImage from '../public/userImage.png'

const DisplayAllPosts = ({
  id,
  postId,
  comments,
  title,
  name,
  avatar,
  email,
  session,
  favorites,
  data,
}) => {
  const queryClient = useQueryClient()

  // add favorite
  const { mutate } = useMutation(
    async ({ postId, email }) =>
      axios.post(`/api/posts/addFavorite`, {
        data: { postId: postId, email: email },
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['all-posts'])
      },
      onError: (error) => {
        console.log(error)
      },
    }
  )

  // delete favs
  const deleteFavFunction = useMutation(
    async ({ postId, email }) =>
      axios.delete('api/posts/deleteFavorite', {
        params: { postId: postId, email: email },
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['all-posts'])
      },
      onError: (error) => {
        console.log(error)
      },
    }
  )

  const addtoFavs = (val1, val2) => {
    const userIdinFav = favorites.some((x) => x.userId === val2)

    if (favorites.length === 0) {
      mutate({ postId: val1, email: val2 })
    } else if (!userIdinFav) {
      mutate({ postId: val1, email: val2 })
    } else if (userIdinFav) {
      deleteFavFunction.mutate({ postId: val1, email: val2 })
    } else {
      console.log('no conditions met')
    }
  }

  return (
    <div className='w-full flex text-gray-700 px-4'>
      <div className='flex flex-col w-full md:w-1/2 justify-center items-center mx-auto bg-gradient-to-br from-slate-900 to-slate-500 text-gray-300 mb-8 pt-4  pb-10 rounded-lg shadow-[0px_2px_4px_-2px_rgba(255,255,255,1)] '>
        <div className='flex w-full justify-evenly sm:justify-between'>
          <div className='w-[1px] lg:w-[125px]'></div>
          <Link
            href={`/users/${id}`}
            className='w-auto'
          >
            <div className='flex w-full items-center justify-end gap-2'>
              <div>
                <Image
                  src={avatar ? avatar : userImage}
                  height={32}
                  width={32}
                  alt='profile-image'
                  className='rounded-full'
                />
              </div>
              <h3 className='font-bold text-text-gray-200 '>
                {name ? name : email}
              </h3>
            </div>
          </Link>
          <div className='flex items-center w-[125px] justify-end gap-2 mr-4'>
            <div onClick={() => addtoFavs(postId, session.user.email)}>
              {session !== null ? (
                favorites.some((x) => x.userId === session.user.email) ? (
                  <BsHeartFill className='cursor-pointer text-lg text-red-500' />
                ) : (
                  <BsHeart className='cursor-pointer text-lg' />
                )
              ) : (
                ''
              )}
            </div>
            <p className='font-semibold'>{favorites.length} favorites</p>
          </div>
        </div>
        {/*  */}

        {/*  */}
        <div className=' my-8  h-[220px] lg:h-[180px] w-full px-2 lg:px-[70px]'>
          <div className='bg-gray-950 flex items-center justify-center  h-full w-full p-3 sm:p-5 rounded-lg'>
            <p className='break-normal  text-center font-semibold text-lg tracking-wide'>
              {title}
            </p>
          </div>
        </div>
        <AddComment
          postId={postId}
          comments={comments}
          id={id}
          email={email}
          session={session}
        />
      </div>
    </div>
  )
}

export default DisplayAllPosts
