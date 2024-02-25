import { useState, useRef, useContext } from 'react';
import { useFormik } from 'formik';

// Icon imports
import { BsEmojiSmile } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { HiOutlineGif } from "react-icons/hi2";
import { MdOutlineLocationOn } from "react-icons/md";
import { GoPaperclip } from "react-icons/go";
import { LiaEraserSolid } from "react-icons/lia";

// Component imports
import CircleProgressBar from '../General/CircleProgressBar';
import PostImages1 from '../Posts/PostImages1';
import PostImages2 from '../Posts/PostImages2';
import PostImages3 from '../Posts/PostImages3';
import PostImages4 from '../Posts/PostImages4';


// Context imports
import AuthContext from '../../context/AuthContext';
import GeneralContext from '../../context/GeneralContext';


const Form = ({ route, method, placeholder, borderStyle, textAreaStyle, message, replyId }) => {

    const [ isFocused, setIsFocused ] = useState(false);
    const [ isAttatchingImage, setIsAttatchingImage] = useState(false);
    const [images, setImages] = useState([]);

    const { user, authTokens } = useContext(AuthContext);
    const { mode, handleImageModal, handleNew, handleReply } = useContext(GeneralContext);

    const postImages = new FormData();

    const { values, handleChange } = useFormik({
        initialValues: {
            'content' : "What's happening !?",
            'image' : null
        }
    })

    
    const text = useRef();
    const percentage = (values.content.length/280) * 100 

    const handleNewPost = () => {
        if (isAttatchingImage) {
            setIsAttatchingImage(!isAttatchingImage);
            return;
        }

        replyId ? handleReply(replyId, values.content) : handleNew(values.content) ; // If the Id of a post is passed in the parameters, it is a reply form.
        text.current.value=placeholder;
        setIsFocused(false);
        values.content = "What's happening !?";
        values.image = null;
    }

    const handleFocus = () => {
        values.content = "";
        setIsFocused(true);
    }

    const handleLoadImage = (event) => {
        const files = Array.from(event.target.files);

        if (files) {
            const localUrls = files.map( file => {
                postImages.append('image', file)
                const localImageUrl = URL.createObjectURL(file);
                return localImageUrl;
            })
            setImages( prevUrls => {
                if (prevUrls) return [ ...prevUrls, ...localUrls];
                return [...localUrls];
            });
        }    
    }

    const handleDeleteImage = (url) => {
        setImages(images.filter( image => image !== url));
    };

    console.log(images.length);

    return <header className={`relative flex flex-col w-full p-2 border ${mode.separator} ${borderStyle} pt-1 pr-2.5 pb-2.5 transition-all`}>
        { (values.image ) && 
              ( isAttatchingImage ? 
                <span className='absolute top-0 right-4 cursor-pointer text-red-900 flex items-center text-sm' onClick={() => { setIsAttatchingImage(!isAttatchingImage); values.image = null}}>
                    <LiaEraserSolid className='mr-1'/>
                    Delete attatchment
                    </span>
                :
                <span className='absolute top-0 right-4 cursor-pointer flex items-center text-sm text-twitter-blue' onClick={() => {setIsAttatchingImage(!isAttatchingImage)}}>
                    <GoPaperclip className='mr-1'/>
                    Image attatched
                    </span>
                )
        }
        <div className='mt-4 flex w-full items-start'>
            <div className='w-10 h-10 overflow-hidden rounded-full ml-2.5'>
                <img src={user.pfp} alt='user profile pic' className='h-full w-full object-fit' />
            </div>
            <div className={`w-full pr-2 ${!isFocused ? 'flex items-center' : ''}`}>
                { isAttatchingImage ? 
                <input value={values.image} name='image' className={`${mode.text} bg-transparent w-full text-lg text-bold ml-3 box-sizing:border-box p-1 resize-none focus:outline-twitter-blue`} placeholder='Paste your image link here' onChange={handleChange}/>
                :
                <textarea  maxLength={280} value={values.content} name='content' ref={text} className={`${isFocused ? `${mode.text} w-full` : 'text-twitter-light-gray w-6/12' } text-lg text-bold ml-3 box-sizing:border-box p-1 resize-none focus:outline-none ${textAreaStyle}`} onFocus={handleFocus} onChange={handleChange} />
                }
                { !isFocused && 
                    <button disabled={true} className={`opacity-50 ml-auto rounded-full bg-${mode.color} text-white p-5 h-5 text-md flex items-center`}>{message}</button>
                }
            </div>
        </div>
        <div className={`mb-2.5 ml-auto pr-3 w-[90%] h-6/12`}>
                { images.length === 1 && <PostImages1 sources={images[0]} inForm={true} handleDeleteImage={handleDeleteImage}/> }
                { images.length === 2 && <PostImages2 sources={images} inForm={true} handleDeleteImage={handleDeleteImage}/> }
                { images.length === 3 && <PostImages3 sources={images} inForm={true} handleDeleteImage={handleDeleteImage}/> }
                { images.length >= 4  && <PostImages4 sources={images} inForm={true} handleDeleteImage={handleDeleteImage}/> }
        </div>
        {isFocused && 
        <footer className='px-2.5 pb-2.5 flex justify-between items-center'>
            <ul className={`ml-14 w-3/12 flex items-center justify-between text-lg text-${mode.color}`}>
                <li>
                    <input type='file' id='add-image' name='attatchment' accept='images/*' className='hidden' onChange={handleLoadImage}/>
                    <label htmlFor='add-image'>
                        <CiImageOn className='cursor-pointer'/>
                    </label>
                </li>
                <li>
                    <HiOutlineGif className='cursor-pointer' onClick={handleImageModal}/>
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
                <button onClick={handleNewPost} className={`ml-auto rounded-full bg-${mode.color} text-white p-5 h-5 text-md flex items-center`}>{isAttatchingImage ? 'Continue' : 'Post'}</button>
            </div>
        </footer>
        }
    </header>
};

export default Form;