// Icon imports
import { MdVerified } from "react-icons/md";
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt } from "react-icons/fa";


// Context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from "../../context/GeneralContext";

import moment from "moment";
import axios from 'axios';

const ProfileHeader = ({ account }) => {
    
    const [ filter, setFilter ] = useState('All');

    const { user, authTokens } = useContext(AuthContext);
    const { mode, handleImageModal, setPfpBig, handleFollow, handleBlock, setPosts, setPage, setLoading, handleProfileModal} = useContext(GeneralContext);

    const navigate = useNavigate()
    
    console.log(account);

    const handleFilter = (url, updatedFilter) => {
        setLoading(true);
        let headers;
        
        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        };

        axios({
            url : `http://127.0.0.1:8000/${url}`,
            method : 'GET',
            headers: headers
        })
        .then( res => {
            setPosts(res.data.posts);
            setPage(1);
            setFilter(updatedFilter);
            setLoading(false);
        })
    }



    return (
        <header className={`border ${mode.separator} border-l-0 w-full`}>
        <figure className='relative h-44 w-full '>
            <div className='absolute h-full w-full z-10'>
                <img src={account.background} alt="user's background pic" className='absolute top-0 w-full h-full object-cover' />
            </div>
            <div className={`absolute left-3 -bottom-16 w-[130px] h-[130px] rounded-full border ${mode.background} border-${mode.background} border-[3.5px] z-10`}>
                <img src={account.pfp} alt="user's profile pic" width='130' className='object-cover w-full h-full rounded-full cursor-pointer' onClick={() => {setPfpBig(account.pfp) ; handleImageModal()}} />
            </div>
            <div className='absolute -bottom-10 right-3 flex items-center space-x-2'>
                    {
                        user && user.username === account.username ? 
                        <button className={` w-[100px] h-8 flex items-center justify-center text-${mode.background} bg-${mode.subColor} opacity-90 hover:opacity-100 rounded-full font-bold`}
                        onClick={() => { handleProfileModal() }}>Edit</button>
                        :
                        <button className={`border ${ account.isBlocked ? 'bg-red-900 border-red-900 bg-opacity-30 text-red-900 hover:bg-transparent hover:border-twitter-blue hover:text-twitter-blue' : `border border-${mode.subColor}  ${mode.text} hover:border-red-900 hover:bg-red-900 hover:bg-opacity-30 hover:text-red-900`} w-[100px] h-8 flex items-center justify-center rounded-full p-2.5 font-bold transition-colors `} onClick={() => {handleBlock(account.username)}}>
                        { account.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    }
                    { (user && user.username !== account.username && !account.isBlocked) &&
                    <button className={`w-[100px] h-8 flex items-center justify-center rounded-full p-2.5 font-bold 
                    ${account.followed ? `bg-transparent border ${mode.text} border-${mode.subColor} hover:border-red-900 hover:text-red-900` 
                    : `border border-${mode.subColor} ${mode.text}`} transition-colors`}
                    onClick={() => { handleFollow(account.user_id)}}>{account.followed ? 'Unfollow' : 'Follow' }</button>
                    }
                </div>
        </figure>
        <div className='px-4 pt-20'>
            <h3 className='text-2xl font-bold flex items-center'>{account.profilename} {account.verified && <MdVerified className='ml-0.5 text-twitter-blue'/>}</h3>
            <p className='text-base text-gray-600'>@{account.username}</p>
            <p className='mt-2.5 text-base'>{account.bio}</p>
            <p className='flex items-center text-gray-600 mt-1.5'>
                <FaRegCalendarAlt />
                <span className='ml-1'>Joined on {moment(account.date_joined).format('MMM DD YYYY')}</span>
            </p>
            <div className='flex text-sm space-x-5 mt-1.5'>
                <p className={`cursor-pointer ${mode.text}`} onClick={() => {navigate(`/following/${account.username}/`)}}><span className='font-bold'>{account.following}</span> Following</p>
                <p className={`cursor-pointer ${mode.text}`} onClick={() => {navigate(`/followers/${account.username}/`)}}><span className='font-bold'>{account.followers}</span> Followers</p>
            </div>
        </div>
        <ul className='w-full h-12 flex mt-2.5'>
            <li className={`relative w-4/12 flex items-center justify-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleFilter(`user/${account.username}`, 'All') }}>
                <span>All</span>
                {filter === 'All' && <span className={`absolute top-11 left-9 w-6/12 h-1 bg-${mode.color} rounded-full`}></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleFilter(`posts/replies/${account.username}`, 'Replies') }}>
                <span>Replies</span>
                {filter==='Replies' &&<span className={`absolute top-11 left-9 w-6/12 h-1 bg-${mode.color} rounded-full`}></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleFilter(`posts/transmissions/${account.username}`, `Transmissions`) }}>
                <span>Transmisisons</span>
                {filter==='Transmissions' &&<span className={`absolute top-11 left-9 w-6/12 h-1 bg-${mode.color} rounded-full`}></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleFilter(`posts/liked/${account.username}`, 'Likes')}}>
                <span>Likes</span>
                {filter==='Likes' &&<span className={`absolute top-11 left-9 w-6/12 h-1 bg-${mode.color} rounded-full`}></span>}
            </li>
        </ul>
    </header>
    )
        
}


export default ProfileHeader;