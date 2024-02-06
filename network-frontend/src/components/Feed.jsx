import { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import useSearch from '../useSearch';

// Component imports
import Form from './Form';
import NewPost from './NewPost';
import ErrorMessage from './ErrorMessage';
import ClipLoader from "react-spinners/ClipLoader";

// Context imports
import AuthContext from '../context/AuthContext';
import GeneralContext from '../context/GeneralContext';

const Feed = ({ form,  url, loginRequired}) => {

  const [pageNumber, setPageNumber] = useState(1);
  const { user, authTokens } = useContext(AuthContext);
  const { darkMode, modalOpen, posts, loading } = useContext(GeneralContext);

  const navigator = useNavigate();

 


  // Handles like, comment, retweet, delete, edit, and bookmark actions
  const handleAction = (url, method, authTokens, body) => { 
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
        console.log('xd')
    })
    .catch(error => {console.log(error)})
  };

  console.log(loading);


  return (
    <div className='w-[600px] transition-all'>
       {(form && user !== null)  ? 
       <Form route='new' method='POST'  borderStyle={`border-l-0 ${darkMode ? 'border-gray-800' : 'border-gray-300'}`} textAreaStyle='bg-transparent' message='Post' placeholder="What's happening !?"/> 
       :
       <div className={`flex items-center space-x-7 text-xl border border-l-0 border-t-0 ${ darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-300'} bg-opacity-50 sticky top-0`}>
            <div className='mt-1 ml-4 mb-1'>
                <h3 className='font-bold' >Bookmarks</h3>
                <p className='text-gray-600 text-sm mt-0'>@{user && user.username}</p>
            </div>
        </div>
       }
       {(posts && posts.length > 0) && posts.map((post,index) => <NewPost key={index} post={post}/>)}
       {(posts && posts.length === 0) && <ErrorMessage/>}
       {loading && <div className='w-full mt-[25%] flex items-center justify-center'>
          <ClipLoader color={'#1D9BF0'} loading={loading} size={150} aria-label='Loading spinner' data-testid='loader'/> 
       </div>}
    </div>
  )
}

export default Feed
