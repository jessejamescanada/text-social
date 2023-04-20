import { getServerSession } from 'next-auth/next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import Searchbar from '../components/Searchbar'
import GetPosts from '../components/GetPosts'

// const getSessions = async () => {
//   const session = await getServerSession(authOptions)
//   return session
// }

const Home = async () => {
  const session = await getServerSession(authOptions)
  // const session = await getSessions()
  // console.log(session)
  return (
    <main className='w-full flex flex-col items-center justify-center m-auto'>
      <Searchbar session={session} />
      <GetPosts session={session} />
    </main>
  )
}
export default Home
