import { useContext } from 'react';
import { useNavigate } from "react-router-dom";

// Context imports
import AuthContext from "../../context/AuthContext";
import GeneralContext from "../../context/GeneralContext";
import MessageContext from '../../context/MessageContext';

// icon imports
import { FaCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";


const ConversationMiniature = ({ mostRecentMessage, active, unreadMessages, conversation }) => {

  const { user } = useContext(AuthContext);
  const { mode } = useContext(GeneralContext);
  const { setActiveConversation } = useContext(MessageContext);

  const navigate = useNavigate;
  return (
    <div className={`w-full h-[72px] bg-transparent flex pl-4 space-x-4 ${active ? `bg-dark-highlight border-r-2 border-twitter-blue` : 'bg-black'}`} onClick={() => setActiveConversation(conversation)}>
      <figure className='w-10 h-10 mt-auto mb-auto cursor-pointer'>
        <img src={mostRecentMessage.sender.pfp} alt='user pfp' className='w-full h-full rounded-full object-fill' onClick={() => {navigate(`/user/${mostRecentMessage.user.username}`)}}/>
      </figure>
      <aside>
        <div className='flex text-base mt-3'>
            <span className='font-bold flex items-center'>{mostRecentMessage.sender.profilename} {mostRecentMessage.sender.profilename && <MdVerified className='ml-0.5 text-twitter-blue'/>}</span>
            <span className={`text-gray-600 ml-1`}>@{mostRecentMessage.sender.username}</span>
            <span className={`text-gray-600 ml-1`}>~ {mostRecentMessage.timestamp}</span>
        </div>
        <div className='flex items-center text-md'>
            { ( mostRecentMessage.sender.username !== user.username &&  !mostRecentMessage.seen ) ? 
            <i className='relative'>
              <FaCircle className='text-twitter-blue mr-1'/> 
              <span className='absolute top-0 left-0 pr-1 h-full w-full flex justify-center items-center text-xs font-bold'>{unreadMessages}</span>
            </i>
            : undefined}
            <p>{mostRecentMessage.content}</p>
            </div>
      </aside>
    </div>
  )
}

export default ConversationMiniature
