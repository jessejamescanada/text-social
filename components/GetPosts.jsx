'use client'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import DisplayAllPosts from './DisplayAllPosts'

const allPosts = async ({ pageParam = '' }) => {
  await new Promise((res) => setTimeout(res, 1000))
  const res = await axios.get('/api/posts/getAllPosts?cursor=' + pageParam)
  return res.data
}

const GetPosts = ({ session }) => {
  const {
    isLoading,
    isError,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryFn: allPosts,
    queryKey: ['all-posts'],
    getNextPageParam: (lastPage) => lastPage.nextId ?? false,
  })

  if (isLoading)
    return <div className='loading flex justify-center'>Loading...</div>
  if (isError)
    return <div className='text-center'>Error! {JSON.stringify(error)}</div>
  console.log(data)

  return (
    <>
      {data &&
        data.pages.map((page) =>
          page.posts.map((post) => (
            <DisplayAllPosts
              key={post.id}
              postId={post.id}
              created={post.createdAt}
              title={post.title}
              name={post.user.name}
              email={post.user.email}
              avatar={post.user.image}
              id={post.user.id}
              comments={post.comments}
              session={session}
              favorites={post.favoritedBy}
              data={data}
            />
          ))
        )}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        className='flex items-center justify-center m-auto'
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : !hasNextPage
          ? 'All Done'
          : 'Nothing more to load'}
      </button>
    </>
  )
}

export default GetPosts
