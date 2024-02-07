import { useState, useContext, useRef } from 'react';
import { useFormik } from 'formik';

// Icon imports
import { IoCloseSharp } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { HiOutlineGif } from "react-icons/hi2";
import { MdOutlineLocationOn } from "react-icons/md";
import { TiWorld } from "react-icons/ti";
import { GoPaperclip } from "react-icons/go";
import { LiaEraserSolid } from "react-icons/lia";

// Component imports
import CircleProgressBar from '../General/CircleProgressBar';

// Context imports
import GeneralContext from '../../context/GeneralContext';
import AuthContext from '../../context/AuthContext';

const ModalForm = ({ placeholder, message, textAreaStyle, borderStyle}) => {

    const { darkMode, handleModal, isEditing, setIsEditing, editedPost, setEditedPost, handleEdit, handleNew } = useContext(GeneralContext);
    const [ isFocused, setIsFocused ] = useState(isEditing);
    const [ isAttatchingImage, setIsAttatchingImage] = useState(false);

    const { user, authTokens } = useContext(AuthContext);

    const { values, handleChange } = useFormik({
        initialValues: {
            'content' : isEditing ? editedPost.content : "What's happening !?",
            'image' : isEditing ? editedPost.image : null
        }
    })
    
    const text = useRef();
    const percentage = (values.content.length/280) * 100 

    const handleNewPost = () => {
        if (isAttatchingImage){
            setIsAttatchingImage(!isAttatchingImage);
            return;
        }
            
        isEditing ? handleEdit(editedPost.id, values.content) : handleNew(values.content);
            setIsFocused(false);
            setIsEditing(false);
            setEditedPost(null);
            values.content = "What's happening !?";
            values.image = null;
            handleModal();
    }

    const handleFocus = () => {
        values.content = "";
        setIsFocused(true);
    }

    return <div className={`relative w-screen sm:w-[600px] h-[277px] ${ darkMode ? 'bg-black' : 'bg-white'} rounded-2xl mt-5`}>
        <IoCloseSharp className={`absolute top-4 left-2 text-xl ${ darkMode ? 'text-white' : 'text-dark'} cursor-pointer`} onClick={() => {handleModal()}}/>
        <span className='absolute top-4 right-11 text-twitter-blue font-bold text-sm'>Drafts</span>
        <header className={`flex flex-col w-full h-full transition-all`}>
        <div className='absolute left-1 top-[4.5rem] flex w-full items-start'>
            <div className='w-10 h-10 overflow-hidden rounded-full ml-2.5'>
                <img src={user.pfp} alt='user profile pic' className='h-full w-full object-fit' />
            </div>
            <div className={`w-full pr-2 ${!isFocused ? 'flex items-center' : ''}`}>
                {isAttatchingImage ?
                <input value={values.image} name='image' className={`ml-4 bg-transparent w-[94%] ${ darkMode ? 'text-white' : 'text-black'} mb-20 focus:outline-none`} placeholder='Insert your image link here' onChange={handleChange}/>
                :
                <textarea  maxLength={280} value={values.content} name='content' ref={text} className={`${isFocused ? `${ darkMode ? 'text-white' : 'text-black'} w-[90%]` : 'text-twitter-light-gray w-6/12' } text-lg text-bold ml-3 h-24 box-sizing:border-box p-1 resize-none focus:outline-none ${textAreaStyle}`} defaultValue={placeholder} onFocus={handleFocus} onChange={handleChange}/>
                }
                {values.image ?
                    <>
                         <span className='absolute -bottom-9 left-2 flex items-center text-twitter-blue font-bold'> <GoPaperclip className='mr-1 text-lg'/> Image attatched </span>
                         <span className='absolute -bottom-10 right-6 flex items-center text-red-900 font bold cursor-pointer' onClick={() => { setIsAttatchingImage(false); values.image = null}}><LiaEraserSolid className='mr-1 text-lg'/> Delete attatchment</span>
                    </>
                    :
                    <span className='absolute -bottom-9 left-2 flex items-center text-twitter-blue font-bold'> <TiWorld className='mr-1 text-lg'/> Everyone can reply </span>
                
                }
            </div>
        </div>
        <footer className={`w-[95%] ml-3 h-auto absolute bottom-3 flex justify-between items-center border ${ darkMode ? 'border-gray-600' : 'border-gray-300'} border-l-0 border-r-0 border-b-0`}>
            <ul className='w-3/12 flex items-center justify-between text-twitter-blue text-lg mt-1.5'>
                <li>
                    <CiImageOn className='cursor-pointer' onClick={() => {setIsAttatchingImage(!isAttatchingImage)}}/>
                </li>
                <li>
                    <HiOutlineGif className='cursor-pointer' onClick={() => {setIsAttatchingImage(!isAttatchingImage)}}/>
                </li>
                <li>
                    <BsEmojiSmile className='cursor-pointer' />
                </li>
                <li>
                    <MdOutlineLocationOn className='opacity-50 cursor-not-allowed'/>
                </li>
            </ul>
            <li className='flex items-center mt-1.5'>
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
                <button onClick={handleNewPost} disabled={(!isFocused || values.content.length === 0 )} className={`${ !isFocused || values.content.length === 0 ? 'opacity-50' : ''} ml-auto rounded-full bg-twitter-blue text-white p-5 h-5 text-md flex items-center`}>{ isAttatchingImage ? 'Continue' : message}</button>
            </li>
        </footer>
    </header>
    </div>
};

export default ModalForm;