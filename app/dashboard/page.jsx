import { getServerSession } from 'next-auth'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import AddBio from './AddBio'
import GetDashboardPosts from './GetDashboardPosts'
// import GetUserFriends from '../..//components/GetUserFriends'
import DisplayAddedFriends from './DisplayAddedFriends'
import userImage from '../../public/userImage.png'

const Dashboard = async () => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main className='w-full max-w-7xl'>
      <div className='flex flex-col items-center justify-center w-full sm:w-1/2 mx-auto px-4 sm:px-auto'>
        <div className='flex flex-col  w-full  items-center my-3'>
          <div className='flex justify-evenly items-center  w-full h-[205px] '>
            <div className='w-1/2 flex items-center justify-center'>
              <Image
                width={128}
                height={128}
                src={session.user.image ? session.user.image : userImage}
                alt='profile image'
                priority
                className='rounded-full'
              />
            </div>
            <AddBio />
          </div>
          <DisplayAddedFriends />
        </div>
        {/* <GetUserFriends /> */}
        <h2 className='text-lg my-3 font-semibold'>Your Posts</h2>
        <GetDashboardPosts session={session} />
      </div>
    </main>
  )
}

export default Dashboard
