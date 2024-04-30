import { useState, useEffect, useContext, useRef, useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';


// Icon imports
import { MdVerified } from "react-icons/md";
import { BsArrowLeftShort } from 'react-icons/bs';

// Components imports
import ProfileHeader from './Profileheader';
import EmptyProfileHeader from '../Alerts/EmptyProfileHeader';
import NewPost from '../Posts/Post';
import ErrorMessage from '../Alerts/ErrorMessage';
import MoonLoader from "react-spinners/MoonLoader";

// Context imports
import GeneralContext from '../../context/GeneralContext';

const Profile = () => {
  

  const { username } = useParams();
  const { posts, account, error, loading, mode, hasMore, page, setPage } = useContext(GeneralContext);
  const [ blocked, setBlocked] = useState(false);

  const navigate = useNavigate();

  const observer = useRef();


  const lastPostRef = useCallback( notification => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
              if (hasMore) setPage(page + 1);
          }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, page]) 

  useEffect(() => {
   if (account) setBlocked(account.isBlocked);
  } , [account])


  return (
    
     <div className='relative w-[600px]'>
        { loading &&
        <div className='w-full h-1/2 flex items-center justify-center'>
            <MoonLoader color='#1D9BF0' size={75} loading={loading}/>
        </div>
        }
        {error && <EmptyProfileHeader username={username} message={error === 404 ? 'This account does not exist' : "You're blocked"}  submessage={error===404 ?'Try searching for another' : `You cant follow or see @${username}'s posts.`} />}
        { account && 
        <>
          <div className={`absolute flex items-center space-x-7 text-2xl border ${mode.text} ${mode.background} ${mode.separator} border-l-0 border-b-0 border-t-0 backdrop-blur bg-opacity-30 sticky top-0 z-20`}>
            <BsArrowLeftShort className={`ml-3.5 text-3xl opacity-100 hover:${mode.highlight} hover:rounded-full cursor-pointer`} onClick={() => { navigate(-1) }} />
            <div className='mb-1'>
                <p className='flex items-center'>
                    <span className='font-bold'>{account.username}</span>
                    {account.verified && <MdVerified className='ml-1 text-twitter-blue' />}
                </p>
                <p className='text-gray-600 text-sm'>{account.number_of_posts} posts </p>
            </div>
        </div>
        <ProfileHeader account={account}/>
        {(posts && posts.length > 0 && !blocked) && posts.map((post,index) => {
         if(post.length - 1 === index) return <NewPost ref={lastPostRef} key={index} post={post}/>;
         return <NewPost key={index} post={post}/>;
        })}
        { posts && posts.length === 0  && <ErrorMessage text={`Nothing to show here`} subtext={`When @${account.username} posts something, it'll show here.`}/>}
        {loading && <div className='w-full mt-[10%] flex items-center justify-center'>
          <MoonLoader color={'#1D9BF0'} loading={loading} size={75} aria-label='Loading spinner' data-testid='loader'/> 
       </div>}
       {account && blocked && 
        <div className='w-full h-[200px] flex flex-col items-center justify-center p-2.5'>
            <h3 className={`${mode.text} text-2xl font-extrabold`}>You have blocked this account.</h3>
            <p className='text-base'>Checking an account's posts does not remove them from your blocklist.</p>
            <button className={`w-28 mt-5 p-2.5 flex justify-center items-center text-white font-bold bg-${mode.color} rounded-full opacity-90 hover:opacity-100`}
            onClick={() => {setBlocked(!blocked)}}
            >See posts</button>
        </div>
       }
        </>
        }
     </div>
    
  )
}

export default Profile;
