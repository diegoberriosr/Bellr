import { useContext, useState } from 'react';

// Context imports
import AuthContext from "../../context/AuthContext"
import GeneralContext from '../../context/GeneralContext';

// Icon imports
import { MdOutlineDelete } from "react-icons/md";

const Message = ({ message, setMessages }) => {
  const [ clicked, setClicked ] = useState(false);
  const { user, authTokens } = useContext(AuthContext);
  const { mode } = useContext(GeneralContext);

  const handleClick = () => {
    if (message.sender === user.username) setClicked(!clicked);
    return;
  }

  const handleDelete = () => {
    setMessages( prevMessages => {
        return prevMessages.filter( element => element.id !== message.id)
    })
  }

  return (
    <div className={`mt-10 relative mt-1 flex p-2.5 ${ clicked ? 'max-w-[60%]' : 'max-w-[50%]'} 
     ${user.username === message.sender ? 'mr-2.5 ml-auto rounded-t-full rounded-l-full rounded-r-none bg-green-900' 
     : 'ml-2.5 mr-auto rounded-t-full rounded-l-none rounded-r-full bg-gray-900'} transition-all duration-500`} onClick={handleClick}>
      <p className='text-white'>{message.content}</p>
      { clicked && message.sender === user.username && <div className='absolute right-0 top-0 w-[20%] bg-red-900 flex justify-center 
    items-center h-full  rounded-t-full rounded-l-full rounded-r-none opacity-90 hover:opacity-100' onClick={handleDelete}>
        <MdOutlineDelete className='text-white text-2xl'/>
      </div>}
      <span className={`absolute -bottom-7 text-sm text-gray-600 w-full flex ${user.username === message.sender ? 'justify-end pr-5' : 'justify-start'}`}>
        {message.timestamp}
      </span>
    </div>
  )
}

export default Message
