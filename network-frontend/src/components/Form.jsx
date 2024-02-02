import { useState, useRef, useContext, useLayoutEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

// Icon imports
import { BsEmojiSmile } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { HiOutlineGif } from "react-icons/hi2";
import { MdOutlineLocationOn } from "react-icons/md";

// Component imports
import CircleProgressBar from './CircleProgressBar';

// Context imports
import AuthContext from '../context/AuthContext';
import GeneralContext from '../context/GeneralContext';


const Form = ({ route, method, placeholder, borderStyle, textAreaStyle, message, handleAction, isEditing }) => {

    const [ isFocused, setIsFocused ] = useState(isEditing);
    
    const { user, authTokens } = useContext(AuthContext);
    const { darkMode } = useContext(GeneralContext);
    
    const navigate = useNavigate();

    const { values, handleChange } = useFormik({
        initialValues: {
            'content' : "What's happening !?"
        }
    })
    
    const text = useRef();
    const percentage = (values.content.length/280) * 100 

    const handleNewPost = () => {
        
        handleAction(route, method, authTokens, {'content' :text.current.value});
        text.current.value=placeholder;
        setIsFocused(false);
        values.content = "What's happening !?";
    }

    const handleFocus = () => {
        values.content = "";
        setIsFocused(true);
    }

    return <header className={`flex flex-col w-full p-2 border ${ darkMode ? 'border-gray-600' : 'border-gray-300'} ${borderStyle} pt-1 pr-2.5 pb-2.5 transition-all`}>
        <div className='mt-4 flex w-full items-start'>
            <div className='w-10 h-10 overflow-hidden rounded-full ml-2.5'>
                <img src={user.pfp} alt='user profile pic' className='h-full w-full object-fit' />
            </div>
            <div className={`w-full pr-2 ${!isFocused ? 'flex items-center' : ''}`}>
                <textarea  maxLength={280} value={values.content} name='content' ref={text} className={`${isFocused ? `${ darkMode ? 'text-white' : 'text-black'} w-full` : 'text-twitter-light-gray w-6/12' } text-lg text-bold ml-3 box-sizing:border-box p-1 resize-none focus:outline-none ${textAreaStyle}`} defaultValue={placeholder} onFocus={handleFocus} onChange={handleChange} />
                {!isFocused && 
                    <button disabled={true} className='opacity-50 ml-auto rounded-full bg-twitter-blue text-white p-5 h-5 text-md flex items-center'>{message}</button>
                }
            </div>
            </div>
        {isFocused && 
        <footer className='px-2.5 pb-2.5 flex justify-between items-center'>
            <ul className='ml-14 w-3/12 flex items-center justify-between text-twitter-blue text-lg'>
                <li>
                    <CiImageOn className='cursor-pointer'/>
                </li>
                <li>
                    <HiOutlineGif className='cursor-pointer'/>
                </li>
                <li>
                    <BsEmojiSmile className='cursor-pointer' />
                </li>
                <li>
                    <MdOutlineLocationOn className='opacity-50 cursor-not-allowed'/>
                </li>
            </ul>
            <div className='flex items-center'>
                <div className={`relative mr-2.5 w-[${25}px] h-[${25}px]`}>
                    { values.content.length > 0 &&
                    <CircleProgressBar circleWidth={25} percentage={percentage}/>
                    }
                    {
                        (values.content.length >= 280 * 0.75 && values.content.length < 271) &&
                        <span className='absolute top-1 left-1.5 text-gray-600 text-xs'>{280 - values.content.length}</span>
                    }
                      {
                        (values.content.length > 270 && values.content.length < 280) &&
                        <span className='absolute top-1 left-2.5 text-gray-600 text-xs'>{280 - values.content.length}</span>
                    }
                    {
                      values.content.length === 280 && 
                        <span className='absolute top-1 left-2.5 text-red-900 text-xs'>0</span>  
                    }
                </div>
                <button onClick={handleNewPost} className='ml-auto rounded-full bg-twitter-blue text-white p-5 h-5 text-md flex items-center'>{message}</button>
            </div>
        </footer>
        }
    </header>
};

export default Form;