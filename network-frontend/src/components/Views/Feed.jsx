import { useContext, useCallback, useRef} from 'react';


// Component imports
import Form from '../Forms/Form';
import NewPost from '../Posts/Post';
import ErrorMessage from '../Alerts/ErrorMessage';
import ClipLoader from "react-spinners/ClipLoader";

// Context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from '../../context/GeneralContext';

const Feed = ({ form,  url, loginRequired}) => {

  const { user } = useContext(AuthContext);
  const { mode, posts, hasMore, loading, setPage} = useContext(GeneralContext);

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
    <div className='w-screen mobile:w-[600px] min-h-screen transition-all'>
       {(form && user)  &&
       <Form route='new' method='POST'  borderStyle={`border-l-0 ${mode.separator}`} textAreaStyle='bg-transparent' message='Post' placeholder="What's happening !?"/> 
      }
      { !form && user &&
       <div className={`flex items-center space-x-7 text-xl border ${mode.separator} border-l-0 border-t-0 ${mode.background} bg-opacity-50 sticky top-0`}>
            <div className='mt-1 ml-4 mb-1'>
                <h3 className='font-bold' >Bookmarks</h3>
                <p className='text-gray-600 text-sm mt-0'>@{user && user.username}</p>
            </div>
        </div>
       }
       {(posts && posts.length > 0) && posts.map((post,index) => {
    
       if (posts.length - 1 === index) return <NewPost ref={lastPostRef} key={index} post={post}/>;
       return <NewPost key={index} post={post}/>})}
       {(posts && posts.length === 0) && <ErrorMessage text='No posts to show here' subtext='When something appears, it will show here.'/>}
       {loading && <div className='w-full mt-[25%] flex items-center justify-center'>
          <ClipLoader color={'#1D9BF0'} loading={loading} size={150} aria-label='Loading spinner' data-testid='loader'/> 
       </div>}
    </div>
  )
}

export default Feed
