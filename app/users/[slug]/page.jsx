import { getServerSession } from 'next-auth'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import FetchUsersPage from './FetchUsersPage'

const UsersPage = async ({ params: { slug } }) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <FetchUsersPage
      slug={slug}
      session={session}
    />
  )
}

export default UsersPage
