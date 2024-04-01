import { useState, useContext, useEffect } from 'react'


// Icon imports
import { BsThreeDots } from "react-icons/bs";
import { SlUserFollow } from "react-icons/sl";
import { RiUserUnfollowLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { LuFileEdit } from "react-icons/lu";
import { TbPinned } from "react-icons/tb";

// Context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from '../../context/GeneralContext';

const DropdownMenu = ({ author_id, followed, post, setDeleting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shrink, setShrink] = useState(false);

  const { user } = useContext(AuthContext);
  const { mode, setEditedPost, setIsEditing, handleModal, handleFollow } = useContext(GeneralContext);

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

  useEffect( () => {
    if (shrink) {
      const timer = setTimeout ( () => {
        handleClose();
        setShrink(false);
      } , 200)

      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shrink])


  return (
    <div className='relative ml-auto mr-2.5 animate-grow z-20' onMouseLeave={() => setShrink(true)}>
        {isOpen ? <ul  tabIndex='0' className={`relative absolute top-7 -right-1 w-28 h-20 flex flex-col border shadow-custom pl-1 pr-1 bg-${mode.background} ${mode.text} rounded-lg border ${mode.separator} ${ shrink ? 'animate-shrink' : 'animate-grow'}`} onKeyDown={() => setShrink(true)}>
          { user.username !== post.user.username && 
            <li className='hover:bg-opacity-50 cursor-pointer inline-flex items-center' onClick={() => {handleFollow(post.user.user_id)}}> 
              {followed ? <RiUserUnfollowLine/> : <SlUserFollow/>}
              <span className='ml-2'>{ post.followed ? 'Unfollow' : 'Follow' }</span>
            </li> }
            {user.user_id === author_id &&
            <li className='hover:bg-opacity-50 cursor-pointer inline-flex items-center' onClick={() => {}}>
              <TbPinned/> 
              <span className='ml-2'>{post.pinned ? 'Unpin' : 'Pin'}</span>
          </li> }
          { user.username === post.user.username && 
            <li className='hover:bg-opacity-50 cursor-pointer inline-flex items-center'> 
              <LuFileEdit onClick={handleEditing}/>
              <span className='ml-2' onClick={handleEditing}>Edit</span>
            </li> }
          { user.username === post.user.username && 
            <li className='hover:bg-opacity-50 cursor-pointer inline-flex items-center' onClick={() => {setDeleting(true); setIsOpen(false)}}>
              <MdDeleteOutline/> 
              <span className='ml-2'>Delete</span>
            </li> }
        </ul> : 
        <BsThreeDots className={`${user ? '' : 'opacity-40 pointer-events-none animate-grow'}`} onClick={() => {setIsOpen(!isOpen)}} />}
    </div>
  )
}

export default DropdownMenu
