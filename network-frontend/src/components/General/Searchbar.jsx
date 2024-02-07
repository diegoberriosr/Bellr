import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Icon imports
import { IoIosSearch } from "react-icons/io";
import { MdVerified } from 'react-icons/md';
// Context imports
import GeneralContext from '../../context/GeneralContext';

const Searchbar = () => {
  
  const [ isSearching, setIsSearching ] = useState(false);
  const [ matches, setMatches] = useState([]);

  const { darkMode } = useContext(GeneralContext);
  const text = useRef();
  const navigate = useNavigate();
  
  const handleOnChange = (event) => {
    if (event.target.value !== '')
    {
        fetch(`http://127.0.0.1:8000/users/${event.target.value}`, {
            'method' : 'GET',
            'headers' : {
                'Content-Type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {setMatches(data)})
    }
    setMatches([]);
  }

  return (
    <div className='w-full relative'>
        <div className={`${isSearching ? 'border border-twitter-blue' : ''} flex items-center h-10 ${ darkMode ? 'bg-twitter-dark text-white' :  'bg-light-gray text-gray-600'} rounded-3xl p-2.5 mt-1 duration-300`}>
            <IoIosSearch className={`${isSearching ? 'text-twitter-blue' : ''} text-2xl ml-2`}/>
            <input ref={text} className='ml-4 bg-transparent text-sm w-full focus:outline-none' placeholder='Search' onFocus={() => { setIsSearching(true) }} onBlur={() => {setIsSearching(false)}} onChange={handleOnChange}/>
        </div>
        {isSearching && <div className={`absolute top-10 max-h-72 overflow-y-auto flex flex-col w-full shadow-custom shadow-gray-800 rounded-xl ${ darkMode ? 'bg-black' : 'bg-white'}`}>
            { matches.length > 0 ? matches.map(user => <div key={user.user_id} className='w-full flex items-center cursor-pointer hover:bg-gray-800 p-3 rounded-xl' onMouseDown={() => {
               navigate(`/user/${user.username}`)}}>
                <div classNam='w-10 h-10 overflow-hidden rounded-full overflow-hidden'>
                  <img src={user.pfp} alt='user profile pic' className='w-10 h-10 object-cover rounded-full'/>
                </div>
                <div className='ml-2.5'>
                  <p className='font-bold flex items-center'>{user.profilename} { user.verified && <MdVerified className='ml-1 text-twitter-blue'/> }</p>
                  <p className='text-gray-600'>@{user.username}</p>
                </div>
               </div>) : 
               <div className='h-20 w-full flex justify-center pt-5 text-gray-600 font-bold'>
                  {text.current.value === ''  ? 'Try searching for people' : 'No matches found'}
                </div>
               }    
        </div>}
    </div>
  )
}

export default Searchbar
