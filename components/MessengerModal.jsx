import FriendsForMessenger from './FriendsForMessenger'

const MessengerModal = ({ session, friendsName, setFriendsName }) => {
  return (
    <div className='absolute mx-auto sm:mx-0 top-[90px] w-[90%] sm:w-[250px] h-[85vh] sm:h-[400px]  inset-0 overflow-y-hidden rounded-lg z-[2000]'>
      <div className='flex items-start w-full sm:px-3 h-full justify-start'>
        <div className='relative bg-white w-full h-full rounded-lg rounded-t-lg '>
          <div className=' h-full sm:h-[400px] z-[100]'>
            <h2 className='text-lg font-semibold  text-center text-white bg-amber-500 rounded-t-lg'>
              {friendsName ? friendsName : 'Your Friends'}
            </h2>

            <FriendsForMessenger
              session={session}
              friendsName={friendsName}
              setFriendsName={setFriendsName}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessengerModal
