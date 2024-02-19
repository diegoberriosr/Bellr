import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

// Context imports
import AuthContext from "../../context/AuthContext"
import GeneralContext from '../../context/GeneralContext';
import MessageContext from '../../context/MessageContext';
// Icon imports
import { MdOutlineDelete } from "react-icons/md";

const Message = ({ message }) => {
  const [ clicked, setClicked ] = useState(false);
  const { user, authTokens } = useContext(AuthContext);
  const { mode } = useContext(GeneralContext);
  const { chatSocket, activeConversation, setConversations } = useContext(MessageContext);


  const handleClick = () => {
    if (message.sender.username === user.username) setClicked(!clicked);
    return;
  }

  const handleDelete = () => {
    axios({
      url : `http://127.0.0.1:8000/messages/delete`,
      method : 'POST',
      headers : {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      },
      data : {message_id : message.id}
    })
    .then ( () => {

      setConversations( prevStatus => {
        let updatedStatus = [...prevStatus];
        const index = updatedStatus.findIndex( conversation => conversation.id === activeConversation.id);

        updatedStatus[index].messages = updatedStatus[index].messages.filter( element => element.id !== message.id)

        return updatedStatus
      })
      chatSocket.send(JSON.stringify({
        'type' : 'delete_message',
        'message_id' : message.id,
        'conversation_id' : message.conversation_id,
        'receiver_id' : activeConversation.partners[0].user_id
      }))
    })
    .catch( err => {
      console.log(err);
    })
  }

  useEffect( () => {
    if (!message.seen && user.username !== message.sender.username) {
      axios({
        url: `http://127.0.0.1:8000/messages/seen`,
        method : 'PUT',
        headers : {
          'Authorization' : 'Bearer ' + String(authTokens.access)
        },
        data : {message_id : message.id}
      })
    }
  }, [])

  return (
    <div className={`mt-10 relative mt-1 flex p-2.5 ${ clicked ? 'max-w-[80%]' : 'max-w-[70%]'} 
     ${user.username === message.sender.username ? 'mr-2.5 ml-auto rounded-t-full rounded-l-full rounded-r-none bg-green-900 pl-8' 
     : 'ml-2.5 mr-auto rounded-t-full rounded-l-none rounded-r-full bg-gray-900'} transition-all duration-500`} onClick={handleClick}>
      <p className='text-white'>{message.content}</p>
      { clicked && message.sender.username === user.username && <div className='absolute right-0 top-0 w-[20%] bg-red-900 flex justify-center 
    items-center h-full  rounded-t-full rounded-l-full rounded-r-none opacity-90 hover:opacity-100' onClick={handleDelete}>
        <MdOutlineDelete className='text-white text-2xl'/>
      </div>}
      <span className={`absolute -bottom-7 text-sm text-gray-600 w-full flex ${user.username === message.sender.username ? 'justify-end pr-10' : 'justify-start'}`}>
        {moment(message.timestamp).format('MMMM DD YYYY, h:mm:ss a')}
      </span>
    </div>
  )
}

export default Message