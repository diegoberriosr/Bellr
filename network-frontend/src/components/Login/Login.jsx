import { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';

// Component imports
import Input from '../Forms/Input';
import MoonLoader from 'react-spinners/MoonLoader';

// Icon imports
import { PiDogBold } from "react-icons/pi";
import { IoArrowBack, IoCloseSharp } from "react-icons/io5";

// Context imports
import AuthContext from '../../context/AuthContext';
 

const Login = ({ handleCloseModal, openForgottenPassword, openRegister }) => {

  const [ errorMessage, setErrorMessage ] = useState(false);
  const [ loading, setLoading ] = useState(false);

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
    loginUser(values, setErrorMessage, setLoading);
  }

  const STEPS = [
    {
        elements : [
          
            {value: values.username, type: 'text', name: 'username', id : 'Username',  placeholder: 'Username or E-mail', containerStyle: 'mt-2', inputStyle: 'w-[250px] sm:w-[300px] h-[56px] bg-transparent', handleChange : handleChange, handleBlur : handleBlur },

            
        ]
    },
    {
        elements : [
            {value: values.username, type: 'text', disabled:true, name: 'username',  id : 'Username', placeholder: 'Username or E-mail', inputStyle: 'w-[250px] sm:w-[440px] h-[56px] bg-disabled-input text-login-gray'},
            {value: values.password, type: 'password', name: 'password', id : 'Password',  placeholder: 'Password', containerStyle : 'mt-7', inputStyle: 'w-[250px] sm:w-[440px] h-[60px] bg-transparent'},
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
    <div className='relative w-screen h-screen sm:w-[600px] sm:h-[650px] bg-black text-white  flex flex-col items-center sm:rounded-xl pt-2.5 mt-auto mb-auto'>
        {step === 0 ? 
        <i className='absolute top-2 left-2 w-9 h-9 flex items-center justify-center rounded-full hover:bg-login-highlight transition-colors duration-150' onClick={handleCloseModal}>
          <IoCloseSharp className='text-[22px] cursor-pointer' /> 
        </i>: <IoArrowBack className='absolute top-3.5 left-3 text-xl cursor-pointer' onClick={ () => {setStep(step-1)}}/> }
        <PiDogBold className='text-4xl'/>
        <div className={`${step === 0 ? 'w-9/12' : 'w-full'} mt-6`}>
            <h2 className='ml-[15%] sm:ml-20 text-xl fold:text-3xl font-bold'>{step === 0 ? 'Login' : 'Enter your password'}</h2>
            <form className='flex flex-col items-center jusitify-center w-full mt-9' onSubmit={(e) => { e.preventDefault(); handleContinue();}}>
            { step === 0 && <>
            <button className='mt-6 w-[250px] fold:w-[300px] h-10 bg-white rounded-full text-black bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center font-bold cursor-not-allowed'>
                    <img src='https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' alt='apple logo' width='20' className='mr-1'/>
                    <span>Log in with Google</span>
                </button>
                <button className='mt-6 w-[250px] fold:w-[300px] h-10 bg-white rounded-full text-black bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center font-bold cursor-not-allowed'>
                    <img src='https://e7.pngegg.com/pngimages/684/943/png-clipart-apple-logo-computer-icons-apple-logo-heart-logo.png' alt='apple logo' width='20' className='mr-1'/>
                    <span>Log in with Apple</span>
                </button>            
            </>}

                    {step === 0 &&
                    <div className='w-full flex items-center justify-center mt-2.5'>
                      <span className='border border-t-0 border-l-0 border-r-0 border-login-gray w-[130px]' />
                      <span className='ml-2.5 mr-2.5'>or</span>
                      <span className='border border-t-0 border-l-0 border-r-0 border-login-gray w-[130px]' />
                    </div>
                } 
                {STEPS[step].elements.map( (element, index) => 
                 
                    <Input key={index} type={element.type} value={element.value} id={element.id}
                    name={element.name} containerStyle={element.containerStyle} inputStyle={element.inputStyle}
                    error={errors[element.name]} touched={touched[element.name]} placeholder={element.placeholder}
                    disabled={element.disabled} handleChange={handleChange} handleBlur={handleBlur}
                    />
                )}
                { step === 1 && <span className='text-twitter-blue text-[12px] mt-0.5 mr-auto ml-[15%] hover:underline' onClick={openForgottenPassword}>Forgot password?</span>}
                <div className={` flex flex-col ${step === 0 ? 'items-center' : 'items-start'}`}>
                <button type='submit' 
                disabled={ step === 0 ? values.username.length === 0 : values.password.length === 0 }
                className={`${ step === 0 ? 'mt-8 w-[250px] fold:w-[300px] h-9 ' : 'mt-56 w-[250px] fold:w-[300px] sm:w-[440px] h-[52px]'} font-semibold  bg-white rounded-full 
                ${(step === 0 && values.username.length === 0) || (step === 1 && values.password.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'} text-black flex items-center justify-center`} 
                onClick={handleContinue}>{ loading ? <MoonLoader loading={loading} size={25} color='#1D9BF0'/>  : (step === 0 ? 'Continue' : 'Log in') }</button>
    
                   { step === 0 &&  <button type='button' className='mt-6 font-bold w-[250px] fold:w-[300px] h-9  bg-transparent rounded-full border border-login-dark-border text-white hover:bg-login-highlight flex items-center justify-center transition-colors duration-200' onClick={openForgottenPassword}>Forgot password?</button> }
                  <p className={`${ step === 0 ? 'mt-12' : 'mt-6'} text-login-light-gray`}>Don't have an account? <span className='text-twitter-blue hover:underline cursor-pointer' onClick={openRegister}>Register</span></p>
                  {step === 0 && <p className='mt-1 text-twitter-blue cursor-pointer hover:underline' onClick={() => {loginUser({ username : 'testboy' , password : 'Testboy1'}, setErrorMessage, setLoading);}}>Log in with a guest account</p>}       
                </div>
            </form>
        </div>
        {errorMessage && <div className='absolute bottom-0 w-60 h-10 flex items-center justify-center text-white bg-twitter-blue font-bold text-xs rounded-full text-center animate-fade-out'>{errorMessage}</div>}
    </div>
  )
}

export default Login;