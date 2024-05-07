import { useContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Icon imports
import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";
import { BsPeople } from "react-icons/bs";
import { BsPeopleFill } from "react-icons/bs";
import { RiNotification2Line } from "react-icons/ri";
import { RiNotification2Fill } from "react-icons/ri";
import { IoMailOutline } from "react-icons/io5";
import { IoMailSharp } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { IoBrushOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";

// Context imports
import GeneralContext from '../../context/GeneralContext';
import AuthContext from '../../context/AuthContext';
import MessageContext from '../../context/MessageContext';

const ICONS = [
  {
      'name' : 'Home',
      'image' : {
          'nonselected' : GoHome, 
          'selected' : GoHomeFill
      },
      'route' : 'home',
      'loginRequired' : false
  },
  {
      'name' : 'Following',
      'image' : {
          'nonselected' : BsPeople, 
          'selected' :BsPeopleFill
      },
      'route' : 'feed',
      'loginRequired' : true
  },
  {
      'name' : 'Notifications',
      'image' : {
          'nonselected' : RiNotification2Line, 
          'selected' : RiNotification2Fill
      },
      'route' : 'notifications',
      'loginRequired' : true
  },
  {
      'name' : 'Messages',
      'image' : {
          'nonselected' : IoMailOutline, 
          'selected' : IoMailSharp
      },
      'route' : 'messages',
      'loginRequired' : true
  },
  {
      'name' : 'Profile',
      'image' : {
          'nonselected' : IoPersonOutline, 
          'selected' : IoPersonSharp
      },
      'route' : 'me',
      'loginRequired' : true
  }
];


const Bottombar = ({ setModeModal }) => {

  const [active, setActive] = useState(0);
  const [unseenNotifications, setUnseenNotifications] = useState(0);
  const [unseenMessages, setUnseenMessages] = useState(0);
  
  const { mode, conversations } = useContext(GeneralContext);
  const { user, authTokens, logoutUser } = useContext(AuthContext);
  const { activeConversation } = useContext(MessageContext);

  const navigate = useNavigate();

  useEffect( () => {
    if( user ){
        let headers;

        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }

        axios({
            url : 'https://bellr.onrender.com/notifications/unseen',
            method : 'GET',
            headers : headers
        })
        .then( res => {
            setUnseenNotifications(res.data.unseen);
        }
        )
    }

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [active]);


useEffect( () => {
    if( user) {
        setUnseenMessages(0);
        if (conversations) {
            conversations.forEach( conversation => conversation.messages.forEach( message => {
                if (message && !message.seen && message.sender.user_id !== user.user_id) setUnseenMessages( prevUnseenMessages => prevUnseenMessages + 1);
            }));
    }
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [conversations])
  

  return (
    <div className={`${ activeConversation ? 'hidden' : 'block mobile:hidden '} fixed bottom-0 w-screen h-20 bg-${mode.background} ${mode.text} border border-${mode.separator} border-b-0 border-l-0 border-r-0`}>
      <ul className='flex items-center justify-center items-center  h-full w-full text-4xl'>
        {
            !user && <li key='change mode' className={`inline-flex items-center px-3.5 p-2.5 hover:${mode.sidebarHighlight} rounded-3xl cursor-pointer duration-[400ms]`} onClick={() => { setModeModal(true)}}>
            <IoBrushOutline/>
        </li>
        }
      {ICONS.map((icon, index) => {
                if (icon.loginRequired && user===null ){
                    return undefined;
                }
                return <li key={index} className={`relative inline-flex items-center px-3.5 p-2.5 hover:${mode.sidebarHighlight} rounded-3xl cursor-pointer duration-[400ms]`} onClick={() => { navigate(`/${icon.route}`) ; setActive(index) }}>
                        {index === active ? <icon.image.selected /> : <icon.image.nonselected/>}
                        { unseenMessages > 0  && icon.route === 'messages' && <span className={`font-bold text-sm text-[11px] absolute top-1 left-7 bg-${mode.color} w-6 h-6 rounded-full animate-image-grow text-white flex justify-center items-center text-sm`}> 
                            {unseenMessages < 99 ? unseenMessages : '99+'}
                        </span>}
                        { unseenNotifications > 0 && icon.route === 'notifications' && <span className={`font-bold text-[11px] absolute top-1 left-7 bg-${mode.color} w-6 h-6 rounded-full animate-image-grow text-white flex justify-center items-center text-sm`}> 
                            {unseenNotifications < 99 ? unseenNotifications : '99+'}
                        </span>}
                    </li>
            })}
            {
            !user && <li key='log out' className={`inline-flex items-center px-3.5 p-2.5 hover:${mode.sidebarHighlight} rounded-3xl cursor-pointer duration-[400ms]`} onClick={() => { navigate('/login')}}>
            <CiLogin/>
        </li>
            }
            {
                user && <li key='log out' className={`inline-flex items-center px-3.5 p-2.5 hover:${mode.sidebarHighlight} rounded-3xl cursor-pointer duration-[400ms]`} onClick={logoutUser}>
                <TbLogout2/>
            </li>
            }
      </ul>
    </div>
  )
}

export default Bottombar
