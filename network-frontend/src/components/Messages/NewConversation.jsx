import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';

// Import icons
import { MdClose } from 'react-icons/md';
import { IoIosSearch } from 'react-icons/io';
import { MdVerified } from 'react-icons/md';
// Context imports
import GeneralContext from '../../context/GeneralContext';

const NewConversation = ({ shrink, setShrink }) => {
  
  const { mode } = useContext(GeneralContext);
  const [matches, setMatches] = useState([])
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setSearch(e.target.value);
  }

  const handleClose = () => {
    setShrink(true);
    setLoading(false);
    setMatches([]);
  }

  useEffect( () => {
      setLoading(!loading);
  
      if (search.length > 0) {
        axios({
          url : `http://127.0.0.1:8000/search`,
          method : 'GET',
          params : { s : search}
        })
        .then( res => {
          setMatches(res.data);
          setLoading(false);
        })
        .catch ( err => {
          console.log(err);
          setLoading(false);
        })
        return;
      }
      setMatches([]);
      setLoading(false);

  }, [search])

  console.log(loading, search, search.length);

  return (
    <div className={`w-[500px] h-[500px] flex flex-col bg-${mode.background} ${mode.text} ${ shrink ? 'animate-shrink' : 'animate-grow'} rounded-xl`} >
      <header className='w-full flex items-center justify-between p-2.5'>
        <div className='flex items-center space-x-10'>
          <MdClose className='text-2xl' onClick={handleClose}/>
          <h3 className='text-2xl font-extrabold'>New Message</h3>
        </div>
        <button className='w-[65px] h-[35px] p-2.5 text-black bg-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 font-bold'>Next</button>
      </header>
      <div className={`flex flex-row-reverse items-center w-full h-10 border border-t-0 border-l-0 border-r-0 ${mode.separator} px-2.5`}>
          <input  name='search' type='text' placeholder='Search people'  
          className='w-full h-full focus:outline-none bg-transparent pl-5 peer' onChange={handleChange}/>
          <IoIosSearch className='text-lg peer-focus:text-twitter-blue'/>
      </div>
      <div className={`w-10 h-1 ${mode.color} `}></div>
      { !loading && <div className='w-full max-h-[400px] overflow-y-auto'>  
        {
         matches.map(user => <div key={user.user_id} className='w-full flex items-center cursor-pointer hover:bg-gray-800 p-3 rounded-xl' onMouseDown={() => {
            navigate(`/user/${user.username}`)}}>
             <div className='w-10 h-10 overflow-hidden rounded-full overflow-hidden'>
               <img src={user.pfp} alt='user profile pic' className='w-10 h-10 object-cover rounded-full'/>
             </div>
             <div className='ml-2.5'>
               <p className='font-bold flex items-center'>{user.profilename} { user.verified && <MdVerified className='ml-1 text-twitter-blue'/> }</p>
               <p className='text-gray-600'>@{user.username}</p>
             </div>
            </div>)
        }
        </div>}
    </div>
  )
}

export default NewConversation;
