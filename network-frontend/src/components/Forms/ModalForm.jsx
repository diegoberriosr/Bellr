import { useState, useContext, useRef } from 'react';
import { useFormik } from 'formik';

// Icon imports
import { IoCloseSharp } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { HiOutlineGif } from "react-icons/hi2";
import { MdOutlineLocationOn } from "react-icons/md";
import { TiWorld } from "react-icons/ti";

// Component imports
import CircleProgressBar from '../General/CircleProgressBar';
import EmojiMenu from '../General/EmojiMenu';
import PostImages1 from '../Posts/PostImages1';
import PostImages2 from '../Posts/PostImages2';
import PostImages3 from '../Posts/PostImages3';
import PostImages4 from '../Posts/PostImages4';
import MoonLoader from 'react-spinners/MoonLoader';

// Context imports
import GeneralContext from '../../context/GeneralContext';
import AuthContext from '../../context/AuthContext';

const ModalForm = ({ placeholder, message, textAreaStyle, shrink, setShrink}) => {

    const { mode, isEditing, setIsEditing, editedPost, setEditedPost, handleEdit, handleNew } = useContext(GeneralContext);
    const [ isFocused, setIsFocused ] = useState(isEditing);
    const [ loading, setLoading ] = useState(false);
    const [images, setImages] = useState( editedPost ? editedPost.images : []);
    const [ files, setFiles] = useState([]);
    console.log(files);
    const { user } = useContext(AuthContext);

    const { values, handleChange, setFieldValue } = useFormik({
        initialValues: {
            'content' : isEditing ? editedPost.content : "What's happening !?",
            'image' : isEditing ? editedPost.image : null
        }
    })
    
    const text = useRef();
    const percentage = (values.content.length/280) * 100 

    const handleNewPost = () => {            
        const data = new FormData();

        data.append('content', values.content);

        if ( files.length > 0) files.forEach( file => data.append('images[]', file));
        if ( isEditing ) images.forEach( image => data.append('updated_images[]', image));

        isEditing ? handleEdit(editedPost.id, data) : handleNew(data, setLoading);
            setIsFocused(false);
            setIsEditing(false);
            setEditedPost(null);
            values.content = "What's happening !?";
            values.image = null;
            setShrink(true);
    }

    const handleFocus = () => {
        values.content = "";
        setIsFocused(true);
    }

    const handleLoadImage = (event) => {
        const file = event.target.files[0];

        if (file){
            setFiles( prevStatus => ([...prevStatus, file]));
            const localUrl = URL.createObjectURL(file);
            setImages( prevStatus => ([...prevStatus, localUrl]));
        }
    };

    const handleDeleteImage = (url) => {
        setImages(images.filter( image => image !== url));
    };

    return <div className={`w-screen mt-10 sm:w-[600px] bg-${mode.background} p-2.5 rounded-xl transition-all ${ shrink ? 'animate-shrink' : 'animate-grow'}`}>
        <header className='w-full flex items-center justify-between'>
        <IoCloseSharp className={`left-2 text-xl ${mode.text} cursor-pointer`} onClick={() => {setShrink(true)}}/>
        <span className={`right-11 text-${mode.color} font-bold text-sm`}>Drafts</span>
        </header>
        <main className={`flex flex-colw-fulltransition-all`}>
              <div className='flex w-full items-start mt-12'>
               <div className='w-10 h-10 overflow-hidden rounded-full ml-2.5'>
                <img src={user.pfp} alt='user profile pic' className='h-full w-full object-fit' />
                </div>
                <div className={`w-full pr-2 ${!isFocused ? 'flex items-center' : ''}`}>
                    <textarea  maxLength={280} value={values.content} name='content' ref={text} className={`${isFocused ? `${mode.text} w-[90%]` : 'text-twitter-light-gray w-6/12' } text-sm fold:text-base sm:text-lg text-bold ml-3 h-24 box-sizing:border-box p-1 resize-none focus:outline-none ${textAreaStyle}`} defaultValue={placeholder} onFocus={handleFocus} onChange={handleChange}/>
                </div>
                </div>
        </main>
        <div className={`mb-2.5 ml-auto pr-3 w-[90%] h-6/12`}>
                { images.length === 1 && <PostImages1 sources={images} inForm={true} handleDeleteImage={handleDeleteImage}/> }
                { images.length === 2 && <PostImages2 sources={images} inForm={true} handleDeleteImage={handleDeleteImage}/> }
                { images.length === 3 && <PostImages3 sources={images} inForm={true} handleDeleteImage={handleDeleteImage}/> }
                { images.length >= 4  && <PostImages4 sources={images} inForm={true} handleDeleteImage={handleDeleteImage}/> }
        </div>
        <span className={`pl-1 flex items-center text-${mode.color} font-bold`}> <TiWorld className='mr-1 text-lg'/> Everyone can reply </span>
        <footer className={`w-[95%] ml-3 h-auto flex justify-between items-center border ${ mode.separator} border-l-0 border-r-0 border-b-0`}>
            <ul className={`w-3/12 flex items-center justify-between text-twitter-blue text-lg mt-1.5 text-${mode.color}`}>
                <li>
                <li>
                    <input type='file' id='add-image' name='attatchment' accept='images/*' className='hidden' onChange={handleLoadImage}/>
                    <label htmlFor='add-image'>
                        <CiImageOn className='cursor-pointer'/>
                    </label>
                </li>
                </li>
                <li>
                    <HiOutlineGif className='cursor-pointer'/>
                </li>
                <li className='hidden mobile:block'>
                    <EmojiMenu content={values.content} setFieldValue={setFieldValue} />
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
                <button onClick={handleNewPost} disabled={(!isFocused || values.content.length === 0 )} className={`${ !isFocused || values.content.length === 0 ? 'opacity-50' : ''} ml-auto rounded-full bg-twitter-blue text-white p-5 h-5 text-md flex items-center bg-${mode.color}`}>
                    {loading ? <MoonLoader loading={loading} size={25} color='#FFFFFF'/> : message }
                    </button>
            </li>
        </footer>
    </div>
};

export default ModalForm;