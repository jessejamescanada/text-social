'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import userImage from '../../../public/userImage.png'
import AddComment from '../../../components/AddComment'

const fetchAllUserPosts = async (slug) => {
  const response = await axios.get(`/api/posts/${slug}`)
  return response.data
}

const FetchUsersPosts = ({ slug, session }) => {
  const queryClient = useQueryClient()
  const { data, error, isLoading } = useQuery({
    queryFn: () => fetchAllUserPosts(slug),
    queryKey: ['all-userPosts'],
  })

  const addFavs = useMutation(
    async ({ postId, email }) =>
      axios.post(`/api/posts/addFavorite`, {
        data: { postId: postId, email: email },
      }),
    {
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries(['user-details']),
          queryClient.invalidateQueries(['all-posts']),
          queryClient.invalidateQueries(['all-userPosts']),
        ]),
      onError: (error) => {
        console.log(error)
      },
    }
  )

  // delete favs
  const deleteFavFunction = useMutation(
    async ({ postId, email }) =>
      axios.delete('/api/posts/deleteFavorite', {
        params: { postId: postId, email: email },
      }),
    {
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries(['user-details']),
          queryClient.invalidateQueries(['all-posts']),
          queryClient.invalidateQueries(['all-userPosts']),
        ]),
      onError: (error) => {
        console.log(error)
      },
    }
  )

  const addtoFavs = (val1, val2, favorites) => {
    const userIdinFav = favorites.some((x) => x.userId === val2)

    if (favorites.length === 0) {
      addFavs.mutate({ postId: val1, email: val2 })
    } else if (!userIdinFav) {
      addFavs.mutate({ postId: val1, email: val2 })
    } else if (userIdinFav) {
      deleteFavFunction.mutate({ postId: val1, email: val2 })
    } else {
      console.log('no conditions met')
    }
  }

  if (error) return 'Couldnt find'
  if (isLoading) return 'Loading...'

  return (
    <div className='w-full flex text-gray-700 px-4'>
      <div className='w-full'>
        {data &&
          data.map((post) => (
            <div
              key={post.id}
              className='flex flex-col w-full md:w-1/2 justify-center items-center mx-auto bg-gradient-to-br from-slate-600 to-slate-300 text-gray-300 mb-8 pt-4  pb-10 rounded-lg shadow-[0px_2px_4px_-2px_rgba(255,255,255,1)] '
            >
              <div className=' flex flex-col w-full justify-evenly sm:justify-between'>
                <div className='flex w-full items-center sm:justify-between justify-end gap-2 px-4'>
                  <div className='w-[1px] sm:w-[125px]'></div>

                  <Link
                    href={`/users/${post.userId}`}
                    className='flex w-[180px] items-center gap-2'
                  >
                    <Image
                      src={post.image ? post.image : userImage}
                      height={32}
                      width={32}
                      alt='profile-image'
                      className='rounded-full'
                    />
                    {/*  include user email as backup for no name */}
                    <p className='font-bold text-text-gray-200 '>
                      {post.name ? post.name : post.email}
                    </p>
                  </Link>
                  <div className='flex items-center w-[80px] sm:w-[120px] justify-end gap-2 '>
                    <div
                      onClick={() =>
                        addtoFavs(post.id, session.user.email, post.favoritedBy)
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
                      {post.favoritedBy.length} favs
                    </p>
                  </div>
                </div>
                <div className='my-8  h-[220px] lg:h-[180px] w-full px-2 lg:px-[70px]'>
                  <div className='bg-zinc-200 flex items-center justify-center  h-full w-full p-3 sm:p-5 rounded-lg'>
                    <p className='break-normal text-center font-semibold text-lg tracking-wide text-gray-700'>
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
          ))}
      </div>
    </div>
  )
}

export default FetchUsersPosts
