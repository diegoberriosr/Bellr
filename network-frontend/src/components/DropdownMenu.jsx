import { useState, useContext} from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// Icon imports
import { BsThreeDots } from "react-icons/bs";
import { SlUserFollow } from "react-icons/sl";
import { RiUserUnfollowLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { LuFileEdit } from "react-icons/lu";
import { TbPinned } from "react-icons/tb";

// Context imports
import AuthContext from '../context/AuthContext';
import GeneralContext from '../context/GeneralContext';

const DropdownMenu = ({ author_id, followed, post, setPosts}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, authTokens } = useContext(AuthContext);
  const { darkMode, setEditedPost, setIsEditing, handleModal, handleFollow, handleDelete} = useContext(GeneralContext);
  const currentUrl = useLocation();

  const handleClose = () => {
      if (isOpen) {
        setIsOpen(!isOpen);
      }
  };

  const handleEditing = () => {
    setEditedPost(post)
    setIsEditing(true);
    handleModal(true);
  }

  return (
    <div className='relative ml-auto mr-2.5' onMouseLeave={handleClose}>
        {isOpen ? <ul  tabIndex='0' className={`relative absolute top-7 -right-1 w-28 h-20 flex flex-col border shadow-custom pl-1 pr-1 ${ darkMode ? 'bg-black text-white' : 'bg-white text-black'} rounded-lg shadow-gray-800 border border-dark-twitter-gray`} onKeyDown={handleClose}>
          { user.user_id !== author_id && 
            <li className='hover:bg-opacity-50 cursor-pointer inline-flex items-center' onClick={() => {handleFollow(author_id)}}> 
              {followed ? <RiUserUnfollowLine/> : <SlUserFollow/>}
              <span className='ml-2'>{ post.followed ? 'Unfollow' : 'Follow' }</span>
            </li> }
            {user.user_id === author_id &&
            <li className='hover:bg-opacity-50 cursor-pointer inline-flex items-center' onClick={() => {}}>
              <TbPinned/> 
              <span className='ml-2'>{post.pinned ? 'Unpin' : 'Pin'}</span>
          </li> }
          { user.user_id === author_id && 
            <li className='hover:bg-opacity-50 cursor-pointer inline-flex items-center'> 
              <LuFileEdit onClick={handleEditing}/>
              <span className='ml-2' onClick={handleEditing}>Edit</span>
            </li> }
          { user.user_id === author_id && 
            <li className='hover:bg-opacity-50 cursor-pointer inline-flex items-center' onClick={() => {handleDelete(post.id)}}>
              <MdDeleteOutline/> 
              <span className='ml-2'>Delete</span>
            </li> }
        </ul> : 
        <BsThreeDots className={`${user ? '' : 'opacity-40 pointer-events-none'}`} onClick={() => {setIsOpen(!isOpen)}} />}
    </div>
  )
}

export default DropdownMenu
