// Icon imports
import { MdVerified } from "react-icons/md";
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeftShort } from 'react-icons/bs';
import { FaRegCalendarAlt } from "react-icons/fa";


// Context imports
import AuthContext from '../context/AuthContext';
import GeneralContext from "../context/GeneralContext";

import moment from "moment";

const ProfileHeader = ({ account, handleAction, setFilterUrl }) => {
    
    const [ filter, setFilter ] = useState('All');

    const { user, authTokens } = useContext(AuthContext);
    const { darkMode, handleImageModal, setPfpBig } = useContext(GeneralContext);

    const navigate = useNavigate()
  
    const handleFilter = (filter, filterUrl) => {
        setFilter(filter);
        setFilterUrl(filterUrl);
    }


    return (
        <header className={`border ${ darkMode ? 'border-gray-600' : 'border-gray-300' } border-l-0 w-full`}>
        <div className={`flex items-center space-x-7 text-2xl border ${ darkMode ? 'border-gray-600 bg-black' : 'border-gray-300 bg-white'} border-l-0 border-b-0 border-t-0 bg-opacity-50 sticky top-0`}>
            <BsArrowLeftShort className='ml-3.5 text-3xl opacity-100 hover:bg-gray-900 hover:rounded-full' onClick={() => { navigate(-1) }} />
            <div className='mb-1'>
                <p className='flex items-center'>
                    <span className='font-bold'>{account.username}</span>
                    {account.verified && <MdVerified className='ml-1 text-twitter-blue' />}
                </p>
                <p className='text-gray-600 text-sm'>{account.number_of_posts} posts </p>
            </div>
        </div>
        <figure className='relative h-64 w-full '>
            <img src='https://picsum.photos/100' alt="user's background pic" className='absolute top-0 w-full h-48 object-cover' />
            <div className={`absolute left-3 bottom-0 w-[130px] h-[130px] rounded-full overflow-hidden ${ darkMode ? 'border-black' : 'border-white' } border-[3.5px]`}>
                <img src={account.pfp} alt="user's profile pic" width='130' className='object-cover w-full h-full cursor-pointer' onClick={() => {setPfpBig(account.pfp) ; handleImageModal()}} />
            </div>
            <div className='absolute bottom-5 right-3 flex items-center space-x-2'>
                    {
                        user && user.username === account.username ? 
                        <button className={` w-[100px] h-8 flex items-center justify-center ${ darkMode ? 'bg-white text-black' : 'bg-black text-white'} opacity-90 hover:opacity-100 rounded-full font-bold`}
                        onClick={() => {navigate('/me/edit')}}>Edit</button>
                        :
                        <button className={`border ${ account.isBlocked ? 'bg-red-900 border-red-900 bg-opacity-30 text-red-900 hover:bg-transparent hover:border-twitter-blue hover:text-twitter-blue' : `${ darkMode ? 'border-white text-white' : 'border-black text-black'} hover:border-red-900 hover:bg-red-900 hover:bg-opacity-30 hover:text-red-900`} w-[100px] h-8 flex items-center justify-center rounded-full p-2.5 font-bold transition-colors `} onClick={() => {handleAction(`block/${account.username}`,'POST', authTokens, undefined)}}>
                        { account.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    }
                    { (user && user.username !== account.username && !account.isBlocked) &&
                    <button className={`w-[100px] h-8 flex items-center justify-center text-black rounded-full p-2.5 font-bold 
                    ${account.followed ? `bg-transparent border ${ darkMode ?' border-white text-white' : 'border-black text-black'} hover:border-red-900 hover:text-red-900` 
                    : `${ darkMode ? 'bg-white text-black hover:bg-opacity-90' : 'bg-black text-white hover:bg-opacity-80'} `} transition-colors`}
                    onClick={() => {handleAction(`follow/${account.user_id}`,'PUT', authTokens, undefined)}}>{account.followed ? 'Unfollow' : 'Follow' }</button>
                    }
                </div>
        </figure>
        <div className='px-4'>
            <h3 className='text-2xl font-bold flex items-center'>{account.profilename} {account.verified && <MdVerified className='ml-0.5 text-twitter-blue'/>}</h3>
            <p className='text-base text-gray-600'>@{account.username}</p>
            <p className='mt-2.5 text-base'>{account.bio}</p>
            <p className='flex items-center text-gray-600 mt-1.5'>
                <FaRegCalendarAlt />
                <span className='ml-1'>Joined on {moment(account.date_joined).format('MMM DD YYYY')}</span>
            </p>
            <div className='flex text-sm space-x-5 mt-1.5'>
                <p className='cursor-pointer text-gray-600' onClick={() => {navigate(`/following/${account.username}/`)}}><span className='text-white font-bold'>{account.following.length}</span> Following</p>
                <p className='cursor-pointer text-gray-600' onClick={() => {navigate(`/followers/${account.username}/`)}}><span className='text-white font-bold'>{account.followers.length}</span> Followers</p>
            </div>
        </div>
        <ul className='w-full h-12 flex mt-2.5'>
            <li className='relative w-4/12 flex justify-center items-center text-base hover:bg-gray-600 hover:bg-opacity-50' onClick={() => { handleFilter('All', `username/${account.username}`) }}>
                <span>All</span>
                {filter === 'All' && <span className={`absolute top-11 left-14 w-3/12 h-1 bg-twitter-blue rounded-full`}></span>}
            </li>
            <li className='relative w-4/12 flex items-center justify-center text-base hover:bg-gray-600 hover:bg-opacity-50' onClick={() => { handleFilter('Replies', `replies/${account.username}`) }}>
                <span>Replies</span>
                {filter==='Replies' &&<span className='absolute top-11 left-9 w-6/12 h-1 bg-twitter-blue rounded-full'></span>}
            </li>
            <li className='relative w-4/12 flex items-center justify-center text-base hover:bg-gray-600 hover:bg-opacity-50' onClick={() => { handleFilter('Transmissions', `transmissions/${account.username}`) }}>
                <span>Transmisisons</span>
                {filter==='Transmissions' &&<span className='absolute top-11 left-6 w-8/12 h-1 bg-twitter-blue rounded-full'></span>}
            </li>
            <li className='relative w-4/12 flex items-center justify-center text-base hover:bg-gray-600 hover:bg-opacity-50' onClick={() => { handleFilter('Likes', `liked/${account.username}`)}}>
                <span>Likes</span>
                {filter==='Likes' &&<span className='absolute top-11 left-12 w-4/12 h-1 bg-twitter-blue rounded-full'></span>}
            </li>
        </ul>
    </header>
    )
        
}


export default ProfileHeader;