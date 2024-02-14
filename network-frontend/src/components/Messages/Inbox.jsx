import { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

// Icon imports
import { IoSettingsOutline } from "react-icons/io5";
import { LuMailPlus } from "react-icons/lu";
import { BsArrowLeftShort } from 'react-icons/bs';
import { IoIosSearch } from "react-icons/io";

// Component imports
import ConversationMiniature from './ConversationMiniature';

// Context imports
import GeneralContext from '../../context/GeneralContext';



const Inbox = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [matches, setMatches] = useState([]);

  const { mode } = useContext(GeneralContext);
  const navigate = useNavigate();

  const { values, handleChange, resetForm, touched } = useFormik(
    {
        initialValues : {
            'search' : ''
        },
    }
  )

  const handleFocus = () => {
    setIsFocused(!isFocused);
  }

  
  const handleResetSearch = () => {
      resetForm({
          initialValues : {
              'search' : ''
            }
        })
    }
    
    const handleGoBack = () => {
      if (isFocused) {
          handleFocus();
          return;
      }
      else {
          navigate(-1);
      }
    }
    
    // Just some test values
    const USER = {
    'verfied' : true,
    'username' : 'testman',
    'profilename' : 'testman',
    'pfp' : 'https://mf.b37mrtl.ru/rbthmedia/images/2023.09/original/64f9e2f36008eb63f72ee054.jpg'
  }

  const MESSAGE = {
    'id' : 1,
    'sender' : 'testman',
    'receiver' : 'testboy',
    'content' : 'Just a little test',
    'timestamp' : null,
    'seen' : false,
    'user' : USER
  }

  return (
    <div className={`w-screen mobile:w-[450px] h-screen text-center text-xl border border-l-0 border-b-0 ${mode.separator} ${mode.text}`}>
        <header className='w-full h-[53px] pl-3.5 pr-2 py-2.5 font-bold flex justify-between items-center'>
            <h3 className='h-full'>Messages</h3>
            <div className='h-full flex items-center text-[19px]'>
                <i className='cursor-pointer rounded-full hover:bg-gray-900 p-2 transition-colors'>
                    <IoSettingsOutline/>
                </i>
                <i className='cursor-pointer rounded-full hover:bg-gray-900 p-2 transition-colors'>
                     <LuMailPlus/>
                </i>
            </div>
        </header>
        <main>
            <div className='w-full flex items-center px-2.5 mt-3'>
                <BsArrowLeftShort className='text-3xl'  onClick={handleGoBack}/>
                <div className={`w-[400px] h-10 rounded-full border ${mode.separator} ${mode.text} ${ isFocused ? 'border border-twitter-blue' : ''} bg-transparent flex items-center justify-start p-2.5`} >
                    <IoIosSearch className='text-[18px]'/>
                    <input value={values.search} name='search' type='text' placeholder='Search Direct Messages' className={`bg-transparent mb-1 ml-1 h-[95%] w-[82.5%] ${mode.text} text-sm focus:outline-none peer `} onChange={handleChange} onFocus={handleFocus} onBlur={handleFocus}/>
                    <button className='visible peer-placeholder-shown:invisible ml-auto mr-1 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold w-[18.79px] h-[18.79px] pb-0.5 pr-[0.5px] cursor-pointer'
                    onClick={handleResetSearch}>x</button>
                </div>
            </div>
            <div className='mt-3'>
                { isFocused && values.search.length === 0 && <p className='text-gray-600'>Try searching for people, groups, or messages.</p>}
                { !isFocused && <ConversationMiniature mostRecentMessage={MESSAGE} active={true} unreadMessages={20}/> }
                { isFocused && matches.length === 0 &&  values.search.length !== 0 && <div className={`pl-16 pt-5 w-full ${mode.text} flex flex-col items-start justify-start`}> 
                    <h3 className='text-3xl w-60 font-bold'>No results for "{values.search}"</h3>
                    <p className='text-gray-600 text-sm mt-1.5'>The term you entered did not bring up any results.</p>
                </div>}
            </div>
        </main>
    </div>
  )
}

export default Inbox
