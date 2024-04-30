import { useState, useEffect, useContext} from 'react';
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
import { BsThreeDots } from "react-icons/bs";
import { LuDog } from "react-icons/lu";
import { CiLogin } from "react-icons/ci";
import { IoBrushOutline } from "react-icons/io5";

// Authentication context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from '../../context/GeneralContext';
import MessageContext from '../../context/MessageContext';

// Helper components imports
import PostButton from './PostButton';
import SidebarDropdownMenu from './SidebarDropdownMenu';
import ImageDropdownMenu from './ImageDropdownMenu';

let ICONS = [
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
        'route' :  '',
        'loginRequired' : true
    }
];


const Sidebar = ({ setModeModal }) => {

    const [ active, setActive ] = useState(0);
    const {user, authTokens } = useContext(AuthContext); // Check if user is logged in
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
    
    if(user) ICONS[ICONS.length -1].route = `user/${user.username}`;
    
    const hoverClass = hoverColors[mode.sidebarHighlight];

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
                        { unseenMessages > 0  && icon.route === 'messages' && <span className={`font-bold text-sm text-[11px] absolute top-1 left-7 bg-${mode.color} w-6 h-6 rounded-full animate-image-grow text-white flex justify-center items-center text-sm`}> 
                            {unseenMessages < 99 ? unseenMessages : '99+'}
                        </span>}
                        { unseenNotifications > 0 && icon.route === 'notifications' && <span className={`font-bold text-[11px] absolute top-1 left-7 bg-${mode.color} w-6 h-6 rounded-full animate-image-grow text-white flex justify-center items-center text-sm`}> 
                            {unseenNotifications < 99 ? unseenNotifications : '99+'}
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
                        <ImageDropdownMenu setModeModal={setModeModal}>
                            <div className='min-w-10 h-10 overflow-hidden rounded-full overflow-hidden ml-[15%] visible'>
                                <img src={user.pfp} alt='user profile pic' className='w-full h-full object-cover'/>
                            </div>
                        </ImageDropdownMenu>
                        <div className='w-full ml-2.5'>
                            <p className='invisible xl:visible max-w-[90%] truncate font-bold text-base'>{user.profilename}</p>
                            <p className='invisible xl:visible max-w-[90%] truncate text-gray-600 text-sm mt-0 pt-0'>@{user.username}</p>
                        </div>
                        <SidebarDropdownMenu setModeModal={setModeModal}>
                            <BsThreeDots/>
                        </SidebarDropdownMenu>
                    </li>                
            }
            {
                !user && <div>
                    <li className={`relative inline-flex items-center px-4 p-2.5 ${hoverClass} rounded-3xl cursor-pointer duration-[400ms]`} onClick={() => navigate('/login')}>
                        <CiLogin/>
                        <span className='ml-4 hidden xl:block text-xl'>Log in</span>
                    </li>
                    <li className={`inline-flex items-center px-4 p-2.5 ${hoverClass} rounded-3xl cursor-pointer duration-[400ms]`} onClick={() => setModeModal(true)}>
                        <IoBrushOutline/>
                        <span className='ml-4 hidden xl:block text-xl'>Change mode</span>
                    </li>
                </div>
            }
        </ul>
    </nav>
}

export default Sidebar;