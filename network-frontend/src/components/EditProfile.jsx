import { useState, useContext } from 'react';
import { useFormik } from 'formik';

// Icon imports
import { MdModeEditOutline } from "react-icons/md";

// Schema imports
import { RegisterSchema } from '../schemas';

// Component imports
import Input from './Forms/Input.jsx';
import Header from './General/Header.jsx';
import Modal from './Modal.jsx';
import EditImage from './Forms/EditImage.jsx';

// Context imports
import AuthContext from '../context/AuthContext';
import GeneralContext from '../context/GeneralContext';

const EditProfile = () => {

    const { user, authTokens } = useContext(AuthContext); 
    const [ isVisible, setIsVisible] = useState(false);

    const { setPfpBig, handleImageModal } = useContext(GeneralContext);

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

    return (
        <div className='w-[600px]'>
            <Header back={true} header='Edit profile' verified={false}/>
            <div className='relative mt-1 flex flex-col items-center justify-center'>
                <figure className='relative flex flex-col items-center justify-center'>
                    <div className='w-[130px] h-[130px] overflow-hidden rounded-full'>
                        <img src={user.pfp} alt='user profile pic' className='h-full w-full object-fill cursor-pointer' onClick={() => {setPfpBig(user.pfp) ; handleImageModal()}}/>
                    </div>
                    <button className='w-5 h-5 flex items-center justify-center absolute bottom-2 text-white bg-twitter-blue opacity-90 hover:opacity-100 rounded-full'>
                        <MdModeEditOutline onClick={() => {setIsVisible(!isVisible)}}/>
                    </button>
                </figure>
                <p>{user.username}</p>
            </div>
            <div className='mt-1'>
                <Input type='text' value={values.profilename} name='profilename' id="Profile's name" handleChange={handleChange} handleBlur={handleBlur}
                    inputStyle='w-full h-[56px] bg-transparent text-white' error={errors['profilename']} touched={touched['profilename']} placeholder='Your name' />
                <Input type='text' value={values.username} name='username' id="Username" handleChange={handleChange} handleBlur={handleBlur}
                    inputStyle='w-full h-[56px] bg-transparent text-white' error={errors['username']} touched={touched['username']} placeholder='Your username' />
                <Input type='password' value={values.password} name='password' id="Password" handleChange={handleChange} handleBlur={handleBlur}
                    inputStyle='w-full h-[56px] bg-transparent text-white' error={errors['password']} touched={touched['password']} placeholder='Password' />
                <Input type='password' value={values.profilename} name='confirmation' id="Confirmation" handleChange={handleChange} handleBlur={handleBlur}
                    inputStyle='w-full h-[56px] bg-transparent text-white' error={errors['confirmation']} touched={touched['confirmation']} placeholder='Confirm password' />
            </div>
            <Modal isVisible={isVisible}>
                <EditImage handleCloseModal={() => {setIsVisible(!isVisible)}} name='image' value={values.image} handleOnChange={handleChange} handleOnBlur={handleBlur}/>
            </Modal>
        </div>
    )
}

export default EditProfile
