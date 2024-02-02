import {useState, useEffect, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

// Icon imports
import { BsArrowLeftShort } from 'react-icons/bs';

// Component imports
import NewPost from './NewPost';
import OriginPost from './OriginPost';
import Form from './Form';


// Context imports
import AuthContext from '../context/AuthContext';
import GeneralContext from '../context/GeneralContext';

const SinglePostView = () => {
  const [posts, setPosts] = useState(undefined);
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(GeneralContext);

  const navigate = useNavigate();

  const getPost = () => {
    console.log(`http://127.0.0.1:8000/posts/${(postId)}`)
    fetch(`http://127.0.0.1:8000/posts/${(postId)}`, {
        method : 'GET',
        headers : {
            'Content-type' : 'application/json'
        }
    })
    .then(response => response.json())
    .then(posts => {
        setPosts(posts)
    })
  }

    // Handles like, comment, retweet, delete, edit, and bookmark actions
    const handleAction = (url, method, authTokens, body) => { 
        console.log('Calling feed function')
        fetch(`http://127.0.0.1:8000/${url}`, {
          method: method,
          headers : {
            'Content-type' : 'application/json',
            'Authorization' : 'Bearer ' + String(authTokens.access)
          },
          body : JSON.stringify(body)
        })
        .then(response => response.json())
        .then( () => {
            getPost();
        })
        .catch(error => {console.log(error)})
      };
  
      
  useEffect(() => {
    getPost();
  } , [postId])

  console.log(posts)
  return (
    <div className='w-5/12'> 
      <div className={`sticky flex pt-6 pb-10 h-8 items-center space-x-7 text-2xl border ${ darkMode ? 'border-gray-600 bg-black' : 'border-gray-300 bg-white'} border-l-0 border-b-0 border-t-0 bg-opacity-50 sticky top-0`}>
            <BsArrowLeftShort className='ml-3.5 text-3xl opacity-100 hover:bg-gray-900 hover:rounded-full cursor-pointer' onClick={() => { navigate(-1) }} />
            <p className='text-xl font-bold'>Post</p>
      </div>
      {posts && 
        <>
          <OriginPost handleAction={handleAction} post={posts.origin}/>
          {user && <Form route={`new/reply/${posts.origin.id}`} method='POST' borderStyle='border-t-0 border-l-0' textAreaStyle='bg-transparent' message={'Reply'} placeholder="Post your reply" handleAction={handleAction}/>}
          {posts.replies.map(post => <NewPost key={post.id} post={post} handleAction={handleAction}/>)}
        </>
      }
    </div>
  )
}

export default SinglePostView
