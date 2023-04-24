'use client'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import userImage from '../public/userImage.png'
import AddComment from './AddComment'
import { BsHeart, BsHeartFill } from 'react-icons/bs'

const getFriends = async () => {
  const response = await axios.get(`/api/user/getFriend`)
  return response.data
}

const GetUserFriends = ({ session }) => {
  const queryClient = useQueryClient()
  const { data, error, isLoading } = useQuery({
    queryFn: getFriends,
    queryKey: ['get-friends', 'all-posts'],
  })
  //   if (error) return error
  //   if (isLoading) return 'Loading...'

  //
  // add favorite
  const { mutate } = useMutation(
    async ({ postId, email }) =>
      axios.post(`/api/posts/addFavorite`, {
        data: { postId: postId, email: email },
      }),
    {
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries(['get-friends']),
          queryClient.invalidateQueries(['all-posts']),
        ]),
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
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries(['get-friends']),
          queryClient.invalidateQueries(['all-posts']),
        ]),
      onError: (error) => {
        console.log(error)
      },
    }
  )

  const addtoFavs = (val1, val2, favorites) => {
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

  console.log(data)
  return (
    <div className='w-full  text-gray-200 px-4'>
      {data && data.friends.length !== 0 ? (
        data.friends.map((friend) => {
          return (
            <div key={friend.id}>
              {friend.posts.map((post) => {
                return (
                  <div
                    key={post.id}
                    className='flex flex-col w-full md:w-1/2 justify-center items-center mx-auto bg-gradient-to-br from-slate-900 to-slate-500 text-gray-300 mb-8 pt-4  pb-10 rounded-lg shadow-[0px_2px_4px_-2px_rgba(255,255,255,1)]'
                  >
                    <div className=' flex flex-col w-full justify-evenly sm:justify-between'>
                      <div className='flex w-full items-center justify-between gap-2'>
                        <div className='w-[1px] lg:w-[125px]'></div>
                        <Link
                          href={`/users/${post.userId}`}
                          className='flex items-center gap-2'
                        >
                          <Image
                            src={post.image ? post.image : userImage}
                            height={32}
                            width={32}
                            alt='profile-image'
                            className='rounded-full'
                          />
                          {/* change this '' to post.email when you update schema for posts to include user email as backup for no name */}
                          <p className='font-bold text-text-gray-200 '>
                            {post.name ? post.name : post.email}
                          </p>
                        </Link>
                        <div className='flex items-center w-[125px] justify-end gap-2 mr-4'>
                          <div
                            onClick={() =>
                              addtoFavs(
                                post.id,
                                session.user.email,
                                post.favoritedBy
                              )
                            }
                          >
                            {session !== null ? (
                              post.favoritedBy.some(
                                (x) => x.userId === session.user.email
                              ) ? (
                                <BsHeartFill className='cursor-pointer text-lg text-red-500' />
                              ) : (
                                <BsHeart className='cursor-pointer text-lg' />
                              )
                            ) : (
                              ''
                            )}
                          </div>
                          <p className='font-semibold'>
                            {post.favoritedBy.length} favorites
                          </p>
                        </div>
                      </div>
                      <div className='my-8  h-[220px] lg:h-[180px] w-full px-2 lg:px-[70px]'>
                        <div className='bg-gray-950 flex items-center justify-center  h-full w-full p-3 sm:p-5 rounded-lg'>
                          <p
                            className='break-normal
                            text-center
                            font-semibold
                            text-lg
                            tracking-wide'
                          >
                            {post.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    <AddComment
                      session={session}
                      postId={post.id}
                      id={post.userId}
                      comments={post.comments}
                    />
                  </div>
                )
              })}
            </div>
          )
        })
      ) : (
        <div className='flex justify-center text-red-400'>
          <p>Add friends to see their posts!</p>
        </div>
      )}
    </div>
  )
}

export default GetUserFriends
