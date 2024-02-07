import { useContext, useRef, useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';


// Icon imports
import { MdVerified } from "react-icons/md";
import { BsArrowLeftShort } from 'react-icons/bs';

// Components imports
import NewProfileHeader from './NewProfileHeader';
import EmptyProfileHeader from './EmptyProfileHeader';
import NewPost from './NewPost';
import ErrorMessage from './ErrorMessage';
import ClipLoader from "react-spinners/ClipLoader";

// Context imports
import AuthContext from '../context/AuthContext';
import GeneralContext from '../context/GeneralContext';

const Profile = ({ me }) => {
  

  const { username } = useParams();
  const { user } = useContext(AuthContext);
  const { posts, account, error, loading, darkMode, hasMore, page, setPage} = useContext(GeneralContext);

  const profile = me ? user.username : username;

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
  }, [hasMore, page]) 

  return (
 
     <div className='relative w-[600px]'>
        {error && <EmptyProfileHeader username={username} message={error === 404 ? 'This account does not exist' : "You're blocked"}  submessage={error===404 ?'Try searching for another' : `You cant follow or see @${username}'s posts.`} />}
        { account && 
        <>
          <div className={`absolute flex items-center space-x-7 text-2xl border ${ darkMode ? 'border-gray-600 bg-black' : 'border-gray-300 bg-white'} border-l-0 border-b-0 border-t-0 bg-opacity-50 sticky top-0`}>
            <BsArrowLeftShort className='ml-3.5 text-3xl opacity-100 hover:bg-gray-900 hover:rounded-full' onClick={() => { navigate(-1) }} />
            <div className='mb-1'>
                <p className='flex items-center'>
                    <span className='font-bold'>{account.username}</span>
                    {account.verified && <MdVerified className='ml-1 text-twitter-blue' />}
                </p>
                <p className='text-gray-600 text-sm'>{account.number_of_posts} posts </p>
            </div>
        </div>
        <NewProfileHeader account={account}/>
        </>
        }
        {(posts && posts.length > 0) && posts.map((post,index) => {
         if(post.length - 1 === index) return <NewPost ref={lastPostRef} key={index} post={post}/>;
         return <NewPost key={index} post={post}/>;
        })}
        {loading && <div className='w-full mt-[10%] flex items-center justify-center'>
          <ClipLoader color={'#1D9BF0'} loading={loading} size={150} aria-label='Loading spinner' data-testid='loader'/> 
       </div>}
     </div>
    
  )
}

export default Profile;
