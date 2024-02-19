import { useState, useContext } from 'react';
import axios from 'axios';

// Context imports
import GeneralContext from '../../context/GeneralContext';
import AuthContext from '../../context/AuthContext';

const ProfileMiniature = ({text, textStyle, account}) => {

  const [visible, setVisible] = useState(false);
  const { mode } = useContext(GeneralContext);
  const { handleFollow } = useContext(AuthContext); 

  const handleVisbility = () => {
    setVisible(!visible)
  }

  console.log('PROFILE MINIATURE ----- ', account)

 

  return (
    <div className='relative flex flex-col items-center justify-center' onMouseLeave={handleVisbility}>
      <span className={textStyle} onMouseEnter={handleVisbility}>{text}</span>
      <div className={`${visible ? 'block' : 'hidden'} absolute top-6 z-50 ${mode.background} border rounded-md border-gray-900 w-[250px] flex flex-col justify-center items-start p-2.5`}>
        <div className='w-full flex justify-between items-start'>
            <figure className='w-[60px] h-[60px]'>
                <img src={account.pfp} alt='user pfp' className='w-full h-full object-fit rounded-full'/>
            </figure>
            <button className='w-20 h-8 justify-center items-center border border-red-900 bg-transparent rounded-full' onClick={handleFollow}>{account.followed ? 'Follow' : 'Unfollow'}</button>
        </div>
        <span className='text-lg font-bold flex items-center p-0 mb-0'>{account.profilename}</span>
        <span className='text-gray-900'>@{account.username}</span>
        <p className='w-full max-h-10 truncated'>{account.bio}</p>
        <div className='w-full flex space-x-2 items-center'>
            <span>{account.followers} followers</span>
            <span>{account.following} following</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileMiniature
