import { useContext, useState, useRef, useCallback, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Icon imports
import { MdVerified } from "react-icons/md";
import { MdClose } from 'react-icons/md';

// Component imports
import ClipLoader from "react-spinners/ClipLoader";

// Context imports
import GeneralContext from '../../context/GeneralContext';
import AuthContext from '../../context/AuthContext';


const PostInteractions = ({ shrink, setShrink}) => {

  const [users, setUsers] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { user, authTokens } = useContext(AuthContext);
  const { editedPost, filter } = useContext(GeneralContext);
  const navigate = useNavigate();

  const observer = useRef();

  const handleLike = (userId) => {
    let headers;

    if (authTokens) {
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    }

    axios({
      url : `http://127.0.0.1:8000/follow/${userId}`,
      method : 'PUT',
      headers: headers
    })
    .then( () => {
      setUsers( prevUsers => {
        const index = prevUsers.findIndex(account => account.user_id === userId)
        let updatedUsers = [...prevUsers];

        updatedUsers[index].followed = !updatedUsers[index].followed;
        console.log(updatedUsers[index], prevUsers[index])
        return updatedUsers;
      })
    })

  }

  useEffect( () => {
    setLoading(true);

    axios({
      url : `http://127.0.0.1:8000/post/interactions/${editedPost.id}`,
      method : 'GET',
      params : { filter : filter}
    })
    .then( res => {
      setUsers( prevUsers => {
        if (page === 1) return res.data.profiles;
        return [...prevUsers, res.data.profiles];
      })
      setLoading(false);
    })
    .catch( err => {
      console.log(err);
      setLoading(false);
    })

  }, [page])

  return (
    <div className={`w-screen h-screen md:w-[500px] h-[500px] ${shrink ? 'animate-shrink' : 'animate-grow'} bg-black rounded-xl`}>
        <header className='sticky top-0 h-12 p-5 z-10 transform'>
                    <MdClose className='text-2xl text-white mt-1 cursor-pointer' onClick={() => {setShrink(true)}}/>
                    <h3 className='absolute top-4 ml-[40%] text-2xl text-white font-bold'>{filter}</h3>
        </header>
        { users && users.length > 0 && 
            users.map((profile, index) =>
            <div key={index} className='w-full flex items-start p-2.5 pt-4 animate-grow'>
              <div className='w-10 h-10 rounded-full overflow-hidden ml-2.5'>
                 <img src={profile.pfp} alt='user pfp' className='object-cover w-full h-full' />
              </div>
              <div className='relative ml-2.5 w-full'>
                { (user ? user.user_id : -1) !== profile.user_id && <button type='button' className={`${profile.followed ? 'hover:text-red-900 hover:bg-red-900 hover:border-red-900 hover:bg-opacity-30' : ''} absolute top-1.5 right-1 w-[99px] h-[30px] border border-white rounded-full font-bold`} onClick={() => { handleLike(profile.user_id)}}>{profile.followed ? 'Unfollow' : 'Follow'}</button>}
                <p className='inline-flex items-center font-bold hover:underline' onClick={()=>{navigate(`/user/${profile.username}`)}}>{profile.profilename} {profile.verified && <MdVerified className='text-twitter-blue ml-0.5'/>}</p>
                <p className='text-gray-600'>@{profile.username}</p>
                <p className='w-full'>{profile.bio}</p>
              </div>
            </div>)
        }
        { loading &&      
        <div className='w-full flex justify-center'>
               <ClipLoader color={'#1D9BF0'} loading={loading} size={150} aria-label='Loading spinner' data-testid='loader'/> 
        </div>
        }
    </div>
  )
}

export default PostInteractions
