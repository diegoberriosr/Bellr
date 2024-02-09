import { useState, useContext } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';

// Icon imports
import { MdClose } from 'react-icons/md';
import { MdModeEditOutline } from "react-icons/md";
import { CiCamera } from "react-icons/ci";
import { TfiReload } from "react-icons/tfi";

// Schema imports
import { RegisterSchema } from '../../schemas/index.js';

// Component imports
import Input from '../Forms/Input.jsx';
import ClipLoader from "react-spinners/ClipLoader";

// Context imports
import AuthContext from '../../context/AuthContext.js';
import GeneralContext from '../../context/GeneralContext.js';

const EditProfile = ({ profile, shrink, setShrink }) => {

    const { darkMode, authTokens } = useContext(AuthContext); 
    const [loading, setLoading] = useState(false);

    const { setPfpBig } = useContext(GeneralContext);

    const { values, errors, touched, handleChange, handleBlur } = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            confirmation: '',
            profilename: '',
            bio: '',
            pfp: '',

        },
        validationSchema: RegisterSchema,
        validateOnChange: false,
        validateOnBlur: true
    })

    const handleUpdate = () => {

        setLoading(true);
        let headers;

        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }

        axios({
            url : '--- TO DO ---',
            method : 'PUT',
            headers : headers,
            data : {email : values.email, username : values.username, password: values.password, confirmation: values.confirmation, profilename : values.profilename,
                    bio : values.bio, pfp : values.pfp }
        })
        .then( () => {
            setLoading(false);
            setShrink(true);
        })
        .catch( error => {
            setLoading(false);
            console.log(error);
        })
    }

    return (
        <div className={`w-screen h-screen sm:w-[600px] sm:h-[600px] bg-black
         ${ shrink ? 'animate-shrink' : 'animate-grow'} rounded-xl ${loading ? 'brightness-50' : ''}`}>
            <header className='sticky top-0 h-12 p-5 flex justify-between items-center z-11 transform'>
                <div className='flex items-center'>
                    <MdClose className='text-2xl text-white mt-1 cursor-pointer' onClick={() => {setShrink(true)}}/>
                    <h3 className='text-xl ml-5 font-bold'> Edit Profile</h3>
                </div>
                <div className='flex items-center'>
                    <TfiReload className='text-lg mr-2.5 cursor-pointer'/>
                    <button disabled={loading} className={`bg-white w-[100px] h-9 flex items-center justify-center rounded-full text-black font-bold ${ loading ? 'opacity-90' : 'opacity-90 hover:opacity-100'}`} onClick={handleUpdate}>
                        { loading ? 
                            <ClipLoader loading={loading} size={20} aria-label='Loading spinner' data-testid='loader'/>
                            :
                            <span>Save</span>
                        }
                    </button>
                </div>
            </header>
            <main className='h-[552px] overflow-y-auto'>
                <figure className='relative w-full h-52'>
                    <div className='absolute top-0 w-full h-full'>
                        <img src='https://i.pinimg.com/originals/66/44/1e/66441ef3f203e8f2598c26f96495d642.gif' alt="user's profile background" className='w-full h-full object-fill'/>
                    </div>
                    <div className='absolute top-0 w-full h-full flex items-center justify-center'>
                        <div className='w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-gray-700 transition-colors hover:bg-opacity-70'>
                                <CiCamera className='text-2xl'/>
                        </div>
                        <div className='w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-gray-700 transition-colors ml-5 hover:bg-opacity-70'>
                                <MdClose className='text-2xl'/>
                        </div>
                    </div>
                    <div className='absolute -bottom-[65px] left-5 w-[130px] h-[130px] rounded-full border border-black border-4'>
                        <img src='https://cdn.dribbble.com/users/1396703/screenshots/3952983/pixel-goust-2.gif' alt='user pfp' className='w-full h-full object-fill rounded-full'/>
                        <div className='absolute top-0 w-full h-full rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-gray-700 transition-colors hover:bg-opacity-70 '>
                                <CiCamera className='text-2xl cursor-pointer'/>
                        </div>
                    </div>
                </figure>
                <form className='w-full px-5 mt-20'>
                    <Input type='text' value={values.username} name='username' id='Username'  containerStyle='w-full h-5' 
                    inputStyle='w-full h-full bg-transparent' error={errors['username']} touched={touched['username']} 
                    maxValue={15} displayMaxValue={true}
                    placeholder='Username' handleBlur={handleBlur} handleChange={handleChange}/>
                    <Input type='text' value={values.bio} name='bio' id='Bio'  containerStyle='mt-16 w-full h-5' 
                    inputStyle='w-full h-full bg-transparent' error={errors['Bio']} touched={touched['Bio']} 
                    maxValue={160} displayMaxValue={true}
                    placeholder='Bio' handleBlur={handleBlur} handleChange={handleChange}/>
                    <Input type='text' value={values.location} name='location' id='Location'  containerStyle='mt-16 w-full h-5' 
                    inputStyle='w-full h-full bg-transparent' error={errors['location']} touched={touched['location']} 
                    placeholder='Location' handleBlur={handleBlur} handleChange={handleChange}/>
                    <Input type='text' value={values.website} name='website' id='Website'  containerStyle='mt-16 w-full h-5' 
                    inputStyle='w-full h-full bg-transparent' error={errors['website']} touched={touched['website']} 
                    placeholder='website' handleBlur={handleBlur} handleChange={handleChange}/>
                </form>
            </main>
        </div>
    )
}

export default EditProfile
