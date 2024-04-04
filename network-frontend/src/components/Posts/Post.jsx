/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, memo, forwardRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {formatDate} from '../../utils';

// Icon imports
import { MdVerified } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";
import { FaRetweet } from "react-icons/fa6";
import { IoBookmarkOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { FiShare2 } from "react-icons/fi";
import { FaReplyAll } from "react-icons/fa";
import { TbPinnedFilled } from "react-icons/tb";
import { CiHeart } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";

// Component imports
import DropDownMenu from '../General/DropdownMenu';
import FormattedContent from './FormattedContent';
import PostImages1 from './PostImages1';
import PostImages2 from './PostImages2';
import PostImages3 from './PostImages3';
import PostImages4 from './PostImages4';

// Context imports
import GeneralContext from '../../context/GeneralContext';


const Post = forwardRef(({ post, setPosts }, ref) => {

    const { handleLike, handleBookmark, handleTransmit, openInteractionsModal, mode, handleDelete } = useContext(GeneralContext);
    const [ deleting, setDeleting ] = useState(false);
    const navigate = useNavigate();

    // Added for solving a non-changing background color bug when the post is hovered 
    const hoverColors = {
        'bg-light-highlight': 'hover:bg-light-highlight',
        'bg-dim-post-highlight' : 'hover:bg-dim-post-highlight',
        'bg-dark-highlight' : 'hover:bg-dark-highlight'
    }
    
    const hoverClass = hoverColors[mode.highlight];
    //------------------------------------------------------------------------------------


    useEffect( () => {
        if (deleting) {
            const timer = setTimeout( () => {   
                handleDelete(post.id);
                setDeleting(false);
            }, 200)

            return () => clearTimeout(timer);
        };
    }, [deleting])

    return <div ref={ref} className={`border border-t-0 border-l-0 ${mode.separator} ${hoverClass} w-full cursor-pointer transition-colors duration-500 ${ deleting ? 'animate-element-shrink' : 'animate-grow'}`}>
        {post.transmission && <p className='flex items-center pt-1.5 ml-10 fold:text-xs sm:text-sm max-w-full truncate text-info-gray'>
            <FaRetweet />
            <span className='ml-2'>{post.transmitter.username} reposted</span>
        </p>}
        {
            post.reply && <p className='flex items-center pt-1.5 ml-10 text-xs sm:text-sm max-w-[95%] truncate text-info-gray'>
                <FaReplyAll />
                <span className='ml-2'>{post.user.username} replied to {post.origin.username}</span>
            </p>
        }
        {
            post.pinned && <p className='flex items-center pt-1.5 ml-10 fold:text-xs sm:text-sm max-w-full truncate text-info-gray'>
            <TbPinnedFilled />
            <span className='ml-2'>Pinned</span>
        </p>
        }
        <div className='flex'>
            <aside className={`${post.transmission || post.reply ? 'mt-0.5' : 'mt-3'} ml-4`}>
                <div className='w-10 h-10 overflow-hidden rounded-full'>
                    <img src={post.user.pfp} className='h-full w-full object-fit' alt='profile pic' />
                </div>
            </aside>
            <main className={`w-[90%] ${post.transmission || post.reply ? 'mt-0' : 'mt-2.5'} p-1 pl-3 text-xs sm:text-sm md:text-base w-full`}>
                <div className='relative max-w-full flex h-4 items-center'>
                    <p className='font-bold hover:underline max-w-[30%] mobile:max-w-[45%] sm:max-w-[30%] md:max-w-[30%] truncate' onClick={() => { navigate(`/user/${post.user.username}`) }}>{post.user.profilename}</p>
                    {post.user.verified && <MdVerified className='text-twitter-blue ml-0.5' />}
                    <p className='text-post-gray ml-1 hidden fold:block mobile:max-w-[30%] sm:max-w-[30%] md:max-w-[30%] truncate'>@{post.user.username}</p>
                    <p className='text-post-gray ml-1'>·</p>
                    <p className='text-post-gray ml-1 mobile:max-w-[10%] sm:max-w-[30%] truncate'>{formatDate(post)}</p>
                    <DropDownMenu followed={post.followed} author_id={post.user.user_id} post={post} setPosts={setPosts} setDeleting={setDeleting}/>
                </div>
                <FormattedContent content={post.content}/>
                { post.images &&
                <div className={`mt-2 flex flex-row w-[98%] h-6/12`}>
                   { post.images.length === 1 && <PostImages1 sources={post.images}/> }
                   { post.images.length === 2 && <PostImages2 sources={post.images}/> }
                   { post.images.length === 3 && <PostImages3 sources={post.images}/> }
                   { post.images.length >= 4 &&  <PostImages4 sources={post.images}/> }
                </div>
                }
                <footer className='w-full'>
                    <ul className='flex items-center my-3 text-twitter-light-gray'>
                        <div className='flex w-6/12 items-center justify-between'>
                            <li className='group flex items-center space-x-1 text-icon-gray'>
                                <FaRegComment className='group-hover:bg-blue-300 group-hover:text-blue-600 group-hover:rounded-full duration-300 cursor-pointer text-[19px]' onClick={() => { navigate(`/post/${post.reply ? post.origin.id : post.id}`)}}/>
                                <span className='group-hover:text-blue-600 transition-colors cursor-default text-xs'>{post.replies > 0 && post.replies}</span>
                            </li>
                            <li className='group flex items-center space-x-1'>
                                {post.liked ?
                                    <FaHeart className={`text-red-600 group-hover:bg-red-300 group-hover:text-red-600 group-hover:rounded-full peer duration-300 cursor-pointer text-[15px]`} onClick={() => {handleLike(post.id)}} />
                                    :
                                    <CiHeart className='text-icon-gray group-hover:bg-red-300 group-hover:text-red-600 group-hover:rounded-full peer duration-300 cursor-pointer text-[18px]' onClick={() => {handleLike(post.id)}}/>
                                }
                                
                                <span className={`${post.liked ? 'text-red-600' : 'text-icon-gray'} w-2 group-hover:text-red-600 transition-colors cursor-default text-xs`} onClick={() => {openInteractionsModal(post, 'likes')}}>{post.likes> 0 && post.likes}</span>
                            </li>
                            <li className='group flex items-center space-x-1'>
                                <FaRetweet className={`${post.transmitted ? 'text-green-600' : 'text-icon-gray'} group-hover:bg-green-300 group-hover:text-green-600 group-hover:rounded-full peer duration-300 cursor-pointer text-[19px]`} onClick={() => {handleTransmit(post.id)}} />
                                <span className='w-2 group-hover:text-green-600 transition-colors cursor-default text-xs' onClick={() => {openInteractionsModal(post, 'transmissions')}}>{post.transmissions > 0 && post.transmissions}</span>
                            </li>
                        </div>
                        <div className='flex items-center space-x-3 mr-2.5 ml-auto'>
                            { post.bookmarked ?
                            <FaBookmark className={`text-twitter-blue hover:bg-twitter-blue hover:bg-opacity-50 hover:rounded-full peer duration-300 cursor-pointer text-[19px]`} onClick={() => {handleBookmark(post.id)}} />
                            :
                            <IoBookmarkOutline className='text-icon-gray hover:bg-twitter-blue hover:bg-opacity-50 hover:text-twitter-blue hover:rounded-full peer duration-300 cursor-pointer text-[19px]' onClick={() => {handleBookmark(post.id)}}/>
                                
                            }
                            <FiShare2 className='text-icon-gray hover:bg-blue-300 hover:text-blue-600 hover:rounded-full duration-300 text-[15px]' />
                        </div>
                    </ul>
                </footer>
            </main>
        </div>
    </div>
})


export default memo(Post);