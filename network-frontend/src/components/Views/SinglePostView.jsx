import {useState, useEffect, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

// Icon imports
import { BsArrowLeftShort } from 'react-icons/bs';

// Component imports
import NewPost from '../Posts/Post';
import OriginPost from '../Posts/OriginPost';
import Form from '../Forms/Form';


// Context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from '../../context/GeneralContext';

const SinglePostView = () => {
  const { user } = useContext(AuthContext);
  const { darkMode, posts, loading } = useContext(GeneralContext);

  const navigate = useNavigate();


  console.log(posts)
  return (
    <div className='w-5/12'> 
      <div className={`sticky flex pt-6 pb-10 h-8 items-center space-x-7 text-2xl border ${ darkMode ? 'border-gray-600 bg-black' : 'border-gray-300 bg-white'} border-l-0 border-b-0 border-t-0 bg-opacity-50 sticky top-0`}>
            <BsArrowLeftShort className='ml-3.5 text-3xl opacity-100 hover:bg-gray-900 hover:rounded-full cursor-pointer' onClick={() => { navigate(-1) }} />
            <p className='text-xl font-bold'>Post</p>
      </div>
      {posts && 
        <>
          <OriginPost post={posts[0]}/>
          {user && <Form borderStyle='border-t-0 border-l-0' textAreaStyle='bg-transparent' message={'Reply'} placeholder="Post your reply" />}
          {posts.length > 1 && posts.slice(1).map(post => <NewPost key={post.id} post={post}/>)}
        </>
      }
    </div>
  )
}

export default SinglePostView
