import { forwardRef, useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import formatDate from '../../utils';
import axios from 'axios';

// Icon imports
import { GoMention } from "react-icons/go";
import { FaHeart, FaRetweet } from "react-icons/fa6";
import { FaReplyAll } from "react-icons/fa";



import GeneralContext from '../../context/GeneralContext';

const Notification = forwardRef(({notification}, ref) => {
  const { mode} = useContext(GeneralContext);

  const navigate = useNavigate();
/* TODO
  useEffect(() => {
    if(!notification.seen) {
      axios({
        url: '',
        method : 'PUT',
        data : { notification_id : notification.id }
      })
      .then( () => {
        console.log(`Notification with id=${notification.id} was successfully updated.`)
      })
    }
  }, [])
*/
  return (
    <div ref={ref} className={`w-full flex px-6 border ${mode.separator} hover:${mode.highlight}  border-l-0 border-t-0 p-2.5 cursor-pointer transform duration-500 animate-grow`} onClick={() => navigate(`/post/${notification.postId}`)}>
    {notification.type === 'mention' && <GoMention className='text-twitter-blue text-3xl' />}
    {notification.type === 'like' && <FaHeart className='text-red-900 text-3xl' />}
    {notification.type === 'transmission' && <FaRetweet className='text-green-900 text-3xl' />}
    {notification.type === 'reply' && <FaReplyAll className='text-twitter-blue text-3xl' />}
    <p className='absolute top-2 right-1 text-gray-600'>{formatDate(notification)}</p>
    <div className='flex flex-col ml-2.5'>
        <div className='w-8 h-8 rounded-full overflow-hidden'>
            <img src={notification.pfp} className='h-full w-full object-cover rounded-full' alt='author pfp' />
        </div>
        <p className='font-bold mt-2'>{notification.origin} {notification.message}</p>
        <p>{notification.content}</p>
    </div>
</div>
  )
})

export default Notification
