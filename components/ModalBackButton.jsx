'use client'
import { TbArrowBackUp } from 'react-icons/tb'

const ModalBackButton = ({ setClickedFriend, setFriendsName }) => {
  const goBackAndChangeName = () => {
    setClickedFriend(false)
    setFriendsName('Your Friends')
  }
  return (
    <button
      className='absolute flex text-white text-lg font-semibold rounded-lg bg-red-400 py-1 px-2 cursor-pointer'
      onClick={goBackAndChangeName}
    >
      <TbArrowBackUp />
    </button>
  )
}

export default ModalBackButton
