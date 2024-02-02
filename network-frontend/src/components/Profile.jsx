import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components imports
import NewProfileHeader from './NewProfileHeader';
import EmptyProfileHeader from './EmptyProfileHeader';
import NewPost from './NewPost';
import ErrorMessage from './ErrorMessage';

// Context imports
import AuthContext from '../context/AuthContext';
import GeneralContext from '../context/GeneralContext';

const Profile = ({ me }) => {
  

  const { username } = useParams();
  const { user, authTokens } = useContext(AuthContext);
  const { modalOpen } = useContext(GeneralContext);

  const profile = me ? user.username : username;

  const [ userData, setUserData] = useState(null);
  
  const [ errorMessage, setErrorMessage] = useState(null);

  const [ filterUrl, setFilterUrl ] = useState(me ? 'profile' : `username/${profile}`);


  const navigate = useNavigate();

  if( user && username === user.username) {
    navigate('/me');
  }


  const getUserData = (url) => {
    const headers =  {
      'Content-type' : 'application/json'
    };
    if (user){
      headers['Authorization'] = 'Bearer ' +  String(authTokens.access);
    }

    fetch(`http://127.0.0.1:8000/posts/${url}`, {
        method : 'GET',
        headers : headers
    })
    .then (response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()})
    .then( data => {
        setUserData(data);
    })
    .catch(error => {
        if (error.message.includes('404') && me === false){
          setErrorMessage(404)
        }
        else if (error.message.includes('403')){
          setErrorMessage(403)
        }
    });
  }

  // Handles like, comment, retweet, delete, edit, and bookmark actions
  const handleProfileAction = (url, method, authTokens, body) => { 
      let headers = {
        'Content-type' : 'application/json'
      }
      if (user) {
        headers['Authorization'] = 'Bearer ' + String(authTokens.access);
      }

      fetch(`http://127.0.0.1:8000/${url}`, {
        method: method,
        headers : headers,
        body : JSON.stringify(body)
      })
      .then(response => response.json())
      .then( () => {
          getUserData(filterUrl);
      })
      .catch(error => {console.log(error)})
    };

    
  useEffect ( () => {
    if (me && !user) {
      navigate('/home');
    }

    getUserData(filterUrl);
  }
  , [filterUrl]);

  useEffect ( () => {
    setErrorMessage(null);
    setUserData(null);
    setFilterUrl(me ? 'profile' : `username/${profile}`);
  }, [profile, modalOpen]);
  
  return (
 
     <div className='w-[600px]'>
        {errorMessage && <EmptyProfileHeader username={username} message={errorMessage === 404 ? 'This account does not exist' : "You're blocked"}  submessage={errorMessage===404 ?'Try searching for another' : `You cant follow or see @${username}'s posts.`} />}
        {userData && <NewProfileHeader account={userData.account} handleAction={handleProfileAction} setFilterUrl={setFilterUrl}/>}
        {(userData && userData.posts.length > 0) && userData.posts.map(post => <NewPost key={post.id} post={post} handleAction={handleProfileAction}/>)}
        {(userData && userData.posts.length === 0) && <ErrorMessage/>}
     </div>
    
  )
}

export default Profile;
