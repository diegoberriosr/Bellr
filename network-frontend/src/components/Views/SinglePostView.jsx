import {useContext} from 'react';
import { useNavigate } from 'react-router-dom'

// Icon imports
import { BsArrowLeftShort } from 'react-icons/bs';

// Component imports
import NewPost from '../Posts/Post';
import OriginPost from '../Posts/OriginPost';
import Form from '../Forms/Form';
import MoonLoader from 'react-spinners/MoonLoader';

// Context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from '../../context/GeneralContext';

const SinglePostView = () => {
  const { user } = useContext(AuthContext);
  const { mode, posts, loading } = useContext(GeneralContext);

  const navigate = useNavigate();

  const hoverBg = `hover:${mode.highlight}`;

  return (
    <div className='w-screen min-h-screen sm:w-5/12'> 
      <div className={`sticky flex pt-6 pb-10 h-8 items-center space-x-7 text-2xl border ${hoverBg} ${mode.separator} bg-${mode.background} border-l-0 ${ loading ? '' : 'border-b-0'} border-t-0 bg-opacity-50 sticky top-0`}>
            <BsArrowLeftShort className='ml-3.5 text-3xl opacity-100  hover:rounded-full cursor-pointer' onClick={() => { navigate(-1) }} />
            <p className='text-xl font-bold'>Post</p>
      </div>
      
      { loading  ?
        <div className='w-full flex justify-center mt-5'>
          <MoonLoader loading={loading} color='#1D9BF0' size={75}/>
        </div> 
        :
        <>
          <OriginPost post={posts[0]}/>
          {user && <Form replying={true} borderStyle='border-t-0 border-l-0' textAreaStyle='bg-transparent' message={'Reply'} placeholder="Post your reply" replyId={posts[0].id} />}
          {posts.length > 1 && posts.slice(1).map(post => <NewPost key={post.id} post={post}/>)}
        </>
      }
    </div>
  )
}

export default SinglePostView
