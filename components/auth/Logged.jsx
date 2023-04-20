'use client'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

const Logged = ({ image }) => {
  return (
    <li className='flex gap-6 items-center'>
      <button
        onClick={() =>
          signOut({ callbackUrl: 'https://text-social.vercel.app/' })
        }
        className='text-sm bg-gray-700 text-white py-2 px-6 rounded-xl disabled:opacity-25'
      >
        Sign Out
      </button>
      <Link href={'/dashboard'}>
        <Image
          width={64}
          height={64}
          src={image}
          alt='profile image'
          priority
          className='w-14 rounded-full'
        />
      </Link>
    </li>
  )
}

export default Logged
