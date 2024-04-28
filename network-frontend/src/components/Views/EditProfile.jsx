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
import MoonLoader from 'react-spinners/MoonLoader';

// Context imports
import AuthContext from '../../context/AuthContext.js';
import GeneralContext from '../../context/GeneralContext.js';

const EditProfile = ({ profile, shrink, setShrink }) => {

    const { authTokens, logoutUser, setUser, user } = useContext(AuthContext); 
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { mode,  account, setAccount, setPosts} = useContext(GeneralContext);
    const [imageData, setImageData] = useState({
      pfp : null,
      background : null  
    });

    const { values, errors, touched, handleChange, handleBlur, resetForm, setFieldValue } = useFormik({
        initialValues: {
            email: account.email,
            username: account.username,
            profilename: account.profilename,
            bio: account.bio,
            website : account.website,
            location : account.location,
            pfp: account.pfp,
            background: account.background

        },
        validationSchema: RegisterSchema,
        validateOnChange: false,
        validateOnBlur: true
    })

    const handleUpdate = () => {
        
        setLoading(true);

        const data = new FormData();
        data.append('email', values.email);
        data.append('username', values.username);
        data.append('profilename', values.profilename);
        data.append('bio', values.bio);
        data.append('website', values.website);
        data.append('location', values.location);
        if ( imageData.pfp ) data.append('pfp', imageData.pfp);
        if ( imageData.background) data.append('background', imageData.background);

        
        for ( const [key, value] of data.entries()){
            console.log(key, value);
        }

        let headers;

        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access),
                'Content-Type' : 'multipart/form-data'
            }
        }

        axios({
            url : `https://bellr.onrender.com/user/edit/${account.username}`,
            method : 'PUT',
            headers : headers,
            data : data
        })
        .then( ( res ) => {
            setLoading(false);
            setAccount( res.data.account);
            setUser( prevStatus => ({...prevStatus, 
                profilename : res.data.account.profilename, 
                username: res.data.account.username, 
                pfp : res.data.account.pfp}));
            setPosts( prevStatus => {
                const updatedStatus = prevStatus.map( post => {
                    if (post.user.id === user.id) {
                        post.user.profilename = res.data.account.profilename;
                        post.user.username = res.data.account.username;
                        post.user.pfp = res.data.account.pfp;
                    };
                    return post;
                });
                return updatedStatus;
            })
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
            profilename: account.profilename,
            bio: account.bio,
            website : account.website,
            location : account.location,
            pfp: account.pfp,
            background: account.background
        }
      })
    }

    const handleDeleteBackground = () => {
        setFieldValue('background', '');
        setImageData({...imageData, background : null});
    }

    const handleLoadBackground = (event) => {
        const file = event.target.files[0];
        
        if (file) {
            const localImageUrl = URL.createObjectURL(file);
            setImageData({...imageData, background : file});
            setFieldValue('background', localImageUrl);
        }    
    }

    const handleChangePfp = (event) => {
        const file = event.target.files[0];
        
        if (file) {
            const localImageUrl = URL.createObjectURL(file);
            setFieldValue('pfp', localImageUrl);
            setImageData({...imageData, pfp: file});
        }   
    }

    const handleDeleteProfile = () => {
        setLoading(true);
        let headers;

        if (authTokens) {
            headers = {
                'Authorization' : 'Bearer ' + String(authTokens.access)
            }
        }

        axios({
            url : `https://bellr.onrender.com/user/delete/${account.username}`,
            method : 'PUT',
            headers : headers
        })
        .then( () => {
            logoutUser();
            setLoading(false);
        })
        .catch( err => {
            setLoading(false);
            console.log(err);
        })
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
                    <button className='w-6/12 mt-5 h-10 border border-red-900 bg-transparent text-white opacity-80 hover:bg-red-900 hover:opacity-100 rounded-full flex items-center justify-center'
                    onClick={handleDeleteProfile}>{
                        loading ? <MoonLoader color='#FFFFFF' size={25} loading={loading}/> : 'Delete'
                    }</button>
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
                    placeholder='Website' handleBlur={handleBlur} handleChange={handleChange}/>
                    <button type='button' className='w-full mt-16 h-10 border border-red-900 bg-transparent text-white opacity-80 hover:bg-red-900 hover:opacity-100 rounded-full' onClick={() => setDeleting(true)}>Delete account</button>
                </form>
                </>
                }
            </main>
        </div>
    )
}

export default EditProfile
