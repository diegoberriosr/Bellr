import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import formatDate from '../../utils';

// Context imports
import AuthContext from "../../context/AuthContext";
import GeneralContext from "../../context/GeneralContext";
import MessageContext from '../../context/MessageContext';

// icon imports
import { FaCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { PiArrowElbowDownRightLight } from "react-icons/pi";


const ConversationMiniature = ({ mostRecentMessage, active, unreadMessages, conversation }) => {

  const { user } = useContext(AuthContext);
  const { mode } = useContext(GeneralContext);
  const { setActiveConversation } = useContext(MessageContext);

  const navigate = useNavigate();


  return (
    <div className={`w-full h-[72px] flex pl-4 space-x-4 hover:${mode.highlight} ${active ? `${mode.highlight} border-r-2 border-${mode.color}` : ''}`} onClick={() => setActiveConversation(conversation)}>
      <figure className='w-10 h-10 mt-auto mb-auto cursor-pointer'>
        <img src={conversation.partners[0].pfp} alt='user pfp' className='w-full h-full rounded-full object-fill' onClick={() => { navigate(`/user/${conversation.partners[0].username}`)}}/>
      </figure>
      <aside>
        <div className='flex  items-center text-base mt-3 w-full'>
            <span className='font-bold max-w-[200px] truncate'>{conversation.partners[0].profilename}</span>
            {conversation.partners[0].verified && <MdVerified className='ml-0.5 text-twitter-blue'/>}
            <span className={`text-gray-600 ml-1`}>@{conversation.partners[0].username}</span>
            <span className={`text-gray-600 ml-1`}>~ { conversation.messages.length > 0 ? formatDate(conversation.messages[conversation.messages.length - 1]): ''}</span>
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
