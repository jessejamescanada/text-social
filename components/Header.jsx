import Link from 'next/link'
import Signin from './auth/Signin'
import Logged from './auth/Logged'
import userImage from '../public/userImage.png'
import Messenger from './Messenger'

const Header = ({ session }) => {
  return (
    <nav className='w-full flex items-center justify-center pt-8 pb-6 bg-gradient-to-r from-slate-900 to-slate-500'>
      <div className='w-full max-w-7xl flex items-center justify-between  m-auto'>
        <Messenger session={session} />
        <ul className='flex items-center gap-6 pr-1 sm:pr-6 justify-end'>
          <Link href={'/'}>
            <h1 className='text-gray-100 font-semibold'>Home</h1>
          </Link>
          {!session?.user && <Signin />}
          {session?.user && <Logged image={session.user?.image || userImage} />}
        </ul>
      </div>
    </nav>
  )
}

export default Header
