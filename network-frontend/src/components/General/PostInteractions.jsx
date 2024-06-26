/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useRef, useCallback, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Icon imports
import { MdVerified } from "react-icons/md";
import { MdClose } from 'react-icons/md';

// Component imports
import MoonLoader from "react-spinners/MoonLoader";

// Context imports
import GeneralContext from '../../context/GeneralContext';
import AuthContext from '../../context/AuthContext';


const PostInteractions = ({ shrink, setShrink}) => {

  const [users, setUsers] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, authTokens } = useContext(AuthContext);
  const { editedPost, filter, mode} = useContext(GeneralContext);
  const navigate = useNavigate();

  const observer = useRef();

  const border = mode.background === 'white' ? 'border-black' : 'border-white';

  const lastProfile = useCallback( profile => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (hasMore) setPage( prevPage => {return prevPage + 1})
      }
    })
    if (profile) observer.current.observe(profile);
  });

  const handleFollow = (userId) => {
    let headers;

    if (authTokens) {
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    }

    axios({
      url : `https://bellr.onrender.com/follow/${userId}`,
      method : 'PUT',
      headers: headers,
      params : {page : page}
    })
    .then( () => {
      setUsers( prevUsers => {
        const index = prevUsers.findIndex(account => account.user_id === userId)
        let updatedUsers = [...prevUsers];

        let updatedUser = {...updatedUsers[index]};
        updatedUser.followed = !updatedUser.followed;

        updatedUsers[index] = updatedUser;
        return updatedUsers;
      })
    })

  };

  useEffect( () => {
    setLoading(true);

    let headers;

    if (authTokens) {
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    }

    axios({
      url : `https://bellr.onrender.com/post/interactions/${editedPost.id}`,
      method : 'GET',
      headers : headers,
      params : { filter : filter}
    })
    .then( res => {
      setUsers( prevUsers => {
        if (page === 1) return res.data.profiles;
        return [...prevUsers, res.data.profiles];
      })
      setHasMore(res.data.hasMore);
      setLoading(false);
    })
    .catch( err => {
      console.log(err);
      setLoading(false);
    })

  }, [page]);


  return (
    <div className={`w-screen h-screen sm:w-[500px] sm:h-[500px] ${shrink ? 'animate-shrink' : 'animate-grow'} bg-${mode.background} ${mode.text} sm:rounded-xl`}>
        <header className={`sticky top-0 h-12 p-5 z-10 transform ${mode.text}`}>
                    <MdClose className='text-2xl mt-1 cursor-pointer' onClick={() => {setShrink(true)}}/>
                    <h3 className='absolute top-4 ml-[40%] text-2xl font-bold'>{filter}</h3>
        </header>
        <main className='relative h-[calc(100vh - 49px)] overflow-y-auto'>
        { users && users.length > 0 && 
            users.map((profile, index) => {
            if (index === users.length - 1) {
              return ( <div key={index} ref={lastProfile} className={`w-full flex items-start p-2.5 pt-4 animate-grow ${mode.text}`}>
              <div className='min-w-10 min-h-10 max-w-10 max-h-10 rounded-full overflow-hidden ml-2.5'>
                 <img src={profile.transmitter ? profile.transmitter.pfp : profile.pfp} alt='user pfp' className='object-cover w-full h-full' />
              </div>
              <div className='relative ml-2.5 w-full'>
                { (user ? user.user_id : -1) !== (profile.transmitter ? profile.transmitter.user_id : profile.user_id) && <button type='button' className={`${profile.followed ? 'hover:text-red-900 hover:bg-red-900 hover:border-red-900 hover:bg-opacity-30' : `hover:bg-white hover:text-black`} ${mode.text} border ${border} absolute top-1.5 right-1 w-[99px] h-[30px] rounded-full font-bold transition-colors duration-300`} onClick={() => { handleFollow(profile.transmitter ? profile.transmitter.user_id : profile.user_id)}}>{(profile.transmitter ? profile.transmitter.followed : profile.followed) ? 'Unfollow' : 'Follow'}</button>}
                <p className='inline-flex items-center font-bold cursor-pointer hover:underline' onClick={()=>{ setShrink(true); navigate(`/user/${profile.transmitter ? profile.transmitter.username : profile.username}`)}}>{ profile.transmitter ? profile.transmitter.profilename : profile.profilename} { (profile.transmitter ? profile.transmitter.verified : profile.verified) && <MdVerified className='text-twitter-blue ml-0.5'/>}</p>
                <p className='text-gray-600'>@{profile.transmitter ? profile.transmitter.username : profile.username}</p>
                <p className='w-full text-gray-600'>{profile.transmitter ? profile.transmitter.bio : profile.bio}</p>
              </div>
              </div>);
            };
           return <div key={index} className={`w-full flex items-start p-2.5 pt-4 animate-grow`}>
              <div className='min-w-10 min-h-10 max-w-10 max-h-10 rounded-full overflow-hidden ml-2.5'>
                 <img src={profile.transmitter ? profile.transmitter.pfp : profile.pfp} alt='user pfp' className='object-cover w-full h-full' />
              </div>
              <div className='relative ml-2.5 w-full'>
                { (user ? user.user_id : -1) !== (profile.transmitter ? profile.transmitter.user_id : profile.user_id) && <button type='button' className={`${profile.followed ? 'hover:text-red-900 hover:bg-red-900 hover:border-red-900 hover:bg-opacity-30' : `hover:bg-white hover:text-black`}  ${mode.text} border ${border} absolute top-1.5 right-1 w-[99px] h-[30px] border rounded-full font-bold transition-colors duration-300`} onClick={() => { handleFollow(profile.transmitter ? profile.transmitter.user_id : profile.user_id)}}>{(profile.transmitter ? profile.transmitter.followed : profile.followed) ? 'Unfollow' : 'Follow'}</button>}
                <p className='inline-flex items-center font-bold hover:underline' onClick={()=>{ setShrink(true); navigate(`/user/${profile.transmitter ? profile.transmitter.username : profile.username}`)}}>{ profile.transmitter ? profile.transmitter.profilename : profile.profilename} { (profile.transmitter ? profile.transmitter.verified : profile.verified) && <MdVerified className='text-twitter-blue ml-0.5'/>}</p>
                <p className='text-gray-600'>@{profile.transmitter ? profile.transmitter.username : profile.username}</p>
                <p className='w-full text-gray-600'>{profile.transmitter ? profile.transmitter.bio : profile.bio}</p>
              </div>
            </div>})
        }
        </main>
        { loading &&      
        <div className='mt-5 w-full flex justify-center'>
               <MoonLoader color={mode.spinnerColor} loading={loading} size={75} aria-label='Loading spinner' data-testid='loader'/> 
        </div>
        }
    </div>
  )
}

export default PostInteractions
