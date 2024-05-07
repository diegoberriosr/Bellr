// Icon imports
import { MdVerified } from "react-icons/md";
import { useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuLink } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";

// Component imports
import FormattedContent from "../Posts/FormattedContent";

// Context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from "../../context/GeneralContext";

import moment from "moment";
import axios from 'axios';

const ProfileHeader = ({ account }) => {
    
    const [ filter, setFilter ] = useState('All');

    const { user, authTokens } = useContext(AuthContext);
    const { mode, handleImageModal, setPfpBig, handleFollow, handleBlock, setPosts, setPage, setLoading, handleProfileModal} = useContext(GeneralContext);

    let ringColor;
    let bgColor;
    let subColor;

    if ( mode.background === 'white') 
    {
        ringColor = 'border-white';
        bgColor = 'bg-black';
        subColor = 'text-white';
    }

    else if ( mode.background === 'dim') {
        ringColor = 'border-dim';
        bgColor = 'bg-white';
        subColor = 'text-dim';
    }

    else {
        ringColor = 'border-black';
        bgColor = 'bg-white';
        subColor='text-black';

    }
    const navigate = useNavigate()
    

    const handleFilter = (url, updatedFilter) => {
        setPosts(null);
        setLoading(true);
        let headers;
        
        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        };

        axios({
            url : `https://bellr.onrender.com/${url}`,
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
            <div className={`absolute left-3 -bottom-16 w-[130px] h-[130px] rounded-full border ${mode.background} ${ringColor} border-[3.5px] z-10`}>
                <img src={account.pfp} alt="user's profile pic" width='130' className='object-cover w-full h-full rounded-full cursor-pointer' onClick={() => {setPfpBig(account.pfp) ; handleImageModal()}} />
            </div>
            <div className='absolute -bottom-10 right-3 flex items-center space-x-2'>
                    {
                        user && user.username === account.username &&
                        <button className={` w-[100px] h-8 flex items-center justify-center ${subColor} ${bgColor} opacity-90 hover:opacity-100 rounded-full font-bold`}
                        onClick={() => { handleProfileModal() }}>Edit</button>
                    }
                    { (user && user.username !== account.username && !account.isBlocked) &&
                    <>
                        <button className={`border ${ account.isBlocked ? 'bg-red-900 border-red-900 bg-opacity-30 text-red-900 hover:bg-transparent hover:border-twitter-blue hover:text-twitter-blue' : `border border-${mode.subColor}  ${mode.text} hover:border-red-900 hover:bg-red-900 hover:bg-opacity-30 hover:text-red-900`} w-[100px] h-8 flex items-center justify-center rounded-full p-2.5 font-bold transition-colors `} onClick={() => {handleBlock(account.username)}}>
                        { account.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                        <button className={`w-[100px] h-8 flex items-center justify-center rounded-full p-2.5 font-bold 
                        ${account.followed ? `bg-transparent border ${mode.text} border-${mode.subColor} hover:border-red-900 hover:text-red-900` 
                        : `border border-${mode.subColor} ${mode.text}`} transition-colors`}
                        onClick={() => { handleFollow(account.user_id)}}>{account.followed ? 'Unfollow' : 'Follow' }</button>
                    </>
                    }
                </div>
        </figure>
        <div className='px-4 pt-20'>
            <h3 className='text-2xl font-bold flex items-center'>{account.profilename} {account.verified && <MdVerified className='ml-0.5 text-twitter-blue'/>}</h3>
            <p className='text-base text-gray-600'>@{account.username}</p>
            <div className='mt-2.5 text-base'>
                <FormattedContent content={account.bio}/>
            </div>
            <div className='flex items-center space-x-[2%] text-gray-600 mt-1.5 w-full'>
                <div className='flex items-center'>
                    <FaRegCalendarAlt />
                    <span className='ml-1'>Joined on {moment(account.date_joined).format('MMM DD YYYY')}</span>
                </div>
                { account.website && <div className='flex items-center max-w-[45%] truncate'>
                    <LuLink/>
                    <a href={account.website} className='ml-1 text-twitter-blue hover:underline cursor-pointer'>{account.website}</a>
                    </div>}
                { account.location && <div className='flex max-w-[45%] truncate items-center'>
                    <MdLocationOn/>
                    <span  className='ml-1 max-w-[30%]'>{account.location}</span>
                    </div>}
            </div>
            <div className='flex text-sm space-x-5 mt-1.5'>
                <p className={`cursor-pointer ${mode.text}`} onClick={() => {navigate(`/following/${account.username}/`)}}><span className='font-bold'>{account.following}</span> Following</p>
                <p className={`cursor-pointer ${mode.text}`} onClick={() => {navigate(`/followers/${account.username}/`)}}><span className='font-bold'>{account.followers}</span> Followers</p>
            </div>
        </div>
        <ul className='w-full h-12 flex mt-2.5 cursor-pointer'>
            <li className={`relative w-4/12 flex items-center justify-center text-xs mobile:text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleFilter(`user/${account.username}`, 'All') }}>
                <span>All</span>
                {filter === 'All' && <span className={`absolute top-11 mr-auto ml-auto w-6/12 h-1 bg-${mode.color} rounded-full`}></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-xs mobile:text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleFilter(`posts/replies/${account.username}`, 'Replies') }}>
                <span>Replies</span>
                {filter==='Replies' &&<span className={`absolute top-11 mr-auto ml-auto w-6/12 h-1 bg-${mode.color} rounded-full`}></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-xs mobile:text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleFilter(`posts/transmissions/${account.username}`, `Transmissions`) }}>
                <span>Transmisisons</span>
                {filter==='Transmissions' &&<span className={`absolute top-11 mr-auto ml-auto w-10/12 h-1 bg-${mode.color} rounded-full`}></span>}
            </li>
            <li className={`relative w-4/12 flex items-center justify-center text-xs mobile:text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { handleFilter(`posts/liked/${account.username}`, 'Likes')}}>
                <span>Likes</span>
                {filter==='Likes' &&<span className={`absolute top-11 mr-auto ml-auto w-6/12 h-1 bg-${mode.color} rounded-full`}></span>}
            </li>
        </ul>
    </header>
    )
        
}


export default ProfileHeader;