import { useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Import icons
import { MdClose } from 'react-icons/md';
import { IoIosSearch } from 'react-icons/io';
import { MdVerified } from 'react-icons/md';

// Context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from '../../context/GeneralContext';
import MessageContext from '../../context/MessageContext';

const NewConversation = ({ shrink, setShrink }) => {
  
  const { user, authTokens} = useContext(AuthContext);
  const { mode } = useContext(GeneralContext);
  const { setConversations, setActiveConversation, conversations} = useContext(MessageContext);

  const [matches, setMatches] = useState([])
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [ selected, setSelected] = useState(null);

  const handleChange = (e) => {
    setSearch(e.target.value);
  }

  const handleClose = () => {
    setShrink(true);
    setLoading(false);
    setMatches([]);
  }

  console.log(selected);

  const handleNewConversation = () => {

    if (selected) {

      const index = conversations.findIndex( conversation => conversation.partners.map( profile => profile.username).includes(selected));
      console.log(index);
      if (index >= 0 ) {
        console.log('conversation already exists')
        setActiveConversation(conversations[index]);
        setShrink(true);
        return;
      }


      console.log('conversation does not exist');
      let headers;

    if (authTokens) {
      headers = {
        'Authorization' : 'Bearer ' + String(authTokens.access)
      }
    }

    axios({
      url : 'https://bellr.onrender.com/messages/conversations/new',
      method : 'POST',
      headers : headers,
      data : { partners : [user.username, selected] }
    })
    .then( res => {
      setConversations( prevStatus => {
        if (prevStatus) return [ res.data, ...prevStatus];
        return res.data;
      })
      setShrink(true);
    })
    }
  }

  useEffect( () => {
      setLoading(!loading);
  
      if (search.length > 0) {
        axios({
          url : `https://bellr.onrender.com/search`,
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  
  return (
    <div className={`w-[500px] h-[500px] flex flex-col bg-${mode.background} ${mode.text} ${ shrink ? 'animate-shrink' : 'animate-grow'} rounded-xl`} >
      <header className='w-full flex items-center justify-between p-2.5'>
        <div className='flex items-center space-x-10'>
          <MdClose className='text-2xl' onClick={handleClose}/>
          <h3 className='text-2xl font-extrabold'>New Message</h3>
        </div>
        <button disabled={!selected} className={`w-[65px] h-[35px] p-2.5 text-black bg-white rounded-full flex items-center justify-center font-bold ${selected ? 'opacity-90 hover:opacity-100' : 'opacity-70' }`} onClick={handleNewConversation}>Next</button>
      </header>
      <div className={`flex flex-row-reverse items-center w-full h-10 border border-t-0 border-l-0 border-r-0 ${mode.separator} px-2.5`}>
          <input  name='search' type='text' placeholder='Search people'  
          className='w-full h-full focus:outline-none bg-transparent pl-5 peer' onChange={handleChange}/>
          <IoIosSearch className='text-lg peer-focus:text-twitter-blue'/>
      </div>
      <div className={`w-10 h-1 ${mode.color} `}></div>
      { !loading && <div className='w-full max-h-[400px] overflow-y-auto'>  
        {
         matches.map(profile => <div key={profile.user_id} className='w-full flex items-center cursor-pointer hover:bg-gray-800 p-3 rounded-xl' onClick={ () => setSelected(profile.username)}>
             <div className='w-10 h-10 overflow-hidden rounded-full overflow-hidden'>
               <img src={profile.pfp} alt='user profile pic' className='w-10 h-10 object-cover rounded-full'/>
             </div>
             <div className='ml-2.5'>
               <p className='font-bold flex items-center'>{profile.profilename} { profile.verified && <MdVerified className='ml-1 text-twitter-blue'/> }</p>
               <p className='text-gray-600'>@{profile.username}</p>
             </div>
            </div>)
        }
        </div>}
    </div>
  )
}

export default NewConversation;
