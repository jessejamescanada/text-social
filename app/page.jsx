import { getServerSession } from 'next-auth/next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import Searchbar from '../components/Searchbar'
import ShowFriendsOnlyButton from '../components/ShowFriendsOnlyButton'
import Messenger from '@/components/Messenger'

const Home = async () => {
  const session = await getServerSession(authOptions)

  return (
    <main className='w-full max-w-7xl flex items-start justify-center '>
      {/* <Messenger session={session} /> */}
      <div className='flex-col  w-full'>
        <Searchbar session={session} />
        <ShowFriendsOnlyButton session={session} />
      </div>
    </main>
  )
}
export default Home
