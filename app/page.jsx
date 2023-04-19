import Image from 'next/image'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import Searchbar from '../components/Searchbar'
import GetPosts from '../components/GetPosts'

const Home = async () => {
  const session = await getServerSession(authOptions)
  console.log(session)
  return (
    <main className='w-full flex flex-col items-center justify-center m-auto'>
      <Searchbar session={session} />
      <GetPosts session={session} />
    </main>
  )
}
export default Home
