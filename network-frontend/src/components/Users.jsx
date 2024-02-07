import { useState, useEffect, useContext, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Icon imports
import { MdVerified } from "react-icons/md";
import { BsArrowLeftShort } from 'react-icons/bs';

// Context imports
import GeneralContext from '../context/GeneralContext';
import AuthContext from '../context/AuthContext';

const Users = () => {

  const [users, setUsers] = useState(null);
  const [ page, setPage ] = useState(1);
  const [ data, setData] = useState(null);
  const [ hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const { darkMode } = useContext(GeneralContext);
  const { type, username, filter } = useParams();
  const navigate = useNavigate();

  const { user, authTokens } = useContext(AuthContext);

  const getUsers = () => {
    setLoading(true);
    let verified = filter === 'verified' ? true : false;
    const headers = {
      'Content-type' : 'application/json'
    }

    if (user) {
      headers['Authorization'] = 'Bearer ' + String(authTokens.access);
    }

      axios({
        method : 'GET',
        url : `http://127.0.0.1:8000/${type}/${username}/`,
        params : { verified : 'xd', page : page}
      })
      .then(res => {
        setUsers(prevUsers => {
          console.log('appending users');
          if (!prevUsers) return res.data.profiles;
          else return [...prevUsers, ...res.data.profiles];
        })
        setHasMore(res.data.hasMore);
        setData(res.data.data);
        setLoading(false);
      })
  }

  const handleFollow = (userId) => {
    let headers = {
      'Content-type': 'application/json'
    };
    if (user) {
      headers['Authorization'] = 'Bearer ' + String(authTokens.access);
    }
    fetch(`http://127.0.0.1:8000/follow/${userId}`, {
      method: 'PUT',
      headers: headers
    })
      .then(response => response.json())
      .then(() => {
        getUsers();
      })
      .catch(error => { console.log(error) })
  };

  useEffect(() => {
    getUsers();
  }, [])

  return (
    <div className='w-[600px]'>
      {users && data  &&
        <>
          <div className={`flex items-center space-x-7 pl-3 text-xl border border-b-0 border-l-0 border-t-0 ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-300'} bg-opacity-50 sticky top-0`}>
          <BsArrowLeftShort className='ml-3.5 text-3xl opacity-100 hover:bg-gray-900 hover:rounded-full' onClick={() => { navigate(-1) }} />
            <div className='mt-1 ml-4 mb-1'>
              <h3 className='font-bold' >{data && data.profilename}</h3>
              <p className='text-gray-600 text-sm mt-0'>{ data && `@${users.username}`}</p>
            </div>
          </div>
          <ul className={`w-full h-10 flex h-[53px] border border-l-0 border-t-0 ${darkMode ? 'border-gray-800' : 'border-gray-300'}`}>
                <li className='relative w-4/12 flex justify-center items-center text-base hover:bg-gray-600 hover:bg-opacity-50' onClick={() => { navigate(`/followers/${username}/verified`)}}>
                  <span className={filter === 'verified' ? 'font-bold' : 'text-gray-600'}>Verified followers</span>
                  {filter === 'verified' && type === 'followers' && <span className={`absolute top-12 left-9 w-8/12 h-1 bg-twitter-blue rounded-full`}></span>}
                </li>
                <li className='relative w-4/12 flex items-center justify-center text-base hover:bg-gray-600 hover:bg-opacity-50' onClick={() => {navigate(`/followers/${username}/`)} }>
                  <span className={!filter && type === 'followers' ? 'font-bold' : 'text-gray-600'}>Followers</span>
                  {!filter  && type ==='followers' && <span className='absolute top-12 left-14 w-5/12 h-1 bg-twitter-blue rounded-full'></span>}
                </li>
                <li className='relative w-4/12 flex items-center justify-center text-base hover:bg-gray-600 hover:bg-opacity-50' onClick={() => {navigate(`/following/${username}/`)}}>
                  <span className={type === 'following' ? 'font-bold' : 'text-gray-600'}>Following</span>
                  { type === 'following' && <span className='absolute top-12 left-12 w-6/12 h-1 bg-twitter-blue rounded-full'></span>}
                </li>
              </ul>

          { users &&
          
          users.length > 0 ?
            users.map((user, index) =>
              <div key={index} className='w-full flex items-start p-2.5'>
                <div className='w-10 h-10 rounded-full overflow-hidden ml-2.5'>
                   <img src={user.pfp} alt='user pfp' className='object-cover w-full h-full' />
                </div>
                <div className='relative ml-2.5 w-full'>
                  {console.log(user.followed)}
                  <button type='button' className={`${user.followed ? 'hover:text-red-900 hover:bg-red-900 hover:border-red-900 hover:bg-opacity-30' : ''} absolute top-1.5 right-1 w-[99px] h-[30px] border border-white rounded-full font-bold`} onClick={() => handleFollow(user.user_id)}>{user.followed ? 'Unfollow' : 'Follow'}</button>
                  <p className='inline-flex items-center font-bold hover:underline' onClick={()=>{navigate(`/user/${user.username}`)}}>{user.profilename} {user.verified && <MdVerified className='text-twitter-blue ml-0.5'/>}</p>
                  <p className='text-gray-600'>@{user.username}</p>
                  <p className='w-full'>{user.bio}</p>
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
        </>
      }
    </div>
  )
}

export default Users;
