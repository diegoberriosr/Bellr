import { useState, useContext } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';

// Icon imports
import { MdClose } from 'react-icons/md';
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

    const { authTokens } = useContext(AuthContext); 
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { mode,  account, setAccount} = useContext(GeneralContext);

    const pfpData = new FormData();
    const backgroundData = new FormData();

    const { values, errors, touched, handleChange, handleBlur, resetForm, setFieldValue } = useFormik({
        initialValues: {
            email: account.email,
            username: account.username,
            password: '',
            confirmation: '',
            profilename: account.profilename,
            bio: account.bio,
            pfp: account.pfp,
            background: account.background

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
            url : `http://127.0.0.1:8000/user/edit/${account.username}`,
            method : 'PUT',
            headers : headers,
            data : {email : values.email, username : values.username, password: values.password, confirmation: values.confirmation, profilename : values.profilename,
                    bio : values.bio, pfp : values.pfp }
        })
        .then( ( res ) => {
            setLoading(false);
            setAccount( res.data.account);
            setShrink(true);
        })
        .catch( error => {
            setLoading(false);
            console.log(error);
        })
    }

    const reset = () => {
      resetForm({
        values : {
            email: account.email,
            username: account.username,
            password: '',
            confirmation: '',
            profilename: account.profilename,
            bio: account.bio,
            pfp: account.pfp,
            background: account.background

        }
      })
    }

    const handleDeleteBackground = () => {
        setFieldValue('background', '');
    }

    const handleLoadBackground = (event) => {
        const file = event.target.files[0];
        
        if (file) {
            backgroundData.append('image', file)
            const localImageUrl = URL.createObjectURL(file);
            setFieldValue('background', localImageUrl);
        }    
    }

    const handleChangePfp = (event) => {
        const file = event.target.files[0];
        
        if (file) {
            pfpData.append('image', file)
            const localImageUrl = URL.createObjectURL(file);
            setFieldValue('pfp', localImageUrl);
        }   
    }

    return (
        <div className={`w-screen h-screen sm:mt-10 sm:w-[600px] sm:h-[600px] bg-${mode.background} ${mode.text}
         ${ shrink ? 'animate-shrink' : 'animate-grow'} sm:rounded-xl ${loading ? 'brightness-50' : ''}`}>
            <header className='sticky top-0 h-12 p-5 flex justify-between items-center z-11 transform'>
                <div className='flex items-center'>
                    <MdClose className='text-2xl text-white mt-1 cursor-pointer' onClick={() => {setShrink(true)}}/>
                    <h3 className='text-xl ml-5 font-bold'> { deleting ? 'Delete' : 'Edit' } Profile </h3>
                </div>
                {!deleting &&
                <div className='flex items-center'>
                    <TfiReload className='text-lg mr-2.5 cursor-pointer' onClick={reset}/>
                    <button disabled={loading} className={`bg-white w-[100px] h-9 flex items-center justify-center rounded-full text-black font-bold ${ loading ? 'opacity-90' : 'opacity-90 hover:opacity-100'}`} onClick={handleUpdate}>
                        { loading ? 
                            <ClipLoader loading={loading} size={20} aria-label='Loading spinner' data-testid='loader'/>
                            :
                            <span>Save</span>
                        }
                    </button>
                </div>
                }
            </header>
            <main className='h-[552px] overflow-y-auto'>
                { deleting ?
                <div className='w-full mt-[20%] flex flex-col items-center justify-center'>
                    <h3 className='text-2xl font-bold'>Are you sure?</h3>
                    <p>This action is irreversible. All your information will be lost.</p>
                    <button className='w-6/12 mt-5 h-10 border bg-white text-black opacity-80 hover:opacity-100 rounded-full' onClick={() =>{setDeleting(false)}}>Cancel</button>
                    <button className='w-6/12 mt-5 h-10 border border-red-900 bg-transparent text-white opacity-80 hover:bg-red-900 hover:opacity-100 rounded-full'>Delete account</button>
                </div>
                :
                <>
                <figure className='relative w-full h-52'>
                    <div className={`absolute top-0 w-full h-full ${ values.background === '' ? 'bg-gray-900'  : ''}`}>
                        {values.background !== '' && <img src={values.background} alt="user's profile background" className='w-full h-full object-fill'/> }
                    </div>
                    <div className='absolute top-0 w-full h-full flex items-center justify-center'>
                        <label htmlFor='background-input' className='w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-gray-700 transition-colors hover:bg-opacity-70'>
                                <input type='file' id='background-input' name='background' accept='images/*' className='hidden' onChange={handleLoadBackground}/>
                                <CiCamera className='text-2xl'/>
                        </label>
                        { values.background !== '' && 
                        <div className='w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-gray-700 transition-colors ml-5 hover:bg-opacity-70' onClick={handleDeleteBackground}>
                                <MdClose className='text-2xl'/>
                        </div>
                        }   
                    </div>
                    <label className='absolute -bottom-[65px] left-5 w-[130px] h-[130px] rounded-full border border-black border-4'>
                        <img src={values.pfp} alt='user pfp' className='w-full h-full object-fill rounded-full'/>
                        <div htmlFor='background-input' className='absolute top-0 w-full h-full rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-gray-700 transition-colors hover:bg-opacity-70 '>
                                <CiCamera className='text-2xl cursor-pointer'/>
                                <input type='file' id='background-input' name='background' accept='images/*' className='hidden' onChange={handleChangePfp}/>
                        </div>
                    </label>
                </figure>
                <form className='w-full px-1 sm:px-5 py-5 mt-20'>
                    <Input type='text' value={values.profilename} name='profilename' id='Profilename'  containerStyle='w-full h-5' 
                    inputStyle='w-full h-full bg-transparent' error={errors['profilename']} touched={touched['profilename']} 
                    maxValue={15} displayMaxValue={true}
                    placeholder='Name' handleBlur={handleBlur} handleChange={handleChange}/>
                    <Input type='text' value={values.bio} name='bio' id='Bio'  containerStyle='mt-16 w-full h-5' 
                    inputStyle='w-full h-full bg-transparent' error={errors['bio']} touched={touched['bio']} 
                    maxValue={160} displayMaxValue={true}
                    placeholder='Bio' handleBlur={handleBlur} handleChange={handleChange}/>
                    <Input type='text' value={values.location} name='location' id='Location'  containerStyle='mt-16 w-full h-5' 
                    inputStyle='w-full h-full bg-transparent' error={errors['location']} touched={touched['location']} 
                    placeholder='Location' handleBlur={handleBlur} handleChange={handleChange}/>
                    <Input type='text' value={values.website} name='website' id='Website'  containerStyle='mt-16 w-full h-5' 
                    inputStyle='w-full h-full bg-transparent' error={errors['website']} touched={touched['website']} 
                    placeholder='website' handleBlur={handleBlur} handleChange={handleChange}/>
                    <button type='button' className='w-full mt-16 h-10 border border-red-900 bg-transparent text-white opacity-80 hover:bg-red-900 hover:opacity-100 rounded-full' onClick={() => setDeleting(true)}>Delete account</button>
                </form>
                </>
                }
            </main>
        </div>
    )
}

export default EditProfile
