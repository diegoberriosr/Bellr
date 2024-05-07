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

// Component imports
import DropDownMenu from '../General/DropdownMenu';
import PostImages1 from './PostImages1';
import PostImages2 from './PostImages2';
import PostImages3 from './PostImages3';
import PostImages4 from './PostImages4';


// Context imports
import GeneralContext from '../../context/GeneralContext';


const OriginPost = ({ post, handleAction, postView }) => {

    const { mode, handleLike, handleTransmit } = useContext(GeneralContext);

    const navigate = useNavigate();

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

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`bellr-alpha.vercel.app/post/1`)
    };


    return <div className={`border border-t-0 border-l-0 border-b-0 ${mode.separator} w-full cursor-pointer animate-grow`}>
        {post.transmission && <p className='flex items-center mt-3 ml-10 text-sm text-gray-700'>
            <FaRetweet />
            <span className='ml-2'>{post.transmitter.username} reposted</span>
        </p>}
        {
            post.reply && <p className='flex items-center mt-3 ml-10 text-sm text-gray-700'>
                <FaRetweet />
                <span className='ml-2'>{post.user.username} replied to {post.origin.username}</span>
            </p>
        }
            <aside className={`flex items-center ${post.transmission || post.reply ? 'mt-0.5' : ''} ml-4`}>
                <div className='w-10 h-10 overflow-hidden rounded-full'>
                    <img src={post.user.pfp} className='w-full h-full object-cover' alt='profile pic' />
                </div>
                <div className='w-full ml-2'>
                    <div className='flex h-4 items-center'>
                    <p className='font-bold hover:underline' onClick={() => { navigate(`/user/${post.user.username}`) }}>{post.user.profilename}</p>
                    {post.user.verified && <MdVerified className='text-twitter-blue ml-0.5' />}
                    <DropDownMenu  author_id={post.user.user_id} post={post}/>
                    </div>
                    <p className='text-twitter-light-gray'>@{post.user.username}</p>
                </div>
            </aside>
            <main className={`w-9/12 ${post.transmission || post.reply ? 'mt-0' : 'mt-2.5'} p-1 pl-4 text-base w-full`}>
                <div className='mt-[3px]'>
                    {contentWithSpaces}
                </div>
                <p className='text-sm text-gray-600 mt-3'>{formatDate(post.timestamp)}</p>
            </main>
            { post.images &&
                <div className={`mt-2 flex flex-row w-[98%] h-6/12 pl-2.5`}>
                   { post.images.length === 1 && <PostImages1 sources={post.images}/> }
                   { post.images.length === 2 && <PostImages2 sources={post.images}/> }
                   { post.images.length === 3 && <PostImages3 sources={post.images}/> }
                   { post.images.length >= 4 &&  <PostImages4 sources={post.images}/> }
                </div>
            }
            <footer className='px-3.5'>
                <ul className={`flex items-center mt-3 mb-1.5 text-twitter-light-gray border ${mode.separator} border-l-0 border-r-0 h-10 transition-colors duration-500`}>
                    <div className='w-full flex items-center justify-between ml-2.5'>
                        <li className='group flex items-center space-x-1'>
                            <FaRegComment className='group-hover:bg-blue-300 group-hover:text-blue-600 group-hover:rounded-full duration-300 cursor-pointer text-[19px]' />
                            <span className='group-hover:text-blue-600 transition-colors cursor-default text-xs'>{post.replies > 0 && post.replies}</span>
                        </li>
                        <li className='group flex items-center space-x-1'>
                            <FaHeart className={`${post.liked? 'text-red-600' : 'text-gray-600'} group-hover:bg-red-300 group-hover:text-red-600 group-hover:rounded-full peer duration-300 cursor-pointer text-[15px]`} onClick={() => { handleLike(post.id)}} />
                            <span className={`${post.liked ? 'text-red-600' : ''} w-2 group-hover:text-red-600 transition-colors cursor-default text-xs`}>{post.likes> 0 && post.likes}</span>
                        </li>
                        <li className='group flex items-center space-x-1'>
                            <FaRetweet className={`${post.transmitted ? 'text-green-600' : 'text-gray-600'} group-hover:bg-green-300 group-hover:text-green-600 group-hover:rounded-full peer duration-300 cursor-pointer text-[19px]`} onClick={() => { handleTransmit(post.id) }} />
                            <span className='group-hover:text-green-600 transition-colors cursor-default text-xs'>{post.transmissions> 0 && post.transmissions}</span>
                        </li>
                        <li>
                            <IoBookmarkOutline className={`${post.bookmarked ? 'text-purple-600' : 'text-gray-600'} hover:bg-purple-300 hover:text-purple-600 hover:rounded-full peer duration-300 cursor-pointer text-[19px]`} onClick={() => { handleTransmit(post.id) }} />
                        </li>
                        <li className='mr-2.5'>
                            <FiShare2 className='hover:bg-blue-300 hover:text-blue-600 hover:rounded-full duration-300 text-[15px]' onClick={handleCopyLink}/>
                        </li>
                    </div>
                </ul>
            </footer>
        </div>
}


export default memo(OriginPost);