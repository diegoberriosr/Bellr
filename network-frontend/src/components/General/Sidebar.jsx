import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

// Sidebar-icon imports
import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";
import { BsPeople } from "react-icons/bs";
import { BsPeopleFill } from "react-icons/bs";
import { RiNotification2Line } from "react-icons/ri";
import { RiNotification2Fill } from "react-icons/ri";
import { IoMailOutline } from "react-icons/io5";
import { IoMailSharp } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark} from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";


import { CiLogout } from "react-icons/ci";
import { LuDog } from "react-icons/lu";

// Authentication context imports
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import GeneralContext from '../../context/GeneralContext';
import MessageContext from '../../context/MessageContext';

// Helper components imports
import PostButton from './PostButton';
import SidebarDropdownMenu from './SidebarDropdownMenu';

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
        'name' : 'Bookmarked',
        'image' : {
            'nonselected' : CiBookmark, 
            'selected' : FaBookmark
        },
        'route' : 'bookmarked',
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


const Sidebar = ({ setModeModal }) => {

    const [ active, setActive ] = useState(0);
    const {user, logoutUser, authTokens } = useContext(AuthContext); // Check if user is logged in
    const { conversations } = useContext(MessageContext);

    const { handleModal, mode } = useContext(GeneralContext);
    const [ unseenNotifications, setUnseenNotifications ] = useState(0);
    const [ unseenMessages, setUnseenMessages] = useState(0);

    const navigate = useNavigate();

    const hoverColors = {
        'bg-light-sidebar-highlight': 'hover:bg-light-sidebar-highlight',
        'bg-dim-sidebar-highlight' : 'hover:bg-dim-sidebar-highlight',
        'bg-dark-sidebar-highlight' : 'hover:bg-dark-sidebar-highlight'
    }
    
    
    const hoverClass = hoverColors[mode.sidebarHighlight];

    useEffect( () => {

        let headers;

        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }

        axios({
            url : 'http://127.0.0.1:8000/notifications/unseen',
            method : 'GET',
            headers : headers
        })
        .then( res => {
            setUnseenNotifications(res.data.unseen);
        }
        )
    }, [active])


    useEffect( () => {
        setUnseenMessages(0);
        if (conversations) {
            conversations.forEach( conversation => conversation.messages.forEach( message => {
                if (message && !message.seen && message.sender.user_id !== user.user_id) setUnseenMessages( prevUnseenMessages => prevUnseenMessages + 1);
            }));
        }
    }, [conversations])

    return <nav className={`sticky hidden mobile:block top-0 w-[75px] xl:w-[275px] h-screen flex flex-col duration-300 relative border ${mode.separator} border-t-0 border-l-0 border-b-0 text-3xl`}>
        <ul className='h-screen'>
            <li className='p-2.5 px-4'>
                <LuDog/>
            </li>
            {ICONS.map((icon, index) => {
                if (icon.loginRequired && user===null ){
                    return undefined;
                }
                return <li key={index} className={`relative inline-flex items-center px-4 p-2.5 ${hoverClass} rounded-3xl cursor-pointer duration-[400ms]`} onClick={() => { navigate(`/${icon.route}`) ; setActive(index) }}>
                        {index === active ? <icon.image.selected /> : <icon.image.nonselected/>}
                        <span className={`${index === active ? 'font-bold' : ''} ml-4 hidden xl:block text-xl`}>{icon.name}</span>
                        { unseenMessages > 0  && icon.route === 'messages' && <span className={`absolute top-1 left-7 bg-${mode.color} w-5 h-5 rounded-full animate-image-grow text-white text-center text-sm`}> 
                            {unseenMessages}
                        </span>}
    
                    </li>
            })}
            {user && 
                <>
                    <li className='w-full mt-1 p-2.5'>
                        <PostButton handleClick={handleModal}/>
                    </li>
                </>
            }
            { user &&
                    <li className='absolute bottom-0 w-full mt-1 p-2.5 flex items-center'>
                        <div className='min-w-10 w-10 h-10 overflow-hidden rounded-full overflow-hidden'>
                            <img src={user.pfp} alt='user profile pic' className='w-full h-full object-cover'/>
                        </div>
                        <div className='w-full ml-2.5'>
                            <p className='invisible xl:visible max-w-full font-bold text-base'>{user.profilename}</p>
                            <p className='invisible xl:visible text-gray-600 text-sm mt-0 pt-0'>@{user.username}</p>
                        </div>
                        <SidebarDropdownMenu setModeModal={setModeModal}/>
                    </li>
            }
        </ul>
    </nav>
}

export default Sidebar;