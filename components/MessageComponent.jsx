import Image from 'next/image'
import TimeAgo from 'react-timeago'

const MessageComponent = ({ message, session }) => {
  const isUser = session?.user?.email === message.email

  // get users first name to display in chat
  const firstName = message.username.split(' ')
  const name = firstName[0]
  // console.log(message)
  return (
    <div className={`flex w-fit items-center ${isUser && 'ml-auto'}`}>
      <div className={`flex-shrink-0 ${isUser && 'order-2'}`}>
        {/* <Image
          src={message.profilePic}
          height={10}
          width={40}
          alt='profile-pic'
          className='rounded-full mx-2'
        /> */}
      </div>

      <div>
        <p
          className={`text-[0.75rem] px-[2px] pb-[2px] font-semibold  ${
            isUser ? 'text-blue-400 text-right' : 'text-amber-500 text-left'
          }`}
        >
          {name}
        </p>
        <div className='flex flex-col items-start'>
          <div
            className={`px-2 py-1 rounded-lg w-fit text-white ${
              isUser ? 'bg-blue-400 ml-auto ' : 'bg-amber-500'
            }`}
          >
            <p>{message.message}</p>
          </div>
          <p
            className={`text-[0.65rem] italic px-2 text-gray-500 ${
              isUser && 'text-right'
            }`}
          >
            <TimeAgo date={new Date(message.created_at)} />
          </p>
        </div>
      </div>
    </div>
  )
}

export default MessageComponent
