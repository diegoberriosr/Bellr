import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Icon imports
import { GoMention } from "react-icons/go";
import { FcLike } from "react-icons/fc";
import { FaHeart, FaRetweet } from "react-icons/fa6";
import { FaReplyAll } from "react-icons/fa";


// Context imports
import AuthContext from '../context/AuthContext';
import GeneralContext from '../context/GeneralContext';

const Notifications = () => {
    
    const { user, authTokens } = useContext(AuthContext);
    const { darkMode } = useContext(GeneralContext);

    const navigate = useNavigate();

    if (!user) {
        navigate('/home');
    }

    const [ notifications, setNotifications] = useState(null);


    const getNotifications = () => {
        fetch(`http://127.0.0.1:8000/notifications`, {
            method : 'GET',
            headers : {
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        })
        .then( response => response.json())
        .then( (notifications) => { 
            console.log(notifications);
            setNotifications(notifications) 
        })
        .catch( error => { console.log(error)})
      };

    
    useEffect (() => {
        getNotifications();
    } , [])

    console.log(notifications);

    return <div className='w-[600px]'>
                <div className={`flex items-center space-x-7 text-2xl border border-gray-800 border-l-0 border-t-0 ${ darkMode ? 'bg-black' : 'bg-white'} bg-opacity-50 sticky top-0`}>
                    <p className='pl-3.5 my-2.5 text-xl font-bold'> Notifications </p>
                </div>
                { notifications && 
                
                (notifications.length > 0) ? notifications.map(notification => 
                    <div className='relative w-full flex px-6 border border-gray-800 border-l-0 border-t-0 p-2.5 cursor-pointer' onClick={() => navigate(`/post/${notification.postId}`)}>
                        {notification.type === 'mention' && <GoMention className='text-twitter-blue text-3xl'/>}
                        {notification.type === 'like' && <FaHeart className='text-red-900 text-3xl'/>}
                        {notification.type === 'transmission' && <FaRetweet className='text-green-900 text-3xl'/>}
                        {notification.type === 'reply' && <FaReplyAll className='text-twitter-blue text-3xl'/>}
                        <p className='absolute top-2 right-1 text-gray-600'>{notification.timestamp}</p>
                        <div className='flex flex-col ml-2.5'> 
                        <div className='w-8 h-8 rounded-full overflow-hidden'>
                             <img src={notification.pfp} className='h-full w-full object-cover rounded-full' alt='author pfp'/>
                        </div>
                         <p className='font-bold mt-2'>{notification.origin} {notification.message}</p>
                         <p>{notification.content}</p>                                
                        </div>
                    </div>
                    )
                    :
                    <div className='mt-16 w-full flex flex-col items-center justify-center'>
                            <h3 className='text-3xl font-bold'>Nothing to see here - yet</h3>
                            <p className='text-gray-600'>When someone mentions you, you'll find it here.</p>
                        </div>
                    }
    </div>
}

export default Notifications;