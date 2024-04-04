import { useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';

// Icon imports
import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";
import { BsPeople } from "react-icons/bs";
import { BsPeopleFill } from "react-icons/bs";
import { RiNotification2Line } from "react-icons/ri";
import { RiNotification2Fill } from "react-icons/ri";
import { IoMailOutline } from "react-icons/io5";
import { IoMailSharp } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";

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


const Bottombar = () => {

  const [active, setActive] = useState(0);
  const { mode } = useContext(GeneralContext);
  const { user } = useContext(AuthContext);
  const { activeConversation } = useContext(MessageContext);

  const navigate = useNavigate();

  return (
    <div className={`${ activeConversation ? 'hidden' : 'block mobile:hidden '} fixed bottom-0 w-screen h-20 bg-${mode.background} ${mode.text} border border-${mode.separator} border-b-0 border-l-0 border-r-0`}>
      <ul className='flex items-center justify-center items-center  h-full w-full text-4xl'>
      {ICONS.map((icon, index) => {
                if (icon.loginRequired && user===null ){
                    return undefined;
                }
                return <li key={index} className={`inline-flex items-center px-3.5 p-2.5 hover:${mode.sidebarHighlight} rounded-3xl cursor-pointer duration-[400ms]`} onClick={() => { navigate(`/${icon.route}`) ; setActive(index) }}>
                        {index === active ? <icon.image.selected /> : <icon.image.nonselected/>}
                    </li>
            })}
      </ul>
    </div>
  )
}

export default Bottombar
