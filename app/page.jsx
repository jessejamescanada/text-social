import { getServerSession } from 'next-auth/next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import Searchbar from '../components/Searchbar'
import GetPosts from '../components/GetPosts'
// import GetUserFriends from '../components/GetUserFriends'
import ShowFriendsOnlyButton from '../components/ShowFriendsOnlyButton'

// const getSessions = async () => {
//   const session = await getServerSession(authOptions)
//   return session
// }

const Home = async () => {
  const session = await getServerSession(authOptions)
  // const session = await getSessions()
  // console.log(session)
  return (
    <main className='w-full flex flex-col items-center justify-center '>
      <Searchbar session={session} />
      <ShowFriendsOnlyButton session={session} />
      {/* <GetPosts session={session} /> */}
      {/* <GetUserFriends /> */}
    </main>
  )
}
export default Home
