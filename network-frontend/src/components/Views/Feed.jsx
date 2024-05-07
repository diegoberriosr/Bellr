import { useContext, useCallback, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// Component imports
import Form from '../Forms/Form';
import NewPost from '../Posts/Post';
import ErrorMessage from '../Alerts/ErrorMessage';
import MoonLoader from "react-spinners/MoonLoader";

// Context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from '../../context/GeneralContext';




const Feed = ({ form, loginRequired}) => {

  const { user } = useContext(AuthContext);
  const { mode, posts, hasMore, loading, setPage} = useContext(GeneralContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (loginRequired && !user) {
    navigate('/login');
  };

  const observer = useRef();
  const lastPostRef = useCallback( post => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (hasMore) setPage( prevPage => {return prevPage + 1})
      }
    })

    if (post) observer.current.observe(post);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  return (
    <div className='w-screen w-[600px] min-h-screen transition-all'>
       <div className={`flex items-center space-x-7 text-xl border ${mode.separator} border-l-0 border-t-0 ${mode.background} bg-opacity-50 sticky top-0 z-[30] backdrop-blur`}>
            <div className='mt-1 ml-4 mb-1'>
                <h3 className='font-bold' >{location.pathname.slice(0).charAt(1).toUpperCase() + location.pathname.slice(2)}</h3>
                <p className={`text-twitter-light-gray text-sm mt-0`}>
                  { !user && 'Log in to discover more'}
                  { location.pathname === '/bookmarked' && user &&  `@${user && user.username}` }
                  { location.pathname === '/home' && user && 'Explore new posts' }
                  { location.pathname === '/feed' && user && 'Your feed' }
          
                  </p>
            </div>
        </div>

       {(form && user)  &&
       <Form route='new' method='POST'  borderStyle={`border-l-0 ${mode.separator}`} textAreaStyle='bg-transparent' message='Post' placeholder="What's happening !?"/> 
      }
       {(posts && posts.length > 0) && posts.map((post,index) => {
       if (posts.length - 1 === index) return <NewPost ref={lastPostRef} key={index} post={post}/>;
       return <NewPost key={index} post={post}/>})}
       {(posts && posts.length === 0) && <ErrorMessage text='No posts to show here' subtext='When something appears, it will show here.'/>}
       {loading && <div className='w-full mt-[25%] flex items-center justify-center'>
          <MoonLoader color={mode.spinnerColor} loading={loading} size={75} data-testid='loader'/> 
       </div>}
    </div>
  )
}

export default Feed
