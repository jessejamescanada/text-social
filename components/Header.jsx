import { getServerSession } from 'next-auth/next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import Link from 'next/link'
import Signin from './auth/Signin'
import Logged from './auth/Logged'
import userImage from '../public/userImage.png'

const Header = async () => {
  const session = await getServerSession(authOptions)

  return (
    <nav className='w-full flex items-center justify-end pt-8 pb-6 bg-gradient-to-r from-slate-900 to-slate-500'>
      <ul className='flex items-center gap-6 pr-6'>
        <Link href={'/'}>
          <h1 className='text-gray-100 font-semibold'>Home</h1>
        </Link>
        {!session?.user && <Signin />}
        {session?.user && <Logged image={session.user?.image || userImage} />}
      </ul>
    </nav>
  )
}

export default Header
