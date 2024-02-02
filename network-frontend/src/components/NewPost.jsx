import { useContext, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'

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
import DropDownMenu from './DropdownMenu';

// Context imports
import AuthContext from '../context/AuthContext';
import GeneralContext from '../context/GeneralContext';


const NewPost = ({ post, handleAction, postView }) => {

    const { user, authTokens } = useContext(AuthContext);
    const { darkMode } = useContext(GeneralContext);

    const navigate = useNavigate();

    // Controls UI according to the post's information
    const status = {
        'like': user ? post.likes.some(id => user.user_id === id) : undefined,
        'transmit': user ? post.transmissions.some(id => id === user.user_id) : undefined,
        'bookmark': user ? post.bookmarks.some(id => user.user_id === id) : undefined,
        'follow': user ? post.user.followers.some(follower => user.user_id === follower.user_id) : undefined
    }


    const formatDate = () => {

        const difference = moment().utc().diff(post.timestamp, 'days'); // Check the time distance between current time and the post's timestamp

        if (difference < 7) { // Output result in 'X time ago') if difference is less than 7 days
            return moment.utc(post.timestamp).fromNow();
        }

        return moment.utc(post.timestamp).format('YYYY-MM-DD'); // Otherwise output in standard calendar format
    }

    // Mention's functionality
    const regex = /@[a-zA-Z0-9_]+/; // Search for a mention inside a post
    const parsedContent = post.content.split(' ').map(word => regex.test(word) ? <span key={word} className='text-twitter-blue hover:underline cursor-pointer' onClick={() => { navigate(`/${word.slice(1)}`) }}>{word}</span> : word); // Parse it's content
    const contentWithSpaces = parsedContent.reduce((prev, curr, i) => { // Transform it into an HTML element
        return [...prev, curr, ' '];
    }, []);

   
    
    return <div className={`border border-t-0 border-l-0 ${ darkMode ? 'border-gray-600' : 'border-gray-300'} w-full cursor-pointer`}>
        {post.transmission && <p className='flex items-center pt-1.5 ml-10 text-sm text-info-gray'>
            <FaRetweet />
            <span className='ml-2'>{post.transmitter} reposted</span>
        </p>}
        {
            post.reply && <p className='flex items-center pt-1.5 ml-10 text-sm text-info-gray'>
                <FaReplyAll />
                <span className='ml-2'>{post.user.username} replied to {post.origin.username}</span>
            </p>
        }
        {
            post.pinned && <p className='flex items-center pt-1.5 ml-10 text-sm text-info-gray'>
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
            <main className={`w-[90%] ${post.transmission || post.reply ? 'mt-0' : 'mt-2.5'} p-1 pl-3 text-base w-full`}>
                <div className='flex h-4 items-center'>
                    <p className='font-bold hover:underline' onClick={() => { navigate(`/user/${post.user.username}`) }}>{post.user.profilename}</p>
                    {post.user.verified && <MdVerified className='text-twitter-blue ml-0.5' />}
                    <p className='text-post-gray ml-1.5'>@{post.user.username}</p>
                    <p className='text-post-gray ml-1'>·</p>
                    <p className='text-post-gray ml-1'>{formatDate()}</p>
                    <DropDownMenu followed={status.follow} author_id={post.user.user_id} post={post} handleAction={handleAction} />
                </div>
                <p className='w-full mt-[3px] overflow-hidden pr-5 whitespace-normal'>
                    {contentWithSpaces}
                </p>
                <footer className='w-full'>
                    <ul className='flex items-center mt-3 mb-1.5 text-twitter-light-gray'>
                        <div className='flex w-6/12 items-center justify-between'>
                            <li className='group flex items-center space-x-1 text-icon-gray'>
                                <FaRegComment className='group-hover:bg-blue-300 group-hover:text-blue-600 group-hover:rounded-full duration-300 cursor-pointer text-[19px]' onClick={() => { navigate(`/post/${post.reply ? post.origin.id : post.id}`)}}/>
                                <span className='group-hover:text-blue-600 transition-colors cursor-default text-xs'>{post.replies > 0 && post.replies}</span>
                            </li>
                            <li className='group flex items-center space-x-1'>
                                {status.like ?
                                    <FaHeart className={`text-red-600 group-hover:bg-red-300 group-hover:text-red-600 group-hover:rounded-full peer duration-300 cursor-pointer text-[15px]`} onClick={() => { handleAction(`like/${post.id}`, 'PUT', authTokens, undefined) }} />
                                    :
                                    <CiHeart className='group-hover:bg-red-300 group-hover:text-red-600 group-hover:rounded-full peer duration-300 cursor-pointer text-[18px]' onClick={() => { handleAction(`like/${post.id}`, 'PUT', authTokens, undefined) }}/>
                                }
                                
                                <span className={`${status.like ? 'text-red-600' : ''} w-2 group-hover:text-red-600 transition-colors cursor-default text-xs`}>{post.likes.length > 0 && post.likes.length}</span>
                            </li>
                            <li className='group flex items-center space-x-1'>
                                <FaRetweet className={`${status.transmit ? 'text-green-600' : 'text-icon-gray'} group-hover:bg-green-300 group-hover:text-green-600 group-hover:rounded-full peer duration-300 cursor-pointer text-[19px]`} onClick={() => { handleAction(`transmit/${post.id}`, 'PUT', authTokens, undefined) }} />
                                <span className='w-2 group-hover:text-green-600 transition-colors cursor-default text-xs'>{post.transmissions.length > 0 && post.transmissions.length}</span>
                            </li>
                        </div>
                        <div className='flex items-center space-x-3 mr-2.5 ml-auto'>
                            { status.bookmark ?
                            <FaBookmark className={`text-twitter-blue hover:bg-twitter-blue hover:bg-opacity-50 hover:rounded-full peer duration-300 cursor-pointer text-[19px]`} onClick={() => { handleAction(`bookmark/${post.id}`, 'PUT', authTokens, undefined) }} />
                            :
                            <IoBookmarkOutline className='hover:bg-twitter-blue hover:bg-opacity-50 hover:text-twitter-blue hover:rounded-full peer duration-300 cursor-pointer text-[19px]' onClick={() => { handleAction(`bookmark/${post.id}`, 'PUT', authTokens, undefined) }}/>
                                
                            }
                            <FiShare2 className='hover:bg-blue-300 hover:text-blue-600 hover:rounded-full duration-300 text-[15px]' />
                        </div>
                    </ul>
                </footer>
            </main>
        </div>
    </div>
}


export default memo(NewPost);