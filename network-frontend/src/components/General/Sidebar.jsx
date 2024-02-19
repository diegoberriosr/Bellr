import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


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

// Helper components imports
import PostButton from './PostButton';


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
    const {user, logoutUser } = useContext(AuthContext); // Check if user is logged in
    const { handleModal, mode } = useContext(GeneralContext);




    const navigate = useNavigate();

    const handleLogoutUser = () => {
        logoutUser();
        navigate('/')
    };

    const hoverColors = {
        'bg-light-sidebar-highlight': 'hover:bg-light-sidebar-highlight',
        'bg-dim-sidebar-highlight' : 'hover:bg-dim-sidebar-highlight',
        'bg-dark-sidebar-highlight' : 'hover:bg-dark-sidebar-highlight'
    }
    
    
    const hoverClass = hoverColors[mode.sidebarHighlight];

    return <nav className={`sticky hidden mobile:block top-0 w-[75px] xl:w-[275px] h-screen flex flex-col duration-300 relative border ${mode.separator} border-t-0 border-l-0 border-b-0 text-3xl`}>
        <ul className='h-screen'>
            <li className='p-2.5 px-4'>
                <LuDog/>
            </li>
            {ICONS.map((icon, index) => {
                if (icon.loginRequired && user===null ){
                    return undefined;
                }
                return <li key={index} className={`inline-flex items-center px-4 p-2.5 ${hoverClass} rounded-3xl cursor-pointer duration-[400ms]`} onClick={() => { navigate(`/${icon.route}`) ; setActive(index) }}>
                        {index === active ? <icon.image.selected /> : <icon.image.nonselected/>}
                        <span className={`${index === active ? 'font-bold' : ''} ml-4 hidden xl:block text-xl`}>{icon.name}</span>
                    </li>
            })}
            {user && 
                <>
                    <li className='w-full mt-1 p-2.5'>
                        <PostButton handleClick={handleModal}/>
                    </li>
                    <li className='relative bottom-0 inline-flex items-center mt-1 p-2.5 hover:bg-gray-800 hover:rounded-3xl cursor-pointer' onClick={handleLogoutUser}>
                        <CiLogout/>
                        <span className='ml-4 hidden sm:block text-2xl'>Logout</span>
                    </li>
                </>
            }
            { user &&
                    <li className='absolute bottom-0 w-full mt-1 p-2.5 flex items-center' onClick={() => setModeModal(true)}>
                        <div className='min-w-10 w-10 h-10 overflow-hidden rounded-full overflow-hidden'>
                            <img src={user.pfp} alt='user profile pic' className='w-full h-full object-cover'/>
                        </div>
                        <div className='w-full ml-2.5'>
                            <p className='invisible xl:visible max-w-full font-bold text-base'>{user.profilename}</p>
                            <p className='invisible xl:visible text-gray-600 text-sm mt-0 pt-0'>@{user.username}</p>
                        </div>
                    </li>
            }
        </ul>
    </nav>
}

export default Sidebar;