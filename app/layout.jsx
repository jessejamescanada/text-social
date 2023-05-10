import './globals.css'
import QueryWrapper from '../components/QueryWrapper'
import Header from '../components/Header'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import Messenger from '@/components/Messenger'

export const metadata = {
  title: 'Text Social',
  description: 'Social Media App',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang='en'>
      <body className='flex flex-col min-h-screen items-center pb-8  bg-gradient-to-b from-slate-600 to-slate-800 text-gray-200  mx-auto overflow-hidden  '>
        <QueryWrapper>
          <Header session={session} />

          <div className='w-full h-[3px] bg-zinc-500'></div>
          <div className='flex flex-col w-full sm:flex-row'>
            <div className='w-[20%]'>
              <Messenger session={session} />
            </div>
            {children}
            <div className='w-[1%] lg:w-[20%]'></div>
          </div>
        </QueryWrapper>
      </body>
    </html>
  )
}
