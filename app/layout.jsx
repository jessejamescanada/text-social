import './globals.css'
import QueryWrapper from '../components/QueryWrapper'
import Header from '../components/Header'

export const metadata = {
  title: 'Text Social',
  description: 'Social Media App',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='flex flex-col min-h-screen items-center pb-8  bg-gradient-to-b from-slate-600 to-slate-800 text-gray-200  mx-auto overflow-hidden  '>
        <QueryWrapper>
          <Header />
          <div className='w-full h-[3px] bg-zinc-500'></div>
          {children}
        </QueryWrapper>
      </body>
    </html>
  )
}
