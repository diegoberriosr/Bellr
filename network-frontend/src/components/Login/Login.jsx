import { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';

// Component imports
import Input from '../Forms/Input';
import { GoogleLogin } from '@react-oauth/google';
// Icon imports
import { PiDogBold } from "react-icons/pi";
import { IoArrowBack, IoCloseSharp } from "react-icons/io5";

// Context imports
import AuthContext from '../../context/AuthContext';


const Login = ({ handleCloseModal, openForgottenPassword, setLoading, setLoadingScreen }) => {

  const [ errorMessage, setErrorMessage ] = useState(false);


  const [ step, setStep] = useState(0);

  const { loginUser } = useContext(AuthContext);

  const {values, errors, touched, handleChange, handleBlur} = useFormik({
    initialValues: {
        'username' : '',
        'password' : ''
    }
  });

  const handleContinue = () => {
    if (step < 1) {
        setStep(step+1);
        return;
    }
    loginUser(values, setErrorMessage, setLoading, setLoadingScreen);
  }

  const STEPS = [
    {
        elements : [
          
            {value: values.username, type: 'text', name: 'username', id : 'Username',  placeholder: 'Username', containerStyle: 'mt-10', inputStyle: 'w-[300px] h-[56px] bg-transparent text-white', handleChange : handleChange, handleBlur : handleBlur },

            
        ]
    },
    {
        elements : [
            {value: values.username, type: 'text', disabled:true, name: 'username',  placeholder: 'Username', inputStyle: 'w-[300px] h-[56px] bg-opacity-50 text-white'},
            {value: values.password, type: 'password', name: 'password',  placeholder: 'Password', containerStyle : 'mt-5', inputStyle: 'w-[300px] h-[56px] bg-transparent text-white'},
        ]
    }
  ]

  useEffect ( () => {
    
    const timer = setTimeout(() => {
        setErrorMessage(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage])

  return (
    <div className='relative w-[600px] h-[650px] bg-black text-white  flex flex-col items-center rounded-xl pt-2.5 mt-auto mb-auto'>
        {step === 0 ? <IoCloseSharp className='absolute top-3.5 left-3 text-xl cursor-pointer' onClick={handleCloseModal}/> : <IoArrowBack className='absolute top-3.5 left-3 text-xl cursor-pointer' onClick={ () => {setStep(step-1)}}/> }
        <PiDogBold className='text-4xl'/>
        <div className='w-9/12 mt-6'>
            <h2 className='ml-16 text-3xl font-bold'>{step === 0 ? 'Login' : 'Enter password'}</h2>
            <form className='flex flex-col items-center jusitify-center w-full mt-9' onSubmit={(e) => {loginUser(e, setErrorMessage)}}>
                {step === 0 &&
                <>
                     <GoogleLogin
          logo_alignment='center'
          shape='pill'
          width='300'
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
                <button className='mt-5 w-[300px] h-10 bg-white rounded-full text-black bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center'>
                    <img src='https://e7.pngegg.com/pngimages/255/774/png-clipart-apple-logo-apple-company-leaf.png' alt='apple logo' width='20' className='mr-1'/>
                    <span>Log in with Apple</span>
                </button>
                </>
                }
                {STEPS[step].elements.map( (element, index) => 
                 
                    <Input key={index} type={element.value} value={element.value} id={element.id}
                    name={element.name} containerStyle={element.containerStyle} inputStyle={element.inputStyle}
                    error={errors[element.name]} touched={touched[element.name]} placeholder={element.placeholder}
                    disabled={element.disabled} handleChange={handleChange} handleBlur={handleBlur}
                    />
                )}
                {step === 0 &&
                    <div className='absolute top-60 w-full flex items-center justify-center mt-2'>
                      <span className='border border-gray-800 w-[130px]' />
                      <span className='ml-2.5 mr-2.5'>or</span>
                      <span className='border border-gray-800 w-[130px]' />
                    </div>
                } 
                <button type='button' className={`${ step === 0 ? 'mt-5' : 'mt-32'} font-bold w-[300px] m-w-[400] h-10  bg-white rounded-full text-black bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center`} onClick={handleContinue}>Continue</button>
                {step === 0 && 
                <>
                    <button type='button' className='mt-5 font-bold w-[300px] h-10  bg-transparent rounded-full border border-gray-icon text-white bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center' onClick={openForgottenPassword}>Forgot password</button>
                    <p className='absolute bottom-20 text-icon-gray tex-base'>Don't have an account ? <span className='text-twitter-blue'>Register.</span></p>
                </>
                }
            </form>
        </div>
        {errorMessage && <div className='absolute bottom-0 w-60 h-10 flex items-center justify-center text-white bg-twitter-blue font-bold text-xs rounded-full text-center animate-fade-out'>{errorMessage}</div>}
    </div>
  )
}

export default Login;