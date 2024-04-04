import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Icon imports
import { MdVerified } from "react-icons/md";
import { BsArrowLeftShort } from 'react-icons/bs';

// Component imports
import ClipLoader from "react-spinners/ClipLoader";

// Context imports
import GeneralContext from '../../context/GeneralContext';
import AuthContext from '../../context/AuthContext';

const Users = () => {

  const [users, setUsers] = useState(null);
  const [ page, setPage ] = useState(1);

  // eslint-disable-next-line no-unused-vars
  const [ hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mode } = useContext(GeneralContext);
  const { type, username, filter } = useParams();
  const navigate = useNavigate();

  const { authTokens, user } = useContext(AuthContext);


  const handleFollow = (userId) => {
    let headers = {
      'Content-type': 'application/json'
    };
    if (authTokens) {
      headers['Authorization'] = 'Bearer ' + String(authTokens.access);
    }
    axios({
      url : `http://127.0.0.1:8000/follow/${userId}`,
      method : 'PUT',
      headers: headers,
    })
      .then(() => {

        setUsers(prevUsers => {
          if (type === 'following' && user.username === username) {
            return users.filter( profile => profile.user_id !== userId); 
          };

          let index = prevUsers.findIndex(profile => profile.id === userId)
          
          let updatedUsers = [...prevUsers];

          updatedUsers[index].followed = !updatedUsers[index].followed;

          return updatedUsers;

        })
      })
      .catch(error => { console.log(error) })
  };

  useEffect(() => {
    setUsers(null);
    setPage(1);

    let headers;

    if (authTokens){
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    }

    axios({
      url:`http://127.0.0.1:8000/${type}/${username}/`,
      headers:headers,
      method: 'GET',
      params : {page : page}
    })
    .then( res => {
      console.log(res.data);
      setUsers(prevUsers => {
        console.log(prevUsers, users);
        if (page === 1) return res.data.profiles; // If page = 1, just set the data to the response's array
        else return [...prevUsers, ...res.data.profiles] // Otherwise, append the new posts at the end of the array.
      });
      setHasMore(res.data.hasMore);
      setLoading(false);
    })
    .catch( error => {
      setLoading(false);
      console.log(error);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, username])

  useEffect(() => {
     let headers;

    if (authTokens){
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    }

    axios({
      url:`http://127.0.0.1:8000/${type}/${username}/`,
      headers:headers,
      method: 'GET',
      params : {page : page}
    })
    .then( res => {
      console.log(res.data);
      setUsers(prevUsers => {
        console.log(prevUsers, users);
        if (page === 1) return res.data.profiles; // If page = 1, just set the data to the response's array
        else return [...prevUsers, ...res.data.profiles] // Otherwise, append the new posts at the end of the array.
      });
      setHasMore(res.data.hasMore);
      setLoading(false);
    })
    .catch( error => {
      setLoading(false);
      console.log(error);
    });
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return (
    <div className='w-screen sm:w-[600px] min-h-screen'>
          <div className={`flex items-center space-x-7 pl-3 text-xl border border-b-0 border-l-0 border-t-0 ${mode.separator} ${mode.background} bg-opacity-50 sticky top-0`}>
          <BsArrowLeftShort className='ml-3.5 text-3xl opacity-100 hover:bg-gray-900 hover:rounded-full' onClick={() => { navigate(-1) }} />
            <div className='mt-1 ml-4 mb-1'>
              <h3 className='font-bold' >{username}</h3>
              <p className='text-gray-600 text-sm mt-0'>{'Connections'}</p>
            </div>
          </div>
          <ul className={`w-full h-10 flex h-[53px] border border-l-0 border-t-0 ${mode.separator}`}>
                <li className={`relative w-4/12 text-xs mobile:text-base flex justify-center items-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => { navigate(`/followers/${username}/verified`)}}>
                  <span className={filter === 'verified' ? 'font-bold' : 'text-gray-600'}>Verified followers</span>
                  {filter === 'verified' && type === 'followers' && <span className={`absolute top-12 mr-auto ml-auto w-8/12 h-1 bg-${mode.color} rounded-full`}></span>}
                </li>
                <li className={`relative w-4/12 mr-auto ml-auto text-xs mobile:text-base flex justify-center items-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => {navigate(`/followers/${username}/`)} }>
                  <span className={!filter && type === 'followers' ? 'font-bold' : 'text-gray-600'}>Followers</span>
                  {!filter  && type ==='followers' && <span className={`absolute top-12 mr-auto ml-auto w-5/12 h-1 bg-${mode.color} rounded-full`}></span>}
                </li>
                <li className={`relative w-4/12 flex mr-auto ml-auto text-xs mobile:text-base justify-center items-center text-base hover:${mode.sidebarHighlight} hover:bg-opacity-50`} onClick={() => {navigate(`/following/${username}/`)}}>
                  <span className={type === 'following' ? 'font-bold' : 'text-gray-600'}>Following</span>
                  { type === 'following' && <span className={`absolute top-12 mr-auto ml-auto w-6/12 h-1 bg-${mode.color} rounded-full`}></span>}
                </li>
              </ul>
          { loading && 
          <div className='w-full flex justify-center'>
               <ClipLoader color={'#1D9BF0'} loading={loading} size={150} aria-label='Loading spinner' data-testid='loader'/> 
            </div>
            }
          { users &&
          users.length > 0 ?
            users.map((profile, index) =>
              <div key={index} className={`w-full flex items-start p-2.5 animate-grow border-r border-b ${mode.separator}`}>
                <div className='w-10 h-10 rounded-full overflow-hidden ml-2.5'>
                   <img src={profile.pfp} alt='user pfp' className='object-cover w-full h-full' />
                </div>
                <div className='relative ml-2.5 w-full'>
                  { (user ? user.user_id : -1) !== profile.user_id && <button type='button' className={`${profile.followed ? 'hover:text-red-900 hover:bg-red-900 hover:border-red-900 hover:bg-opacity-30' : ''} absolute top-1.5 right-1 w-[99px] h-[30px] border border-white rounded-full font-bold`} onClick={() => handleFollow(profile.user_id)}>{profile.followed ? 'Unfollow' : 'Follow'}</button>}
                  <p className='inline-flex items-center font-bold hover:underline' onClick={()=>{navigate(`/user/${profile.username}`)}}>{profile.profilename} {profile.verified && <MdVerified className='text-twitter-blue ml-0.5'/>}</p>
                  <p className='text-gray-600'>@{profile.username}</p>
                  <p className='w-full'>{profile.bio}</p>
                </div>
              </div>
            )
            :
            <div className='w-full h-[300px] flex flex-col justify-center items-center p-5'>
              <div className='w-[300px]'>
                <h3 className={`${filter === 'followers' ? 'w-[180px]' : 'w-full'} text-3xl font-bold`}>{type === 'followers' ? 'Looking for followers?' : `@${username} is not following anyone`}</h3>
              </div>
              <p className='w-[300px] mt-2.5 text-gray-600 w-6/12'>{type === 'followers' ? 'When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers.' : "Once they'll follow accounts, they'll show up here"}</p>
            </div>
          }
    </div>
  )
}

export default Users;
