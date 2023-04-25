'use client'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import userImage from '../../public/userImage.png'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import AddComment from '../../components/AddComment'

const DisplayDashboardPost = ({ id, title, data, session }) => {
  // console.log(data)
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
      onSuccess: (stuff) =>
        Promise.all([
          console.log(stuff),
          toast.success('Post has been deleted'),
          queryClient.invalidateQueries(['dashboard-posts']),
          queryClient.invalidateQueries(['all-posts']),
        ]),
    }
  )

  const deletePost = (id) => {
    mutate(id)
  }

  const addFavs = useMutation(
    async ({ postId, email }) =>
      axios.post(`/api/posts/addFavorite`, {
        data: { postId: postId, email: email },
      }),
    {
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries(['dashboard-posts']),
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
          queryClient.invalidateQueries(['dashboard-posts']),
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
      addFavs.mutate({ postId: val1, email: val2 })
    } else if (!userIdinFav) {
      addFavs.mutate({ postId: val1, email: val2 })
    } else if (userIdinFav) {
      deleteFavFunction.mutate({ postId: val1, email: val2 })
    } else {
      console.log('no conditions met')
    }
  }
  return (
    // <div className='w-full flex flex-col text-gray-700 '>
    //   {isLoading ? <div className='text-gray-200'>Deleting your post</div> : ''}
    //   <div className='flex flex-col w-full justify-center items-center mx-auto bg-gradient-to-br from-slate-900 to-slate-500 text-gray-300 mb-8 pt-4 pr-1 pb-8 rounded-lg shadow-[0px_2px_4px_-2px_rgba(255,255,255,1)]'>
    //     <div className='flex w-full items-end justify-end'>
    //       <button onClick={deletePost}>
    //         {' '}
    //         <RiDeleteBin6Line className='text-gray-200' />
    //       </button>
    //     </div>
    //     <div className=' my-8  h-[220px] lg:h-[180px] w-full px-2 lg:px-[70px]'>
    //       <div className='bg-gray-950 flex items-center justify-center  h-full w-full p-3 sm:p-5 rounded-lg'>
    //         <p className=' break-normal  text-center font-semibold text-lg tracking-wide'>
    //           {title}
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className='w-full '>
      {isLoading ? <div className='text-gray-200'>Deleting your post</div> : ''}
      {data ? (
        data.map((post) => (
          <div
            key={post.id}
            className='flex flex-col w-full  justify-center items-center mx-auto bg-gradient-to-br from-slate-600 to-slate-300 text-gray-300 mb-8 pt-4  pb-10 rounded-lg shadow-[0px_2px_4px_-2px_rgba(255,255,255,1)]'
          >
            <div className=' flex flex-col w-full justify-evenly sm:justify-between'>
              <div className='flex w-full items-center justify-between gap-2 px-4'>
                <button
                  onClick={() => deletePost(post.id)}
                  className='w-[80px] sm:w-[110px]'
                >
                  <RiDeleteBin6Line className='text-gray-200' />{' '}
                </button>
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
                <div className='flex items-center w-[80px] sm:w-[110px] justify-end gap-2 '>
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
        ))
      ) : (
        <div>
          <p>You haven`&apos;`t made any posts yet!</p>
        </div>
      )}
    </div>
  )
}

export default DisplayDashboardPost
