import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import formatDate from '../../utils';
import axios from 'axios';

// Context imports
import AuthContext from "../../context/AuthContext";
import GeneralContext from "../../context/GeneralContext";
import MessageContext from '../../context/MessageContext';

// icon imports
import { FaCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { PiArrowElbowDownRightLight } from "react-icons/pi";

// Component imports
import MessageDropdownMenu from './MessageDropdownMenu';

const ConversationMiniature = ({ mostRecentMessage, active, unreadMessages, conversation }) => {

  const { user, authTokens } = useContext(AuthContext);
  const { mode } = useContext(GeneralContext);
  const { activeConversation, setActiveConversation, setConversations } = useContext(MessageContext);

  const navigate = useNavigate();

  const handleDeleteConversation = (event) => {
    event.stopPropagation();
    let headers;

    if (authTokens) {
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    }

    axios({
      url : 'http://127.0.0.1:8000/messages/conversations/delete',
      method : 'PUT',
      headers : headers,
      data : { conversation_id : conversation.id }
    })
    .then( () => {
      
      if ( activeConversation && conversation.id === activeConversation.id ) setActiveConversation(null);

      setConversations( prevStatus => {
        return prevStatus.filter( element => element.id !== conversation.id);
      })
    })

  };

  const handleClearConversation = (event) => {
    event.stopPropagation();
    let headers;

    if (authTokens) {
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    }

    axios({
      url : 'http://127.0.0.1:8000/messages/conversations/delete',
      method : 'PUT',
      headers : headers,
      data : { conversation_id : conversation.id }
    })
    .then( () => {
  
      setConversations( prevStatus => {
        let updatedStatus = [...prevStatus];
        const index = prevStatus.findIndex(element => element.id === conversation.id);

        updatedStatus[index].messages = []

        return updatedStatus;
      })
    })

  }

  return (
    <div className={`w-full h-[72px] flex pl-4 space-x-4 hover:${mode.highlight} ${active ? `${mode.highlight} border-r-2 border-${mode.color}` : ''}`} onClick={() => setActiveConversation(conversation)}>
      <figure className='w-10 h-10 mt-auto mb-auto cursor-pointer'>
        <img src={conversation.partners[0].pfp} alt='user pfp' className='w-full h-full rounded-full object-fill' onClick={() => { navigate(`/user/${conversation.partners[0].username}`)}}/>
      </figure>
      <aside className='w-full'>
        <div className='w-full relative flex items-center text-base mt-3 w-full'>
            <span className='font-bold max-w-[200px] truncate'>{conversation.partners[0].profilename}</span>
            {conversation.partners[0].verified && <MdVerified className='ml-0.5 text-twitter-blue'/>}
            <span className={`text-gray-600 ml-1`}>@{conversation.partners[0].username}</span>
            <span className={`text-gray-600 ml-1`}>~ { conversation.messages.length > 0 ? formatDate(conversation.messages[conversation.messages.length - 1]): ''}</span>
            <div className='absolute top-0 right-3'>
            <MessageDropdownMenu conversation_id={conversation.id} handleClearConversation={handleClearConversation} handleDeleteConversation={handleDeleteConversation}/>
            </div>
        </div>
        <div className='flex items-center text-sm'>
            { ( conversation.messages.length > 0 && conversation.messages[conversation.messages.length - 1].sender.username !== user.username && conversation.unseen > 0   ) ? 
            <i className='relative mr-1.5'>
              <FaCircle className='text-twitter-blue mr-1'/> 
              <span className='absolute top-0 left-0 pr-1 h-full w-full flex justify-center items-center text-xs font-bold'>{conversation.unseen}</span>
            </i>
            : undefined}
            <span className='max-w-[300px] max-h-[100px] truncate flex items-center'>
              { conversation.messages.length > 0 && conversation.messages[conversation.messages.length -1].sender.username === user.username  &&
              <PiArrowElbowDownRightLight className={`${mode.text} 'text-md mr-2.5`}/>}
              {conversation.messages.length > 0 ? conversation.messages[conversation.messages.length -1 ].content : ' '}
              </span>
            </div>
      </aside>
    </div>
  )
}

export default ConversationMiniature
